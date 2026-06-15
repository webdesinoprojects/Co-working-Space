"use client";

import { useState, useMemo } from "react";
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
  Image as ImageIcon,
  ArrowRight,
  CheckCircle2,
  Circle,
  TrendingUp,
  LayoutGrid,
  Users,
  FileText,
  MessageCircle,
  Share2,
  MapPin,
  CreditCard,
  Shield,
  Sparkles,
  ChevronDown,
  Building,
} from "lucide-react";

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

  const donutData = byInterest.length > 0 
    ? byInterest.map((b) => ({ name: b.interest || "Unknown", value: b.count }))
    : [
        { name: "Private Cabins", value: 45 },
        { name: "Dedicated Desks", value: 30 },
        { name: "Meeting Rooms", value: 15 },
        { name: "Virtual Office", value: 10 },
      ];

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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold tracking-tight">Month goals:</h2>
              <div className="w-6 h-6 border border-neutral-300 rounded-full flex items-center justify-center text-[8px] font-bold">1/4</div>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="w-5 h-5 rounded-[4px] bg-neutral-900 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium">Review pending messages</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="w-5 h-5 rounded-[4px] border-2 border-neutral-300 flex items-center justify-center shrink-0"></div>
                <span className="text-sm font-medium text-neutral-400">Update homepage hero</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="w-5 h-5 rounded-[4px] border-2 border-neutral-300 flex items-center justify-center shrink-0"></div>
                <span className="text-sm font-medium text-neutral-400">Process media assets</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="w-5 h-5 rounded-[4px] border-2 border-neutral-300 flex items-center justify-center shrink-0"></div>
                <span className="text-sm font-medium text-neutral-400">Add new workspaces</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col">
             <div className="flex items-center justify-between mb-4 px-2">
               <h2 className="text-lg font-semibold tracking-tight">Quick Overview</h2>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
               {/* Card 1: Combined Inbox */}
               <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-white/60 flex flex-col justify-between text-neutral-900">
                 <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                     <Mail className="w-4 h-4 text-neutral-600" />
                     <h3 className="font-semibold text-sm">Inbox</h3>
                   </div>
                 </div>
                 
                 {recentMessages[0] ? (
                   <div className="mb-4 flex-1">
                     <h4 className="font-semibold text-[13px] leading-tight mb-1 truncate">{recentMessages[0].full_name}</h4>
                     <p className="text-[11px] text-neutral-500 truncate">{recentMessages[0].email}</p>
                   </div>
                 ) : (
                   <div className="mb-4 flex-1 flex items-center justify-center text-xs text-neutral-400 font-medium bg-white/30 rounded-xl">
                     No recent inquiries
                   </div>
                 )}
                 
                 <Link href="/admin/messages" className="w-full py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors mt-auto">
                   Open Inbox <ArrowRight className="w-3 h-3" />
                 </Link>
               </div>

               {/* Card 2: Occupancy Rate */}
               <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-white/60 flex flex-col items-center justify-center text-neutral-900 relative">
                 <h3 className="font-semibold text-sm absolute top-5 left-5">Occupancy</h3>
                 <Building className="w-4 h-4 text-neutral-400 absolute top-5 right-5" />
                 
                 <div className="mt-6 relative w-20 h-20 flex items-center justify-center">
                   <svg className="w-full h-full transform -rotate-90">
                     <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/60" />
                     <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="226" strokeDashoffset="60" className="text-neutral-900 drop-shadow-md transition-all duration-1000" />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center flex-col">
                     <span className="text-lg font-bold">73%</span>
                   </div>
                 </div>
                 <p className="text-[10px] text-neutral-500 font-semibold mt-3 uppercase tracking-wider">146 / 200 Seats</p>
               </div>

               {/* Card 3: Engagement */}
               <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-white/60 flex flex-col justify-between text-neutral-900">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="font-semibold text-sm">Engagement</h3>
                   <Users className="w-4 h-4 text-neutral-400" />
                 </div>
                 <div className="flex-1 flex flex-col justify-center">
                   <div className="text-3xl font-bold tracking-tight mb-1">1,248</div>
                   <div className="text-[10px] font-bold text-green-600 flex items-center gap-1 uppercase tracking-wider">
                     <TrendingUp className="w-3 h-3" /> +12.5% vs last week
                   </div>
                 </div>
                 <div className="flex items-end gap-1.5 h-8 mt-4">
                   {[30, 45, 25, 60, 40, 80, 50].map((v, i) => (
                     <div key={i} className="flex-1 bg-neutral-900 rounded-t-sm opacity-80" style={{ height: `${v}%` }} />
                   ))}
                 </div>
               </div>
             </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4 px-2">
             <h2 className="text-lg font-semibold tracking-tight">System Status</h2>
             <div className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
               Sort by <ChevronDown className="w-3 h-3" />
             </div>
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
