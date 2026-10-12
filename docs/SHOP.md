# SHOP.md — The 13i Shop and Fourthwall

Update 5.71. The shop lives at `/shop` and is linked from the footer, next to
About and Contact. It is deliberately simple. The page shows the products,
and every Buy button sends the visitor to **Fourthwall**, which handles
checkout, payment, printing, shipping, tracking and returns. 13i.space never
takes a payment and has no checkout of its own.

## Files

| File | What it is |
|---|---|
| `lib/shop.js` | **The only file to edit for products**: collections, names, descriptions, prices, sizes, pictures, buy links |
| `components/shop/ProductCard.js` | One reusable product card: picture with front/back toggle, name, details, description, size chips, price, Buy button |
| `app/(site)/shop/page.js` | The page: hero, collection jump links, one section per collection |
| `public/shop/*.webp` | Product pictures (`<id>-front.webp`, `<id>-back.webp`) |
| `app/globals.css` | Styles, in the block headed "The 13i Shop" |

The print files for every design are on Paul's Mac in
`Desktop/13i/13i Logos/Shop Print Files` (the `_PRINT` files go to
Fourthwall; the `web only` folder is not for printing).

## Collections

13i Originals, Alien Universe, 13i Artifacts, 13i Music (`COLLECTIONS` in
`lib/shop.js`). A collection with no products shows its `empty` line instead
of a grid. A collection with a single product shows it as one wide featured
card.

## Adding or changing a product

1. Make the product in Fourthwall and publish it.
2. Copy its page address from Fourthwall (it looks like
   `https://<shop>.fourthwall.com/products/<name>`).
3. In `lib/shop.js`, paste it into that product's `fourthwallUrl`.
4. Make sure `price` matches the price set in Fourthwall. The site does not
   read prices from Fourthwall yet (see "Possible next step" below).
5. New product: add an entry to `PRODUCTS` (copy an existing one), and put
   its pictures in `public/shop/` named `<id>-front.webp` and
   `<id>-back.webp`.
6. To take a product off the page without deleting it, set `hidden: true`.

When at least one product has a link, the page's status reads "Open" and the
"opens soon" note disappears on its own.

### Optional: send a chosen size straight to checkout
Each product can also carry `variantIds` (one Fourthwall variant id per size)
and `SHOP.fourthwallDomain` can be set to the shop's address. The Buy button
then goes straight to Fourthwall's checkout with that size already in the
cart, using Fourthwall's documented link
`https://<shop domain>/cart/checkout?products=<variantId>:1`. Without them,
the button opens the product's Fourthwall page, where the buyer picks a size
there. Either way works; the plain product link is the simpler place to start.

## What Fourthwall's API can actually do (checked Oct 11, 2026)

Sources: docs.fourthwall.com (Storefront API overview, cart and checkout
tutorial, architecture, API reference) and help.fourthwall.com (embedding
your store, API surfaces, Free plan and Pro FAQs).

**Three APIs, two credentials.**
- **Storefront API** (`storefront-api.fourthwall.com/v1`), authenticated with
  a `storefront_token` from Settings > For Developers. It is built for
  custom storefronts.
- **Platform Open API** (`api.fourthwall.com`): shop data such as products
  and orders, plus webhooks. It uses a separate OpenAPI credential.
- **Product Offer Open API**: read-only published offers, using the OpenAPI
  credential.

The Storefront token does not work on the other two APIs.

**What the Storefront API supports**
- The shop's info (`GET /shop`: id, name, domain, publicDomain).
- Collections and the products in each (`/collections`,
  `/collections/{slug}/products`), and a single product (`/products/{slug}`).
  A product returns its name, description, images, state (AVAILABLE or
  SOLD_OUT), and variants. Each variant has a unitPrice, compareAtPrice,
  size/color attributes and stock.
- Carts: create, get, add to cart, remove, change quantity.
- Checkout: **a redirect to Fourthwall's hosted checkout page** using the
  cart id (`https://{checkout domain}/checkout/?cartCurrency=USD&cartId=...`),
  or the direct `/cart/checkout?products=<variantId>:1` link.

**What is not supported**
- **Checkout embedded on 13i.space is not supported.** The docs only describe
  a redirect to Fourthwall's checkout. Fourthwall's embedding guide says an
  iframe can show a single product page, but "Cart and checkout redirect to
  Fourthwall", and the whole shop can't be embedded.
- Payment always happens on Fourthwall. That is why this site has no payment
  code and needs none.

**Not stated in the docs.** The docs don't mention plan requirements for the
Storefront API, rate limits, CORS, or whether the storefront token is meant
to be public. Their own example calls it from the browser, but the help
article says to "store it securely". If we use it, it should be called from a
server route with the token in a Vercel environment variable, never shipped
to the browser.

**Cost.** Fourthwall's Free plan has no monthly subscription, and allows up
to 50 products (active and hidden). Payment processing fees apply to sales,
plus a 5% fee on digital products only. Pro is optional, at $19/month.
Nothing in this build requires Pro.

## Possible next step (not built)

Read live prices, pictures and sold-out status from the Storefront API so
`lib/shop.js` only needs each product's Fourthwall slug:

- A server route reads `FOURTHWALL_STOREFRONT_TOKEN` from Vercel. If it's
  missing, the page falls back to `lib/shop.js` as it does now.
- Optionally, a cart on 13i.space (add several items, then one redirect to
  Fourthwall checkout).

This would follow the "build now, connect key later" rule. It isn't needed to
start selling, so it waits until there's a reason.
