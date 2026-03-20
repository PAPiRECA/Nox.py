import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Instagram,
  MessageCircle,
  ShoppingBag,
  Star,
  Search,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const introOverlay = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45 } },
  exit: { opacity: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } },
};

const introPanel = {
  hidden: { opacity: 0, scale: 0.92, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 1.04,
    y: -18,
    filter: "blur(10px)",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const introLogo = {
  hidden: { opacity: 0, scale: 0.86, rotate: -6 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.95, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 1.08,
    rotate: 3,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const introText = {
  hidden: { opacity: 0, y: 18, letterSpacing: "0.2em" },
  show: {
    opacity: 1,
    y: 0,
    letterSpacing: "0.06em",
    transition: { duration: 0.9, delay: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type Product = {
  name: string;
  category: string;
  price: string;
  image: string;
  badge?: string;
  oldPrice?: string;
};

type CartItem = Product & {
  quantity: number;
};

const filters = ["Todos", "Combos", "Combos premium", "Pulseras", "Collares"];

const products: Product[] = [
  { name: "Pulsera Moon", category: "Pulseras", price: "Gs. 115.000", image: "/products/pulsera-moon.jpeg" },
  { name: "Pulsera Coffee", category: "Pulseras", price: "Gs. 115.000", image: "/products/pulsera-coffee.jpeg" },
  { name: "Pulsera Brown", category: "Pulseras", price: "Gs. 115.000", image: "/products/pulsera-brown.jpeg" },
  { name: "Pulsera White", category: "Pulseras", price: "Gs. 115.000", image: "/products/pulsera-white.jpeg" },
  { name: "Pulsera Earth", category: "Pulseras", price: "Gs. 150.000", image: "/products/pulsera-earth.jpeg" },
  { name: "Pulsera Wolf", category: "Pulseras", price: "Gs. 115.000", image: "/products/pulsera-wolf.jpeg" },
  { name: "Pulsera Black King", category: "Pulseras", price: "Gs. 100.000", image: "/products/pulsera-black-king.jpeg" },
  { name: "Pulsera White King", category: "Pulseras", price: "Gs. 120.000", image: "/products/pulsera-white-king.jpeg" },
  { name: "Collar Silver Point", category: "Collares", price: "Gs. 165.000", image: "/products/collar-silver-point.jpeg" },
  { name: "Collar Thunder", category: "Collares", price: "Gs. 130.000", image: "/products/collar-thunder.jpeg" },
  { name: "Collar Gold Point", category: "Collares", price: "Gs. 165.000", image: "/products/collar-gold-point.jpeg" },
  { name: "Collar Black Plate", category: "Collares", price: "Gs. 145.000", image: "/products/collar-black-plate.jpeg" },
  { name: "Collar Clover", category: "Collares", price: "Gs. 135.000", image: "/products/collar-clover.jpeg" },
  { name: "Collar Blue Stone", category: "Collares", price: "Gs. 150.000", image: "/products/collar-blue-stone.jpeg" },
  { name: "Combo Dark Set", category: "COMBOS", price: "Gs. 234.000", oldPrice: "Gs. 260.000", image: "/products/combo-dark-set.jpeg", badge: "10% OFF" },
  { name: "Combo Gold Set", category: "COMBOS", price: "Gs. 256.500", oldPrice: "Gs. 285.000", image: "/products/combo-gold-set.jpeg", badge: "10% OFF" },
  { name: "Combo Blue Set", category: "COMBOS", price: "Gs. 270.000", oldPrice: "Gs. 300.000", image: "/products/combo-blue-set.jpeg", badge: "10% OFF" },
  { name: "Combo Black Duo", category: "COMBOS", price: "Gs. 220.500", oldPrice: "Gs. 245.000", image: "/products/combo-black-duo.jpeg", badge: "10% OFF" },
  { name: "Combo Silver Set", category: "COMBOS", price: "Gs. 252.000", oldPrice: "Gs. 280.000", image: "/products/combo-silver-set.jpeg", badge: "10% OFF" },
  { name: "Combo Storm Set", category: "COMBOS", price: "Gs. 220.500", oldPrice: "Gs. 245.000", image: "/products/combo-storm-set.jpeg", badge: "10% OFF" },
  { name: "Combo Royal Set", category: "COMBOS", price: "Gs. 229.500", oldPrice: "Gs. 255.000", image: "/products/combo-royal-set.jpeg", badge: "10% OFF" },
  { name: "Combo Earth Night", category: "COMBOS", price: "Gs. 283.500", oldPrice: "Gs. 315.000", image: "/products/combo-earth-night.jpeg", badge: "10% OFF" },
  { name: "Combo Coffee Style", category: "COMBOS", price: "Gs. 252.000", oldPrice: "Gs. 280.000", image: "/products/combo-coffee-style.jpeg", badge: "10% OFF" },
  { name: "Combo Brown Set", category: "COMBOS", price: "Gs. 238.500", oldPrice: "Gs. 265.000", image: "/products/combo-brown-set.jpeg", badge: "10% OFF" },
  { name: "Combo White & Black", category: "COMBOS", price: "Gs. 234.000", oldPrice: "Gs. 260.000", image: "/products/combo-white-black.jpeg", badge: "10% OFF" },
  { name: "Combo King Set", category: "COMBOS", price: "Gs. 238.500", oldPrice: "Gs. 265.000", image: "/products/combo-king-set.jpeg", badge: "10% OFF" },
];

function ProductCard({ item, onAdd, featured = false }: { item: Product; onAdd: (item: Product) => void; featured?: boolean }) {
  const [localAdded, setLocalAdded] = useState(false);

  const handleAdd = () => {
    onAdd(item);
    setLocalAdded(true);
    window.setTimeout(() => {
      setLocalAdded(false);
    }, 1400);
  };

  return (
    <motion.div variants={fadeUp}>
      <div className={`group rounded-[20px] p-2.5 transition duration-300 hover:-translate-y-1 ${featured ? "border border-white/10 bg-white/[0.03] shadow-[0_12px_40px_rgba(0,0,0,0.24)] hover:border-white/20 hover:bg-white/[0.05]" : "bg-transparent shadow-none border border-transparent hover:bg-white/[0.02]"}`}>
        <div className={`relative overflow-hidden rounded-[18px] bg-[#0f1117] ${featured ? "" : "border border-white/6"}`}>
          {localAdded ? (
            <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 rounded-xl border border-[#c2a25f]/20 bg-black/70 px-3 py-2 text-center text-xs font-medium text-[#ead6a8] backdrop-blur-md">
              Agregado al carrito
            </div>
          ) : null}
          <div className="aspect-[4/4.5] overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              draggable={false}
              className="pointer-events-none h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
          {item.badge ? (
            <div className="absolute left-3 top-3 rounded-full border border-[#c2a25f]/20 bg-[#c2a25f]/12 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#ead6a8] backdrop-blur">
              {item.badge}
            </div>
          ) : null}
        </div>

        <div className="px-2.5 pb-2.5 pt-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/38">{item.category}</p>
          <h3 className="mt-2 text-[16px] font-semibold leading-tight text-white sm:text-[18px]">{item.name}</h3>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              {item.oldPrice ? (
                <p className="text-xs text-white/40">
                  Antes <span className="line-through">{item.oldPrice}</span>
                </p>
              ) : null}
              <p className="text-[16px] font-semibold text-white/88 sm:text-[18px]">{item.price}</p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-medium text-white/84 transition hover:bg-white/[0.08]"
          >
            <ShoppingBag className="h-4 w-4" /> Agregar al carrito
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function HorizontalScroller({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollerRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX;
    startScrollLeft.current = scrollerRef.current.scrollLeft;
    scrollerRef.current.style.cursor = "grabbing";
  };

  const handleMouseLeave = () => {
    if (!scrollerRef.current) return;
    isDragging.current = false;
    scrollerRef.current.style.cursor = "grab";
  };

  const handleMouseUp = () => {
    if (!scrollerRef.current) return;
    isDragging.current = false;
    scrollerRef.current.style.cursor = "grab";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollerRef.current) return;
    e.preventDefault();
    const walk = (e.pageX - startX.current) * 1.1;
    scrollerRef.current.scrollLeft = startScrollLeft.current - walk;
  };

  return (
    <div
      id={id}
      ref={scrollerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="cursor-grab overflow-x-auto pb-2 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex min-w-max gap-3">{children}</div>
    </div>
  );
}

export default function NoxAccessoriesStore() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowIntro(false);
    }, 2600);

    return () => window.clearTimeout(timer);
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchesSearch = (product: Product) => {
    if (!normalizedQuery) return true;
    return (
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery)
    );
  };

  const featuredNames = [
    "Combo Dark Set",
    "Combo Storm Set",
    "Collar Gold Point",
    "Collar Silver Point",
    "Combo Gold Set",
    "Combo King Set",
    "Pulsera Moon",
    "Pulsera Black King",
  ];

  const featuredProducts = featuredNames
    .map((name) => products.find((p) => p.name === name))
    .filter(Boolean)
    .filter((p) => matchesSearch(p as Product)) as Product[];

  const premiumComboNames = [
    "Combo Gold Set",
    "Combo Blue Set",
    "Combo Earth Night",
    "Combo King Set",
    "Combo Royal Set",
  ];

  const premiumCombos = products.filter(
    (p) => p.category === "COMBOS" && premiumComboNames.includes(p.name) && matchesSearch(p)
  );

  const standardCombos = products.filter(
    (p) => p.category === "COMBOS" && !premiumComboNames.includes(p.name) && matchesSearch(p)
  );

  const featuredFiltered = featuredProducts.filter((p) => {
    if (activeFilter === "Todos") return true;
    if (activeFilter === "Combos") {
      return p.category === "COMBOS" && !premiumComboNames.includes(p.name);
    }
    if (activeFilter === "Combos premium") {
      return p.category === "COMBOS" && premiumComboNames.includes(p.name);
    }
    return p.category === activeFilter;
  });

  const bracelets = products.filter((p) => p.category === "Pulseras" && matchesSearch(p));
  const necklaces = products.filter((p) => p.category === "Collares" && matchesSearch(p));
  
  const filteredProducts = useMemo(() => {
    if (activeFilter === "Todos") return products.filter(matchesSearch);
    if (activeFilter === "Combos") {
      return products.filter(
        (p) => p.category === "COMBOS" && !premiumComboNames.includes(p.name) && matchesSearch(p)
      );
    }
    if (activeFilter === "Combos premium") {
      return products.filter(
        (p) => p.category === "COMBOS" && premiumComboNames.includes(p.name) && matchesSearch(p)
      );
    }
    return products.filter((p) => p.category === activeFilter && matchesSearch(p));
  }, [activeFilter, normalizedQuery]);

  const showCombos = activeFilter === "Todos" || activeFilter === "Combos";
  const showPremiumCombos = activeFilter === "Todos" || activeFilter === "Combos premium";
  const showBracelets = activeFilter === "Todos" || activeFilter === "Pulseras";
  const showNecklaces = activeFilter === "Todos" || activeFilter === "Collares";

    const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

  };

  const removeFromCart = (name: string) => {
    setCart((prev) => prev.filter((item) => item.name !== name));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const parsePrice = (price: string) => {
    const numeric = price.replace(/[^0-9]/g, "");
    return Number(numeric || 0);
  };

  const cartTotal = cart.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);

  const formatGs = (value: number) => {
    return "Gs. " + value.toLocaleString("es-PY");
  };

  const whatsappMessage =
    cart.length === 0
      ? "Hola, quiero consultar sobre productos de NOX | ACCESORIES."
      : [
          "Hola, quiero hacer este pedido:",
          "",
          ...cart.map((item) => `• ${item.name} x${item.quantity} — ${item.price}`),
          "",
          `Total de productos: ${cartCount}`,
          `Total estimado: ${formatGs(cartTotal)}`,
        ].join("\n");

  const whatsappCartLink = `https://wa.me/595984940564?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#08090d] text-white">
      <AnimatePresence>
        {showIntro ? (
          <motion.div
            key="intro"
            variants={introOverlay}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 z-[140] flex items-center justify-center overflow-hidden bg-[#06070b]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.05),transparent_12%),radial-gradient(circle_at_50%_50%,rgba(194,162,95,0.22),transparent_24%),linear-gradient(180deg,#05060a_0%,#090b10_100%)]" />
            <motion.div
              animate={{ opacity: [0.06, 0.14, 0.06], scale: [1, 1.06, 1] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c2a25f]/[0.14] blur-[130px]"
            />
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:42px_42px]"
            />
            <motion.div
              variants={introPanel}
              initial="hidden"
              animate="show"
              exit="exit"
              className="relative mx-6 flex w-full max-w-md flex-col items-center rounded-[34px] border border-white/10 bg-white/[0.05] p-8 text-center shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            >
              <div className="absolute inset-0 rounded-[34px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.11),transparent_26%)]" />
              <motion.div
                variants={introLogo}
                className="relative overflow-hidden rounded-[26px] border border-white/10 bg-black/20 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
              >
                <img src="/brand/profile.jpeg" alt="NOX logo" draggable={false} className="pointer-events-none h-28 w-28 object-cover sm:h-32 sm:w-32" />
                <motion.div
                  initial={{ x: "-120%", opacity: 0 }}
                  animate={{ x: ["-120%", "120%"], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/35 to-transparent blur-md"
                />
              </motion.div>
              <motion.p variants={introText} className="relative mt-6 text-[11px] uppercase tracking-[0.28em] text-white/40">
                Nox Accessories
              </motion.p>
              <motion.h2 variants={introText} className="relative mt-3 text-4xl font-semibold tracking-[0.06em] text-white sm:text-5xl">
                NOX | ACCESORIES
              </motion.h2>
              <motion.p variants={introText} className="relative mt-4 text-sm leading-7 text-white/58 sm:text-base">
                Pulseras, collares y combos premium.
              </motion.p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[#07080c]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 18%, rgba(255,255,255,0.07), transparent 14%), radial-gradient(circle at 82% 10%, rgba(194,162,95,0.18), transparent 20%), radial-gradient(circle at 50% 82%, rgba(234,214,168,0.08), transparent 24%), linear-gradient(180deg, #07080c 0%, #0c0d12 48%, #07080c 100%)",
          }}
        />

        <div className="absolute inset-0 overflow-hidden opacity-[0.28]">
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.div
              key={`nox-fall-${i}`}
              initial={{ y: "-120%", opacity: 0 }}
              animate={{ y: "120%", opacity: [0, 0.55, 0] }}
              transition={{
                duration: 10 + (i % 4) * 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "linear",
              }}
              className="absolute top-0 h-[140%] w-px bg-gradient-to-b from-transparent via-[#ead6a8]/70 to-transparent"
              style={{ left: `${6 + i * 6.8}%`, filter: "blur(1px)" }}
            />
          ))}
        </div>

        <div className="absolute inset-0 overflow-hidden opacity-[0.14]">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={`nox-glow-${i}`}
              initial={{ y: "-130%", opacity: 0 }}
              animate={{ y: "130%", opacity: [0, 0.35, 0] }}
              transition={{
                duration: 14 + (i % 3) * 2,
                repeat: Infinity,
                delay: i * 0.9,
                ease: "linear",
              }}
              className="absolute top-0 h-[180px] w-[2px] bg-gradient-to-b from-transparent via-white/70 to-transparent"
              style={{ left: `${10 + i * 8.5}%`, filter: "blur(2px)" }}
            />
          ))}
        </div>

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            background:
              "radial-gradient(circle at 15% 22%, rgba(255,255,255,0.22) 0 1px, transparent 1px), radial-gradient(circle at 72% 28%, rgba(194,162,95,0.30) 0 1px, transparent 1px), radial-gradient(circle at 64% 72%, rgba(255,255,255,0.16) 0 1px, transparent 1px), radial-gradient(circle at 24% 78%, rgba(234,214,168,0.24) 0 1px, transparent 1px)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08090d]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div></div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-white/55">
              <Search className="h-4 w-4 shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar"
                className="w-28 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="rounded-full border border-white/10 bg-[#111319] px-3 py-1 text-xs text-white outline-none"
              >
                {filters.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter}
                  </option>
                ))}
              </select>
            </div>
            <a
              href="https://www.instagram.com/nox.py_/"
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-white/75 transition hover:bg-white/[0.07]"
            >
              Instagram
            </a>
          </div>
        </div>
      </header>

      <main id="top" className="relative mx-auto max-w-7xl px-5 pb-20 pt-0 lg:px-8">
        <style>{`
          @keyframes nox-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
        `}</style>

        <div className="-mx-5 mb-0 overflow-hidden border-y border-white/8 bg-[linear-gradient(90deg,#15171d_0%,#2a2418_18%,#6b5630_50%,#2a2418_82%,#15171d_100%)] lg:-mx-8">
          <div className="flex w-max" style={{ animation: "nox-marquee 28s linear infinite" }}>
            {Array.from({ length: 6 }).map((_, group) => (
              <div
                key={group}
                className="flex min-w-max items-center gap-5 whitespace-nowrap px-6 py-2 text-[11px] font-medium tracking-[0.18em] text-white/88"
              >
                <span className="uppercase">Accesorios premium</span>
                <span className="text-[#ead6a8]/70">•</span>
                <span className="uppercase">10% off en combos seleccionados</span>
                <span className="text-[#ead6a8]/70">•</span>
                <span className="uppercase">Atención directa por WhatsApp</span>
                <span className="text-[#ead6a8]/70">•</span>
                <span className="uppercase">Colección NOX | ACCESORIES</span>
                <span className="text-[#ead6a8]/70">•</span>
              </div>
            ))}
          </div>
        </div>

        <section className="relative -mx-5 overflow-hidden border-b border-white/10 lg:-mx-8">
          <div className="absolute inset-0 bg-[#090b10]" />
          <div className="absolute inset-0">
            <img src="/brand/banner.jpeg" alt="NOX banner" draggable={false} className="pointer-events-none h-full w-full object-cover opacity-40" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,7,11,0.96)_0%,rgba(6,7,11,0.88)_36%,rgba(6,7,11,0.55)_62%,rgba(6,7,11,0.85)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(194,162,95,0.20),transparent_24%)]" />

          <div className="relative mx-auto flex min-h-[350px] max-w-7xl flex-col justify-end px-5 py-10 sm:min-h-[420px] sm:py-14 lg:px-8 lg:py-16">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:h-20 sm:w-20">
                  <img src="/brand/profile.jpeg" alt="NOX profile" draggable={false} className="pointer-events-none h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[#ead6a8]/70">Nox Accessories</p>
                  <div className="mt-2 h-px w-24 bg-gradient-to-r from-[#c2a25f] to-transparent" />
                </div>
              </div>

              <h1 className="text-4xl font-semibold tracking-[0.06em] text-white sm:text-5xl lg:text-6xl">
                NOX | ACCESORIES
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 sm:text-base lg:text-lg">
                Accesorios masculinos con estética premium. Pulseras, collares y combos pensados para elevar tu estilo con una presencia más limpia, elegante y moderna.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#catalogo"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-3 text-sm font-medium text-white transition hover:bg-white/[0.12]"
                >
                  Ver catálogo
                </a>
                <a
                  href="https://www.instagram.com/nox.py_/"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm font-medium text-white/82 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mb-8 px-2 pt-6 sm:pt-8"> 
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/38">Estilo</p>
              <p className="mt-2 text-base font-medium text-white">Minimalista y premium</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/38">Colección</p>
              <p className="mt-2 text-base font-medium text-white">Pulseras, collares y combos</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/38">Contacto</p>
              <p className="mt-2 text-base font-medium text-white">Compra rápida por WhatsApp</p>
            </div>
          </div>
        </section>

        <motion.section
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div variants={fadeUp} className="mb-8 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((filter) => {
              const active = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-sm transition ${
                    active
                      ? "border-white/25 bg-white/[0.08] text-white"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </motion.div>

          <motion.div variants={fadeUp} className="mb-12 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_14px_50px_rgba(0,0,0,0.28)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 fill-red-500 text-red-500" />
                <h2 className="text-xl font-semibold text-white sm:text-2xl">Destacados</h2>
              </div>
              <span className="text-sm text-white/40">{featuredFiltered.length} productos</span>
            </div>

            <HorizontalScroller id="featured-scroll">
              {featuredFiltered.map((item) => (
                <div key={`featured-${item.name}`} className="w-[220px] shrink-0 sm:w-[240px] lg:w-[250px]">
                  <ProductCard item={item} onAdd={addToCart} featured />
                </div>
              ))}
            </HorizontalScroller>
          </motion.div>

          <div id="catalogo">
            {activeFilter === "Todos" ? (
              <div className="space-y-14">
                {showCombos && standardCombos.length > 0 ? (
                  <motion.section variants={fadeUp} id="combos">
                    <div className="mb-6 flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-white sm:text-3xl">Combos</h2>
                      <span className="text-sm text-white/40">{standardCombos.length} combos</span>
                    </div>
                    <HorizontalScroller>
                      {standardCombos.map((item) => (
                        <div key={item.name} className="w-[220px] shrink-0 sm:w-[240px] lg:w-[250px]">
                          <ProductCard item={item} onAdd={addToCart} />
                        </div>
                      ))}
                    </HorizontalScroller>
                  </motion.section>
                ) : null}

                {showPremiumCombos && premiumCombos.length > 0 ? (
                  <motion.section variants={fadeUp} id="combos-premium">
                    <div className="mb-6 flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-white sm:text-3xl">Combos Premium</h2>
                      <span className="text-sm text-white/40">{premiumCombos.length} combos</span>
                    </div>
                    <HorizontalScroller>
                      {premiumCombos.map((item) => (
                        <div key={item.name} className="w-[220px] shrink-0 sm:w-[240px] lg:w-[250px]">
                          <ProductCard item={item} onAdd={addToCart} />
                        </div>
                      ))}
                    </HorizontalScroller>
                  </motion.section>
                ) : null}

                {showBracelets && bracelets.length > 0 ? (
                  <motion.section variants={fadeUp} id="pulseras">
                    <div className="mb-6 flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-white sm:text-3xl">Pulseras</h2>
                      <span className="text-sm text-white/40">{bracelets.length} productos</span>
                    </div>
                    <HorizontalScroller>
                      {bracelets.map((item) => (
                        <div key={item.name} className="w-[220px] shrink-0 sm:w-[240px] lg:w-[250px]">
                          <ProductCard item={item} onAdd={addToCart} />
                        </div>
                      ))}
                    </HorizontalScroller>
                  </motion.section>
                ) : null}

                {showNecklaces && necklaces.length > 0 ? (
                  <motion.section variants={fadeUp} id="collares">
                    <div className="mb-6 flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-white sm:text-3xl">Collares</h2>
                      <span className="text-sm text-white/40">{necklaces.length} productos</span>
                    </div>
                    <HorizontalScroller>
                      {necklaces.map((item) => (
                        <div key={item.name} className="w-[220px] shrink-0 sm:w-[240px] lg:w-[250px]">
                          <ProductCard item={item} onAdd={addToCart} />
                        </div>
                      ))}
                    </HorizontalScroller>
                  </motion.section>
                ) : null}

                {(!showCombos || standardCombos.length === 0) && (!showPremiumCombos || premiumCombos.length === 0) && (!showBracelets || bracelets.length === 0) && (!showNecklaces || necklaces.length === 0) ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">
                    No se encontraron productos para esa búsqueda.
                  </div>
                ) : null}
              </div>
            ) : (
              <motion.div
                variants={fadeUp}
                id={
                  activeFilter === "Pulseras"
                    ? "pulseras"
                    : activeFilter === "Collares"
                    ? "collares"
                    : activeFilter === "COMBOS"
                    ? "combos"
                    : undefined
                }
              >
                {filteredProducts.length > 0 ? (
                  <HorizontalScroller>
                    {filteredProducts.map((item) => (
                      <div key={item.name} className="w-[220px] shrink-0 sm:w-[240px] lg:w-[250px]">
                        <ProductCard item={item} onAdd={addToCart} />
                      </div>
                    ))}
                  </HorizontalScroller>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/55">
                    No se encontraron productos para esa búsqueda.
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.section>

        <section id="carrito" className="mt-24">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.div variants={fadeUp} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:p-7 md:p-10">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">Contacto</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white sm:text-4xl">
                    Tu selección lista para contacto.
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/62 sm:text-lg">
                    Revisá los productos seleccionados, consultá disponibilidad y ponete en contacto con nosotros para completar tu pedido de forma rápida y directa.
                  </p>
                </div>

                <div className="w-full max-w-xl space-y-4 lg:pl-6">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <p className="text-sm uppercase tracking-[0.18em] text-white/40">Resumen de selección</p>
                      <p className="text-sm font-semibold text-white/82">{formatGs(cartTotal)}</p>
                    </div>
                    {cart.length === 0 ? (
                      <p className="text-white/55">Todavía no agregaste productos.</p>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item.name} className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-3">
                            <div>
                              <p className="text-sm font-medium text-white">{item.name}</p>
                              <p className="text-xs text-white/45">
                                {item.price} • Cantidad: {item.quantity}
                              </p>
                              <p className="mt-1 text-xs font-medium text-white/70">
                                Subtotal: {formatGs(parsePrice(item.price) * item.quantity)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.name)}
                              className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                            >
                              Quitar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <a
                      href={whatsappCartLink}
                      className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white/82 transition hover:bg-white/[0.08]"
                    >
                      <MessageCircle className="h-5 w-5" /> Enviar carrito
                    </a>
                    <a
                      href="https://www.instagram.com/nox.py_/"
                      className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white/82 transition hover:bg-white/[0.08]"
                    >
                      <Instagram className="h-5 w-5" /> Instagram
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}




