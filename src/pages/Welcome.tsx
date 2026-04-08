import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Send, RotateCcw, Mic, MessageSquare, SlidersHorizontal, Quote } from "lucide-react";
import { MarketingNav } from "@/components/MarketingNav";
import bradPixar from "@/assets/bradley/brad_pixar.webp";

/* ── Showcase data ── */

interface HeroShowcase {
  id: number;
  style: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaSecondary: string;
  link: string;
  linkSecondary: string;
  titleColor: string;
  subtitleColor: string;
  ctaStyle: string;
  ctaSecondaryStyle: string;
  backgroundImage?: string;
  overlay?: string;
  backgroundColor?: string;
  gradient?: string;
  accent?: string;
  decorations?: boolean;
  image?: string;
}

const INITIAL_SHOWCASE: HeroShowcase = {
  id: -1,
  style: "whiteboard",
  title: "TELL BRADLEY WHAT YOU WANT. WATCH IT APPEAR.",
  subtitle: "Your AI website builder. Just describe your dream website and watch it come to life.",
  cta: "Get Started",
  ctaSecondary: "Explore Builder",
  link: "/new-project",
  linkSecondary: "/builder",
  gradient: "bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900",
  titleColor: "text-white",
  subtitleColor: "text-neutral-400",
  ctaStyle: "bg-white text-neutral-900 hover:bg-neutral-100",
  ctaSecondaryStyle: "bg-transparent border border-white/30 text-white hover:bg-white/10",
};

const HERO_SHOWCASES: HeroShowcase[] = [
  {
    id: 0,
    style: "background-image",
    title: "Listen Mode",
    subtitle: "Create websites in real time as you speak",
    cta: "Start Listening",
    ctaSecondary: "Try Builder",
    link: "/builder",
    linkSecondary: "/builder",
    backgroundImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80",
    overlay: "bg-gradient-to-r from-black/80 via-black/60 to-black/40",
    titleColor: "text-white",
    subtitleColor: "text-white/80",
    ctaStyle: "bg-white text-black hover:bg-white/90",
    ctaSecondaryStyle: "bg-transparent border border-white/50 text-white hover:bg-white/10",
  },
  {
    id: 1,
    style: "minimal",
    title: "Builder Mode",
    subtitle: "For fine tuning precision",
    cta: "Open Builder",
    ctaSecondary: "New Project",
    link: "/builder",
    linkSecondary: "/new-project",
    backgroundColor: "bg-[#fafafa]",
    titleColor: "text-neutral-900",
    subtitleColor: "text-neutral-500",
    ctaStyle: "bg-neutral-900 text-white hover:bg-neutral-800",
    ctaSecondaryStyle: "bg-transparent border border-neutral-300 text-neutral-700 hover:bg-neutral-100",
    accent: "border-l-4 border-neutral-900",
  },
  {
    id: 2,
    style: "harvard",
    title: "Harvard Research",
    subtitle: "Capstone on AI First Documentation",
    cta: "Explore Builder",
    ctaSecondary: "New Project",
    link: "/builder",
    linkSecondary: "/new-project",
    backgroundColor: "bg-[#1e1e1e]",
    gradient: "bg-gradient-to-br from-[#A51C30] via-[#1e1e1e] to-[#1e1e1e]",
    titleColor: "text-white",
    subtitleColor: "text-[#A51C30]",
    ctaStyle: "bg-[#A51C30] text-white hover:bg-[#8B1729]",
    ctaSecondaryStyle: "bg-transparent border border-[#A51C30]/50 text-[#A51C30] hover:bg-[#A51C30]/10",
  },
  {
    id: 3,
    style: "saas",
    title: "AI Symbolic Protocol",
    subtitle: "Proof-based specifications with near-zero ambiguity",
    cta: "Explore Protocol",
    ctaSecondary: "Try Builder",
    link: "/builder",
    linkSecondary: "/builder",
    gradient: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500",
    titleColor: "text-white",
    subtitleColor: "text-indigo-200",
    ctaStyle: "bg-white text-indigo-600 hover:bg-indigo-50",
    ctaSecondaryStyle: "bg-transparent border border-white/30 text-white hover:bg-white/10",
    decorations: true,
  },
  {
    id: 4,
    style: "creator",
    title: "Bradley Ross",
    subtitle: "Creator & Visionary",
    cta: "Get Started",
    ctaSecondary: "New Project",
    link: "/builder",
    linkSecondary: "/new-project",
    backgroundColor: "bg-white",
    gradient: "bg-gradient-to-br from-amber-50 via-white to-rose-50",
    titleColor: "text-neutral-800",
    subtitleColor: "text-pink-500",
    ctaStyle: "bg-neutral-900 text-white hover:bg-neutral-800",
    ctaSecondaryStyle: "bg-transparent border border-neutral-300 text-neutral-700 hover:bg-neutral-100",
    image: bradPixar,
  },
];

