// The Alien Lab's live feed (Update 5.63). The lab scene copies what's in
// the tank onto a small canvas every frame; the card preview below the
// lab shows that canvas, so the card's portrait window always matches the
// tank - the embryo, the transformation, then the species itself.

let feed = null;
export function setLabMirror(canvas) { feed = canvas; }
export function getLabMirror() { return feed; }
