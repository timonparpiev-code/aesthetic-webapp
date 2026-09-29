const tg = window.Telegram && window.Telegram.WebApp;
const IN_TG = !!(tg && tg.initData);

const $ = (s) => document.querySelector(s);
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
const fmt = (n) => n.toLocaleString("ru-RU").replace(/,/g, " ") + " сум";

const DELIVERY_PRICE = 30000;
const FREE_DELIVERY_FROM = 500000;

const TYPES = [
  ["all", "Все"], ["shampoo", "Шампуни"], ["conditioner", "Кондиционеры"], ["mask", "Уход и маски"],
  ["spray", "Спреи"], ["styling", "Стайлинг"], ["set", "Наборы"],
];
const LINES = ["Все линии", "CARE", "SO PURE", "STYLE", "1922 MAN", "HOLIDAY"];

const state = {
  type: "all",
  line: "Все линии",
  query: "",
  cart: loadCart(),
  stack: ["catalog"],
};

/* ---------- storage ---------- */
function loadCart() {
  try { return JSON.parse(localStorage.getItem("ac_cart")) || {}; } catch { return {}; }
}
function saveCart() {
  try { localStorage.setItem("ac_cart", JSON.stringify(state.cart)); } catch {}
}

/* ---------- cart helpers ---------- */
function cartItems() {
  return Object.entries(state.cart)
    .filter(([id, q]) => byId[id] && q > 0)
    .map(([id, q]) => ({ ...byId[id], qty: q }));
}
function cartCount() { return cartItems().reduce((s, i) => s + i.qty, 0); }
function cartTotals(delivery = "delivery") {
  const items = cartItems();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const saved = items.reduce((s, i) => s + (i.old ? (i.old - i.price) * i.qty : 0), 0);
  const ship = delivery === "pickup" || subtotal >= FREE_DELIVERY_FROM || !subtotal ? 0 : DELIVERY_PRICE;
  return { subtotal, saved, ship, total: subtotal + ship };
}
function setQty(id, q) {
  if (q <= 0) delete state.cart[id]; else state.cart[id] = Math.min(q, 20);
  saveCart();
  haptic("light");
  renderAll();
}

/* ---------- telegram glue ---------- */
function haptic(kind) {
  if (!IN_TG || !tg.HapticFeedback) return;
  if (kind === "success" || kind === "error") tg.HapticFeedback.notificationOccurred(kind);
  else tg.HapticFeedback.impactOccurred(kind);
}

let mainHandler = null;
function setMainButton(text, handler) {
  if (!IN_TG) return;
  const mb = tg.MainButton;
  if (mainHandler) mb.offClick(mainHandler);
  mainHandler = handler;
  if (!text) { mb.hide(); return; }
  mb.setParams({ text, color: "#1a0f08", text_color: "#ffffff", is_active: true, is_visible: true });
  mb.onClick(handler);
}

function syncChrome() {
  const screen = state.stack[state.stack.length - 1];
  if (IN_TG) {
    screen === "catalog" || screen === "done" ? tg.BackButton.hide() : tg.BackButton.show();
  }
  const count = cartCount();
  const { total } = cartTotals(currentDelivery());
  if (screen === "catalog") {
    setMainButton(count ? `Корзина · ${count} шт · ${fmt(total)}` : null, () => go("cart"));
  } else if (screen === "cart") {
    setMainButton(count ? `Оформить · ${fmt(total)}` : null, () => go("checkout"));
  } else if (screen === "checkout") {
    setMainButton(`Подтвердить заказ · ${fmt(total)}`, submitOrder);
  } else {
    setMainButton(null);
  }
}

/* ---------- navigation ---------- */
function go(screen) {
  state.stack.push(screen);
  show(screen);
}
function back() {
  if (sheetOpen()) return closeSheet();
  if (state.stack.length > 1) state.stack.pop();
  show(state.stack[state.stack.length - 1]);
}
function show(screen) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $("#screen-" + screen).classList.add("active");
  window.scrollTo(0, 0);
  renderAll();
}

