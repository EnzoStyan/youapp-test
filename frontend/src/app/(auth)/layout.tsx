export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // Pastikan main ini punya min-h-screen
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card-bg/50 backdrop-blur-sm rounded-xl p-8 border border-secondary-text/10">
        {children}
      </div>
    </main>
  );
}