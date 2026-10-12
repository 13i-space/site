// The 13i Shop (Update 5.71). Everything the /shop page shows comes from this
// one file: change a price, a description, a picture or a buy link here and
// the page follows. No redesign needed.
//
// Selling and shipping happen on Fourthwall (no monthly fee on its free
// plan). This site never takes a payment itself: every Buy button sends the
// visitor to Fourthwall, which runs the checkout, prints, ships and handles
// returns. See docs/SHOP.md for how to add a product and what Fourthwall's
// API can and can't do.
//
// HOW A BUY BUTTON DECIDES WHERE TO GO (first match wins):
//   1. the chosen option has its own `links` entry (a full URL), or
//   2. the chosen option has a Fourthwall variant id in `variantIds` and
//      SHOP.fourthwallDomain is set: the button goes straight to Fourthwall's
//      checkout with that size already in the cart, or
//   3. the product's `fourthwallUrl` (its page on the Fourthwall shop).
//   If none of these is filled in yet, the button reads "Opening soon" and
//   can't be clicked. Nothing breaks.

export const SHOP = {
  // The Fourthwall shop's address, without https:// (for example
  // "13i-shop.fourthwall.com"). Fill in once the shop exists.
  fourthwallDomain: "13i-shop.fourthwall.com",
  // Shown in the small print. Prices are in this currency.
  currency: "USD",
};

export const COLLECTIONS = [
  {
    id: "originals",
    name: "13i Originals",
    kicker: "the mark · the steel · the Kin",
    blurb: "The 13i logo, the ring-eye mark on its own, and the words the Kin go by.",
  },
  {
    id: "alien-universe",
    name: "Alien Universe",
    kicker: "species of the 13i galaxy",
    blurb: "The aliens of 13i, and the lab where Kin grow new ones.",
  },
  {
    id: "artifacts",
    name: "13i Artifacts",
    kicker: "objects recovered from inside the story",
    blurb: "Pieces made from the things 13i brought back.",
    empty: "Nothing has come out of the Artifacts vault yet. The first pieces will appear here when they're ready.",
  },
  {
    id: "music",
    name: "13i Music",
    kicker: "the signal, translated",
    blurb: "Gear from The Rave and the three albums of Signal 13i.",
  },
];

const TEE_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

