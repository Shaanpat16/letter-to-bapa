import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { CITIES, COUNTRIES, LONDON, coordsFor, guessCountryFromLocale } from "@shared/places.js";
import { fetchStats, sendLetter } from "./api.js";
import Sky from "./components/Sky.jsx";
import Journey from "./components/Journey.jsx";
import Receipt from "./components/Receipt.jsx";
import Footer from "./components/Footer.jsx";
import Admin from "./components/Admin.jsx";

const MAX = 300;

function remember(key, value) {
  try {
    localStorage.setItem(`prk:${key}`, value);
  } catch {
    /* private mode */
  }
}

function recall(key) {
  try {
    return localStorage.getItem(`prk:${key}`);
  } catch {
    return null;
  }
}

function formatCount(n) {
  return Number(n || 0).toLocaleString("en-GB");
}

function AnimatedCount({ value }) {
  const [shown, setShown] = useState(value);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || value === shown) {
      setShown(value);
      return undefined;
    }
    const from = shown;
    const to = value;
    const start = performance.now();
    const duration = Math.min(1400, 400 + Math.abs(to - from) * 12);
    let frame;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setShown(Math.round(from + (to - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduce]);

  return <b>{formatCount(shown)}</b>;
}

export default function App() {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return <Admin />;
  }
  return <Home />;
}

function Home() {
  const reduce = useReducedMotion();
  const [total, setTotal] = useState(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState(recall("name") || "");
  const [city, setCity] = useState(recall("city") || "");
  const [country, setCountry] = useState(recall("country") || guessCountryFromLocale());
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [closed, setClosed] = useState(false);
  const [journey, setJourney] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const formRef = useRef(null);
  const resultRef = useRef(null);
  const animDoneRef = useRef(false);

  const remaining = MAX - message.length;

  const origin = useMemo(() => coordsFor(city, country), [city, country]);

  async function refresh() {
    try {
      const data = await fetchStats();
      setTotal(data.total || 0);
      setClosed(Boolean(data.closed));
    } catch {
      /* keep last good frame */
    }
  }

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 12000);
    return () => clearInterval(id);
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    const line = message.trim().replace(/\s+/g, " ");
    if (!line) {
      setError("Write your message first.");
      return;
    }
    if (closed) {
      setError("The offering has closed.");
      return;
    }

    remember("name", name);
    remember("city", city);
    remember("country", country);

    setBusy(true);
    const pending = {
      line,
      name: name.trim(),
      city: city.trim(),
      country: country.trim(),
      origin
    };
    resultRef.current = null;
    animDoneRef.current = false;
    setJourney(pending);

    try {
      const res = await sendLetter({
        message: line,
        name: name.trim(),
        city: city.trim(),
        country: country.trim(),
        website: honeypot
      });
      const entry = { ...pending, seq: res.seq, total: res.total };
      resultRef.current = entry;
      setTotal(typeof res.total === "number" ? res.total : (total || 0) + 1);
      remember("mine", JSON.stringify(entry));
      setMessage("");
      finishIfReady();
    } catch (err) {
      resultRef.current = null;
      setJourney(null);
      setError(err.message || "That did not send. Try once more.");
      setBusy(false);
    }
  }

  function finishIfReady() {
    if (!animDoneRef.current || !resultRef.current) return;
    const entry = resultRef.current;
    setJourney(null);
    setReceipt(entry);
    setBusy(false);
    refresh();
  }

  function onJourneyDone() {
    animDoneRef.current = true;
    finishIfReady();
  }

  return (
    <div className="page">
      <Sky />
      <a className="skip" href="#letter">
        Skip to letter
      </a>
      <div className="phone">
        <main className="wrap">
          <p className="kicker">BAPS Swaminarayan Sanstha UK &amp; Europe</p>
          <p className="count-chip" aria-live="polite">
            {total == null ? (
              "Gathering letters…"
            ) : (
              <>
                <AnimatedCount value={total} /> {total === 1 ? "letter sent" : "letters sent"}
              </>
            )}
          </p>
          <h1>Write to Bapa</h1>
          <p className="lede">
            For 93 years, Swamishri has given his time to anyone who asked. Tell him what it means to have him here.
          </p>

          <div className="pills">
            <span className="pill">
              <i />
              He’s in London
            </span>
          </div>

          <form id="letter" ref={formRef} onSubmit={onSubmit} noValidate>
            <label className="field">
              <span>Your message</span>
              <textarea
                id="line"
                name="message"
                maxLength={MAX}
                rows={5}
                dir="auto"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
                autoComplete="off"
                enterKeyHint="next"
                placeholder="Dear Bapa,"
                required
              />
            </label>
            <div className="meta">
              <span>A few words is enough</span>
              <span>{remaining}</span>
            </div>

            <label className="hp" htmlFor="website" aria-hidden="true">
              Website
              <input
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </label>

            <label className="field" htmlFor="fname">
              <span>First name</span>
              <input
                id="fname"
                name="fname"
                type="text"
                maxLength={40}
                autoComplete="given-name"
                placeholder="Optional"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-describedby="name-hint"
              />
            </label>
            <p className="hint" id="name-hint">
              Only you see this. Everyone else sees your city.
            </p>

            <div className="pair">
              <label className="field">
                <span>City</span>
                <input
                  id="city"
                  name="city"
                  type="text"
                  list="cities"
                  maxLength={40}
                  autoComplete="address-level2"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </label>
              <label className="field">
                <span>Country</span>
                <input
                  id="country"
                  name="country"
                  type="text"
                  list="countries"
                  maxLength={56}
                  autoComplete="country-name"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </label>
            </div>
            <datalist id="cities">
              {CITIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <datalist id="countries">
              {COUNTRIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>

            <button className="go" type="submit" disabled={busy || closed}>
              {closed ? "Offering closed" : busy ? "Sending…" : "Send it to Bapa"}
            </button>
            <p className="err" role="alert">
              {error}
            </p>
          </form>
        </main>
        <Footer />
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {journey && (
              <Journey
                key="journey"
                entry={journey}
                dest={LONDON}
                reduce={reduce}
                onDone={onJourneyDone}
              />
            )}
            {receipt && (
              <Receipt
                key="receipt"
                entry={receipt}
                total={total}
                onClose={() => setReceipt(null)}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
