"use client";

import { FormEvent, useState } from "react";
import { Bot, ChevronRight, FileText, History, Menu, Plus, Send, Settings, Sparkles, X } from "lucide-react";

type Message = { role: "user" | "assistant"; text: string };
const suggestions = ["Research a topic for me", "Help me plan my day", "Analyze a document", "Write something professional"];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const value = input.trim();
    if (!value || loading) return;
    const nextMessages = [...messages, { role: "user" as const, text: value }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: nextMessages.map(({ role, text }) => ({ role, content: text })) }) });
      const data = await response.json();
      setMessages([...nextMessages, { role: "assistant", text: data.message || data.error || "Something went wrong." }]);
    } catch {
      setMessages([...nextMessages, { role: "assistant", text: "I could not reach the AI service. Please try again." }]);
    } finally { setLoading(false); }
  }

  return (
    <main className="flex min-h-screen bg-[#080d1b] grid-bg">
      <aside className={`${mobileOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-white/10 bg-[#0c1224] p-5 transition-transform md:static md:translate-x-0`}>
        <div className="mb-10 flex items-center justify-between"><a href="#" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo to-cyan font-display text-lg font-bold">H</span><span className="font-display text-lg font-semibold">Hexa<span className="text-cyan"> AI</span></span></a><button onClick={() => setMobileOpen(false)} className="md:hidden"><X size={20} /></button></div>
        <button onClick={() => setMessages([])} className="mb-7 flex items-center justify-center gap-2 rounded-xl bg-indigo px-4 py-3 text-sm font-semibold transition hover:bg-indigo/80"><Plus size={18} /> New conversation</button>
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Workspace</p>
        <nav className="space-y-1 text-sm text-slate-300"><a className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-2.5 text-white" href="#"><Sparkles size={17} /> Assistant</a><a className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/5" href="#"><History size={17} /> Conversations</a><a className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/5" href="#"><FileText size={17} /> Files</a></nav>
        <div className="mt-auto space-y-1 border-t border-white/10 pt-4 text-sm text-slate-300"><a className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/5" href="#"><Settings size={17} /> Settings</a><div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 p-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-cyan/20 text-xs font-bold text-cyan">A</div><div><p className="text-sm font-medium">Your workspace</p><p className="text-xs text-slate-500">Free plan</p></div></div></div>
      </aside>
      <section className="flex min-h-screen flex-1 flex-col"><header className="flex h-20 items-center justify-between border-b border-white/10 px-5 md:px-10"><button onClick={() => setMobileOpen(true)} className="md:hidden"><Menu /></button><div className="hidden items-center gap-2 text-sm text-slate-400 md:flex"><Bot size={18} className="text-cyan" /> Personal workspace <ChevronRight size={14} /> <span className="text-white">Assistant</span></div><div className="ml-auto flex items-center gap-3"><span className="hidden rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs text-cyan sm:block">AI agent online</span><div className="grid h-9 w-9 place-items-center rounded-full bg-indigo font-semibold">A</div></div></header>
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 md:px-10 md:py-16">{messages.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center text-center"><div className="glow mb-7 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-indigo to-cyan"><Sparkles size={38} /></div><h1 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">How can I help you today?</h1><p className="mt-4 max-w-xl text-base leading-7 text-slate-400">I’m Hexa, your intelligent partner for research, creation, analysis, organization, and more.</p><div className="mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-2">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => setInput(suggestion)} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-left text-sm text-slate-300 transition hover:border-indigo/60 hover:bg-indigo/10"><span>{suggestion}</span><ChevronRight size={16} className="text-slate-500" /></button>)}</div></div> : <div className="flex-1 space-y-6 pb-8">{messages.map((message, index) => <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-2xl rounded-2xl px-5 py-3.5 text-sm leading-6 ${message.role === "user" ? "bg-indigo text-white" : "border border-white/10 bg-white/[.04] text-slate-200"}`}>{message.text}</div></div>)}{loading && <div className="text-sm text-slate-500">Hexa is thinking…</div>}</div>}
          <form onSubmit={sendMessage} className="relative mt-8"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder="Ask Hexa anything..." rows={1} className="w-full resize-none rounded-2xl border border-white/15 bg-[#111a31] py-4 pl-5 pr-14 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo" /><button disabled={loading} aria-label="Send message" type="submit" className="absolute right-3 top-2.5 grid h-10 w-10 place-items-center rounded-xl bg-indigo transition hover:bg-indigo/80 disabled:cursor-not-allowed disabled:opacity-50"><Send size={17} /></button></form><p className="mt-3 text-center text-xs text-slate-600">Hexa can make mistakes. Check important information.</p>
        </div>
      </section>
    </main>
  );
}
