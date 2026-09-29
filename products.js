// Каталог снят с aestheticcosmetics.store (29.09.2026).
// Формат: [slug, название, линия, цена, старая цена|0, в наличии 1/0, имя картинки (если отличается от slug)]
const IMG_BASE = "https://orrlomgsbgiomkhuakaw.supabase.co/storage/v1/object/public/products/";

const RAW = [
  ["keune-care-velvet-smooth-conditioner","Keune Care Velvet Smooth Anti-Frizz Conditioner","CARE",340000,425000,1],
  ["keune-color-brillianz-shampoo-300ml","Keune Color Brillianz Shampoo / 300ml","CARE",255000,318750,0],
  ["keune-care-blonde-savior-treatment-140-ml","Keune CARE Blonde Savior Treatment / 140 ml","CARE",323000,0,1],
  ["keune-vital-nutrition-protein-spray-150ml","Keune Vital Nutrition Protein Spray 150ml","CARE",289000,0,1],
  ["keune-confident-curl-shampoo-300ml","Keune Confident Curl Shampoo 300ml","CARE",323000,0,1],
  ["keune-absolute-volume-spray-150ml","Keune Absolute Volume Spray 150ml","CARE",306000,0,1],
  ["keune-radiant-gloss-mask-250ml","Keune Radiant Gloss Mask 250ml","CARE",476000,0,1],
  ["keune-radiant-gloss-illume-infusion-100ml","Keune Radiant Gloss Illume Infusion 100ml","CARE",595000,0,1],
  ["keune-silver-savior-shampoo-300ml","Keune Silver Savior Shampoo / 300ml","CARE",306000,0,1],
  ["keune-dandruff-detox-shampoo-300ml","Keune Dandruff Detox Shampoo 300ml","CARE",323000,0,1],
  ["keune-radiant-gloss-shampoo-300ml","Keune Radiant Gloss Shampoo 300ml","CARE",323000,0,1],
  ["keune-long-strong-shampoo-300ml","Keune Long & Strong Shampoo 300ml","CARE",323000,0,1],
  ["keune-velvet-smooth-2phase-spray-200ml","Keune Velvet Smooth 2Phase Spray 200ml","CARE",289000,0,0],
  ["keune-scalp-sensitive-shampoo-300ml","Keune Scalp Sensitive Shampoo 300ml","CARE",323000,0,1],
  ["keune-care-blonde-savior-shampoo-300-ml","Keune CARE Blonde Savior Shampoo / 300 ml","CARE",306000,0,1],
  ["keune-long-strong-leave-in-100ml","Keune Long & Strong Leave-in 100ml","CARE",306000,0,1],
  ["keune-care-curl-leave-in-curly-300-ml","Keune CARE Curl Leave-in Curly / 300 ml","CARE",540000,0,1],
  ["keune-derma-regulate-shampoo-300ml","Keune Derma Regulate Shampoo / 300ml","CARE",255000,0,1],
  ["keune-color-brillianz-conditioner-250ml","Keune Color Brillianz Conditioner / 250ml","CARE",306000,0,0],
  ["keune-color-brillianz-mask-250ml","Keune Color Brillianz Mask 250ml","CARE",476000,0,1],
  ["keune-care-curl-leave-in-coily-300-ml","Keune CARE Curl Leave-in Coily / 300 ml","CARE",544000,0,1],
  ["keune-care-curl-mask-200-ml","Keune CARE Curl Mask / 200 ml","CARE",459000,0,1],
  ["keune-shampun-dlya-volos-vital-nutrition-mask-50ml","Keune Vital Nutrition Mask 50ml","CARE",476000,0,1],
  ["keune-care-curl-leave-in-wavy-300-ml","Keune CARE Curl Leave-in Wavy / 300 ml","CARE",540000,0,1],
  ["keune-care-blonde-savior-mask-200-ml","Keune CARE Blonde Savior Mask / 200 ml","CARE",442000,0,0],
  ["keune-color-brillianz-sf-shampoo-300ml","Keune Color Brillianz SF Shampoo 300ml","CARE",323000,0,0],
  ["keune-care-curl-control-mask-200-ml","Keune CARE Curl Control Mask / 200 ml","CARE",476000,0,1],
  ["keune-vital-nutrition-mask-250ml","Keune Vital Nutrition Mask 250ml","CARE",476000,0,1],
  ["keune-care-absolute-volume-shampoo-300-ml","Keune CARE Absolute Volume Shampoo / 300 ml","CARE",255000,0,1],
  ["keune-color-brillianz-protect-spray-150ml","Keune Color Brillianz Protect Spray 150ml","CARE",272000,0,1],
  ["keune-radiant-gloss-hair-gloss-200ml","Keune Radiant Gloss Hair Gloss 200ml","CARE",289000,0,0],
  ["keune-velvet-smooth-mask-250ml","Keune Velvet Smooth Mask 250ml","CARE",510000,0,1],
  ["keune-silver-savior-conditioner-250ml","Keune Silver Savior Conditioner / 250ml","CARE",357000,0,1],
  ["keune-vital-nutrition-power-plump-45ml","Keune Vital Nutrition Power Plump 45ml","CARE",450500,0,1],
  ["keune-care-lumi-coat-140-ml","Keune Care Lumi Coat / 140 ml","CARE",391000,0,0],
  ["keune-long-strong-serum-100ml","Keune Long & Strong Serum 100ml","CARE",595000,0,0],
  ["keune-velvet-smooth-silkening-polish-45ml","Keune Velvet Smooth Silkening Polish 45ml","CARE",450500,0,1],
  ["keune-care-vital-nutrit-conditioner-250-ml","Keune CARE Vital Nutrition Conditioner / 250 ml","CARE",306000,0,1],
  ["keune-care-lumi-coat-supreme-cream-95-ml","Keune CARE Lumi Coat Supreme Cream / 95 ml","CARE",595000,0,1],
  ["keune-long-strong-conditioner-250ml","Keune Long & Strong Conditioner 250ml","CARE",357000,0,0],
  ["keune-care-absolute-vol-conditioner-250-ml","Keune CARE Absolute Vol Conditioner / 250 ml","CARE",306000,0,1],
  ["keune-maska-dlya-volos-velvet-smooth-mask-50ml","Keune Маска для волос Velvet Smooth Mask 50ml","CARE",510000,0,1],
  ["keune-care-velvet-smooth-shampoo","Keune Care Velvet Smooth Anti-Frizz Shampoo","CARE",289000,0,0],
  ["keune-care-vital-nutrition-shampoo","Keune Care Vital Nutrition Shampoo / 300 ml","CARE",255000,0,1,"keune-care-vital-nutrition-shampoo-v2"],
  ["keune-care-keratin-smooth-serum","Keune CARE Keratin Smooth Serum / 25 ml","CARE",510000,0,1],
  ["keune-so-pure-polish-shampoo-refill-400ml","Keune So Pure Polish Shampoo Refill / 400ml","SO PURE",459000,573750,1],
  ["keune-so-pure-restore-cond-refill-400ml","Keune So Pure Restore Cond. Refill / 400ml","SO PURE",374000,0,1],
  ["keune-so-pure-polish-mask-300ml","Keune So Pure Polish Mask / 300ml","SO PURE",204000,0,1],
  ["keune-so-pure-cool-shampoo-refill-400ml","Keune So Pure Cool Shampoo Refill / 400ml","SO PURE",459000,0,1],
  ["keune-so-pure-restore-mask-300ml","Keune So Pure Restore Mask / 300ml","SO PURE",204000,0,1],
  ["keune-so-pure-clarify-cond-refill-400ml","Keune So Pure Clarify Cond. Refill / 400ml","SO PURE",374000,0,1],
  ["keune-so-pure-restore-shampoo-refill-400ml","Keune So Pure Restore Shampoo Refill / 400ml","SO PURE",459000,0,1],
  ["keune-so-pure-polish-cond-refill-400ml","Keune So Pure Polish Cond. Refill / 400ml","SO PURE",374000,0,1],
  ["keune-so-pure-clarify-shampoo-refill-400ml","Keune So Pure Clarify Shampoo Refill / 400ml","SO PURE",459000,0,1],
  ["keune-so-pure-cool-cond-refill-400ml","Keune So Pure Cool Cond. Refill / 400ml","SO PURE",374000,0,1],
  ["keune-resetter-200-ml","Keune Resetter, 200 ml","STYLE",255000,318750,1],
  ["keune-gel-krem-dlya-volos-spring-loaded-150-ml","Keune Гель-крем для волос Spring Loaded, 150 ml","STYLE",195500,244375,1],
  ["keune-luminous-coat-shine-spray-150ml","Keune Luminous Coat Shine Spray 150ml","STYLE",467500,0,1],
  ["keune-suhoi-shampun-dlya-volos-clean-slate-200-ml","Keune Clean Slate Dry Shampoo / 200 ml","STYLE",255000,0,0],
  ["keune-smooth-operator-30ml","Keune Smooth Operator 30ml","STYLE",450500,0,1],
  ["keune-zhitkii-lak-dlya-volos-liquid-lock-200-ml","Keune Жидкий лак для волос Liquid Lock, 200 ml","STYLE",323000,0,1],
  ["keune-style-humidity-shield-200-ml","Keune Style Humidity Shield / 200 ml","STYLE",272000,0,1],
  ["keune-royal-tribute-hair-serum-50ml","Keune Royal Tribute Hair Serum 50ml","STYLE",595000,0,1],
  ["keune-style-straight-cream-200-ml","Keune Style Straight Cream / 200 ml","STYLE",289000,0,1],
  ["keune-suhoi-teksturaizer-dlya-volos-get-a-grip-75-ml","Keune Сухой текстурайзер Get a Grip, 75 ml","STYLE",170000,0,0],
  ["keune-loson-dlya-volos-ultimate-blowout-200-ml","Keune Лосьон для волос Ultimate Blowout, 200 ml","STYLE",272000,0,1],
  ["keune-krem-dlya-volos-tame-game-200-ml","Keune Крем для волос Tame Game, 200 ml","STYLE",289000,0,1],
  ["keune-sprei-vosk-dlya-volos-air-wax-200-ml","Keune Спрей-воск для волос Air Wax, 200 ml","STYLE",229500,0,1],
  ["keune-suhoi-teksturaizer-dlya-volos-get-a-grip-200-ml","Keune Сухой текстурайзер Get a Grip, 200 ml","STYLE",255000,0,1],
  ["keune-mus-dlya-tonkih-volos-cashmere-cloud-200-ml","Keune Мусс для тонких волос Cashmere Cloud, 200 ml","STYLE",170000,0,1],
  ["keune-sprei-blesk-dlya-volos-shine-therapy-75-ml","Keune Спрей-блеск для волос Shine Therapy, 75 ml","STYLE",255000,0,1],
  ["keune-lak-dlya-volos-freestyler-300-ml","Keune Лак для волос Freestyler, 300 ml","STYLE",229500,0,1],
  ["keune-1922-purifying-shampoo-250-ml","Keune 1922 Purifying Shampoo / 250 ml","1922 MAN",221000,276250,1],
  ["keune-1922-fortifying-shampoo-250-ml","Keune 1922 Fortifying Shampoo / 250 ml","1922 MAN",221000,0,1],
  ["keune-1922-original-pomade-75-ml","Keune 1922 Original Pomade / 75 ml","1922 MAN",238000,0,1],
  ["keune-1922-refreshing-conditioner-250-ml","Keune 1922 Refreshing Conditioner / 250 ml","1922 MAN",255000,0,1],
  ["keune-balzam-dlya-borody-1922-beard-balm-100ml","Keune 1922 Бальзам для бороды Beard Balm 100ml","1922 MAN",408000,0,1],
  ["keune-maslo-dlya-borody-1922-beard-oil-50ml","Keune 1922 Масло для бороды Beard Oil 50ml","1922 MAN",442000,0,1],
  ["keune-1922-deep-cleansing-shampoo-250-ml","Keune 1922 Deep-Cleansing Shampoo / 250 ml","1922 MAN",221000,0,1],
  ["keune-1922-superior-shaving-cream-150ml","Keune 1922 Superior Shaving Cream 150ml","1922 MAN",306000,0,1],
  ["keune-1922-refreshing-shampoo-250-ml","Keune 1922 Refreshing Shampoo / 250 ml","1922 MAN",221000,0,1],
  ["keune-1922-essential-conditioner-250-ml","Keune 1922 Essential Conditioner / 250 ml","1922 MAN",221000,0,1],
  ["keune-holiday-25-box-shine","Keune Holiday 25 Box Shine","HOLIDAY",544000,0,1],
  ["keune-holiday-25-box-nourish","Keune Holiday 25 Box Nourish","HOLIDAY",544000,0,1],
  ["keune-holiday-25-box-velvet-pcs","Keune Holiday 25 Box Velvet","HOLIDAY",544000,0,1],
  ["keune-holiday-25-box-refresh","Keune Holiday 25 Box Refresh","HOLIDAY",595000,0,1],
];

