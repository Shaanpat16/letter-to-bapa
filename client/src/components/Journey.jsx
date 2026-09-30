import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Globe from "./Globe.jsx";

function easeOut(t) {
  return 1 - (1 - t) * (1 - t);
}

function MailPin() {
  return (
    <div className="mail-pin" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <rect x="3.5" y="6.5" width="17" height="12" rx="2.2" />
        <path d="M4 8.2 12 14l8-5.8" />
      </svg>
    </div>
  );
}

export default function Journey({ entry, dest, reduce, onDone }) {
  const origin = entry.origin || { lat: 40.7, lng: -74, label: "You" };
  const [phase, setPhase] = useState(reduce ? "land" : "fly");
  const [progress, setProgress] = useState(reduce ? 1 : 0);
  const done = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (reduce) {
      setPhase("land");
      setProgress(1);
      return undefined;
    }

    const start = performance.now();
    const duration = 2400;
    let frame;
    const tick = (now) => {
      const raw = Math.min(1, (now - start) / duration);
      setProgress(easeOut(raw));
      if (raw < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setPhase("land");
        setProgress(1);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce]);

  useEffect(() => {
    if (phase !== "land") return undefined;
    const wait = setTimeout(() => {
      if (!done.current) {
        done.current = true;
        onDoneRef.current();
      }
    }, reduce ? 400 : 350);
    return () => clearTimeout(wait);
  }, [phase, reduce]);

  return (
    <motion.div
      className="journey"
      role="dialog"
      aria-modal="true"
      aria-label="Your letter is travelling to London"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flight-stage">
        <div className="cobe-wrap">
          <Globe origin={origin} dest={dest} progress={progress} phase={phase} />
          <MailPin />
        </div>
      </div>
    </motion.div>
  );
}
