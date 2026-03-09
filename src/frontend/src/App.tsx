import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  Clock,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Star,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Product, ShopInfo } from "./backend.d.ts";
import { useActor } from "./hooks/useActor";

// ─── Hardcoded Fallback Data ────────────────────────────────────────────────

const FALLBACK_PRODUCTS = [
  {
    nameEnglish: "Print Stamper Self Inking Stamp",
    descriptionEnglish:
      "Premium self-inking stamp. No separate ink pad needed. Clean, crisp impressions every time.",
    price: BigInt(320),
    priceLabel: "₹320",
    image: "/assets/uploads/image-1.png",
  },
  {
    nameEnglish: "Wood Chemical Stamp",
    descriptionEnglish:
      "Traditional wooden handle stamp with chemical rubber. Durable and long-lasting.",
    price: BigInt(120),
    priceLabel: "₹120",
    image: "/assets/uploads/5-inch-rubber-stamp-1.jpg",
  },
  {
    nameEnglish: "Laminated Pocket name Plate",
    descriptionEnglish:
      "High-quality laminated name plates for offices, homes, and doors. Weather resistant.",
    price: BigInt(80),
    priceLabel: "₹80",
    image: "/assets/uploads/lv_0_20260309152130-1.jpg",
  },
  {
    nameEnglish: "Visiting Card",
    descriptionEnglish:
      "Professional visiting cards with premium print quality. Perfect for business networking.",
    price: BigInt(800),
    priceLabel: "₹800 / 1000 pcs",
    image: "/assets/uploads/IMG_20260309_154713-1.jpg",
  },
];

const FALLBACK_SHOP_INFO = {
  shopName: "Indian Mohar Vale",
  address: "Prayagraj, Uttar Pradesh",
  phoneNumber1: "6386024945",
  phoneNumber2: "9598807883",
  ownerName: "",
  gstinNumber: "",
};

const WHATSAPP_BASE = "https://wa.me/916386024945";

function getWhatsAppUrl(message: string) {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
}

function getProductWhatsAppUrl(productName: string) {
  const msg = `Hello, I need ${productName}. Please share details. I will share my photo, text and document.`;
  return getWhatsAppUrl(msg);
}

// ─── Hooks ──────────────────────────────────────────────────────────────────

function useShopData() {
  const { actor, isFetching } = useActor();

  const productsQuery = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });

  const shopInfoQuery = useQuery<ShopInfo>({
    queryKey: ["shopInfo"],
    queryFn: async () => {
      if (!actor) return FALLBACK_SHOP_INFO as ShopInfo;
      return actor.getShopInfo();
    },
    enabled: !!actor && !isFetching,
  });

  const products =
    productsQuery.data && productsQuery.data.length > 0
      ? productsQuery.data.map((p, i) => ({
          ...p,
          image:
            FALLBACK_PRODUCTS[i]?.image ??
            "/assets/uploads/IMG_20260309_154713-1.jpg",
        }))
      : FALLBACK_PRODUCTS;

  const shopInfo = shopInfoQuery.data?.shopName
    ? shopInfoQuery.data
    : FALLBACK_SHOP_INFO;

  return { products, shopInfo };
}

