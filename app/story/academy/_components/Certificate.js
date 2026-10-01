"use client";
// The Story Champion digital certificate (SVG, landscape 1100 x 850).
import { forwardRef } from "react";

function Rosette({ cx, cy, r, n = 36, color = "#C99A3B", op = 0.35, sw = 0.6 }) {
  return (
    <g opacity={op}>
      {Array.from({ length: n }, (_, i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.38} fill="none" stroke={color} strokeWidth={sw} transform={`rotate(${(180 / n) * i} ${cx} ${cy})`} />
      ))}
    </g>
  );
}

function Guilloche({ y, x1, x2, amp = 7, waves = 46, color = "#C99A3B" }) {
  const lines = [0, 1, 2].map((k) => {
    let d = "";
    const steps = 400;
    for (let i = 0; i <= steps; i++) {
      const x = x1 + ((x2 - x1) * i) / steps;
      const t = (i / steps) * Math.PI * 2 * waves;
      const yy = y + Math.sin(t + k * 2.1) * amp * (k === 1 ? 0.6 : 1);
      d += `${i ? "L" : "M"}${x.toFixed(1)} ${yy.toFixed(1)} `;
    }
    return <path key={k} d={d} fill="none" stroke={color} strokeWidth="0.7" opacity={0.55 - k * 0.12} />;
  });
  return <g>{lines}</g>;
}

