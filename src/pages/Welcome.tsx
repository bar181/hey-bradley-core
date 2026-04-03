import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Send, RotateCcw } from "lucide-react";
import bradPixar from "@/assets/bradley/brad_pixar.webp";

const INITIAL_SHOWCASE = {
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
  ctaSecondaryStyle: "bg-transparent border border-white/30 text-white hover:bg-white/10"
};

const CONVERSATION = [
  {
    type: "user",
    text: "Hey Bradley! Let's create a website that is beautiful, intuitive, and captures attention.",
    triggerShowcase: null
  },
  {
    type: "ai",
    text: "Great choice! Here's a beautiful full-screen design that really pops...",
    triggerShowcase: 0
  },
  {
    type: "user",
    text: "That's amazing! Can we try something more minimal and refined?",
    triggerShowcase: null
  },
  {
    type: "ai",
    text: "Of course! Here's a nice clean layout with plenty of breathing room...",
    triggerShowcase: 1
  },
  {
    type: "user",
    text: "This is for an academic research project at Harvard.",
    triggerShowcase: null
  },
  {
    type: "ai",
    text: "Love it! Here's a polished academic look with Harvard's classic colors...",
    triggerShowcase: 2
  },
  {
    type: "user",
    text: "Can you show me something more modern and tech-forward?",
    triggerShowcase: null
  },
  {
    type: "ai",
    text: "You got it! Here's a sleek, modern look with bold colors and sharp text...",
    triggerShowcase: 3
  },
  {
    type: "user",
    text: "I'd love to see the creator's personal touch.",
    triggerShowcase: null
  },
  {
    type: "ai",
    text: "Here's the person behind it all. Ready to build something together?",
    triggerShowcase: 4
  }
];

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
    ctaSecondaryStyle: "bg-transparent border border-white/50 text-white hover:bg-white/10"
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
    accent: "border-l-4 border-neutral-900"
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
    ctaSecondaryStyle: "bg-transparent border border-[#A51C30]/50 text-[#A51C30] hover:bg-[#A51C30]/10"
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
    decorations: true
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
    image: bradPixar
  }
];