// ─── Components ─────────────────────────────────────────────────────────────

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home", ocid: "nav.home.link" },
    { href: "#products", label: "Products", ocid: "nav.products.link" },
    {
      href: "#customer-care",
      label: "Customer Care",
      ocid: "nav.customer_care.link",
    },
    { href: "#contact", label: "Contact", ocid: "nav.contact.link" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-primary shadow-lg" : "bg-primary/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-display font-bold text-lg shadow-md">
              IM
            </div>
            <div>
              <div className="font-display font-bold text-primary-foreground text-sm md:text-base leading-tight">
                Indian Mohar Vale
              </div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.ocid}
                href={link.href}
                data-ocid={link.ocid}
                className="px-4 py-2 text-primary-foreground/85 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden text-primary-foreground p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t border-primary-foreground/10"
            >
              <nav className="py-3 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.ocid}
                    href={link.href}
                    data-ocid={link.ocid}
                    className="px-4 py-3 text-primary-foreground/85 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-lg transition-all text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[85vh] flex items-center justify-center pt-16 overflow-hidden bg-primary"
    >
      {/* Wallpaper Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/indian-wallpaper.dim_1920x1080.jpg')",
        }}
      />
      {/* Overlay */}
      <div className="hero-overlay absolute inset-0" />

      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full border-2 border-secondary/30 hidden lg:block" />
      <div className="absolute top-20 right-24 w-16 h-16 rounded-full border border-secondary/20 hidden lg:block" />
      <div className="absolute bottom-20 left-10 w-24 h-24 rounded-full border-2 border-secondary/20 hidden lg:block" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Location Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-4"
        >
          <Badge className="bg-secondary/90 text-foreground border-0 px-4 py-1.5 text-sm font-medium gap-1.5">
            <MapPin size={13} />
            Prayagraj, Uttar Pradesh
          </Badge>
        </motion.div>

        {/* Shop Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1
            className="font-display text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 text-shadow-strong"
            style={{ letterSpacing: "0.03em" }}
          >
            Indian Mohar Vale
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/90 text-lg md:text-xl mb-10 text-shadow-soft font-medium"
        >
          Your Trusted Stamp &amp; Printing Shop
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href={getWhatsAppUrl(
              "Hello, I need a stamp. Please share details.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="hero.primary_button"
            className="inline-flex items-center justify-center gap-3 bg-whatsapp hover:bg-whatsapp/90 text-white font-semibold px-8 py-4 rounded-2xl text-lg shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl whatsapp-pulse"
          >
            <MessageCircle size={24} />
            Order on WhatsApp
          </a>
          <a
            href="#products"
            className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 font-medium px-6 py-4 rounded-2xl text-base transition-all duration-200 backdrop-blur-sm"
          >
            See Products
            <ChevronDown size={18} />
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 grid grid-cols-3 gap-4 max-w-sm mx-auto"
        >
          {[
            { num: "4+", label: "Products" },
            { num: "100%", label: "Quality" },
            { num: "Fast", label: "Delivery" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-secondary font-display font-extrabold text-2xl text-shadow-soft"
                style={{ letterSpacing: "0.04em" }}
              >
                {stat.num}
              </div>
              <div className="text-white/75 text-xs mt-0.5 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface ProductItem {
  nameEnglish: string;
  descriptionEnglish: string;
  price: bigint;
  priceLabel: string;
  image: string;
}

function ProductCard({
  product,
  index,
}: { product: ProductItem; index: number }) {
  const ocidIndex = index + 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="product-card rounded-2xl overflow-hidden"
      data-ocid={`products.item.${ocidIndex}`}
    >
      {/* Product Image */}
      <div
        className="relative overflow-hidden h-52"
        style={{ background: "oklch(0.18 0.05 25 / 0.8)" }}
      >
        <img
          src={product.image}
          alt={product.nameEnglish}
          loading="lazy"
          className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-secondary text-secondary-foreground font-bold text-base px-3 py-1 shadow-md">
            {product.priceLabel}
          </Badge>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <h3
          className="font-display font-bold text-white text-lg leading-snug mb-3 text-shadow-soft"
          style={{ letterSpacing: "0.03em" }}
        >
          {product.nameEnglish}
        </h3>
        <p className="text-white/75 text-sm leading-relaxed mb-5 line-clamp-2">
          {product.descriptionEnglish}
        </p>

        <a
          href={getProductWhatsAppUrl(product.nameEnglish)}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid={`products.order.primary_button.${ocidIndex}`}
          className="flex items-center justify-center gap-2 w-full bg-whatsapp hover:bg-whatsapp/90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] text-sm shadow-lg"
        >
          <MessageCircle size={18} />
          Place Order
        </a>
      </div>
    </motion.div>
  );
}