/* ---------- catalog ---------- */
function renderChips() {
  $("#type-chips").innerHTML = TYPES.map(([k, label]) =>
    `<button class="chip ${state.type === k ? "active" : ""}" data-type="${k}">${label}</button>`).join("");
  $("#line-chips").innerHTML = LINES.map((l) =>
    `<button class="chip ${state.line === l ? "active" : ""}" data-line="${l}">${l}</button>`).join("");
}

function filtered() {
  const q = state.query.trim().toLowerCase();
  return PRODUCTS
    .filter((p) => state.type === "all" || p.type === state.type)
    .filter((p) => state.line === "Все линии" || p.line === state.line)
    .filter((p) => !q || p.name.toLowerCase().includes(q) || p.line.toLowerCase().includes(q))
    // сначала скидки, потом в наличии, потом нет в наличии
    .sort((a, b) => (b.stock - a.stock) || (!!b.old - !!a.old));
}

function cardHtml(p) {
  const inCart = state.cart[p.id];
  const discount = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  return `
    <article class="card" data-open="${p.id}">
      ${!p.stock ? `<span class="tag out">Нет в наличии</span>` : discount ? `<span class="tag">−${discount}%</span>` : ""}
      <div class="pic"><img loading="lazy" src="${p.img}" alt=""></div>
      <div class="body">
        <div class="line">${p.line}</div>
        <div class="name">${p.name}</div>
        <div class="prices"><span class="price">${fmt(p.price)}</span>${p.old ? `<span class="old">${fmt(p.old)}</span>` : ""}</div>
        <button class="add ${inCart ? "in" : ""}" data-add="${p.id}" ${p.stock ? "" : "disabled"}>
          ${!p.stock ? "Нет в наличии" : inCart ? `В корзине · ${inCart}` : "В корзину"}
        </button>
      </div>
    </article>`;
}

function renderCatalog() {
  const list = filtered();
  $("#grid").innerHTML = list.map(cardHtml).join("");
  $("#empty").hidden = list.length > 0;
  const c = cartCount();
  $("#cart-badge").hidden = !c;
  $("#cart-badge").textContent = c;
}

/* ---------- product sheet ---------- */
function openProduct(id) {
  const p = byId[id];
  let qty = state.cart[id] || 1;
  const draw = () => {
    $("#sheet").innerHTML = `
      <div class="grab"></div>
      <div class="pic"><img src="${p.img}" alt=""></div>
      <div class="line" style="margin-top:14px;font-size:11px;letter-spacing:.08em;color:var(--muted);font-weight:700">${p.line}</div>
      <h2>${p.name}</h2>
      <p class="desc">${p.desc}</p>
      <div class="row">
        <div><span class="price">${fmt(p.price)}</span>${p.old ? `<span class="old">${fmt(p.old)}</span>` : ""}</div>
        ${p.stock ? `<div class="qty"><button data-q="-1">−</button><span>${qty}</span><button data-q="1">+</button></div>` : ""}
      </div>
      <button class="btn wide" style="margin:18px 0 0;width:100%" id="sheet-add" ${p.stock ? "" : "disabled"}>
        ${p.stock ? (state.cart[id] ? "Обновить корзину" : "Добавить в корзину") : "Нет в наличии"}
      </button>`;
    $("#sheet").querySelectorAll("[data-q]").forEach((b) =>
      b.onclick = () => { qty = Math.max(1, Math.min(20, qty + +b.dataset.q)); haptic("light"); draw(); });
    const add = $("#sheet-add");
    if (add && p.stock) add.onclick = () => { setQty(id, qty); closeSheet(); toast("Добавлено в корзину"); };
  };
  draw();
  openSheet();
}

function openSheet() {
  $("#sheet").classList.add("open");
  $("#sheet-backdrop").classList.add("open");
  if (IN_TG) tg.BackButton.show();
}
function closeSheet() {
  $("#sheet").classList.remove("open");
  $("#sheet-backdrop").classList.remove("open");
  syncChrome();
}
const sheetOpen = () => $("#sheet").classList.contains("open");

