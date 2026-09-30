export async function fetchStats() {
  const res = await fetch("/api/stats", { cache: "no-store" });
  if (!res.ok) throw new Error("stats");
  return res.json();
}

export async function sendLetter(payload) {
  const res = await fetch("/api/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "That did not send. Try once more.");
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function fetchAdminLetters(key) {
  const res = await fetch("/api/admin/letters", {
    headers: { "x-admin-key": key }
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("failed");
  return res.json();
}

export async function deleteAdminLetter(key, id) {
  const res = await fetch(`/api/admin/letters/${id}`, {
    method: "DELETE",
    headers: { "x-admin-key": key }
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (res.status === 404) throw new Error("not_found");
  if (!res.ok) throw new Error("failed");
  return res.json();
}

export async function resetAdminLetters(key) {
  const res = await fetch("/api/admin/reset", {
    method: "POST",
    headers: { "x-admin-key": key }
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("failed");
  return res.json();
}
