"use client";

// One product in the 13i Shop (Update 5.71). Everything it shows comes from
// the product's entry in lib/shop.js. The Buy button only ever links out to
// Fourthwall; no payment happens on 13i.space.

import { useState } from "react";
import { buyHref, formatPrice } from "../../lib/shop";

export default function ProductCard({ product, index = 0 }) {
  const [side, setSide] = useState("front");
  const [option, setOption] = useState(product.options && product.options.values.length === 1 ? product.options.values[0] : null);
  // size buttons only when a size changes where Buy goes; otherwise the
  // buyer picks the size on Fourthwall's page and the card just lists them
  const perOption = !!((product.links && Object.keys(product.links).length) || (product.variantIds && Object.keys(product.variantIds).length));
  const hasBack = !!(product.images && product.images.back);
  const src = (product.images && (side === "back" && hasBack ? product.images.back : product.images.front)) || null;
  const href = buyHref(product, option);
  const needsChoice = !href && !option && product.variantIds && Object.keys(product.variantIds).length > 0;
  const idBase = `shop-${product.id}`;

  return (
    <article className="shop-card" style={{ "--i": index }}>
      <div className={`shop-stage${product.images && product.images.photo ? " shop-stage-photo" : ""}`}>
        {src ? (
          <img src={src} alt={`${product.name}, ${side}`} loading="lazy" width="900" height="900" />
        ) : (
          <div className="shop-stage-empty mono">PICTURE COMING</div>
        )}
        {hasBack && (
          <div className="shop-side" role="group" aria-label="Show front or back">
            <button id={`${idBase}-front`} type="button" aria-pressed={side === "front"} onClick={() => setSide("front")}>Front</button>
            <button id={`${idBase}-back`} type="button" aria-pressed={side === "back"} onClick={() => setSide("back")}>Back</button>
          </div>
        )}
      </div>

      <div className="shop-card-body">
        <h3 className="shop-card-name">{product.name}</h3>
        {product.details && <div className="mono shop-card-details">{product.details}{product.color ? ` · ${product.color}` : ""}</div>}
        {product.blurb && <p className="shop-card-blurb">{product.blurb}</p>}

        {product.options && product.options.values.length > 0 && !perOption && (
          <div className="mono shop-sizes">
            {product.options.label}{product.options.values.length > 1 ? "s" : ""}{" "}
            <span>{product.options.values.length > 1 ? `${product.options.values[0]} – ${product.options.values[product.options.values.length - 1]}` : product.options.values[0]}</span>
          </div>
        )}

        {perOption && product.options && product.options.values.length > 1 && (
          <div className="shop-options" role="group" aria-label={product.options.label}>
            <span className="mono shop-options-label">{product.options.label}</span>
            {product.options.values.map((v) => (
              <button key={v} id={`${idBase}-opt-${v}`} type="button" className="mono" aria-pressed={option === v} onClick={() => setOption(option === v ? null : v)}>
                {v}
              </button>
            ))}
          </div>
        )}

        <div className="shop-buy-row">
          <span className="mono shop-price">{formatPrice(product.price)}</span>
          {href ? (
            <a className="mono shop-buy" href={href} rel="noopener">
              Buy on Fourthwall <span aria-hidden="true">&rarr;</span>
            </a>
          ) : (
            <span className="mono shop-buy shop-buy-off" aria-disabled="true">
              {needsChoice ? `Choose a ${product.options.label.toLowerCase()}` : "Opening soon"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
