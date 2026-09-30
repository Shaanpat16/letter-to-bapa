import { useState } from "react";
import { deleteAdminLetter, fetchAdminLetters, resetAdminLetters } from "../api.js";
import Footer from "./Footer.jsx";

export default function Admin() {
  const [key, setKey] = useState(() => sessionStorage.getItem("adminKey") || "");
  const [letters, setLetters] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [busyId, setBusyId] = useState(null);

  async function load(event) {
    event?.preventDefault();
    setError("");
    try {
      const data = await fetchAdminLetters(key);
      sessionStorage.setItem("adminKey", key);
      setLetters(data.letters || []);
      setLoaded(true);
    } catch {
      setError("That key did not work.");
      setLoaded(false);
    }
  }

  async function removeOne(id) {
    if (!window.confirm(`Delete letter #${id}? This cannot be undone.`)) return;
    setBusyId(id);
    setError("");
    try {
      await deleteAdminLetter(key, id);
      setLetters((list) => list.filter((letter) => letter.id !== id));
    } catch {
      setError("Could not delete that letter.");
    } finally {
      setBusyId(null);
    }
  }

  async function resetAll() {
    if (!window.confirm("Delete every letter? This cannot be undone.")) return;
    setBusyId("reset");
    setError("");
    try {
      await resetAdminLetters(key);
      setLetters([]);
    } catch {
      setError("Could not reset letters.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="admin">
      <h1>Letters</h1>
      <p>Names are only visible here, so they can be offered to Bapa.</p>
      <form className="admin-auth" onSubmit={load}>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Admin key"
          autoComplete="current-password"
        />
        <button type="submit" className="go">
          Open
        </button>
      </form>
      {error && <p className="err">{error}</p>}
      {loaded && (
        <>
          <p className="count">
            <b>{letters.length.toLocaleString("en-GB")}</b> letters
          </p>
          <div className="admin-tools">
            <a href={`/api/admin/export.csv?key=${encodeURIComponent(key)}`}>Download CSV</a>
            <button
              type="button"
              className="danger-text"
              disabled={busyId != null || letters.length === 0}
              onClick={resetAll}
            >
              {busyId === "reset" ? "Resetting…" : "Reset all letters"}
            </button>
          </div>
          <ol className="admin-list">
            {letters.map((letter) => (
              <li key={letter.id}>
                <header>
                  <strong>#{letter.id}</strong>
                  <span>{[letter.name, letter.city, letter.country].filter(Boolean).join(" · ")}</span>
                  <button
                    type="button"
                    className="danger-text"
                    disabled={busyId != null}
                    onClick={() => removeOne(letter.id)}
                  >
                    {busyId === letter.id ? "Deleting…" : "Delete"}
                  </button>
                </header>
                <p>Dear Bapa, {letter.message}</p>
              </li>
            ))}
          </ol>
        </>
      )}
      <Footer />
    </main>
  );
}
