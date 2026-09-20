export function currentPeriodStart() {
  const now = new Date();
  const boundary = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0));
  if (now.getTime() < boundary.getTime()) {
    boundary.setUTCDate(boundary.getUTCDate() - 1);
  }
  return boundary.toISOString();
}
