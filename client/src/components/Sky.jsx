export default function Sky() {
  return (
    <div className="sky" aria-hidden="true">
      <svg className="geo" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <line x1="80" y1="-40" x2="420" y2="860" />
        <line x1="280" y1="-40" x2="620" y2="860" />
        <line x1="520" y1="-80" x2="980" y2="900" />
        <line x1="760" y1="-40" x2="1180" y2="820" />
        <line x1="-40" y1="120" x2="1280" y2="40" />
        <line x1="-40" y1="340" x2="1280" y2="220" />
        <line x1="-40" y1="620" x2="1280" y2="480" />
      </svg>
    </div>
  );
}
