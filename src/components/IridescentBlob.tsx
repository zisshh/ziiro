const IridescentBlob = () => {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: 520, height: 520 }}
      aria-hidden
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: -120,
          background:
            "radial-gradient(circle, rgba(180,130,45,0.18) 0%, rgba(80,40,160,0.1) 45%, transparent 70%)",
          filter: "blur(55px)",
          animation: "blob-pulse 6s ease-in-out infinite",
        }}
      />

      {/* Spinning iridescent colour ring */}
      <div
        style={{
          position: "absolute",
          width: 460,
          height: 460,
          background:
            "conic-gradient(from 0deg at 50% 50%, #c88030 0deg, #7830c0 80deg, #3878d0 160deg, #18b090 240deg, #c05020 320deg, #c88030 360deg)",
          animation: "blob-morph 11s ease-in-out infinite, blob-spin 24s linear infinite",
          filter: "blur(0.5px)",
        }}
      />

      {/* Dark core — gives the deep interior look */}
      <div
        style={{
          position: "absolute",
          width: "72%",
          height: "72%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 42% 38%, #12103a 0%, #060610 75%)",
          filter: "blur(14px)",
          zIndex: 2,
        }}
      />

      {/* Primary glass highlight — top-left */}
      <div
        style={{
          position: "absolute",
          top: "9%",
          left: "12%",
          width: "42%",
          height: "36%",
          background:
            "radial-gradient(ellipse at 40% 38%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 48%, transparent 72%)",
          borderRadius: "60% 40% 50% 30% / 50% 60% 40% 50%",
          filter: "blur(7px)",
          zIndex: 3,
          animation: "blob-morph 11s ease-in-out infinite",
        }}
      />

      {/* Warm secondary glow — bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: "14%",
          right: "10%",
          width: "28%",
          height: "22%",
          background:
            "radial-gradient(ellipse, rgba(200,128,48,0.45) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(10px)",
          zIndex: 3,
        }}
      />
    </div>
  );
};

export default IridescentBlob;