/* ---------- quiz (подбор ухода) ---------- */
const QUIZ = [
  { q: "Для кого подбираем?", key: "who", opts: [["me", "Для себя"], ["man", "Для мужчины"], ["gift", "В подарок"]] },
  { q: "Главная задача?", key: "goal", opts: [
    ["color", "Сохранить цвет после окрашивания"], ["dry", "Питание сухих и повреждённых"],
    ["volume", "Объём для тонких волос"], ["frizz", "Гладкость, убрать пушистость"],
    ["curl", "Кудри и волны"], ["blonde", "Блонд / седина без желтизны"], ["scalp", "Кожа головы, перхоть"],
  ]},
  { q: "Какие формулы предпочитаете?", key: "formula", opts: [["classic", "Профессиональный уход Care"], ["pure", "Без сульфатов и парабенов (So Pure)"]] },
];
const RECS = {
  color: ["keune-color-brillianz-mask-250ml", "keune-color-brillianz-protect-spray-150ml", "keune-radiant-gloss-shampoo-300ml", "keune-radiant-gloss-mask-250ml"],
  dry: ["keune-care-vital-nutrition-shampoo", "keune-care-vital-nutrit-conditioner-250-ml", "keune-vital-nutrition-mask-250ml", "keune-vital-nutrition-protein-spray-150ml"],
  volume: ["keune-care-absolute-volume-shampoo-300-ml", "keune-care-absolute-vol-conditioner-250-ml", "keune-absolute-volume-spray-150ml", "keune-mus-dlya-tonkih-volos-cashmere-cloud-200-ml"],
  frizz: ["keune-care-velvet-smooth-conditioner", "keune-velvet-smooth-mask-250ml", "keune-velvet-smooth-silkening-polish-45ml", "keune-care-keratin-smooth-serum"],
  curl: ["keune-confident-curl-shampoo-300ml", "keune-care-curl-mask-200-ml", "keune-care-curl-leave-in-wavy-300-ml", "keune-care-curl-leave-in-curly-300-ml"],
  blonde: ["keune-care-blonde-savior-shampoo-300-ml", "keune-care-blonde-savior-treatment-140-ml", "keune-silver-savior-shampoo-300ml", "keune-silver-savior-conditioner-250ml"],
  scalp: ["keune-dandruff-detox-shampoo-300ml", "keune-scalp-sensitive-shampoo-300ml", "keune-derma-regulate-shampoo-300ml"],
  man: ["keune-1922-purifying-shampoo-250-ml", "keune-1922-refreshing-conditioner-250-ml", "keune-1922-original-pomade-75-ml", "keune-maslo-dlya-borody-1922-beard-oil-50ml"],
  gift: ["keune-holiday-25-box-shine", "keune-holiday-25-box-nourish", "keune-holiday-25-box-velvet-pcs", "keune-holiday-25-box-refresh"],
};
const PURE = {
  color: "polish", frizz: "polish", dry: "restore", curl: "restore", volume: "clarify", blonde: "cool", scalp: "clarify",
};

function recommend(a) {
  if (a.who === "man") return RECS.man;
  if (a.who === "gift") return RECS.gift;
  if (a.formula === "pure") {
    const k = PURE[a.goal];
    return [`keune-so-pure-${k}-shampoo-refill-400ml`, `keune-so-pure-${k}-cond-refill-400ml`,
      k === "polish" || k === "restore" ? `keune-so-pure-${k}-mask-300ml` : "keune-so-pure-restore-mask-300ml"];
  }
  return RECS[a.goal];
}