const LINE_INFO = {
  "CARE": "Профессиональный уход Keune Care — линии под конкретную задачу: цвет, объём, гладкость, питание, кудри, кожа головы.",
  "SO PURE": "Keune So Pure — веганские формулы без сульфатов и парабенов с эфирными маслами. Рефилы 400 мл — экологичнее и выгоднее.",
  "STYLE": "Keune Style — стайлинг салонного уровня: текстура, фиксация, блеск и термозащита.",
  "1922 MAN": "Keune 1922 by J.M. Keune — мужская линия для волос, бороды и бритья.",
  "HOLIDAY": "Подарочный набор Keune: шампунь, кондиционер и маска в праздничной коробке. Готов к вручению — упаковывать не нужно.",
};

const SET_INFO = {
  "keune-holiday-25-box-shine": "Набор на основе Care Color: удерживает пигмент окрашенных волос, не даёт цвету выцветать и добавляет зеркальный блеск.",
  "keune-holiday-25-box-nourish": "Набор на основе Satin Oil: питает сухие и повреждённые волосы, возвращает эластичность и мягкость.",
  "keune-holiday-25-box-velvet-pcs": "Набор на основе Care Velvet: разглаживает жёсткие и непослушные волосы, убирает пушистость.",
  "keune-holiday-25-box-refresh": "Набор на основе Vital Nutrition: лёгкий ежедневный уход — освежает и увлажняет, не утяжеляя.",
};

function detectType(name, line) {
  const n = name.toLowerCase();
  if (line === "HOLIDAY") return "set";
  if (/shampoo|шампун/.test(n) && !/dry|сух/.test(n)) return "shampoo";
  if (/cond/.test(n)) return "conditioner";
  if (/mask|маска|treatment/.test(n)) return "mask";
  if (/spray|спрей|лак|lock|freestyler/.test(n)) return "spray";
  // несмываемые сыворотки/кремы из линии Care — это уход, а не стайлинг
  return line === "CARE" ? "mask" : "styling";
}

const PRODUCTS = RAW.map(([id, name, line, price, old, stock, img]) => ({
  id, name, line, price,
  old: old || null,
  stock: !!stock,
  type: detectType(name, line),
  img: IMG_BASE + (img || id) + ".png",
  desc: SET_INFO[id] || LINE_INFO[line],
}));
