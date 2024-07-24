export function calculateExpirationDate(days: number): Date {
  const millisecondsInADay = 24 * 60 * 60 * 1000;
  return new Date(Date.now() + days * millisecondsInADay);
}
