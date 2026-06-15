"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { loginAdminAction, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

type CowState = "idle" | "email" | "password";

function CowMascot({ state }: { state: CowState }) {
  const hiding = state === "password";
  const peeking = state === "email";

  return (
    <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-[150px] w-[210px] -translate-x-1/2 -translate-y-[112px]">
      <div className="absolute left-[20px] top-[32px] h-10 w-10 rotate-[-18deg] rounded-[18px_18px_24px_24px] border-[4px] border-[#2b2039] bg-[#f7f0dd]" />
      <div className="absolute right-[20px] top-[32px] h-10 w-10 rotate-[18deg] rounded-[18px_18px_24px_24px] border-[4px] border-[#2b2039] bg-[#f7f0dd]" />
      <div className="absolute left-[34px] top-[48px] h-9 w-8 rotate-[-28deg] rounded-full bg-[#2b2039]" />
      <div className="absolute right-[34px] top-[48px] h-9 w-8 rotate-[28deg] rounded-full bg-[#2b2039]" />

      <motion.div
        className="absolute left-1/2 top-[34px] h-[112px] w-[140px] -translate-x-1/2 rounded-[58px_58px_46px_46px] border-[4px] border-[#2b2039] bg-white shadow-[0_10px_0_rgba(43,32,57,0.08)]"
        animate={{
          y: peeking ? 6 : 0,
          rotate: peeking ? -2 : 0,
        }}
        transition={{ type: "spring", stiffness: 160, damping: 14 }}
      >
        <div className="absolute left-5 top-4 h-10 w-12 rounded-[50%] bg-[#2b2039]" />
        <div className="absolute right-4 top-5 h-8 w-11 rotate-12 rounded-[50%] bg-[#2b2039]" />
        <div className="absolute left-[29px] top-[45px] h-8 w-8 rounded-full bg-[#2b2039]">
          <motion.div
            className="absolute left-[10px] top-[8px] h-2.5 w-2.5 rounded-full bg-white"
            animate={{ x: peeking ? 3 : 0, y: peeking ? 2 : 0 }}
          />
        </div>
        <div className="absolute right-[29px] top-[45px] h-8 w-8 rounded-full bg-[#2b2039]">
          <motion.div
            className="absolute left-[8px] top-[8px] h-2.5 w-2.5 rounded-full bg-white"
            animate={{ x: peeking ? -3 : 0, y: peeking ? 2 : 0 }}
          />
        </div>
        <div className="absolute left-[28px] top-[76px] h-4 w-6 rounded-full bg-[#ff8bb7]" />
        <div className="absolute right-[28px] top-[76px] h-4 w-6 rounded-full bg-[#ff8bb7]" />
        <div className="absolute left-1/2 top-[70px] h-6 w-8 -translate-x-1/2 rounded-[50%] bg-[#2b2039]" />
        <div className="absolute left-1/2 top-[88px] h-7 w-12 -translate-x-1/2 rounded-b-full border-b-[3px] border-[#2b2039]" />
      </motion.div>

      <motion.div
        className="absolute left-[26px] top-[112px] h-[50px] w-[42px] rounded-[16px_16px_22px_22px] border-[4px] border-[#2b2039] bg-[#2b2039]"
        animate={{
          x: hiding ? 46 : 0,
          y: hiding ? -50 : 18,
          rotate: hiding ? 18 : 0,
        }}
        transition={{ type: "spring", stiffness: 170, damping: 14 }}
      >
        <div className="absolute bottom-2 left-1/2 h-5 w-6 -translate-x-1/2 rounded-t-full bg-white" />
      </motion.div>
      <motion.div
        className="absolute right-[26px] top-[112px] h-[50px] w-[42px] rounded-[16px_16px_22px_22px] border-[4px] border-[#2b2039] bg-[#2b2039]"
        animate={{
          x: hiding ? -46 : 0,
          y: hiding ? -50 : 18,
          rotate: hiding ? -18 : 0,
        }}
        transition={{ type: "spring", stiffness: 170, damping: 14 }}
      >
        <div className="absolute bottom-2 left-1/2 h-5 w-6 -translate-x-1/2 rounded-t-full bg-white" />
      </motion.div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-3 w-full rounded-xl bg-neutral-900 px-4 py-3 text-[13px] font-black uppercase tracking-[0.35em] text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Signing in..." : "Login"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAdminAction, initialState);
  const [cowState, setCowState] = useState<CowState>("idle");

  return (
    <div className="pointer-events-auto relative mt-28 w-full max-w-[460px]">
      <CowMascot state={cowState} />
      <form
        action={formAction}
        className="relative rounded-[18px] border border-white/60 bg-white/40 backdrop-blur-xl px-12 pb-12 pt-20 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-[18px] font-black text-neutral-900"
            >
              Enter your email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              onFocus={() => setCowState("email")}
              onBlur={() => setCowState("idle")}
              className="w-full border-0 border-b-2 border-neutral-300 bg-transparent px-1 py-2 text-[16px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-0"
              placeholder="Email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-[18px] font-black text-neutral-900"
            >
              Enter your password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              onFocus={() => setCowState("password")}
              onBlur={() => setCowState("idle")}
              className="w-full border-0 border-b-2 border-neutral-300 bg-transparent px-1 py-2 text-[16px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-0"
              placeholder="Password"
            />
          </div>

          {state.error && (
            <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
