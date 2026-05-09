/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { Github, Linkedin, Mail, ExternalLink, ChevronRight, Terminal, Cpu, Code2, X, Command, Sun, Moon, Instagram } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const TerminalOverlay = ({ onClose }: { onClose: () => void }) => {
  const [lines, setLines] = useState<string[]>(["Initializing yulius-sys v1.0.4...", "Loading kernel modules...", "System ready."]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  const commands: Record<string, string> = {
    help: "Available: about, skills, projects, whoami, clear, exit",
    about: "Yulius Restu Putranto | 2nd Year SE Student @ ITS | Focused on Systems Programming.",
    skills: "C, C++, Python, Bash, Git, Linux (Kernel/CLI)",
    projects: "1. Data Structs Lib, 2. OS Lab",
    socials: "GitHub: @yulius, LinkedIn: @yulius, Instagram: @yulius",
    whoami: "User: Guest | Privileges: Read-Only | Host: yulius-sys",
    exit: "Closing session..."
  };

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const cmd = inputValue.toLowerCase().trim();
      if (cmd === "exit") {
        onClose();
        return;
      }
      if (cmd === "clear") {
        setLines([]);
      } else {
        setLines([...lines, `> ${cmd}`, commands[cmd] || `Command not found: ${cmd}. Type 'help' for options.`]);
      }
      setInputValue("");
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="terminal-container"
    >
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-neutral-500">yulius@its:~</span>
        <button onClick={onClose} className="hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1 mb-4 custom-scrollbar">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-4">
            <span className="text-neutral-600">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
            <span className={line.startsWith(">") ? "text-white" : "text-neutral-400"}>{line}</span>
          </div>
        ))}
        <div className="flex gap-4 items-center">
          <span className="text-emerald-500 font-bold">$</span>
          <input 
            ref={inputRef}
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleCommand}
            className="bg-transparent border-none outline-none flex-1 text-white"
            autoFocus
          />
        </div>
      </div>
      <div className="text-[10px] text-neutral-600 uppercase tracking-widest">
        Type 'help' to explore or 'exit' to return to GUI
      </div>
    </motion.div>
  );
};

