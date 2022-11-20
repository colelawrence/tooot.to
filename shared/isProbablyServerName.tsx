export function isProbablyServerName(x: unknown): x is string {
  if(typeof x !== "string")
    return false;
  // at least 3 chars & has no spaces, forward slashes or ?
  if(x.length < 3 || /[ \/\?]/.test(x))
    return false;
  return /[^\.]\.[^\.]/.test(x);
}
