import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const FOOTER_SRC = "/baps-footer.png";
let footerImage;

function loadFooter() {
  if (footerImage?.complete && footerImage.naturalWidth) {
    return Promise.resolve(footerImage);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      footerImage = img;
      resolve(img);
    };
    img.onerror = reject;
    img.src = FOOTER_SRC;
  });
}

function drawCard(canvas, entry, footer) {
  const w = 1080;
  const h = 1440;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#F3F4F6";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, 48, 48, w - 96, h - 96, 44);
  ctx.fill();

  ctx.fillStyle = "#8B909A";
  ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PRATYAKSH", w / 2, 168);

  ctx.fillStyle = "#111111";
  ctx.font = "700 56px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Dear Bapa,", w / 2, 268);

  ctx.fillStyle = "#111111";
  ctx.font = "500 36px 'Noto Sans Gujarati', 'Plus Jakarta Sans', sans-serif";
  const words = String(entry.line || "").split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > w - 220) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  lines.slice(0, 10).forEach((line, i) => {
    ctx.fillText(line, w / 2, 360 + i * 52);
  });

  const who = [entry.name, entry.city, entry.country].filter(Boolean).join(", ");
  ctx.fillStyle = "#8B909A";
  ctx.font = "600 28px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(who ? `— ${who}` : "—", w / 2, 920);

  ctx.fillStyle = "#22C55E";
  ctx.beginPath();
  ctx.arc(w / 2, 1010, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(w / 2 - 12, 1011);
  ctx.lineTo(w / 2 - 3, 1020);
  ctx.lineTo(w / 2 + 14, 1000);
  ctx.stroke();

  ctx.fillStyle = "#8B909A";
  ctx.font = "500 22px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("He’s in London", w / 2, 1088);
  if (entry.seq) {
    ctx.fillStyle = "#111111";
    ctx.font = "700 22px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(`Letter ${Number(entry.seq).toLocaleString("en-GB")}`, w / 2, 1130);
  }

  if (footer?.naturalWidth) {
    const maxW = 620;
    const maxH = 118;
    const scale = Math.min(maxW / footer.naturalWidth, maxH / footer.naturalHeight);
    const dw = footer.naturalWidth * scale;
    const dh = footer.naturalHeight * scale;
    ctx.drawImage(footer, (w - dw) / 2, h - 86 - dh, dw, dh);
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x + w, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function toPhoto(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
  });
}

const BITS = [
  { left: "18%", top: "28%", color: "#22c55e", x: "-28px", y: "-36px", r: "20deg" },
  { left: "72%", top: "24%", color: "#111", x: "34px", y: "-28px", r: "-18deg" },
  { left: "30%", top: "18%", color: "#f59e0b", x: "-8px", y: "-48px", r: "40deg" },
  { left: "62%", top: "16%", color: "#38bdf8", x: "18px", y: "-52px", r: "-30deg" },
  { left: "46%", top: "12%", color: "#fb7185", x: "4px", y: "-44px", r: "12deg" },
  { left: "22%", top: "42%", color: "#a78bfa", x: "-40px", y: "8px", r: "20deg" },
  { left: "78%", top: "40%", color: "#22c55e", x: "42px", y: "10px", r: "28deg" }
];

export default function Receipt({ entry, total, onClose }) {
  const canvasRef = useRef(null);
  const photoRef = useRef(null);
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    let url = "";
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    loadFooter()
      .catch(() => null)
      .then((footer) => {
        if (cancelled) return null;
        drawCard(canvas, entry, footer);
        return toPhoto(canvas);
      })
      .then((blob) => {
        if (cancelled || !blob) return;
        url = URL.createObjectURL(blob);
        setPhotoUrl(url);
        photoRef.current = blob;
      });

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [entry]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function save() {
    const blob = photoRef.current;
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "letter-to-bapa.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  async function share() {
    const blob = photoRef.current;
    if (!blob) {
      save();
      return;
    }
    const file = new File([blob], "letter-to-bapa.jpg", { type: "image/jpeg" });
    const text = `Jai Swaminarayan\n\nDear Bapa, ${entry.line}\n\nHe’s in London. Write yours.`;
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text, title: "Letter to Bapa" });
        return;
      }
      if (navigator.share) {
        await navigator.share({ text, title: "Letter to Bapa" });
        return;
      }
    } catch {
      /* cancelled or unsupported — fall through to save */
    }
    save();
  }

  return (
    <motion.div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
      >
        <div className="confetti" aria-hidden="true">
          {BITS.map((bit, i) => (
            <span
              key={i}
              style={{
                left: bit.left,
                top: bit.top,
                background: bit.color,
                "--x": bit.x,
                "--y": bit.y,
                "--r": bit.r,
                animationDelay: `${i * 40}ms`
              }}
            />
          ))}
        </div>
        <div className="success-mark" aria-hidden="true">
          ✓
        </div>
        <h2 id="receipt-title">Successful!</h2>
        <p className="placed">
          Your letter is on its way to London.
          {total
            ? ` ${Number(total).toLocaleString("en-GB")} ${total === 1 ? "letter sent" : "letters sent"}.`
            : ""}
        </p>
        <canvas ref={canvasRef} className="sr" aria-hidden="true" />
        {photoUrl ? (
          <img className="card-photo" src={photoUrl} alt="Your letter to Bapa" />
        ) : (
          <div className="card-photo card-photo-wait" aria-hidden="true" />
        )}
        <div className="acts">
          <button type="button" className="primary" onClick={onClose}>
            Write another
          </button>
          <button type="button" className="ghost" onClick={share}>
            Share
          </button>
          <button type="button" className="ghost" onClick={save}>
            Save photo
          </button>
        </div>
        <p className="hold">Press and hold the photo to save it to your camera roll.</p>
      </motion.div>
    </motion.div>
  );
}
