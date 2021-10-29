export const delay = (ms: Number) =>
  new Promise((r) => setTimeout(r, Number(ms)));
