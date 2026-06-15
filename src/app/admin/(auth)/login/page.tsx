import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-10">
      <div className="pointer-events-auto absolute left-1/2 top-8 z-20 -translate-x-1/2 text-center text-neutral-900">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-neutral-500">
          Axion CMS
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Admin Login
        </h1>
      </div>
      <LoginForm />
    </div>
  );
}