function ProductsSection({ products }: { products: ProductItem[] }) {
  return (
    <section
      id="products"
      className="py-20 px-4 pattern-bg relative"
      data-ocid="products.section"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="ornament-divider mb-6 max-w-xs mx-auto">
            <Star
              size={14}
              className="text-secondary fill-secondary flex-shrink-0"
            />
          </div>
          <h2
            className="font-display font-bold text-4xl md:text-5xl text-white mb-4 text-shadow-strong"
            style={{ letterSpacing: "0.04em" }}
          >
            Our Products
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-shadow-soft">
            Quality stamps and printing services at the best prices in Prayagraj
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {products.map((product, i) => (
            <ProductCard
              key={product.nameEnglish}
              product={product}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CustomerCareSection() {
  const phones = [
    {
      number: "6386024945",
      display: "63860 24945",
      ocid: "customer_care.call.primary_button.1",
    },
    {
      number: "9598807883",
      display: "95988 07883",
      ocid: "customer_care.call.primary_button.2",
    },
  ];

  return (
    <section
      id="customer-care"
      className="py-20 px-4 pattern-bg relative"
      data-ocid="customer_care.section"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="ornament-divider mb-6 max-w-xs mx-auto">
            <Phone
              size={14}
              className="text-secondary fill-secondary flex-shrink-0"
            />
          </div>
          <h2
            className="font-display font-bold text-4xl md:text-5xl text-white mb-4 text-shadow-strong"
            style={{ letterSpacing: "0.04em" }}
          >
            Customer Care
          </h2>
          <p className="text-white/85 text-lg text-shadow-soft">
            We are here to help you!
          </p>
        </motion.div>

        {/* Call Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {phones.map((phone, i) => (
            <motion.div
              key={phone.number}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-call-green/20 border-2 border-call-green flex items-center justify-center mx-auto mb-4">
                <Phone size={28} className="text-call-green" />
              </div>
              <p className="text-white/75 text-sm font-medium mb-1">Call Us</p>
              <p className="text-white font-display font-bold text-2xl mb-5 tracking-wide text-shadow-soft">
                {phone.display}
              </p>
              <a
                href={`tel:${phone.number}`}
                data-ocid={phone.ocid}
                className="flex items-center justify-center gap-2 w-full bg-call-green hover:bg-call-green/80 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] text-base shadow-lg"
              >
                <Phone size={18} />
                Call Now
              </a>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-2xl p-6 text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-whatsapp/20 border-2 border-whatsapp flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={28} className="text-whatsapp" />
          </div>
          <p className="text-white/75 text-sm font-medium mb-1">
            Chat on WhatsApp
          </p>
          <p className="text-white font-display font-bold text-2xl mb-2 tracking-wide text-shadow-soft">
            63860 24945
          </p>
          <p className="text-white/60 text-xs mb-5">
            Share photos, text &amp; documents
          </p>
          <a
            href={getWhatsAppUrl(
              "Hello, I need a stamp. Please share details.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="customer_care.whatsapp.primary_button"
            className="flex items-center justify-center gap-2 w-full bg-whatsapp hover:bg-whatsapp/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] text-base shadow-lg"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
          </a>
        </motion.div>

        {/* Business Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center flex items-center justify-center gap-3"
        >
          <Clock size={18} className="text-secondary flex-shrink-0" />
          <div>
            <span className="text-white/90 text-sm font-medium">
              Mon–Sat: 9 AM – 8 PM
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ContactSection({ shopInfo }: { shopInfo: typeof FALLBACK_SHOP_INFO }) {
  return (
    <section
      id="contact"
      className="py-20 px-4 pattern-bg relative"
      data-ocid="contact.section"
    >
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="ornament-divider mb-6 max-w-xs mx-auto">
            <MapPin
              size={14}
              className="text-secondary fill-secondary flex-shrink-0"
            />
          </div>
          <h2
            className="font-display font-bold text-4xl md:text-5xl text-white mb-2 text-shadow-strong"
            style={{ letterSpacing: "0.04em" }}
          >
            About Us
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card rounded-3xl p-8 md:p-12 text-center"
        >
          {/* Shop name decorative */}
          <div
            className="stamp-seal w-20 h-20 mx-auto mb-6 flex items-center justify-center"
            style={{ background: "oklch(0.35 0.13 20 / 0.4)" }}
          >
            <span className="font-display font-bold text-secondary text-2xl text-shadow-soft">
              IM
            </span>
          </div>

          <h3
            className="font-display font-bold text-3xl text-white mb-6 text-shadow-soft"
            style={{ letterSpacing: "0.03em" }}
          >
            {shopInfo.shopName}
          </h3>

          <div className="flex items-center justify-center gap-2 text-white/75 mb-8">
            <MapPin size={16} className="text-secondary flex-shrink-0" />
            <span>Prayagraj, Uttar Pradesh</span>
          </div>

          {/* Serving note */}
          <div
            className="rounded-2xl px-6 py-4 mb-8 border border-secondary/40"
            style={{ background: "oklch(0.82 0.16 68 / 0.12)" }}
          >
            <p className="text-white font-medium text-shadow-soft">
              Serving Prayagraj since years
            </p>
          </div>

          {/* Phone numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={`tel:${shopInfo.phoneNumber1}`}
              className="flex items-center justify-center gap-3 rounded-2xl px-5 py-4 transition-all duration-200 border border-white/20 hover:border-secondary/60 group"
              style={{ background: "oklch(0.18 0.05 25 / 0.5)" }}
            >
              <Phone
                size={18}
                className="text-call-green group-hover:scale-110 transition-transform"
              />
              <div className="text-left">
                <div className="text-xs text-white/60">Primary</div>
                <div className="font-semibold text-white">
                  {shopInfo.phoneNumber1}
                </div>
              </div>
            </a>
            <a
              href={`tel:${shopInfo.phoneNumber2}`}
              className="flex items-center justify-center gap-3 rounded-2xl px-5 py-4 transition-all duration-200 border border-white/20 hover:border-secondary/60 group"
              style={{ background: "oklch(0.18 0.05 25 / 0.5)" }}
            >
              <Phone
                size={18}
                className="text-call-green group-hover:scale-110 transition-transform"
              />
              <div className="text-left">
                <div className="text-xs text-white/60">Secondary</div>
                <div className="font-semibold text-white">
                  {shopInfo.phoneNumber2}
                </div>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={getWhatsAppUrl("Hello, I need a stamp. Please share details.")}
      target="_blank"
      rel="noopener noreferrer"
      data-ocid="whatsapp.floating.button"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-whatsapp hover:bg-whatsapp/90 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110 whatsapp-pulse"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}

function Footer({ shopInfo }: { shopInfo: typeof FALLBACK_SHOP_INFO }) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="py-10 px-4 backdrop-blur-sm"
      style={{ background: "oklch(0.08 0.04 20 / 0.92)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h4
              className="font-display font-bold text-xl text-white mb-3 text-shadow-soft"
              style={{ letterSpacing: "0.03em" }}
            >
              {shopInfo.shopName}
            </h4>
            <div className="flex items-center gap-1.5 text-white/55 text-sm">
              <MapPin size={13} className="flex-shrink-0" />
              <span>Prayagraj, Uttar Pradesh</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-semibold text-white mb-3 text-shadow-soft">
              Contact
            </h5>
            <div className="space-y-2">
              <a
                href={`tel:${shopInfo.phoneNumber1}`}
                className="flex items-center gap-2 text-white/65 hover:text-secondary text-sm transition-colors"
              >
                <Phone size={13} />
                {shopInfo.phoneNumber1}
              </a>
              <a
                href={`tel:${shopInfo.phoneNumber2}`}
                className="flex items-center gap-2 text-white/65 hover:text-secondary text-sm transition-colors"
              >
                <Phone size={13} />
                {shopInfo.phoneNumber2}
              </a>
              <a
                href={getWhatsAppUrl("Hello!")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/65 hover:text-secondary text-sm transition-colors"
              >
                <MessageCircle size={13} />
                WhatsApp: 6386024945
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h5 className="font-semibold text-white mb-3 text-shadow-soft">
              Hours
            </h5>
            <div className="flex items-start gap-2 text-white/65 text-sm">
              <Clock size={13} className="mt-0.5 flex-shrink-0" />
              <div>
                <div>Mon–Sat: 9 AM – 8 PM</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-white/45 text-sm">
            © {year} {shopInfo.shopName}. Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-secondary/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const { products, shopInfo } = useShopData();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection products={products} />
        <CustomerCareSection />
        <ContactSection shopInfo={shopInfo} />
      </main>
      <Footer shopInfo={shopInfo} />
      <FloatingWhatsApp />
    </div>
  );
}