function openQuiz() {
  const answers = {};
  let step = 0;
  const draw = () => {
    // мужчинам и подаркам вопросы 2-3 не нужны
    if (step > 0 && answers.who !== "me") step = QUIZ.length;
    if (step >= QUIZ.length) return drawResult();
    const s = QUIZ[step];
    $("#sheet").innerHTML = `
      <div class="grab"></div>
      <div class="quiz">
        <div class="step">ВОПРОС ${step + 1} ИЗ ${QUIZ.length}</div>
        <h2>${s.q}</h2>
        <div class="opts">${s.opts.map(([v, l]) => `<button data-v="${v}">${l}</button>`).join("")}</div>
      </div>`;
    $("#sheet").querySelectorAll("[data-v]").forEach((b) =>
      b.onclick = () => { answers[s.key] = b.dataset.v; step++; haptic("light"); draw(); });
  };
  const drawResult = () => {
    const recs = recommend(answers).map((id) => byId[id]).filter(Boolean);
    const avail = recs.filter((p) => p.stock);
    $("#sheet").innerHTML = `
      <div class="grab"></div>
      <div class="quiz">
        <div class="step">ВАШ УХОД</div>
        <h2>Вот что подойдёт</h2>
        <div class="recs">${recs.map((p) => `
          <div class="rec" data-open="${p.id}">
            <img src="${p.img}" alt="">
            <div class="name">${p.name}<br><span class="price" style="font-size:13px">${p.stock ? fmt(p.price) : "Нет в наличии"}</span></div>
          </div>`).join("")}</div>
        ${avail.length ? `<button class="btn" style="width:100%" id="add-all">Добавить всё в корзину · ${fmt(avail.reduce((s, p) => s + p.price, 0))}</button>` : ""}
        <button class="btn ghost" style="width:100%;margin-top:8px" id="quiz-again">Пройти заново</button>
      </div>`;
    const addAll = $("#add-all");
    if (addAll) addAll.onclick = () => {
      avail.forEach((p) => { state.cart[p.id] = (state.cart[p.id] || 0) + 1; });
      saveCart(); renderAll(); closeSheet(); haptic("success"); toast(`Добавлено: ${avail.length} шт.`);
    };
    $("#quiz-again").onclick = () => { step = 0; Object.keys(answers).forEach((k) => delete answers[k]); draw(); };
  };
  draw();
  openSheet();
}

/* ---------- cart screen ---------- */
function summaryHtml(delivery) {
  const t = cartTotals(delivery);
  return `
    <div><span>Товары</span><span>${fmt(t.subtotal)}</span></div>
    ${t.saved ? `<div><span>Скидка</span><span style="color:var(--sale)">−${fmt(t.saved)}</span></div>` : ""}
    <div><span>${delivery === "pickup" ? "Самовывоз" : "Доставка"}</span><span>${t.ship ? fmt(t.ship) : "бесплатно"}</span></div>
    ${delivery !== "pickup" && t.ship ? `<span class="hint">Бесплатная доставка от ${fmt(FREE_DELIVERY_FROM)}</span>` : ""}
    <div class="total"><span>Итого</span><span>${fmt(t.total)}</span></div>`;
}

function renderCart() {
  const items = cartItems();
  $("#cart-empty").hidden = items.length > 0;
  $("#cart-summary").hidden = !items.length;
  $("#to-checkout").hidden = !items.length;
  $("#cart-list").innerHTML = items.map((p) => `
    <div class="cart-item">
      <div class="pic"><img src="${p.img}" alt=""></div>
      <div class="info">
        <div class="name">${p.name}</div>
        <div class="price">${fmt(p.price * p.qty)}</div>
      </div>
      <div class="qty"><button data-dec="${p.id}">−</button><span>${p.qty}</span><button data-inc="${p.id}">+</button></div>
    </div>`).join("");
  $("#cart-summary").innerHTML = items.length ? summaryHtml("delivery") : "";
}

/* ---------- checkout ---------- */
function currentDelivery() {
  const r = document.querySelector('input[name="delivery"]:checked');
  return r ? r.value : "delivery";
}
function renderCheckout() {
  const d = currentDelivery();
  $("#address-field").hidden = d === "pickup";
  $("#checkout-summary").innerHTML = summaryHtml(d);
}

function prefillFromTelegram() {
  const u = IN_TG && tg.initDataUnsafe && tg.initDataUnsafe.user;
  const f = $("#checkout-form");
  if (u && !f.name.value) f.name.value = [u.first_name, u.last_name].filter(Boolean).join(" ");
}

