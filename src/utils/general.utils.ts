export const generateRandomTimeInMS = (max: number, from = 0) => {
  return Math.round((Math.random() * (max - from)) + from);
}
