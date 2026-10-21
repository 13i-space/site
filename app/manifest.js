// Update 6.03: lets 13i be added to a phone's home screen and open full screen, with no browser bars
export default function manifest() {
  return {
    name: "13i",
    short_name: "13i",
    description: "A signal, translated.",
    start_url: "/",
    display: "fullscreen",
    background_color: "#05051A",
    theme_color: "#05051A",
    icons: [{ src: "/icon.png", sizes: "any", type: "image/png" }],
  };
}
