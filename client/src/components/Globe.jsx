import { useEffect, useRef } from "react";
import createGlobe from "cobe";

function lookAt(lat, lng) {
  return {
    phi: -((lng * Math.PI) / 180) - Math.PI / 2,
    theta: Math.max(-0.55, Math.min(0.55, (lat * Math.PI) / 180))
  };
}

function toCart(lat, lng) {
  const phi = (lat * Math.PI) / 180;
  const lam = (lng * Math.PI) / 180;
  return [Math.cos(phi) * Math.cos(lam), Math.cos(phi) * Math.sin(lam), Math.sin(phi)];
}

function fromCart(x, y, z) {
  return {
    lat: (Math.asin(Math.min(1, Math.max(-1, z))) * 180) / Math.PI,
    lng: (Math.atan2(y, x) * 180) / Math.PI
  };
}

function along(a, b, t) {
  const u = Math.min(1, Math.max(0, t));
  if (u <= 0) return { lat: a.lat, lng: a.lng };
  if (u >= 1) return { lat: b.lat, lng: b.lng };
  const A = toCart(a.lat, a.lng);
  const B = toCart(b.lat, b.lng);
  let dot = A[0] * B[0] + A[1] * B[1] + A[2] * B[2];
  dot = Math.min(1, Math.max(-1, dot));
  const omega = Math.acos(dot);
  if (omega < 1e-5) return { lat: a.lat + (b.lat - a.lat) * u, lng: a.lng + (b.lng - a.lng) * u };
  const s = Math.sin(omega);
  const w1 = Math.sin((1 - u) * omega) / s;
  const w2 = Math.sin(u * omega) / s;
  return fromCart(A[0] * w1 + B[0] * w2, A[1] * w1 + B[1] * w2, A[2] * w1 + B[2] * w2);
}

export default function Globe({ origin, dest, progress = 0, phase = "fly" }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const live = useRef({ origin, dest, progress, phase });
  live.current = { origin, dest, progress, phase };

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return undefined;

    const from = [origin.lat, origin.lng];
    const start = lookAt(origin.lat, origin.lng);
    const firstTip = along(origin, dest, 0.04);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const measure = () => Math.max(280, Math.round(canvas.offsetWidth || host.offsetWidth || 600));

    let cancelled = false;
    let globe;
    let raf = 0;
    let lastW = 0;

    const run = () => {
      if (cancelled) return;
      if (!canvas.offsetWidth && !host.offsetWidth) {
        raf = requestAnimationFrame(run);
        return;
      }

      lastW = measure();
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: lastW,
        height: lastW,
        phi: start.phi,
        theta: start.theta,
        dark: 0,
        diffuse: 1.45,
        mapSamples: 22000,
        mapBrightness: 8,
        mapBaseBrightness: 0.08,
        baseColor: [1, 1, 1],
        markerColor: [0.13, 0.77, 0.37],
        glowColor: [0.93, 0.94, 0.96],
        markerElevation: 0.025,
        scale: 1.08,
        opacity: 0.95,
        markers: [
          { location: from, size: 0.05, color: [0.07, 0.07, 0.07], id: "origin" },
          { location: [firstTip.lat, firstTip.lng], size: 0.04, color: [0.13, 0.77, 0.37], id: "tip" }
        ],
        arcs: [
          {
            from,
            to: [firstTip.lat, firstTip.lng],
            color: [0.13, 0.77, 0.37],
            id: "flight"
          }
        ],
        arcColor: [0.13, 0.77, 0.37],
        arcWidth: 0.9,
        arcHeight: 0.42
      });

      const tick = () => {
        if (cancelled) return;
        const { origin: o, dest: d, progress: p, phase: ph } = live.current;
        const t = ph === "land" ? 1 : Math.max(0.04, p);
        const tip = along(o, d, t);
        const cam = along(o, d, t * 0.55);
        const view = lookAt(cam.lat, cam.lng);
        const w = measure();
        const next = {
          phi: view.phi,
          theta: view.theta,
          markers: [
            { location: [o.lat, o.lng], size: 0.05, color: [0.07, 0.07, 0.07], id: "origin" },
            {
              location: [d.lat, d.lng],
              size: 0.035,
              color: [0.13, 0.77, 0.37],
              id: "london"
            },
            {
              location: [tip.lat, tip.lng],
              size: ph === "land" ? 0.02 : 0.04,
              color: [0.13, 0.77, 0.37],
              id: "tip"
            }
          ],
          arcs: [
            {
              from: [o.lat, o.lng],
              to: [tip.lat, tip.lng],
              color: [0.13, 0.77, 0.37],
              id: "flight"
            }
          ]
        };
        if (w !== lastW) {
          lastW = w;
          next.width = w;
          next.height = w;
        }
        globe.update(next);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(run);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (globe) globe.destroy();
      const wrap = canvas.parentElement;
      if (wrap && wrap !== host) {
        host.appendChild(canvas);
        wrap.remove();
      }
    };
  }, [origin.lat, origin.lng, dest.lat, dest.lng]);

  return (
    <div className="cobe-host" ref={hostRef}>
      <canvas ref={canvasRef} className="cobe-canvas" />
    </div>
  );
}
