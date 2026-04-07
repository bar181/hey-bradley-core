import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Send, RotateCcw, FileText, Eye, Cpu, Rocket, Quote } from "lucide-react";
import { MarketingNav } from "@/components/MarketingNav";

const CONVERSATION = [
  { type: "user", text: "Hey Bradley! Let's create a website that is beautiful, intuitive, and captures attention." },
  { type: "ai", text: "Great choice! Here's a beautiful full-screen design that really pops..." },
  { type: "user", text: "That's amazing! Can we try something more minimal and refined?" },
  { type: "ai", text: "Of course! Here's a nice clean layout with plenty of breathing room..." },
  { type: "user", text: "This is for an academic research project at Harvard." },
  { type: "ai", text: "Love it! Here's a polished academic look with Harvard's classic colors..." },
  { type: "user", text: "Can you show me something more modern and tech-forward?" },
  { type: "ai", text: "You got it! Here's a sleek, modern look with bold colors and sharp text..." },
];
function TimelineStep({ time, title, description, index }: { time: string; title: string; description: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="flex gap-6 items-start"
    >
      <div className="flex flex-col items-center shrink-0">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
          {time}
        </div>
        {index < 3 && <div className="w-px h-16 bg-gradient-to-b from-emerald-500/40 to-transparent mt-2" />}
      </div>
      <div className="pb-8">
        <h4 className="text-lg font-semibold text-white mb-1">{title}</h4>
        <p className="text-neutral-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
export function Welcome() {
  const [displayedMessages, setDisplayedMessages] = useState<Array<{type: string; text: string; isComplete: boolean}>>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayedMessages]);

  useEffect(() => {
    if (currentMessageIndex >= CONVERSATION.length) return;
    const msg = CONVERSATION[currentMessageIndex];
    if (currentCharIndex < msg.text.length) {
      const t = setTimeout(() => {
        setDisplayedMessages(prev => {
          const next = [...prev];
          if (next.length <= currentMessageIndex) {
            next.push({ type: msg.type, text: msg.text.charAt(0), isComplete: false });
          } else {
            next[currentMessageIndex] = { ...next[currentMessageIndex], text: msg.text.substring(0, currentCharIndex + 1) };
          }
          return next;
        });
        setCurrentCharIndex(p => p + 1);
      }, msg.type === "user" ? 30 : 25);
      return () => clearTimeout(t);
    } else {
      setDisplayedMessages(prev => {
        const next = [...prev];
        if (next[currentMessageIndex]) next[currentMessageIndex].isComplete = true;
        return next;
      });
      const t = setTimeout(() => {
        setCurrentMessageIndex(p => p + 1);
        setCurrentCharIndex(0);
      }, msg.type === "user" ? 800 : 1500);
      return () => clearTimeout(t);
    }
  }, [currentMessageIndex, currentCharIndex, animationKey]);

  const resetAnimation = () => {
    setDisplayedMessages([]);
    setCurrentMessageIndex(0);
    setCurrentCharIndex(0);
    setAnimationKey(p => p + 1);
  };

  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white" role="main">
      <MarketingNav />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f1a] via-[#111827] to-[#0b0f1a]" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/80 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Spec-Driven Website Builder
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6"
          >
            The whiteboard that
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">writes your specs.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Describe what you want. See it build in real-time.
            Get enterprise specifications that any AI can execute on the first try.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex gap-4 justify-center"
          >
            <Link to="/new-project" className="px-8 py-4 rounded-xl font-semibold bg-white text-neutral-900 hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl text-lg">
              Try the Builder <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link to="/research" className="px-8 py-4 rounded-xl font-semibold bg-transparent border border-white/30 text-white hover:bg-white/10 transition-all text-lg">
              See the Research
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 bg-[#111827]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="text-sm font-semibold text-red-400 uppercase tracking-widest mb-4">The Problem</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
              The most expensive game of
              <br />
              <span className="text-red-400">telephone</span> in history.
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }}>
            <p className="text-lg text-neutral-300 leading-relaxed max-w-3xl mb-8">
              Every piece of software ever built started the same way: a picture in
              someone&rsquo;s head. A nurse imagines a better patient intake form. A
              bakery owner sees the website she wants. A founder has the dashboard
              that will change everything. The picture is vivid, specific, and
              completely trapped inside their skull.
            </p>
            <p className="text-lg text-neutral-300 leading-relaxed max-w-3xl mb-10">
              Then the telephone game begins. She describes it to someone who writes
              it down. The write-up goes to a designer who interprets it. The design
              goes to a developer who approximates it. Each handoff degrades the
              signal.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 md:p-12 text-center"
          >
            <p className="text-5xl md:text-7xl font-bold text-red-400 mb-4">40&ndash;65%</p>
            <p className="text-xl text-neutral-300">of implementation intent is lost in translation.</p>
          </motion.div>
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 border-l-4 border-neutral-600 pl-6 py-2"
          >
            <p className="text-xl italic text-neutral-400">
              &ldquo;I described exactly what I wanted. What I got back looked nothing like it.&rdquo;
            </p>
            <cite className="block mt-3 text-sm text-neutral-500 not-italic">&mdash; Every person who ever commissioned software</cite>
          </motion.blockquote>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-24 bg-[#0b0f1a]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-4">The Solution</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              What happens when the
              <br />
              telephone game <span className="text-emerald-400">ends.</span>
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mb-16">
              A nurse has been frustrated with the patient intake form for two years.
              She knows exactly what it should look like. Today she opens Hey&nbsp;Bradley.
            </p>
          </motion.div>
          <div className="max-w-xl">
            <TimelineStep index={0} time="10 AM" title="The Idea" description="She says: 'Patient intake form with a progress bar, clear sections for medical history, and a confirmation screen.' The form takes shape on screen while she talks." />
            <TimelineStep index={1} time="10:20" title="The Specs" description="Twenty minutes of adjustments. The form looks exactly like what she imagined. Underneath, six enterprise specification documents were generated automatically." />
            <TimelineStep index={2} time="11:30" title="The Build" description="IT pastes the specs into an AI coding tool. The form is built — and it integrates with the existing system because the specs understood what was already there." />
            <TimelineStep index={3} time="12 PM" title="Production" description="Deployed. Patients use the new form that afternoon. No Jira ticket. No six-month backlog. No 'that's not what I meant.'" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-4">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Idea &rarr; See it &rarr; Spec it &rarr; Ship it
            </h2>
          </motion.div>

          {/* 4-step cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {[
              { icon: FileText, title: "Describe", desc: "Type, talk, or click. Three interaction modes. The picture in your head becomes visible in seconds.", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
              { icon: Eye, title: "See it live", desc: "A real prototype materializes. Five seconds per change. Iterate at the speed of conversation.", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
              { icon: Cpu, title: "Specs generated", desc: "Six enterprise documents — AISP Crystal Atoms — created automatically. Under 2% ambiguity.", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
              { icon: Rocket, title: "Ship it", desc: "Paste specs into any AI coding tool. One command. Built, tested, deployed. What you approved is what ships.", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`rounded-2xl border p-8 ${step.bg}`}
              >
                <step.icon className={`w-8 h-8 ${step.color} mb-4`} />
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-neutral-400 leading-relaxed text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Chat animation demo */}
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-[#0b0f1a] overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/10 bg-[#0b0f1a]/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#A51C30] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-white">Hey Bradley</span>
                    <p className="text-xs text-white/50">Chat Demo</p>
                  </div>
                </div>
                <button type="button" onClick={resetAnimation} className="p-2 rounded-full text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors" title="Restart animation">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              <div className="h-72 overflow-y-auto p-4 space-y-3">
                {displayedMessages.map((message, index) => (
                  <motion.div
                    key={`${animationKey}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-[#2563EB] text-white rounded-tr-sm"
                        : "bg-[#1a1f2e] border border-white/10 rounded-tl-sm"
                    }`}>
                      <p className={`leading-relaxed text-sm ${message.type === "user" ? "" : "text-white/90"}`}>
                        {message.text}
                        {index === displayedMessages.length - 1 && !message.isComplete && (
                          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className={`inline-block w-0.5 h-4 ml-1 align-middle ${message.type === "user" ? "bg-white" : "bg-[#A51C30]"}`} />
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                  <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-white/30" disabled />
                  <button className="p-2 rounded-full text-white/30" disabled><Send className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CRYSTAL ATOM */}
      <section className="py-24 bg-[#0b0f1a]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
            <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-4">The Innovation</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              A specification language designed
              <br />for <span className="text-purple-400">zero ambiguity.</span>
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl">
              The telephone game persists because there is no language designed for this
              particular translation. AISP Crystal Atoms change that.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Code block */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <pre className="bg-[#1a1d27] border border-white/10 rounded-2xl p-8 text-sm leading-relaxed font-mono overflow-x-auto">
                <code className="text-neutral-300">
{`// Crystal Atom — five formal components
⟦
  Ω := { Patient intake form with progress bar }
  Σ := { Form:{sections:[Demographics, History,
         Medications, Confirm]} }
  Γ := { R1: reuse existing PatientAuth
         R2: validate against patient_records }
  Λ := { route:="/intake/new", db:=patients,
         api:=POST /api/v2/intake }
  Ε := { V1: VERIFY 4 sections render
         V2: progress bar advances per step }
⟧`}
                </code>
              </pre>
              <div className="mt-4 flex gap-4 text-sm">
                <span className="text-purple-400 font-medium">Ω Objective</span>
                <span className="text-indigo-400 font-medium">Σ Structure</span>
                <span className="text-emerald-400 font-medium">Γ Grounding</span>
                <span className="text-amber-400 font-medium">Λ Logistics</span>
                <span className="text-pink-400 font-medium">Ε Evaluation</span>
              </div>
            </motion.div>
            {/* Comparison */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                <p className="text-6xl font-bold text-red-400 mb-2">50%</p>
                <p className="text-neutral-400">Traditional spec ambiguity</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
                <p className="text-6xl font-bold text-emerald-400 mb-2">&lt;2%</p>
                <p className="text-neutral-400">AISP Crystal Atom ambiguity</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-2xl font-bold text-white mb-1">1st try</p>
                <p className="text-sm text-neutral-400">Any AI builds it right because there is nothing to misinterpret.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-24 bg-[#111827]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-4">Who It Serves</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Everyone who ever dreamed about
              <br />a product can <span className="text-amber-400">build it.</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "The bakery owner", quote: "I didn't need to explain it. I could just show it.", desc: "Warm colors, photos of pastries, online ordering. Five minutes later she is looking at the website she imagined for three years." },
              { title: "The accountant", quote: "I didn't ask permission. I just built it.", desc: "Drowning in reconciliation spreadsheets for years. Describes the dashboard he wishes existed. Specs go to an AI agent. Deployed before he leaves." },
              { title: "The startup team", quote: "The whiteboard finally builds what we drew.", desc: "Five stakeholders on Zoom. The prototype builds while they argue. When the call ends, the specs already exist. One PR. Done before lunch." },
              { title: "The enterprise team", quote: "Everyone is finally building the same thing.", desc: "Fifteen teams, one specification language. Typed, versioned, auditable. When compliance asks 'why was this built?' the spec is the audit trail." },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{card.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-4">{card.desc}</p>
                <div className="flex items-start gap-2 text-amber-400/80 text-sm italic">
                  <Quote className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{card.quote}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN SOURCE */}
      <section className="py-24 bg-[#0b0f1a]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-4">Open Source</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Two open projects. One commercial future.
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.a
              href="https://github.com/bar181/aisp-open-core"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-cyan-500/40 transition-colors block"
            >
              <h3 className="text-xl font-bold text-white mb-2">AISP 5.1 &mdash; The Specification Language</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">Crystal Atom notation, 512-symbol set, tier assessment, validation tools, and the formal ambiguity measurement methodology. Open standard. MIT license.</p>
              <span className="text-cyan-400 text-sm font-medium">github.com/bar181/aisp-open-core &rarr;</span>
            </motion.a>
            <motion.a
              href="https://github.com/bar181/hey-bradley-core"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-cyan-500/40 transition-colors block"
            >
              <h3 className="text-xl font-bold text-white mb-2">Hey Bradley &mdash; The Reference Implementation</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">Visual builder that generates AISP specs from human interactions. React + TypeScript + Tailwind. 12 themes, 258+ images, 6 spec generators. MIT license.</p>
              <span className="text-cyan-400 text-sm font-medium">github.com/bar181/hey-bradley-core &rarr;</span>
            </motion.a>
          </div>

          {/* Tiers */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tier: "Community", price: "Free forever", features: ["AISP spec language and validator", "Hey Bradley builder (self-hosted)", "All template variants", "6 spec generators", "Full Playwright test suite"] },
              { tier: "Pro", price: "Coming 2026", features: ["Everything in Community", "AI-powered chat and voice", "Brownfield codebase analysis", "Custom brand assets", "Hosted version with cloud"] },
              { tier: "Enterprise", price: "By arrangement", features: ["Everything in Pro", "Multi-user collaboration", "AISP spec versioning", "SSO and role-based access", "CI/CD integration"] },
            ].map((t, i) => (
              <motion.div
                key={t.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`rounded-2xl p-8 border ${i === 0 ? "bg-white/5 border-white/10" : i === 1 ? "bg-indigo-500/10 border-indigo-500/30" : "bg-white/5 border-white/10"}`}
              >
                <h3 className="text-xl font-bold text-white mb-1">{t.tier}</h3>
                <p className="text-sm text-neutral-400 mb-6">{t.price}</p>
                <ul className="space-y-2">
                  {t.features.map(f => (
                    <li key={f} className="text-sm text-neutral-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-b from-[#111827] to-[#0b0f1a]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            The telephone game is over.
          </h2>
          <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Describe what you see. Watch it appear.
            Specs generated automatically. Any AI builds it.
            What you approved is what ships.
          </p>
          <Link
            to="/new-project"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl font-bold bg-white text-neutral-900 hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl text-lg"
          >
            Try the Builder
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10 bg-[#0b0f1a]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-neutral-500 mb-2">Harvard ALM Capstone &mdash; Digital Media Design &mdash; May 2026</p>
          <p className="text-sm text-neutral-500">Bradley Ross &mdash; Creator of AISP</p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-neutral-600">
            <a href="https://github.com/bar181/aisp-open-core" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">AISP Repo</a>
            <a href="https://github.com/bar181/hey-bradley-core" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Hey Bradley Repo</a>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}