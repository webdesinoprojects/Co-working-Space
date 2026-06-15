"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Mail,
  TrendingUp,
  LayoutGrid,
  FileText,
  Share2,
  Building,
  Clock,
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = "7D" | "30D" | "90D" | "1Y";

interface Props {
  name?: string | null;
  totalMessages: number;
  newMessages: number;
  inProgress: number;
  resolved: number;
  spam: number;
  mediaCount: number;
  activeWorkspaces: number;
  activeFaqItems: number;
  dailyData: { date: string; label: string; shortLabel?: string; count: number }[];
  monthlyData: { date: string; label: string; shortLabel?: string; count: number }[];
  byInterest: { interest: string; count: number }[];
  recentMessages: {
    id: string;
    full_name: string;
    email: string;
    interest?: string | null;
    status: string;
    created_at: string;
  }[];
}

const DONUT_COLORS = ["#111111", "#444444", "#888888", "#bbbbbb", "#eeeeee"];

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  viewed: "Viewed",
  replied: "Replied",
  archived: "Archived",
  spam: "Spam",
};

// ─── IST Clock ────────────────────────────────────────────────────────────────

function useISTClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function DashMouse({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      width="24"
      height="16"
      viewBox="0 0 24 16"
      fill="none"
      style={{ transform: flipped ? "scaleX(-1)" : undefined, display: "block" }}
    >
      {/* Body */}
      <ellipse cx="14.5" cy="9.5" rx="8" ry="5" fill="#9ca3af" />
      {/* Head */}
      <ellipse cx="5.5" cy="8" rx="5.5" ry="4.5" fill="#9ca3af" />
      {/* Ear */}
      <ellipse cx="4.5" cy="3.5" rx="3" ry="2.5" fill="#9ca3af" />
      <ellipse cx="4.5" cy="3.5" rx="1.8" ry="1.5" fill="#fda4af" />
      {/* Eye */}
      <circle cx="4" cy="7.5" r="1.3" fill="#111827" />
      <circle cx="4.4" cy="7.1" r="0.4" fill="white" />
      {/* Whiskers */}
      <line x1="7" y1="8" x2="11" y2="7.5" stroke="#d1d5db" strokeWidth="0.6" strokeLinecap="round" />
      <line x1="7" y1="9" x2="11" y2="9"   stroke="#d1d5db" strokeWidth="0.6" strokeLinecap="round" />
      {/* Tail */}
      <path d="M22.5 9.5 C25 7 24.5 13.5 22 13" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <line x1="10" y1="14" x2="9"   y2="15.5" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="14.5" x2="13.5" y2="16" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ISTClockCard() {
  const now = useISTClock();
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseOrbiterRef = useRef<HTMLDivElement>(null);
  const orbitAngleRef = useRef(0);
  const [escaped, setEscaped] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const escapedRef = useRef(false);
  const prevXRef = useRef(0);
  const mouseControls = useAnimation();

  // Unmount cleanup
  useEffect(() => () => { escapedRef.current = false; }, []);

  // Orbit animation (rAF, zero re-renders)
  useEffect(() => {
    if (escaped) return;
    let rafId: number;
    const radius = 34;
    const tick = () => {
      orbitAngleRef.current += 0.022;
      const a = orbitAngleRef.current;
      const x = radius * Math.cos(a);
      const y = radius * Math.sin(a);
      if (mouseOrbiterRef.current) {
        const flip = Math.sin(a) > 0; // moving left on top half
        mouseOrbiterRef.current.style.transform =
          `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scaleX(${flip ? -1 : 1})`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [escaped]);

  async function runEscape() {
    escapedRef.current = true;
    while (escapedRef.current) {
      const x = 40 + Math.random() * (window.innerWidth - 120);
      const y = 40 + Math.random() * (window.innerHeight - 120);
      setFlipped(x < prevXRef.current);
      prevXRef.current = x;
      await mouseControls.start({
        x,
        y,
        transition: { duration: 0.38 + Math.random() * 0.42, ease: [0.25, 0.46, 0.45, 0.94] },
      });
      if (!escapedRef.current) break;
      await new Promise((r) => setTimeout(r, 70 + Math.random() * 130));
    }
  }

  function handleMouseEnter() {
    if (escapedRef.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseControls.set({ x: cx, y: cy, opacity: 1, scale: 1 });
    prevXRef.current = cx;
    setEscaped(true);
    runEscape();
  }

  function handleMouseLeave() {
    if (!escapedRef.current || !cardRef.current) return;
    escapedRef.current = false;
    const rect = cardRef.current.getBoundingClientRect();
    mouseControls
      .start({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        opacity: 0,
        scale: 0.4,
        transition: { duration: 0.32, ease: "easeIn" },
      })
      .then(() => setEscaped(false));
  }

  const time = now
    ? now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
    : "--:--:--";

  const rawHour = now ? parseInt(now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false })) : 0;
  const rawMin  = now ? parseInt(now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", minute: "2-digit" })) : 0;
  const rawSec  = now ? parseInt(now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", second: "2-digit" })) : 0;

  const hourDeg = (rawHour % 12) * 30 + rawMin * 0.5;
  const minDeg  = rawMin * 6;
  const secDeg  = rawSec * 6;

  const date = now
    ? now.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short" })
    : "";

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-[#111111]/80 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-white/10 flex flex-col items-center justify-center text-white relative overflow-hidden cursor-default select-none"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Clock face */}
      <div className="relative w-24 h-24 mb-3">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 - 90) * (Math.PI / 180);
            return (
              <line
                key={i}
                x1={50 + 40 * Math.cos(a)} y1={50 + 40 * Math.sin(a)}
                x2={50 + 44 * Math.cos(a)} y2={50 + 44 * Math.sin(a)}
                stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"
              />
            );
          })}
          <line x1="50" y1="50" x2={50 + 24 * Math.cos((hourDeg - 90) * (Math.PI / 180))} y2={50 + 24 * Math.sin((hourDeg - 90) * (Math.PI / 180))} stroke="white" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="50" x2={50 + 33 * Math.cos((minDeg  - 90) * (Math.PI / 180))} y2={50 + 33 * Math.sin((minDeg  - 90) * (Math.PI / 180))} stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="50" x2={50 + 36 * Math.cos((secDeg  - 90) * (Math.PI / 180))} y2={50 + 36 * Math.sin((secDeg  - 90) * (Math.PI / 180))} stroke="#F26522" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="3"   fill="white" />
          <circle cx="50" cy="50" r="1.5" fill="#F26522" />
        </svg>

        {/* Orbiting mouse (hidden while escaped) */}
        {!escaped && (
          <div className="absolute inset-0 pointer-events-none" style={{ overflow: "visible" }}>
            <div
              ref={mouseOrbiterRef}
              className="absolute"
              style={{ top: "50%", left: "50%" }}
            >
              <DashMouse />
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] font-mono font-bold tracking-widest text-white/60 tabular-nums">{time}</p>
      <div className="mt-2 text-center">
        <p className="text-[13px] font-semibold tracking-tight">New Delhi</p>
        <p className="text-[10px] text-neutral-400 font-medium mt-0.5">IST · UTC+5:30</p>
      </div>
      <p className="mt-1.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">{date}</p>

      {/* Fixed escaped mouse — always mounted, invisible until escape */}
      <motion.div
        className="fixed top-0 left-0 z-[500] pointer-events-none"
        style={{ marginLeft: -12, marginTop: -8 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={mouseControls}
      >
        <DashMouse flipped={flipped} />
      </motion.div>
    </div>
  );
}

// ─── Chart Tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-neutral-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl">
      <p className="font-semibold">{payload[0].value} inquiries</p>
      <p className="text-neutral-400 mt-0.5">{label}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DashboardClient({
  name,
  totalMessages,
  newMessages,
  inProgress,
  resolved,
  spam,
  mediaCount,
  activeWorkspaces,
  activeFaqItems,
  dailyData,
  monthlyData,
  byInterest,
  recentMessages,
}: Props) {
  const [period, setPeriod] = useState<Period>("30D");

  const chartData = useMemo(() => {
    if (period === "1Y") return monthlyData;
    const days = period === "7D" ? 7 : period === "30D" ? 30 : 90;
    return dailyData.slice(-days);
  }, [period, dailyData, monthlyData]);

  const donutData = byInterest.map((b) => ({ name: b.interest || "Unknown", value: b.count }));

  const totalInterest = donutData.reduce((s, i) => s + i.value, 0) || 1;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide relative min-h-0 text-neutral-900 px-2 py-4">
      <div className="relative z-10 px-8 py-4 max-w-[1400px] mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            Hi, {name ? name : "Admin"}!
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#111111]/80 backdrop-blur-md rounded-[2rem] p-6 text-white shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tracking-tight">Overall Information</h2>
              <Share2 className="w-4 h-4 text-neutral-400" />
            </div>
            
            <div className="flex items-end gap-6 mb-8 mt-2">
              <div>
                <div className="text-5xl font-bold mb-1">{totalMessages}</div>
                <div className="text-xs text-neutral-400 font-medium">Total messages<br/>for all time</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{inProgress}</div>
                <div className="text-xs text-neutral-400 font-medium">Messages are<br/>in progress</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-auto">
              <div className="bg-white text-neutral-900 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
                <div className="w-4 h-4 border-[3px] border-neutral-300 rounded-full mb-2 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                </div>
                <div className="text-2xl font-bold leading-none mb-1">{newMessages}</div>
                <div className="text-[10px] font-semibold text-neutral-500 tracking-wider">NEW</div>
              </div>
              <div className="bg-white text-neutral-900 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                <div className="w-4 h-4 border-[2px] border-dashed border-neutral-400 rounded-full mb-2" />
                <div className="text-2xl font-bold leading-none mb-1">{inProgress}</div>
                <div className="text-[10px] font-semibold text-neutral-500 tracking-wider text-center">IN PROGRESS</div>
              </div>
              <div className="bg-white text-neutral-900 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                <div className="w-4 h-4 border-[2px] border-neutral-900 rounded-full mb-2 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                </div>
                <div className="text-2xl font-bold leading-none mb-1">{resolved}</div>
                <div className="text-[10px] font-semibold text-neutral-500 tracking-wider text-center">RESOLVED</div>
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm flex flex-col border border-white/60 relative text-neutral-900">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold tracking-tight">Weekly progress</h2>
              <TrendingUp className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex gap-4 mb-4 text-xs font-semibold">
              <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-neutral-900"></span> Inquiries</div>
              <div className="flex items-center gap-1 text-neutral-400"><span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span> Media</div>
            </div>
            
            <div className="absolute top-16 right-6 bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg z-10">
              +{Math.round(totalMessages / 10)}%
            </div>

            <div className="flex-1 h-[140px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: "#a3a3a3", fontWeight: "bold" }}
                    dx={-10}
                    width={30}
                  />
                  <defs>
                    <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#111" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey={(d) => d.shortLabel || d.label}
                    tick={{ fontSize: 10, fill: "#888", fontWeight: "bold" }}
                    tickLine={false}
                    axisLine={{ stroke: '#eee' }}
                    interval={period === "7D" ? 0 : "preserveStartEnd"}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="natural"
                    dataKey="count"
                    stroke="#111111"
                    strokeWidth={2}
                    fill="url(#areaColor)"
                    dot={{ r: 3, fill: "#111", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm flex flex-col border border-white/60 text-neutral-900">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold tracking-tight">Interest progress</h2>
              <LayoutGrid className="w-4 h-4 text-neutral-400" />
            </div>
            <p className="text-[10px] font-semibold text-neutral-500 mb-6">Based on latest inquiries</p>

            <div className="flex flex-1 items-center justify-center relative mb-4">
               {donutData.length > 0 ? (
                 <>
                   <div className="w-[120px] h-[120px]">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                            data={donutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={5}
                            cornerRadius={4}
                            dataKey="value"
                            stroke="none"
                          >
                           {donutData.map((_, i) => (
                             <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                           ))}
                         </Pie>
                       </PieChart>
                     </ResponsiveContainer>
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center flex-col">
                     <span className="text-xl font-bold">{Math.round((donutData[0]?.value || 0) / totalInterest * 100)}%</span>
                     <span className="text-[8px] text-neutral-400 uppercase font-bold tracking-widest text-center mt-1 w-12 truncate">{donutData[0]?.name}</span>
                   </div>
                 </>
               ) : (
                 <div className="text-neutral-400 text-xs">No data yet</div>
               )}
            </div>

            <div className="space-y-2 mb-4">
               {byInterest.slice(0, 3).map((b, i) => (
                 <div key={b.interest} className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                   <span className="text-xs font-semibold text-neutral-600 truncate flex-1">{b.interest}</span>
                 </div>
               ))}
            </div>

            <Link href="/admin/messages" className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 border border-neutral-300 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors">
              <Share2 className="w-3.5 h-3.5" /> View Report
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
          <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white/60 flex flex-col text-neutral-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tracking-tight">Recent Messages</h2>
              <Clock className="w-4 h-4 text-neutral-400" />
            </div>

            {recentMessages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs text-neutral-400 font-medium">
                No messages yet
              </div>
            ) : (
              <div className="space-y-3 flex-1">
                {recentMessages.slice(0, 4).map((msg) => (
                  <Link
                    key={msg.id}
                    href="/admin/messages"
                    className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-white/50 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {msg.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold truncate leading-tight">{msg.full_name}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{msg.interest ?? msg.email}</p>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${
                      msg.status === "new" ? "bg-neutral-900 text-white" :
                      msg.status === "in_progress" ? "bg-yellow-100 text-yellow-700" :
                      msg.status === "resolved" ? "bg-green-100 text-green-700" :
                      "bg-neutral-100 text-neutral-500"
                    }`}>
                      {STATUS_LABEL[msg.status] ?? msg.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            <Link href="/admin/messages" className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 border border-neutral-300 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors">
              <Mail className="w-3.5 h-3.5" /> View all messages
            </Link>
          </div>

          <div className="flex flex-col">
             <div className="flex items-center justify-between mb-4 px-2">
               <h2 className="text-lg font-semibold tracking-tight">Quick Overview</h2>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
               {/* Card 1: IST Clock */}
               <ISTClockCard />

               {/* Card 2: Active Workspaces */}
               <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-white/60 flex flex-col items-center justify-center text-neutral-900 relative">
                 <h3 className="font-semibold text-sm absolute top-5 left-5">Workspaces</h3>
                 <Building className="w-4 h-4 text-neutral-400 absolute top-5 right-5" />
                 <div className="mt-6 flex flex-col items-center gap-2">
                   <div className="text-4xl font-bold">{activeWorkspaces}</div>
                   <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Active workspaces</p>
                 </div>
               </div>

               {/* Card 3: Active FAQ Items */}
               <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-white/60 flex flex-col justify-between text-neutral-900">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="font-semibold text-sm">FAQ Items</h3>
                   <FileText className="w-4 h-4 text-neutral-400" />
                 </div>
                 <div className="flex-1 flex flex-col justify-center">
                   <div className="text-3xl font-bold tracking-tight mb-1">{activeFaqItems}</div>
                   <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                     Active questions
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4 px-2">
             <h2 className="text-lg font-semibold tracking-tight">System Status</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111111]/80 backdrop-blur-md border border-white/10 rounded-3xl p-5 text-white flex flex-col justify-between shadow-md">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="font-semibold text-[15px]">Media Library</h3>
                 <div className="w-6 h-6 border-[2px] border-white/20 rounded-full flex items-center justify-center text-[8px] font-bold">{mediaCount}</div>
               </div>
               <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                 <div className="w-1.5 h-1.5 bg-white rounded-full" /> Total assets uploaded
               </div>
            </div>

            <div className="bg-[#111111]/80 backdrop-blur-md border border-white/10 rounded-3xl p-5 text-white flex flex-col justify-between shadow-md">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="font-semibold text-[15px]">Spam Filter</h3>
                 <div className="w-6 h-6 border-[2px] border-white/20 rounded-full flex items-center justify-center text-[8px] font-bold">{spam}</div>
               </div>
               <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                 <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full" /> Messages blocked
               </div>
            </div>

            <div className="bg-[#111111]/80 backdrop-blur-md border border-white/10 rounded-3xl p-5 text-white flex flex-col justify-between shadow-md">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="font-semibold text-[15px]">System Health</h3>
                 <div className="w-6 h-6 border-[2px] border-white/20 rounded-full flex items-center justify-center text-[8px] font-bold">OK</div>
               </div>
               <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> All services operational
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
