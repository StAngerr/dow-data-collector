export const generateRandomTimeInMS = (max: number, from = 0) => {
  return Math.round(Math.random() * (max - from) + from) * 1000;
};

export const mapAMap = <K, V, T = void, S = void>(
  map: Map<K, V>,
  cb: ([key, value]: [K, V]) => [V | T, K | S]
) => {
  const newEntries = Array.from(map, cb);
  return new Map(newEntries);
};
