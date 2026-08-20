import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbfaf7",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(16,133,89,0.16), transparent 60%), radial-gradient(ellipse 70% 50% at 100% 10%, rgba(217,158,45,0.16), transparent 55%)",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            background: "linear-gradient(135deg, #0f7a54, #0b5e40)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
            <circle cx="6" cy="7" r="2.8" fill="white" />
            <circle cx="18" cy="7" r="2.8" fill="white" />
            <circle cx="12" cy="18" r="2.8" fill="#d99e2d" />
            <path d="M8 8.5L10.5 15.5M16 8.5L13.5 15.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, color: "#1c1917", display: "flex" }}>
          EthioChina Hub
        </div>
        <div style={{ fontSize: 30, color: "#78716c", marginTop: 16, display: "flex" }}>
          A community platform for Ethiopians in China
        </div>
      </div>
    ),
    { ...size }
  );
}
