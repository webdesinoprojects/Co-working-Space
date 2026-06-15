export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 overflow-y-auto bg-transparent min-h-0">
      {children}
    </main>
  );
}
