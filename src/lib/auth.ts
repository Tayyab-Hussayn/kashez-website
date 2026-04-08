const ADMIN_PASSWORD = "admin123";
const AUTH_KEY = "lamaison_admin_auth";

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function isAuthenticated(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === "authenticated";
  } catch {
    return false;
  }
}

export function setAuthenticated(value: boolean): void {
  if (value) {
    localStorage.setItem(AUTH_KEY, "authenticated");
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}
