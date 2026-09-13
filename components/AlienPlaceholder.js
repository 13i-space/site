export default function AlienPlaceholder({ size = 180 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ borderRadius: "50%", background: "#12153A", border: "1px solid #262A55" }}
    >
      <ellipse cx="100" cy="95" rx="52" ry="66" fill="#1C1F48" stroke="#4C5192" strokeWidth="1.5" />
      <ellipse cx="72" cy="90" rx="16" ry="10" fill="#8B95F6" opacity="0.85" transform="rotate(-12 72 90)" />
      <ellipse cx="128" cy="90" rx="16" ry="10" fill="#8B95F6" opacity="0.85" transform="rotate(12 128 90)" />
      <ellipse cx="72" cy="90" rx="6" ry="4" fill="#0A0B1C" transform="rotate(-12 72 90)" />
      <ellipse cx="128" cy="90" rx="6" ry="4" fill="#0A0B1C" transform="rotate(12 128 90)" />
      <path d="M100 150 Q100 160 100 168" stroke="#4C5192" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
