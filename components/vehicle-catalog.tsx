"use client";

import Image from "next/image";
import { ArrowRight, Check, Minus, Plus, Search, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { fleet, type Vehicle } from "@/lib/fleet";

const whatsappNumber = "971557162816";
const categories = ["All vehicles", "Supercars", "Luxury Sedans", "Luxury SUVs", "VIP Vans"] as const;
const cartStorageKey = "alharamain-vehicle-cart";
type CartLine = { id: string; quantity: number };
type CartSnapshot = { cart: CartLine[]; message: string };
const emptyCartSnapshot: CartSnapshot = { cart: [], message: "" };
let cartSnapshot = emptyCartSnapshot;
let storageLoaded = false;
const cartListeners = new Set<() => void>();

function isCartLine(value: unknown): value is CartLine {
  return typeof value === "object" && value !== null &&
    "id" in value && typeof value.id === "string" &&
    "quantity" in value && typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) && value.quantity >= 1 && value.quantity <= 99;
}

function notifyCartListeners() {
  cartListeners.forEach((listener) => listener());
}

function readStoredCart(): CartSnapshot {
  const savedCart = localStorage.getItem(cartStorageKey);
  if (!savedCart) return emptyCartSnapshot;
  const parsed: unknown = JSON.parse(savedCart);
  if (!Array.isArray(parsed) || !parsed.every(isCartLine)) {
    throw new Error("Saved cart data is invalid.");
  }
  const cart = parsed.filter((line) => fleet.some((vehicle) => vehicle.id === line.id));
  return {
    cart,
    message: cart.length === parsed.length ? "" : "Some vehicles are no longer available and were removed from your saved cart.",
  };
}

function handleStorageChange(event: StorageEvent) {
  if (event.key !== cartStorageKey && event.key !== null) return;
  try {
    cartSnapshot = readStoredCart();
  } catch {
    cartSnapshot = { cart: [], message: "Your saved cart could not be restored. Add your vehicles again." };
  }
  notifyCartListeners();
}

