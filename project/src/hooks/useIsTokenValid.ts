export default function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp; // in seconds
    const now = Math.floor(Date.now() / 1000); // current time in seconds
    return exp < now;
  } catch (err) {
    return true; // assume expired if error
  }
}