const CONVERSATION = [
  { type: "user", text: "Hey Bradley! Let's create a website that is beautiful, intuitive, and captures attention.", triggerShowcase: null },
  { type: "ai", text: "Great choice! Here's a beautiful full-screen design that really pops...", triggerShowcase: 0 },
  { type: "user", text: "That's amazing! Can we try something more minimal and refined?", triggerShowcase: null },
  { type: "ai", text: "Of course! Here's a nice clean layout with plenty of breathing room...", triggerShowcase: 1 },
  { type: "user", text: "This is for an academic research project at Harvard.", triggerShowcase: null },
  { type: "ai", text: "Love it! Here's a polished academic look with Harvard's classic colors...", triggerShowcase: 2 },
  { type: "user", text: "Can you show me something more modern and tech-forward?", triggerShowcase: null },
  { type: "ai", text: "You got it! Here's a sleek, modern look with bold colors and sharp text...", triggerShowcase: 3 },
  { type: "user", text: "I'd love to see the creator's personal touch.", triggerShowcase: null },
  { type: "ai", text: "Here's the person behind it all. Ready to build something together?", triggerShowcase: 4 },
];

/* ── Timeline step ── */

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

/* ── Main component ── */

export function Welcome() {
  const [displayedMessages, setDisplayedMessages] = useState<Array<{ type: string; text: string; isComplete: boolean }>>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentShowcaseIndex, setCurrentShowcaseIndex] = useState(-1);
  const [animationKey, setAnimationKey] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [displayedMessages]);

  useEffect(() => {
    if (!isRunning) return;
    if (currentMessageIndex >= CONVERSATION.length) return;
    const msg = CONVERSATION[currentMessageIndex];
    if (currentCharIndex < msg.text.length) {
      const t = setTimeout(() => {
        setDisplayedMessages((prev) => {
          const next = [...prev];
          if (next.length <= currentMessageIndex) {
            if (msg.triggerShowcase !== null) setCurrentShowcaseIndex(msg.triggerShowcase);
            next.push({ type: msg.type, text: msg.text.charAt(0), isComplete: false });
          } else {
            next[currentMessageIndex] = { ...next[currentMessageIndex], text: msg.text.substring(0, currentCharIndex + 1) };
          }
          return next;
        });
        setCurrentCharIndex((p) => p + 1);
      }, msg.type === "user" ? 30 : 25);
      return () => clearTimeout(t);
    } else {
      setDisplayedMessages((prev) => {
        const next = [...prev];
        if (next[currentMessageIndex]) next[currentMessageIndex].isComplete = true;
        return next;
      });
      const t = setTimeout(() => {
        setCurrentMessageIndex((p) => p + 1);
        setCurrentCharIndex(0);
      }, msg.type === "user" ? 800 : 1500);
      return () => clearTimeout(t);
    }
  }, [currentMessageIndex, currentCharIndex, animationKey, isRunning]);

  const startAnimation = () => {
    setDisplayedMessages([]);
    setCurrentMessageIndex(0);
    setCurrentCharIndex(0);
    setCurrentShowcaseIndex(-1);
    setAnimationKey((p) => p + 1);
    setIsRunning(true);
  };

  const resetAnimation = () => {
    setDisplayedMessages([]);
    setCurrentMessageIndex(0);
    setCurrentCharIndex(0);
    setCurrentShowcaseIndex(-1);
    setAnimationKey((p) => p + 1);
    setIsRunning(true);
  };

  const currentShowcase: HeroShowcase = currentShowcaseIndex === -1 ? INITIAL_SHOWCASE : HERO_SHOWCASES[currentShowcaseIndex];

  /* ── Showcase renderer ── */

  const renderHeroShowcase = () => {
    if (currentShowcaseIndex === -1) {
      return (
        <div className={`absolute inset-0 ${INITIAL_SHOWCASE.gradient} rounded-2xl overflow-hidden`}>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 lg:p-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="mb-4">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/80 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Your AI Website Builder
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className={`text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight ${INITIAL_SHOWCASE.titleColor}`}
            >
              {INITIAL_SHOWCASE.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className={`text-lg lg:text-xl mt-6 max-w-lg ${INITIAL_SHOWCASE.subtitleColor}`}
            >
              {INITIAL_SHOWCASE.subtitle}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-4 text-sm text-neutral-500 max-w-md">
              No coding needed. No design skills required.
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.6 }} className="mt-10 flex gap-4">
              <Link to={INITIAL_SHOWCASE.link} className={`px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl ${INITIAL_SHOWCASE.ctaStyle}`}>{INITIAL_SHOWCASE.cta}</Link>
              <Link to={INITIAL_SHOWCASE.linkSecondary} className={`px-8 py-4 rounded-xl font-semibold transition-all ${INITIAL_SHOWCASE.ctaSecondaryStyle}`}>{INITIAL_SHOWCASE.ctaSecondary}</Link>
            </motion.div>
          </div>
        </div>
      );
    }

    switch (currentShowcase.style) {
      case "background-image":
        return (
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <img src={currentShowcase.backgroundImage} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div className={`absolute inset-0 ${currentShowcase.overlay}`} />
            <div className="absolute inset-0 flex flex-col items-start justify-center p-12 lg:p-16">
              <motion.h1 initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className={`text-5xl lg:text-7xl font-bold tracking-tight ${currentShowcase.titleColor}`}>{currentShowcase.title}</motion.h1>
              <motion.p initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className={`text-xl lg:text-2xl mt-4 max-w-md ${currentShowcase.subtitleColor}`}>{currentShowcase.subtitle}</motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="mt-8 flex gap-4">
                <Link to={currentShowcase.link} className={`px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl ${currentShowcase.ctaStyle}`}>{currentShowcase.cta}</Link>
                <Link to={currentShowcase.linkSecondary} className={`px-8 py-4 rounded-xl font-semibold transition-all ${currentShowcase.ctaSecondaryStyle}`}>{currentShowcase.ctaSecondary}</Link>
              </motion.div>
            </div>
          </div>
        );

      case "minimal":
        return (
          <div className={`absolute inset-0 ${currentShowcase.backgroundColor} rounded-2xl overflow-hidden flex items-center justify-center`}>
            <div className={`text-center ${currentShowcase.accent} pl-8`}>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className={`text-6xl lg:text-8xl font-extralight tracking-tight ${currentShowcase.titleColor}`}>{currentShowcase.title}</motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className={`text-xl lg:text-2xl mt-6 font-light ${currentShowcase.subtitleColor}`}>{currentShowcase.subtitle}</motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="mt-10 flex gap-4 justify-center">
                <Link to={currentShowcase.link} className={`px-10 py-4 font-medium transition-all ${currentShowcase.ctaStyle}`}>{currentShowcase.cta}</Link>
                <Link to={currentShowcase.linkSecondary} className={`px-10 py-4 font-medium transition-all ${currentShowcase.ctaSecondaryStyle}`}>{currentShowcase.ctaSecondary}</Link>
              </motion.div>
            </div>
          </div>
        );

      case "harvard":
        return (
          <div className={`absolute inset-0 ${currentShowcase.gradient} rounded-2xl overflow-hidden`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 lg:p-12">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="mb-6">
                <span className="text-[#A51C30] text-sm font-semibold tracking-[0.3em] uppercase">Harvard Capstone</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className={`text-5xl lg:text-7xl font-bold tracking-tight ${currentShowcase.titleColor}`}>{currentShowcase.title}</motion.h1>
              <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className={`text-2xl lg:text-3xl mt-4 font-semibold ${currentShowcase.subtitleColor}`}>{currentShowcase.subtitle}</motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }} className="mt-10 flex gap-4">
                <Link to={currentShowcase.link} className={`px-8 py-4 rounded-xl font-semibold transition-all shadow-lg ${currentShowcase.ctaStyle}`}>{currentShowcase.cta}</Link>
                <Link to={currentShowcase.linkSecondary} className={`px-8 py-4 rounded-xl font-semibold transition-all ${currentShowcase.ctaSecondaryStyle}`}>{currentShowcase.ctaSecondary}</Link>
              </motion.div>
            </div>
          </div>
        );

      case "saas":
        return (
          <div className={`absolute inset-0 ${currentShowcase.gradient} rounded-2xl overflow-hidden`}>
            {currentShowcase.decorations && (
              <>
                <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                <div className="absolute bottom-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-lg rotate-45 blur-lg" />
              </>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 lg:p-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="mb-4">
                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                  <Sparkles className="w-4 h-4" />
                  New Protocol
                </span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className={`text-4xl lg:text-6xl font-bold tracking-tight ${currentShowcase.titleColor}`}>{currentShowcase.title}</motion.h1>
              <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className={`text-lg lg:text-xl mt-4 max-w-md ${currentShowcase.subtitleColor}`}>{currentShowcase.subtitle}</motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }} className="mt-10 flex gap-4">
                <Link to={currentShowcase.link} className={`px-8 py-4 rounded-xl font-semibold transition-all shadow-lg ${currentShowcase.ctaStyle}`}>{currentShowcase.cta}</Link>
                <Link to={currentShowcase.linkSecondary} className={`px-8 py-4 rounded-xl font-semibold transition-all ${currentShowcase.ctaSecondaryStyle}`}>{currentShowcase.ctaSecondary}</Link>
              </motion.div>
            </div>
          </div>
        );

      case "creator":
        return (
          <div className={`absolute inset-0 ${currentShowcase.gradient} rounded-2xl overflow-hidden`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 lg:p-12">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="mb-6">
                <img src={currentShowcase.image} alt="Bradley Ross" className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover shadow-2xl border-4 border-white" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className={`text-5xl lg:text-7xl font-bold tracking-tight ${currentShowcase.titleColor}`}>{currentShowcase.title}</motion.h1>
              <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className={`text-2xl lg:text-3xl mt-2 font-semibold ${currentShowcase.subtitleColor}`}>{currentShowcase.subtitle}</motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }} className="mt-10 flex gap-4">
                <Link to={currentShowcase.link} className={`px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl ${currentShowcase.ctaStyle}`}>{currentShowcase.cta}</Link>
                <Link to={currentShowcase.linkSecondary} className={`px-8 py-4 rounded-xl font-semibold transition-all ${currentShowcase.ctaSecondaryStyle}`}>{currentShowcase.ctaSecondary}</Link>
              </motion.div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white" role="main">
      <MarketingNav />

      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
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

      {/* CHAT DEMO — split panel with start button */}
      <section className="py-20 bg-[#0b0f1a]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
            <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-4">See It In Action</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Watch the builder <span className="text-indigo-400">respond.</span>
            </h2>
          </motion.div>

          <div className="w-full max-w-[1100px] mx-auto h-[600px] md:h-[550px] flex flex-col md:flex-row rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0b0f1a]">
            {/* Left — Chat */}
            <div className="w-full md:w-[45%] flex flex-col flex-1 md:flex-none bg-[#111827]/50 min-h-0">
              <div className="p-5 border-b border-white/10 bg-[#0b0f1a]/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#A51C30] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-white">Hey Bradley</span>
                      <p className="text-xs text-white/50">Chat Demo</p>
                    </div>
                  </div>
                  {isRunning && (
                    <button type="button" onClick={resetAnimation} className="p-2 rounded-full text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors" title="Restart">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div ref={chatContainerRef} className="flex-1 p-5 overflow-y-auto relative">
                {!isRunning && displayedMessages.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <p className="text-neutral-500 text-sm mb-6 max-w-xs">
                      Watch a conversation with Hey Bradley. Each message triggers a new visual design on the right.
                    </p>
                    <button
                      type="button"
                      onClick={startAnimation}
                      className="px-10 py-5 rounded-2xl font-bold text-xl bg-[#A51C30] text-white hover:bg-[#8B1729] transition-all shadow-lg hover:shadow-2xl hover:scale-105 transform"
                    >
                      Start Demo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayedMessages.map((message, index) => (
                      <motion.div
                        key={`${animationKey}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[90%] rounded-2xl px-4 py-3 ${message.type === "user" ? "bg-[#2563EB] text-white rounded-tr-sm" : "bg-[#1a1f2e] border border-white/10 rounded-tl-sm"}`}>
                          <p className={`leading-relaxed ${message.type === "user" ? "text-base font-medium" : "text-base text-white/90"}`}>
                            {message.text}
                            {index === displayedMessages.length - 1 && !message.isComplete && (
                              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className={`inline-block w-0.5 h-4 ml-1 align-middle ${message.type === "user" ? "bg-white" : "bg-[#A51C30]"}`} />
                            )}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    <div />
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10 bg-[#0b0f1a]/80">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5 border border-white/10">
                  <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-white/30" disabled />
                  <button className="p-1.5 rounded-full text-white/30" disabled><Send className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Right — Showcase */}
            <div className="flex-1 relative overflow-hidden bg-black/20 p-4 hidden md:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${animationKey}-${currentShowcaseIndex}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-4"
                >
                  {renderHeroShowcase()}
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                <button onClick={() => setCurrentShowcaseIndex(-1)} aria-label="Intro" className={`w-2 h-2 rounded-full transition-all duration-300 ${currentShowcaseIndex === -1 ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"}`} />
                {HERO_SHOWCASES.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentShowcaseIndex(idx)} aria-label={HERO_SHOWCASES[idx].title} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentShowcaseIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"}`} />
                ))}
              </div>
            </div>
          </div>
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

      {/* THREE MODES */}
      <section className="py-24 bg-[#111827]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-4">Three Ways to Build</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Listen. Chat. Build.
            </h2>
          </motion.div>

          {/* Listen Mode — hero treatment with pulsing red glow */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#A51C30]/20 via-[#111827] to-[#A51C30]/10" />
            {/* Pulsing red glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#A51C30]/15 blur-[100px] animate-pulse" />
            <div className="relative grid md:grid-cols-2 gap-8 p-10 lg:p-14 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#A51C30]/20 border border-[#A51C30]/40 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-[#A51C30]" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-white">Listen Mode</span>
                    <span className="block text-xs text-[#A51C30] font-medium uppercase tracking-wider">Unique to Hey Bradley</span>
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                  The whiteboard that writes<br />your specs in real time.
                </h3>
                <p className="text-neutral-400 leading-relaxed mb-4">
                  Start talking with your team. Hey Bradley listens and builds while you discuss.
                  A website takes shape as you describe it&mdash;no typing, no clicks, just conversation.
                  Enterprise-grade AISP specifications generate automatically in both machine-readable
                  and human-readable formats.
                </p>
                <p className="text-neutral-500 text-sm italic">
                  The meeting is the sprint. The whiteboard is the specification.
                </p>
              </div>
              <div className="relative">
                <img src="/previews/theme-startup.png" alt="Listen mode building a website in real time" className="rounded-xl border border-white/10 shadow-2xl w-full" />
                {/* Pulsing recording indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#A51C30] animate-pulse" />
                  <span className="text-xs text-white/80 font-medium">Listening...</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat + Builder modes side by side */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="relative">
                <img src="/previews/theme-saas.png" alt="Chat mode building a SaaS website" className="w-full border-b border-white/10" />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="text-lg font-bold text-white">Chat Mode</span>
                </div>
                <p className="text-neutral-400 leading-relaxed text-sm mb-3">
                  Explain your ideas in natural language. AISP agents handle intent decomposition
                  and translation&mdash;breaking your description into design decisions and
                  specifications automatically. The AI understands what you mean, not just what you say.
                </p>
                <p className="text-neutral-500 text-xs">
                  Powered by AISP intent and decomposition agents for precise translation.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="relative">
                <img src="/previews/theme-creative.png" alt="Builder mode with fine-tuning controls" className="w-full border-b border-white/10" />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-lg font-bold text-white">Builder Mode</span>
                </div>
                <p className="text-neutral-400 leading-relaxed text-sm mb-3">
                  Fine-tune every detail directly. Themes, layouts, image effects, typography,
                  colors&mdash;full visual control with no LLM required. Every change you make
                  generates specifications in real time. What you see is exactly what gets spec&rsquo;d.
                </p>
                <p className="text-neutral-500 text-xs">
                  No AI calls needed. 12 themes, 13 image effects, 300+ curated images.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* THE INNOVATION — storytelling, no raw code */}
      <section className="py-24 bg-[#0b0f1a]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
            <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-4">The Innovation</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Why &ldquo;make it pop&rdquo; means
              <br />something different to <span className="text-purple-400">everyone.</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p className="text-lg text-neutral-300 leading-relaxed mb-6">
                The telephone game persists because human language is inherently ambiguous.
                &ldquo;Add a form&rdquo; means something different to every developer who reads it.
                Traditional specs&mdash;Jira tickets, Google Docs, even Figma annotations&mdash;still
                leave 40&ndash;65% of implementation decisions to interpretation.
              </p>
              <p className="text-lg text-neutral-300 leading-relaxed mb-6">
                AISP (AI Symbolic Protocol) is a math-first symbolic language with 512 symbols that
                all AI architectures understand natively. Every design decision is encoded with
                five formal components: what to build, what shape it takes, what constraints apply,
                what values to use, and how to verify it works. <strong className="text-white">Nothing
                left to interpret.</strong>
              </p>
              <p className="text-neutral-400 leading-relaxed mb-8">
                The result: specification ambiguity drops from the industry baseline of 40&ndash;65%
                to under 2%. Any AI coding tool&mdash;Claude Code, Cursor, Codex&mdash;executes
                the same Crystal Atom and produces the same result. The premium is in the
                blueprint, not the compiler.
              </p>
              <Link to="/open-core" className="inline-flex items-center gap-2 text-purple-400 font-medium hover:text-purple-300 transition-colors">
                See how it works in practice <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
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

      {/* USE CASES — with images */}
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
              { title: "The bakery owner", quote: "I didn't need to explain it. I could just show it.", desc: "Warm colors, photos of pastries, online ordering. Five minutes later she is looking at the website she imagined for three years.", image: "/previews/example-bakery.png" },
              { title: "The photographer", quote: "My portfolio finally looks the way I shoot.", desc: "Full-bleed images, minimal chrome, gallery effects. The website matches the visual standard of the work itself.", image: "/previews/example-photography.png" },
              { title: "The startup team", quote: "The whiteboard finally builds what we drew.", desc: "Five stakeholders on Zoom. The prototype builds while they argue. When the call ends, the specs already exist. One PR. Done before lunch.", image: "/previews/example-launchpad.png" },
              { title: "The consulting firm", quote: "Everyone is finally building the same thing.", desc: "Professional credibility in minutes. Typed specifications, versioned, auditable. When compliance asks 'why was this built?' — the spec is the audit trail.", image: "/previews/example-consulting.png" },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                <img src={card.image} alt={card.title} className="w-full h-40 object-cover object-top border-b border-white/10" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-3">{card.desc}</p>
                  <div className="flex items-start gap-2 text-amber-400/80 text-sm italic">
                    <Quote className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{card.quote}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THEME SHOWCASE */}
      <section className="py-24 bg-[#0b0f1a]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-sm font-semibold text-pink-400 uppercase tracking-widest mb-4">12 Themes, 300+ Images</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Start with a vision. Not a blank page.
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["agency", "portfolio", "saas", "wellness", "minimalist", "creative", "startup", "professional"].map((theme, i) => (
              <motion.div
                key={theme}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="relative group rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors"
              >
                <img src={`/previews/theme-${theme}.png`} alt={`${theme} theme`} className="w-full aspect-[4/3] object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-3 text-xs font-medium text-white/80 capitalize">{theme}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN SOURCE */}
      <section className="py-24 bg-[#111827]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-4">Open Source</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Two open projects. One methodology.
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
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
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">Visual builder that generates AISP specs from human interactions. React + TypeScript + Tailwind. 12 themes, 300+ images, 6 spec generators. MIT license.</p>
              <span className="text-cyan-400 text-sm font-medium">github.com/bar181/hey-bradley-core &rarr;</span>
            </motion.a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-b from-[#0b0f1a] to-[#111827]">
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