function submitOrder() {
  const f = $("#checkout-form");
  const data = Object.fromEntries(new FormData(f));
  const err = [];
  f.querySelectorAll("input").forEach((i) => i.classList.remove("invalid"));
  if (!data.name.trim()) { err.push("имя"); f.name.classList.add("invalid"); }
  if (data.phone.replace(/\D/g, "").length < 9) { err.push("телефон"); f.phone.classList.add("invalid"); }
  if (data.delivery === "delivery" && !data.address.trim()) { err.push("адрес"); f.address.classList.add("invalid"); }
  if (err.length) {
    $("#form-error").textContent = "Заполните: " + err.join(", ");
    $("#form-error").hidden = false;
    haptic("error");
    return;
  }
  $("#form-error").hidden = true;

  const t = cartTotals(data.delivery);
  const order = {
    items: cartItems().map((p) => ({ id: p.id, name: p.name.slice(0, 60), qty: p.qty, price: p.price })),
    name: data.name.trim(), phone: data.phone.trim(),
    delivery: data.delivery, address: data.delivery === "pickup" ? "" : data.address.trim(),
    payment: data.payment, comment: data.comment.trim().slice(0, 300),
    subtotal: t.subtotal, ship: t.ship, total: t.total,
  };

  // sendData() доступен только при запуске через reply-кнопку (тогда нет query_id)
  if (IN_TG && tg.initDataUnsafe.query_id) {
    tg.showAlert("Чтобы оформить заказ, откройте магазин кнопкой «🛍 Магазин» внизу чата. Корзина сохранится.");
    return;
  }

  haptic("success");
  state.cart = {};
  saveCart();

  if (IN_TG) {
    // Данные уходят боту как message.web_app_data, окно закрывается автоматически.
    // Работает, когда Web App открыт через reply-кнопку (KeyboardButton), см. bot.py.
    tg.sendData(JSON.stringify(order));
  } else {
    // Демо-режим в обычном браузере
    $("#done-json").textContent = JSON.stringify(order, null, 2);
    state.stack = ["catalog", "done"];
    show("done");
  }
}

/* ---------- ui misc ---------- */
let toastTimer;
function toast(text) {
  const el = $("#toast");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
}

function renderAll() {
  const screen = state.stack[state.stack.length - 1];
  if (screen === "catalog") { renderChips(); renderCatalog(); }
  if (screen === "cart") renderCart();
  if (screen === "checkout") { prefillFromTelegram(); renderCheckout(); }
  syncChrome();
}

/* ---------- events ---------- */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-add],[data-open],[data-type],[data-line],[data-inc],[data-dec],[data-back]");
  if (!t) return;
  const d = t.dataset;
  if (d.add) { e.stopPropagation(); setQty(d.add, (state.cart[d.add] || 0) + 1); toast("Добавлено в корзину"); }
  else if (d.open) {
    const wasOpen = sheetOpen();
    if (wasOpen) closeSheet();
    setTimeout(() => openProduct(d.open), wasOpen ? 250 : 0);
  }
  else if (d.type) { state.type = d.type; haptic("light"); renderAll(); }
  else if (d.line) { state.line = d.line; haptic("light"); renderAll(); }
  else if (d.inc) setQty(d.inc, state.cart[d.inc] + 1);
  else if (d.dec) setQty(d.dec, state.cart[d.dec] - 1);
  else if ("back" in d) back();
});
$("#search").addEventListener("input", (e) => { state.query = e.target.value; renderCatalog(); });
$("#open-cart").onclick = () => go("cart");
$("#open-quiz").onclick = openQuiz;
$("#to-checkout").onclick = () => go("checkout");
$("#sheet-backdrop").onclick = closeSheet;
$("#checkout-form").addEventListener("change", renderCheckout);
$("#checkout-form").addEventListener("submit", (e) => { e.preventDefault(); submitOrder(); });
$("#done-back").onclick = () => { state.stack = ["catalog"]; show("catalog"); };

/* ---------- boot ---------- */
if (IN_TG) {
  document.body.classList.add("in-tg");
  tg.ready();
  tg.expand();
  tg.setHeaderColor("#ffffff");
  tg.setBackgroundColor("#ffffff");
  tg.BackButton.onClick(back);
}
renderAll();
