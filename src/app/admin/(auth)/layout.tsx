import Galaxy from "./login/Galaxy";

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070712]">
      <div className="absolute inset-0 z-0">
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={1}
          glowIntensity={0.3}
          saturation={0}
          hueShift={140}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.5}
          speed={1}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(139,109,232,0.16),rgba(7,7,18,0.72)_62%)]" />
      <div className="pointer-events-none relative z-10">{children}</div>
    </div>
  );
}
