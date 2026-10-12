import ProductCard from "../../../components/shop/ProductCard";
import { COLLECTIONS, productsIn, shopIsOpen } from "../../../lib/shop";

// The 13i Shop (Update 5.71). Products, prices, pictures and buy links all
// live in lib/shop.js. Checkout, printing and shipping are Fourthwall's;
// see docs/SHOP.md.

export const metadata = {
  title: "Shop",
  description: "13i gear, made to order: the mark, the steel, the aliens and The Rave.",
};

export default function ShopPage() {
  const open = shopIsOpen();
  const sections = COLLECTIONS.map((c) => ({ ...c, items: productsIn(c.id) }));
  const total = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="shop">
      <section className="shop-hero">
        <div className="shop-hero-text">
          <div className="mono shop-eyebrow">the 13i shop</div>
          <h1 className="shop-title">Wear the <em>signal.</em></h1>
          <p className="shop-line">
            Every piece is printed or stitched when you order it and shipped from the print house nearest you.
            Nothing waits in a warehouse, and nothing goes to waste.
          </p>
        </div>
        <dl className="shop-readout mono" aria-label="About the shop">
          <div><dt><span className="shop-pulse" aria-hidden="true" />Status</dt><dd>{open ? "Open" : "Opening soon"}</dd></div>
          <div><dt>Pieces</dt><dd>{total}</dd></div>
          <div><dt>Made</dt><dd>To order</dd></div>
          <div><dt>Checkout</dt><dd>Fourthwall</dd></div>
        </dl>
      </section>

      <nav className="shop-jump" aria-label="Collections">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="mono">
            {s.name} <span className="shop-jump-n">{s.items.length}</span>
          </a>
        ))}
      </nav>

      {!open && (
        <p className="mono shop-note">
          The shop opens soon. Every piece below is ready; the buy buttons switch on when it does.
        </p>
      )}

      {sections.map((s) => (
        <section key={s.id} id={s.id} className="shop-collection" aria-labelledby={`${s.id}-title`}>
          <header className="shop-collection-head">
            <div>
              <div className="mono shop-collection-kicker">{s.kicker}</div>
              <h2 id={`${s.id}-title`} className="shop-collection-name">{s.name}</h2>
            </div>
            <p className="shop-collection-blurb">{s.blurb}</p>
          </header>
          {s.items.length ? (
            <div className="shop-grid" data-n={Math.min(s.items.length, 3)}>
              {s.items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          ) : (
            <div className="shop-empty">
              <span className="shop-empty-mark" aria-hidden="true" />
              <p>{s.empty || "Nothing here yet."}</p>
            </div>
          )}
        </section>
      ))}

      <section className="shop-fine mono">
        <p>Checkout, payment, shipping, tracking and returns are handled by Fourthwall, the shop's print partner. 13i.space never sees your card.</p>
        <p>Prices in US dollars. Questions about an order? <a href="/contact">Contact Paul</a>.</p>
      </section>
    </div>
  );
}