export default function App() {
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const variants = {
    default: {
      x: mousePos.x - 16,
      y: mousePos.y - 16,
      transition: { type: "spring", stiffness: 500, damping: 28 }
    },
    hover: {
      height: 64,
      width: 64,
      x: mousePos.x - 32,
      y: mousePos.y - 32,
      backgroundColor: "white",
      transition: { type: "spring", stiffness: 500, damping: 28 }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    setTimeout(() => setFormStatus("sent"), 1500);
  };

  const projects = [
    {
      title: "Data Structures Library",
      category: "System Programming",
      description: "Implementation of complex trees, graphs, and search algorithms in C++ for performance benchmarking.",
      icon: <Cpu className="w-5 h-5" />,
      tags: ["C", "C++", "Algorithms"]
    },
    {
      title: "Operating Systems Lab",
      category: "Kernel & Systems",
      description: "Kernel-level process management and thread synchronization modules developed for OS coursework at ITS.",
      icon: <Code2 className="w-5 h-5" />,
      tags: ["C", "Linux", "POSIX"]
    }
  ];

  const skills = ["C", "C++", "Python", "Bash", "Git", "Linux"];

  return (
    <div className="min-h-screen selection:bg-brand-primary selection:text-brand-bg p-8 md:p-16 flex flex-col gap-16 md:gap-24 relative overflow-x-hidden">
      {/* Interactive Elements */}
      <motion.div 
        className="custom-cursor" 
        variants={variants} 
        animate={cursorVariant} 
      />
      <motion.div className="scroll-progress" style={{ scaleX }} />
      
      <AnimatePresence>
        {isTerminalOpen && <TerminalOverlay onClose={() => setIsTerminalOpen(false)} />}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 md:px-16 py-8 flex justify-between items-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-primary pointer-events-auto"
          onMouseEnter={() => setCursorVariant("hover")}
          onMouseLeave={() => setCursorVariant("default")}
        >
          Yulius / ITS
        </motion.div>
        <div className="flex gap-4 pointer-events-auto items-center">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full border border-brand-border hover:border-brand-primary transition-colors group"
            onMouseEnter={() => setCursorVariant("hover")}
            onMouseLeave={() => setCursorVariant("default")}
            title="Toggle Theme"
          >
            {theme === "light" ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setIsTerminalOpen(true)}
            className="p-2 rounded-full border border-brand-border hover:border-brand-primary transition-colors group"
            onMouseEnter={() => setCursorVariant("hover")}
            onMouseLeave={() => setCursorVariant("default")}
            title="Open Interactive Terminal"
          >
            <Command className="w-3 h-3 group-hover:scale-110 transition-transform" />
          </button>
          <div className="flex gap-8 ml-4">
            {["Projects", "Contact"].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[10px] uppercase tracking-[0.15em] font-medium opacity-40 hover:opacity-100 transition-opacity text-brand-primary"
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl w-full mx-auto pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-[12vw] sm:text-[80px] font-extrabold tracking-[-0.05em] leading-[0.9] text-brand-primary m-0 break-words"
            onMouseEnter={() => setCursorVariant("hover")}
            onMouseLeave={() => setCursorVariant("default")}
          >
            YULIUS RESTU PUTRANTO<span className="text-brand-primary/10">.</span>
          </motion.h1>
          <p className="text-xl md:text-[20px] font-extralight text-brand-text-dim mt-4 tracking-wide max-w-xl">
            Software Engineering Student & System Programmer
          </p>
          <div className="flex gap-6 mt-12">
            <motion.a 
              href="#projects"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="minimal-button"
              onMouseEnter={() => setCursorVariant("hover")}
              onMouseLeave={() => setCursorVariant("default")}
            >
              View Works
            </motion.a>
          </div>
        </motion.div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-6xl w-full mx-auto grid lg:grid-cols-[300px_1fr] gap-16 lg:gap-24 items-start">
        {/* Sidebar */}
        <aside className="flex flex-col gap-12 sticky top-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-label">Background</div>
            <p className="text-[15px] text-brand-text-dim leading-relaxed font-light">
              Semester 2 student at <span className="text-brand-primary font-medium border-b border-brand-border">Institut Teknologi Sepuluh Nopember (ITS)</span>. 
              Focused on high-performance computing, kernel development, and the Linux ecosystem.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="section-label">Expertise</div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <motion.span 
                  key={skill} 
                  className="skill-pill cursor-crosshair hover:bg-brand-primary hover:text-brand-bg hover:border-brand-primary"
                  whileHover={{ y: -5 }}
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="section-label">Location</div>
            <p className="text-[13px] text-brand-text-dim">Surabaya, Indonesia</p>
          </motion.div>
        </aside>

        {/* Selected Works Grid */}
        <section id="projects" className="flex flex-col gap-8">
          <div className="section-label">Selected Works</div>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            {projects.map((project, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="project-card group cursor-pointer relative overflow-hidden"
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-brand-primary/20 p-2 border border-brand-border rounded group-hover:text-brand-primary group-hover:border-brand-primary/20 transition-all">
                    {project.icon}
                  </div>
                  <ExternalLink className="w-4 h-4 text-brand-primary/10 group-hover:text-brand-primary transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-brand-primary mb-2 group-hover:translate-x-2 transition-transform duration-500">{project.title}</h3>
                <p className="text-[13px] text-brand-text-dim font-light mb-6 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex gap-4 opacity-30 group-hover:opacity-100 transition-all group-hover:translate-x-2 duration-500 text-brand-primary">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-mono tracking-tighter">{tag}</span>
                  ))}
                </div>
                
                {/* Visual accent */}
                <div className="absolute top-0 right-0 w-[1px] h-0 bg-brand-primary/10 group-hover:h-full transition-all duration-1000" />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      {/* Contact Section */}
      <section id="contact" className="max-w-6xl w-full mx-auto py-16 border-t border-brand-border">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          <motion.div {...fadeInUp}>
            <div className="section-label">Get in touch</div>
            <div className="flex flex-col gap-6 mt-4">
              <a 
                href="mailto:5025251042@student.its.ac.id" 
                className="text-xl font-light text-brand-text-dim hover:text-brand-primary transition-colors"
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                5025251042@student.its.ac.id
              </a>
              <div className="flex gap-8">
                <a 
                  href="#" 
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-text-dim hover:text-brand-primary transition-colors"
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a 
                  href="#" 
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-text-dim hover:text-brand-primary transition-colors"
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
                <a 
                  href="#" 
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-text-dim hover:text-brand-primary transition-colors"
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <div className="section-label">Message</div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Name" 
                required
                className="w-full bg-brand-primary/[0.02] border border-brand-border p-4 text-sm focus:outline-none focus:border-brand-primary/30 transition-colors placeholder:text-neutral-400 font-light rounded text-brand-primary"
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
              />
              <textarea 
                placeholder="Message" 
                rows={4}
                required
                className="w-full bg-brand-primary/[0.02] border border-brand-border p-4 text-sm focus:outline-none focus:border-brand-primary/30 transition-colors placeholder:text-neutral-400 font-light resize-none rounded text-brand-primary"
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
              />
              <button 
                type="submit" 
                disabled={formStatus !== "idle"}
                className={`minimal-button w-full ${formStatus === "sent" ? "bg-brand-primary text-brand-bg transition-colors" : ""}`}
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                {formStatus === "idle" && "Send Transmission"}
                {formStatus === "sending" && "Sending..."}
                {formStatus === "sent" && "Sent Successfully"}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <footer className="max-w-6xl w-full mx-auto pt-8 pb-16 flex justify-between items-center opacity-20 text-[10px] uppercase tracking-widest font-mono border-t border-brand-border text-brand-primary">
        <span>Built with precision &bull; 2024</span>
        <span>Yulius Restu Putranto ITS</span>
      </footer>
    </div>
  );
}
