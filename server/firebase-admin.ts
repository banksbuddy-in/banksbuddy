// Firebase Realtime Database REST API helper
// No service account required — uses Firebase REST API directly
// For write operations in production, set FIREBASE_DATABASE_SECRET in server/.env

const DB_URL = process.env.FIREBASE_DATABASE_URL || "https://banksbuddy-fbcc4-default-rtdb.firebaseio.com";
const DB_SECRET = process.env.FIREBASE_DATABASE_SECRET; // optional legacy secret for writes

function authParam() {
  return DB_SECRET ? `?auth=${DB_SECRET}` : "";
}

function authSep(path: string) {
  // Append auth param: if path has no query, use ?auth=..., else &auth=...
  return DB_SECRET ? (path.includes("?") ? `&auth=${DB_SECRET}` : `?auth=${DB_SECRET}`) : "";
}

export async function dbGet(path: string): Promise<unknown> {
  const url = `${DB_URL}/${path}.json${authParam()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Firebase GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function dbSet(path: string, data: unknown): Promise<void> {
  const url = `${DB_URL}/${path}.json${authParam()}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Firebase SET ${path} failed: ${res.status}`);
}

export async function dbPush(path: string, data: unknown): Promise<string> {
  const url = `${DB_URL}/${path}.json${authParam()}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Firebase PUSH ${path} failed: ${res.status}`);
  const json = await res.json() as { name: string };
  return json.name;
}

export async function dbUpdate(path: string, data: unknown): Promise<void> {
  const url = `${DB_URL}/${path}.json${authParam()}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Firebase UPDATE ${path} failed: ${res.status}`);
}

export async function dbDelete(path: string): Promise<void> {
  const url = `${DB_URL}/${path}.json${authParam()}`;
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) throw new Error(`Firebase DELETE ${path} failed: ${res.status}`);
}

export default { dbGet, dbSet, dbPush, dbUpdate, dbDelete };
