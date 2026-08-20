import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 7,
          background: "linear-gradient(135deg, #0f7a54, #0b5e40)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="7" r="2.8" fill="white" />
          <circle cx="18" cy="7" r="2.8" fill="white" />
          <circle cx="12" cy="18" r="2.8" fill="#d99e2d" />
          <path d="M8 8.5L10.5 15.5M16 8.5L13.5 15.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
