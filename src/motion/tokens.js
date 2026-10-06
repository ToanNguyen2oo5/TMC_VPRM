export const springs = {
  soft: { type: 'spring', stiffness: 100, damping: 20 },
  bouncy: { type: 'spring', stiffness: 400, damping: 25, mass: 1 },
  liquid: { type: 'spring', stiffness: 200, damping: 15, mass: 1 },
};

export const easings = {
  silk: [0.25, 1, 0.5, 1],
  swift: [0.4, 0, 0.2, 1],
};

export const durations = {
  short: 0.2,
  base: 0.45,
  long: 0.8,
};