const Certificate = forwardRef(function Certificate({ name, date, id, level = "Level 1", forExport = false }, ref) {
  const serif = forExport ? "Georgia, 'Times New Roman', serif" : "Newsreader, Georgia, serif";
  const sans = forExport ? "Helvetica, Arial, sans-serif" : "Manrope, Helvetica, Arial, sans-serif";
  const script = forExport ? "Georgia, serif" : "'Pinyon Script', 'Snell Roundhand', cursive";
  const ink = "#2A2420", ember = "#C25B34", gold = "#B8892E", soft = "#6B5E54";
  return (
    <svg ref={ref} viewBox="0 0 1100 850" xmlns="http://www.w3.org/2000/svg" className="ac-cert" role="img"
      aria-label={`Certificate: ${name} is a Certified Story Champion, ${level}, ${date}`}>
      <defs>
        <linearGradient id="certPaper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFDF8" />
          <stop offset="100%" stopColor="#F6EEE1" />
        </linearGradient>
        <linearGradient id="certSeal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D46E43" />
          <stop offset="100%" stopColor="#9A401D" />
        </linearGradient>
        <linearGradient id="certGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B8892E" />
          <stop offset="50%" stopColor="#E3C27A" />
          <stop offset="100%" stopColor="#B8892E" />
        </linearGradient>
        <path id="certSealPath" d="M 912 676 m -58 0 a 58 58 0 1 1 116 0 a 58 58 0 1 1 -116 0" />
      </defs>

      <rect width="1100" height="850" fill="url(#certPaper)" />
      <Rosette cx={550} cy={430} r={330} n={60} op={0.07} sw={0.8} />
      <rect x="28" y="28" width="1044" height="794" fill="none" stroke={ember} strokeWidth="2.5" />
      <rect x="40" y="40" width="1020" height="770" fill="none" stroke="url(#certGold)" strokeWidth="1" />
      <Guilloche y={62} x1={70} x2={1030} />
      <Guilloche y={788} x1={70} x2={1030} />
      {[[40, 40], [1060, 40], [40, 810], [1060, 810]].map(([x, y], i) => (
        <g key={i}>
          <Rosette cx={x} cy={y} r={30} n={18} op={0.5} sw={0.7} />
          <circle cx={x} cy={y} r="5" fill={ember} />
        </g>
      ))}

      {/* brand */}
      <g transform="translate(550 128)">
        <circle cx="-86" cy="-6" r="11" fill="none" stroke={ember} strokeWidth="2.6" />
        <circle cx="-86" cy="-22" r="3.6" fill={ember} />
        <text x="6" y="2" textAnchor="middle" fontFamily={serif} fontSize="24" fill={ink}>Story <tspan fill={ember} fontStyle="italic">of</tspan> Self</text>
      </g>
      <text x="550" y="176" textAnchor="middle" fontFamily={sans} fontSize="13" letterSpacing="6" fill={soft} fontWeight="700">CHAMPION ACADEMY</text>

      <text x="550" y="250" textAnchor="middle" fontFamily={serif} fontSize="52" fill={ink}>Certificate of Certification</text>
      <text x="550" y="300" textAnchor="middle" fontFamily={sans} fontSize="15" letterSpacing="3" fill={soft}>THIS CERTIFIES THAT</text>

      <text x="550" y="392" textAnchor="middle" fontFamily={serif} fontStyle="italic" fontSize={name && name.length > 22 ? 54 : 66} fill={ember}>{name || "Your Name"}</text>
      <line x1="270" x2="830" y1="416" y2="416" stroke="url(#certGold)" strokeWidth="1.5" />

      <text x="550" y="462" textAnchor="middle" fontFamily={sans} fontSize="16" fill={ink}>has completed the Story of Self Champion Training: SEE and is recognized as a</text>
      <text x="550" y="520" textAnchor="middle" fontFamily={serif} fontSize="38" fill={ink}>Certified Story Champion</text>
      <text x="550" y="556" textAnchor="middle" fontFamily={sans} fontSize="14" letterSpacing="4" fill={gold} fontWeight="700">{level.toUpperCase()} · ONE-ON-ONE CHAMPION</text>
      <text x="550" y="594" textAnchor="middle" fontFamily={sans} fontSize="13.5" fill={soft}>The Framework for Coaching · The Six Lessons · The Story Write · Practice Room · Safety &amp; Care</text>

      {/* signature + date */}
      <text x="310" y="690" textAnchor="middle" fontFamily={script} fontStyle={forExport ? "italic" : "normal"} fontSize={forExport ? 30 : 42} fill={ink}>Aaron Donaghy</text>
      <line x1="190" x2="430" y1="704" y2="704" stroke={ink} strokeWidth="0.8" />
      <text x="310" y="726" textAnchor="middle" fontFamily={sans} fontSize="12.5" fill={soft}>Aaron Donaghy · Founder, Story of Self</text>

      <text x="550" y="690" textAnchor="middle" fontFamily={serif} fontSize="22" fill={ink}>{date}</text>
      <line x1="470" x2="630" y1="704" y2="704" stroke={ink} strokeWidth="0.8" />
      <text x="550" y="726" textAnchor="middle" fontFamily={sans} fontSize="12.5" fill={soft}>Date certified</text>

      {/* seal */}
      <Rosette cx={912} cy={676} r={84} n={40} op={0.55} sw={0.7} />
      <circle cx="912" cy="676" r="72" fill="url(#certSeal)" />
      <circle cx="912" cy="676" r="65" fill="none" stroke="#F8D9C6" strokeOpacity=".7" strokeWidth="1" />
      <text fontFamily={sans} fontSize="9" letterSpacing="2.2" fill="#FFF3EA" fontWeight="700">
        <textPath href="#certSealPath">· CHAM·PI·ON · ONE WHO FIGHTS FOR ANOTHER · OWN YOUR STORY</textPath>
      </text>
      <circle cx="912" cy="665" r="14" fill="none" stroke="#FFF7EF" strokeWidth="2.6" />
      <circle cx="912" cy="648" r="4" fill="#FFF7EF" />
      <text x="912" y="701" textAnchor="middle" fontFamily={serif} fontStyle="italic" fontSize="16" fill="#FFF7EF">Champion</text>

      <text x="550" y="770" textAnchor="middle" fontFamily={sans} fontSize="11.5" letterSpacing="1.5" fill={soft}>CREDENTIAL ID {id} · storyofself.com</text>
    </svg>
  );
});

export default Certificate;

// Save the certificate as a high-resolution PNG.
export async function downloadPng(svgEl, filename) {
  const clone = svgEl.cloneNode(true);
  clone.setAttribute("width", "2200");
  clone.setAttribute("height", "1700");
  const xml = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
    const canvas = document.createElement("canvas");
    canvas.width = 2200;
    canvas.height = 1700;
    canvas.getContext("2d").drawImage(img, 0, 0, 2200, 1700);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = filename;
    a.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}
