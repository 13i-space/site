// 13i's Continuance Review verdicts (written by app/api/alien, action
// "review"). Under the Continuance Rule a species' survival is conditional
// on demonstrated internal cooperation - see docs/WORLD.md.
export const VERDICTS = {
  granted: { label: "Continuance granted", short: "GRANTED", color: "#6FC3A8" },
  observation: { label: "Under observation", short: "OBSERVED", color: "#E8CFC0" },
  not_yet: { label: "Continuance not yet earned", short: "NOT YET", color: "#C97B6E" },
};

export const verdictFor = (species) => {
  const v = species?.review?.verdict;
  return v && VERDICTS[v] ? { id: v, ...VERDICTS[v] } : null;
};
