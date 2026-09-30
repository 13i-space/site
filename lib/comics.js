// Comic versions of short stories, keyed by assignment number. Each one gets
// a "Comic version" box at the top of its story and a reader page at
// /assignments/<number>/comic. Images live in public/comics/<slug>/.
//
// To add a comic: put cover.jpg and page-1.jpg ... page-N.jpg in a new
// folder under public/comics/, then add an entry here.
const pagesFor = (slug, count) => Array.from({ length: count }, (_, i) => `/comics/${slug}/page-${i + 1}.jpg`);

export const COMICS = {
  215783: {
    title: "Nerath's Secret",
    cover: "/comics/neraths-secret/cover.jpg",
    pages: pagesFor("neraths-secret", 8),
  },
};

export const comicHrefFor = (number) => (COMICS[number] ? `/assignments/${number}/comic` : null);