// One entry per product. Fields:
//   id            short name, also the picture file names in public/shop/
//   collection    one of the COLLECTIONS ids above
//   name, blurb   what the card says
//   details       one small line: garment and how it's decorated
//   price         a number, in SHOP.currency (keep it the same as Fourthwall)
//   images        { front, back, photo } pictures; back is optional.
//                 photo: true = a square product photo that fills the
//                 card edge to edge (Fourthwall's own photos)
//   options       optional: { label, values } (sizes etc.)
//   color         optional: the colour shown
//   fourthwallUrl the product's page on Fourthwall ("" until it exists)
//   links         optional: { "M": "https://..." } a link per option
//   variantIds    optional: { "M": "<Fourthwall variant id>" } per option
//   hidden        true keeps a product off the page without deleting it
export const PRODUCTS = [
  {
    id: "neon-emblem-tee",
    collection: "originals",
    name: "13i Neon Emblem Tee",
    blurb: "The brushed-steel 13i across the chest, its eye lit blue. The mark at the back of the neck, and www.13i.space low on the back.",
    details: "Cotton tee · printed",
    price: 18.45,
    color: "Black",
    images: { front: "/shop/neon-emblem-tee-front.webp", back: "/shop/neon-emblem-tee-back.webp", photo: true },
    options: { label: "Size", values: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"] },
    fourthwallUrl: "https://13i-shop.fourthwall.com/products/13i-neon-emblem-tee",
  },
  {
    id: "steel-tee",
    collection: "originals",
    name: "Steel 13i Tee",
    blurb: "The full brushed-steel 13i across the chest. The mark at the back of the neck, and www.13i.space low on the back.",
    details: "Cotton tee · printed",
    price: 32,
    color: "Black",
    images: { front: "/shop/steel-tee-front.webp", back: "/shop/steel-tee-back.webp" },
    options: { label: "Size", values: TEE_SIZES },
    fourthwallUrl: "",
    // replaced for now by the 13i Neon Emblem Tee; set hidden: false to show it again
    hidden: true,
  },
  {
    id: "transmission-tee",
    collection: "originals",
    name: "Transmission Tee",
    blurb: "A small mark over the heart and www.13i.space across the shoulders. A tour shirt that tells people where to go.",
    details: "Cotton tee · printed",
    price: 18.45,
    color: "Black",
    images: { front: "/shop/transmission-tee-front.webp", back: "/shop/transmission-tee-back.webp", photo: true },
    options: { label: "Size", values: TEE_SIZES },
    fourthwallUrl: "https://13i-shop.fourthwall.com/products/transmission-tee",
  },
  {
    id: "mark-hat",
    collection: "originals",
    name: "The Mark Hat",
    blurb: "Just the ring-eye mark, stitched in blue on the front. The quiet way to wear it, and the one people will ask about.",
    details: "Unstructured cotton cap · embroidered",
    price: 18.65,
    color: "Black",
    images: { front: "/shop/mark-hat-front.webp", back: "/shop/mark-hat-back.webp", photo: true },
    options: { label: "Fit", values: ["One size"] },
    fourthwallUrl: "https://13i-shop.fourthwall.com/products/13i-mark-hat",
  },
  {
    id: "mark-hoodie",
    collection: "originals",
    name: "The Mark Hoodie",
    blurb: "A stitched mark over the heart. On the back, a tall mark down the spine and www.13i.space below it.",
    details: "Pullover hoodie · embroidered front, printed back",
    price: 36.24,
    color: "Black",
    images: { front: "/shop/mark-hoodie-front.webp", back: "/shop/mark-hoodie-back.webp", photo: true },
    options: { label: "Size", values: TEE_SIZES },
    fourthwallUrl: "https://13i-shop.fourthwall.com/products/13i-mark-hoodie",
  },
  {
    id: "kin-tee",
    collection: "originals",
    name: "Everyone Is Kin Tee",
    blurb: "KINSHIP with both ring-eye i's, and the line that says what it means. www.13i.space on the back.",
    details: "Cotton tee · printed",
    price: 18.45,
    color: "Black",
    images: { front: "/shop/kin-tee-front.webp", back: "/shop/kin-tee-back.webp", photo: true },
    options: { label: "Size", values: TEE_SIZES },
    fourthwallUrl: "https://13i-shop.fourthwall.com/products/kinship-everyone-is-kin-tee",
  },
  {
    id: "epc-crew",
    collection: "originals",
    name: "Explore · Play · Create Crew",
    blurb: "The three ways into 13i.space, one line across the chest. The mark and the address on the back.",
    details: "Crewneck sweatshirt · printed",
    price: 27.74,
    color: "Indigo Blue",
    images: { front: "/shop/epc-crew-front.webp", back: "/shop/epc-crew-back.webp", photo: true },
    options: { label: "Size", values: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"] },
    fourthwallUrl: "https://13i-shop.fourthwall.com/products/explore-play-create-sweatshirt",
  },
  {
    id: "alien-lab-tee",
    collection: "alien-universe",
    name: "The Alien Lab Tee",
    blurb: "Ixxen at the controls, a specimen growing in the tank. Straight from Xenogenesis Bay 13, with www.13i.space on the back.",
    details: "Cotton tee · printed",
    price: 18.45,
    color: "Black",
    images: { front: "/shop/alien-lab-tee-front.webp", back: "/shop/alien-lab-tee-back.webp", photo: true },
    options: { label: "Size", values: TEE_SIZES },
    fourthwallUrl: "https://13i-shop.fourthwall.com/products/the-alien-lab-sci-fi-t-shirt",
  },
  {
    id: "alien-rave-tee",
    collection: "music",
    name: "The Alien Rave Tee",
    blurb: "Qeth, Ilu, Ixxen and Varrow on the floor, the DJ on the decks, the 13i marks on the screen. www.13i.space on the back.",
    details: "Cotton tee · printed",
    price: 18.45,
    color: "Black",
    images: { front: "/shop/alien-rave-tee-front.webp", back: "/shop/alien-rave-tee-back.webp", photo: true },
    options: { label: "Size", values: TEE_SIZES },
    fourthwallUrl: "https://13i-shop.fourthwall.com/products/the-alien-rave-neon-sci-fi-tee",
  },
];

// Where a Buy button should send someone, or null if the product isn't on
// sale yet. Never throws.
export function buyHref(product, option) {
  try {
    if (!product) return null;
    const link = option && product.links && product.links[option];
    if (link) return link;
    const vid = option && product.variantIds && product.variantIds[option];
    const domain = (SHOP.fourthwallDomain || "").replace(/^https?:\/\//, "").replace(/\/+$/, "");
    if (vid && domain) return `https://${domain}/cart/checkout?products=${encodeURIComponent(vid)}:1`;
    return product.fourthwallUrl || null;
  } catch {
    return null;
  }
}

export function formatPrice(n) {
  if (typeof n !== "number" || !isFinite(n)) return "";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: SHOP.currency || "USD", maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
  } catch {
    return `$${n}`;
  }
}

export function productsIn(collectionId) {
  return PRODUCTS.filter((p) => !p.hidden && p.collection === collectionId);
}

export function shopIsOpen() {
  return PRODUCTS.some((p) => !p.hidden && (p.fourthwallUrl || (p.links && Object.keys(p.links).length) || (SHOP.fourthwallDomain && p.variantIds && Object.keys(p.variantIds).length)));
}