function subscribeToCart(listener: () => void) {
  cartListeners.add(listener);
  if (!storageLoaded) {
    storageLoaded = true;
    try {
      cartSnapshot = readStoredCart();
    } catch {
      cartSnapshot = { cart: [], message: "Your saved cart could not be restored. Add your vehicles again." };
    }
    notifyCartListeners();
  }
  window.addEventListener("storage", handleStorageChange);
  return () => {
    cartListeners.delete(listener);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function getCartSnapshot() {
  return cartSnapshot;
}

function getServerCartSnapshot() {
  return emptyCartSnapshot;
}

function saveCart(cart: CartLine[]) {
  let message = "";
  try {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  } catch {
    message = "Cart changes could not be saved on this device.";
  }
  cartSnapshot = { cart, message };
  notifyCartListeners();
}

export function VehicleCatalog({ featured = false }: { featured?: boolean }) {
  const [category, setCategory] = useState("All vehicles");
  const [query, setQuery] = useState("");
  const { cart, message: cartMessage } = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot);
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(() => fleet.filter((vehicle) =>
    (category === "All vehicles" || vehicle.category === category) &&
    `${vehicle.name} ${vehicle.category} ${vehicle.body} ${vehicle.specs} ${vehicle.engine} ${vehicle.transmission} ${vehicle.features.join(" ")} ${vehicle.seats} seats`.toLowerCase().includes(query.trim().toLowerCase()),
  ), [category, query]);
  const visible = featured ? filtered.slice(0, 6) : filtered;
  const cartItems = cart.flatMap((line) => {
    const vehicle = fleet.find((item) => item.id === line.id);
    return vehicle ? [{ vehicle, quantity: line.quantity }] : [];
  });
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.vehicle.day * item.quantity, 0);
  const whatsappMessage = [
    "Hello, I would like to request these vehicles from Al Haramain Luxury Fleet:",
    ...cartItems.map(({ vehicle, quantity }) =>
      `• ${vehicle.name}${vehicle.year ? ` (${vehicle.year})` : ""} × ${quantity} — AED ${(vehicle.day * quantity).toLocaleString("en-US")} / day`,
    ),
    `Estimated daily total: AED ${total.toLocaleString("en-US")}`,
    "Please confirm availability, final rates, and payment details.",
  ].join("\n");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  function updateQuantity(id: string, quantity: number) {
    saveCart(quantity < 1
      ? cart.filter((line) => line.id !== id)
      : cart.map((line) => line.id === id ? { ...line, quantity: Math.min(quantity, 99) } : line));
  }

  function addToCart(vehicle: Vehicle) {
    const existing = cart.find((line) => line.id === vehicle.id);
    if (existing) {
      saveCart(cart.map((line) => line.id === vehicle.id
          ? { ...line, quantity: Math.min(line.quantity + 1, 99) }
          : line));
    } else {
      saveCart([...cart, { id: vehicle.id, quantity: 1 }]);
    }
    setCartOpen(true);
  }

  return (
    <section className="fleet-section section-pad" id={featured ? "fleet" : undefined}>
      <div className="section-heading">
        <div><div className="eyebrow eyebrow--dark"><i /> {featured ? "THE COLLECTION" : "THE FULL COLLECTION"}</div><h2>{featured ? <>A fleet for <em>every journey.</em></> : <>Choose your <em>vehicle.</em></>}</h2></div>
        <div className="fleet-heading-actions">
          <button className="catalog-cart-button" onClick={() => setCartOpen((open) => !open)} aria-label={`Open cart, ${cartCount} vehicles`}>
            <ShoppingBag size={17} /> Cart <span>{cartCount}</span>
          </button>
          {featured && <Link className="text-action" href="/fleet">All vehicles <ArrowRight size={14} /></Link>}
        </div>
      </div>
      <p className="fleet-intro">{featured
        ? `${fleet.length} selected luxury vehicles, each paired with a unique vehicle photograph.`
        : "Search by make, model, specification, engine or feature. Rates and unit specifications are indicative; our concierge confirms availability and exact details."}</p>
      <div className="fleet-tools">
        <div className="tabs">{categories.map((item) => <button key={item} className={category === item ? "tab tab--active" : "tab"} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <label className="search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search make, model, GCC, or feature" /><span aria-live="polite">{filtered.length} AVAILABLE</span></label>
      </div>
      <div className="fleet-grid">
        {visible.map((vehicle) => {
          const inCart = cart.find((line) => line.id === vehicle.id)?.quantity ?? 0;
          return (
            <article className="vehicle-card" key={vehicle.id}>
              <div className="vehicle-card__photo" style={{ backgroundColor: vehicle.backdrop }}>
                <Image src={vehicle.photo} alt={`${vehicle.name} luxury vehicle`} fill sizes="(max-width: 760px) 100vw, (max-width: 1050px) 50vw, 33vw" unoptimized />
                <span className="vehicle-card__category">{vehicle.category}</span>
              </div>
              <div className="vehicle-card__body">
                <div className="vehicle-card__title">
                  <div><h3>{vehicle.name}</h3><p>{vehicle.year ?? "Model year on request"} <i /> {vehicle.specs}</p></div>
                </div>
                <div className="vehicle-specs">
                  <span>{vehicle.engine}</span>
                  <span>{vehicle.transmission}</span>
                  <span>{vehicle.seats} seats · {vehicle.body}</span>
                  <span>{vehicle.features.join(" · ")}</span>
                </div>
                <div className="vehicle-card__footer">
                  <div><small>DAILY · MONTHLY</small><strong>AED {vehicle.day.toLocaleString("en-US")} / day</strong><small className="vehicle-monthly">AED {vehicle.month.toLocaleString("en-US")} / month</small></div>
                  <button className={inCart ? "button button--gold button--small vehicle-add vehicle-add--added" : "button button--gold button--small vehicle-add"} onClick={() => addToCart(vehicle)}>
                    {inCart ? <><Check size={14} /> Added ({inCart})</> : <><Plus size={14} /> Add to cart</>}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {visible.length === 0 && <p className="empty-state">No vehicles match that search. Try another make, model or category.</p>}
      {featured && <div className="fleet-bottom"><span>{filtered.length} premium vehicles available</span><Link className="button button--dark" href="/fleet">View all {fleet.length} vehicles <ArrowRight size={15} /></Link></div>}
      {cartOpen && <div className="cart-backdrop" onClick={() => setCartOpen(false)}>
        <aside className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(event) => event.stopPropagation()}>
          <div className="cart-panel__header"><div><span className="eyebrow eyebrow--dark">YOUR SELECTION</span><h2 id="cart-title">Vehicle cart <span>({cartCount})</span></h2></div><button className="circle-arrow" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={17} /></button></div>
          {cartMessage && <p className="form-message form-message--error" role="alert">{cartMessage}</p>}
          {cartItems.length === 0
            ? <div className="cart-empty"><ShoppingBag size={26} /><p>Your cart is empty.</p><span>Add a vehicle to prepare your WhatsApp enquiry.</span></div>
            : <div className="cart-lines">{cartItems.map(({ vehicle, quantity }) => <article className="cart-line" key={vehicle.id}>
              <Image src={vehicle.photo} alt={vehicle.name} width={110} height={78} unoptimized />
              <div className="cart-line__details"><strong>{vehicle.name}{vehicle.year ? ` · ${vehicle.year}` : ""}</strong><small>AED {vehicle.day.toLocaleString("en-US")} / day · AED {vehicle.month.toLocaleString("en-US")} / month</small>
                <div className="cart-quantity"><button onClick={() => updateQuantity(vehicle.id, quantity - 1)} aria-label={`Remove one ${vehicle.name}`}><Minus size={13} /></button><span>{quantity}</span><button onClick={() => updateQuantity(vehicle.id, quantity + 1)} aria-label={`Add one ${vehicle.name}`}><Plus size={13} /></button></div>
              </div>
              <button className="cart-line__remove" onClick={() => updateQuantity(vehicle.id, 0)} aria-label={`Remove ${vehicle.name} from cart`}><Trash2 size={15} /></button>
            </article>)}</div>}
          {cartItems.length > 0 && <>
            <div className="cart-total"><span>Estimated daily total</span><strong>AED {total.toLocaleString("en-US")}</strong></div>
            <p className="cart-disclaimer">Final availability, rates and payment are confirmed by our concierge.</p>
            <a className="button button--gold cart-checkout" href={whatsappUrl} target="_blank" rel="noreferrer">Continue on WhatsApp <ArrowRight size={16} /></a>
          </>}
        </aside>
      </div>}
    </section>
  );
}