export function Welcome() {
  const [displayedMessages, setDisplayedMessages] = useState<Array<{type: string, text: string, isComplete: boolean}>>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentShowcaseIndex, setCurrentShowcaseIndex] = useState(-1);
  const [animationKey, setAnimationKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayedMessages]);

  useEffect(() => {
    if (currentMessageIndex >= CONVERSATION.length) return;

    const currentMessage = CONVERSATION[currentMessageIndex];

    if (currentCharIndex < currentMessage.text.length) {
      const timeout = setTimeout(() => {
        setDisplayedMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length <= currentMessageIndex) {
            if (currentMessage.triggerShowcase !== null) {
              setCurrentShowcaseIndex(currentMessage.triggerShowcase);
            }
            newMessages.push({
              type: currentMessage.type,
              text: currentMessage.text.charAt(0),
              isComplete: false
            });
          } else {
            newMessages[currentMessageIndex] = {
              ...newMessages[currentMessageIndex],
              text: currentMessage.text.substring(0, currentCharIndex + 1)
            };
          }
          return newMessages;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, currentMessage.type === "user" ? 30 : 25);
      return () => clearTimeout(timeout);
    } else {
      setDisplayedMessages(prev => {
        const newMessages = [...prev];
        if (newMessages[currentMessageIndex]) {
          newMessages[currentMessageIndex].isComplete = true;
        }
        return newMessages;
      });

      const timeout = setTimeout(() => {
        setCurrentMessageIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, currentMessage.type === "user" ? 800 : 1500);
      return () => clearTimeout(timeout);
    }
  }, [currentMessageIndex, currentCharIndex, animationKey]);

  const resetAnimation = () => {
    setDisplayedMessages([]);
    setCurrentMessageIndex(0);
    setCurrentCharIndex(0);
    setCurrentShowcaseIndex(-1);
    setAnimationKey(prev => prev + 1);
  };

  const isTypingComplete = currentMessageIndex >= CONVERSATION.length;
  const currentShowcase: HeroShowcase = currentShowcaseIndex === -1
    ? INITIAL_SHOWCASE as HeroShowcase
    : HERO_SHOWCASES[currentShowcaseIndex];

  const renderHeroShowcase = () => {
    if (currentShowcaseIndex === -1) {
      return (
        <div className={`absolute inset-0 ${INITIAL_SHOWCASE.gradient} rounded-2xl overflow-hidden`}>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-4"
            >
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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-4 text-sm text-neutral-500 max-w-md"
            >
              No coding needed. No design skills required.
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-10 flex gap-4"
            >
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
            <img
              src={currentShowcase.backgroundImage}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 ${currentShowcase.overlay}`} />
            <div className="absolute inset-0 flex flex-col items-start justify-center p-12 lg:p-16">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className={`text-5xl lg:text-7xl font-bold tracking-tight ${currentShowcase.titleColor}`}
              >
                {currentShowcase.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className={`text-xl lg:text-2xl mt-4 max-w-md ${currentShowcase.subtitleColor}`}
              >
                {currentShowcase.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mt-8 flex gap-4"
              >
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
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className={`text-6xl lg:text-8xl font-extralight tracking-tight ${currentShowcase.titleColor}`}
              >
                {currentShowcase.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className={`text-xl lg:text-2xl mt-6 font-light ${currentShowcase.subtitleColor}`}
              >
                {currentShowcase.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mt-10 flex gap-4 justify-center"
              >
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
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-6"
              >
                <span className="text-[#A51C30] text-sm font-semibold tracking-[0.3em] uppercase">Harvard Capstone</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className={`text-5xl lg:text-7xl font-bold tracking-tight ${currentShowcase.titleColor}`}
              >
                {currentShowcase.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className={`text-xl lg:text-2xl mt-4 font-medium ${currentShowcase.subtitleColor}`}
              >
                {currentShowcase.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-10 flex gap-4"
              >
                <Link to={currentShowcase.link} className={`px-8 py-4 rounded-sm font-semibold transition-all shadow-lg ${currentShowcase.ctaStyle}`}>{currentShowcase.cta}</Link>
                <Link to={currentShowcase.linkSecondary} className={`px-8 py-4 rounded-sm font-semibold transition-all ${currentShowcase.ctaSecondaryStyle}`}>{currentShowcase.ctaSecondary}</Link>
              </motion.div>
            </div>
          </div>
        );

      case "saas":
        return (
          <div className={`absolute inset-0 ${currentShowcase.gradient} rounded-2xl overflow-hidden`}>
            <div className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 lg:p-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-4"
              >
                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                  <Sparkles className="w-4 h-4" />
                  New Protocol
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className={`text-4xl lg:text-6xl font-bold tracking-tight ${currentShowcase.titleColor}`}
              >
                {currentShowcase.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className={`text-lg lg:text-xl mt-4 max-w-md ${currentShowcase.subtitleColor}`}
              >
                {currentShowcase.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-10 flex gap-4"
              >
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
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-6"
              >
                <img
                  src={currentShowcase.image}
                  alt="Bradley Ross"
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover shadow-2xl border-4 border-white"
                />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className={`text-5xl lg:text-7xl font-bold tracking-tight ${currentShowcase.titleColor}`}
              >
                {currentShowcase.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className={`text-2xl lg:text-3xl mt-2 font-semibold ${currentShowcase.subtitleColor}`}
              >
                {currentShowcase.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-10 flex gap-4"
              >
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
    <main className="min-h-screen bg-[#0b0f1a] flex items-center justify-center p-4 lg:p-6" role="main">
      <div className="w-full max-w-[1200px] min-h-[calc(100vh-48px)] md:h-[calc(100vh-48px)] flex flex-col md:flex-row rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0b0f1a]">
        {/* Left Panel - Chat */}
        <div className="w-full md:w-[45%] flex flex-col flex-1 md:flex-none bg-[#111827]/50 min-h-0">
          {/* Chat Header */}
          <div className="p-6 border-b border-white/10 bg-[#0b0f1a]/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#A51C30] flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-white text-xl">Hey Bradley</span>
                  <p className="text-sm text-white/50">Your AI Website Builder</p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetAnimation}
                className="p-2 rounded-full text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors"
                title="Restart animation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {displayedMessages.map((message, index) => (
                <motion.div
                  key={`${animationKey}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-5 py-4 ${
                      message.type === "user"
                        ? "bg-[#2563EB] text-white rounded-tr-sm"
                        : "bg-[#1a1f2e] border border-white/10 shadow-sm rounded-tl-sm"
                    }`}
                  >
                    <p className={`leading-relaxed ${
                      message.type === "user"
                        ? "text-lg lg:text-xl font-medium"
                        : "text-lg lg:text-xl text-white/90"
                    }`}>
                      {message.text}
                      {index === displayedMessages.length - 1 && !message.isComplete && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className={`inline-block w-0.5 h-5 ml-1 align-middle ${
                            message.type === "user" ? "bg-white" : "bg-[#A51C30]"
                          }`}
                        />
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input Area */}
          <div className="p-5 border-t border-white/10 bg-[#0b0f1a]/80 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-lg outline-none text-white placeholder:text-white/30"
                  disabled
                />
                <button className="p-2 rounded-full text-white/30" disabled>
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <Link to="/new-project" className="w-full flex items-center justify-center gap-2 text-lg font-bold h-14 rounded-xl shadow-lg transition-all bg-[#6366F1] text-white hover:bg-[#5558E6] hover:shadow-xl mt-2">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Panel - Hero Showcases */}
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

          {/* Showcase indicator dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            <button
              onClick={() => setCurrentShowcaseIndex(-1)}
              aria-label="Show intro showcase"
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentShowcaseIndex === -1
                  ? "bg-white w-8 shadow-lg"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
            {HERO_SHOWCASES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentShowcaseIndex(idx)}
                aria-label={`Show ${HERO_SHOWCASES[idx].title} showcase`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentShowcaseIndex
                    ? "bg-white w-8 shadow-lg"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
