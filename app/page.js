"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const easeExpo = [0.16, 1, 0.3, 1];

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeExpo }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const staggerViewContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

// ─────────────────────────────────────
// Navbar Component
// ─────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: easeExpo }}
        className={`navbar ${scrolled ? "scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="logo">
          Lucas<span className="logo-dot">.</span>
        </div>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#test-our-workflow">Test Our Workflow</a>
          <a href="#projects">Projects</a>
          <Link href="/get-started" className="magnetic-btn btn-primary">
            Get Started
          </Link>
        </div>
        <button
          className="mobile-menu-btn"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={menuOpen ? "ph ph-x" : "ph ph-list"} aria-hidden="true" />
        </button>
      </motion.nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          <a href="#services" className="mobile-link" onClick={closeMenu}>Services</a>
          <a href="#test-our-workflow" className="mobile-link" onClick={closeMenu}>Test Our Workflow</a>
          <a href="#projects" className="mobile-link" onClick={closeMenu}>Projects</a>
          <Link href="/get-started" className="magnetic-btn btn-primary btn-block" onClick={closeMenu}>
            Get Started
          </Link>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────
// Hero Component
// ─────────────────────────────────────
function Hero() {
  const [greeting, setGreeting] = useState("Automation Agency");
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Cinematic Parallax Transforms with strict clamping to prevent negative CSS values causing browser black screen glitches
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2], { clamp: true });
  const videoOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2], { clamp: true });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -200], { clamp: true });
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0], { clamp: true });

  useEffect(() => {
    const hour = new Date().getHours();
    const text = hour < 12 ? "Good morning. Let's automate." : hour < 18 ? "Good afternoon. Let's automate." : "Good evening. Let's automate.";
    const timer = setTimeout(() => {
      setGreeting(text);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="hero" ref={heroRef}>
      <motion.video
        style={{ scale: videoScale, opacity: videoOpacity }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: easeExpo }}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/og-image.png"
        aria-label="Background video showcasing automation workflows"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4"
          type="video/mp4"
        />
      </motion.video>
      <div className="hero-overlay" />
      <motion.div
        className="hero-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ y: textY, opacity: textOpacity }}
      >
        <motion.p variants={fadeUpVariant} className="hero-label">
          <span className="hero-pulse-dot" /> {greeting}
        </motion.p>
        <motion.h1 variants={fadeUpVariant} className="hero-title">
          We handle your busywork.<br />We put your business<br />on autopilot.
        </motion.h1>
        <motion.p variants={fadeUpVariant} className="hero-subtitle">
          Stop wasting hours on boring, repetitive tasks. We connect your daily apps and
          build simple setups that do the manual work for you—automatically, 24/7.
        </motion.p>
        <motion.div variants={fadeUpVariant} className="hero-ctas">
          <Link href="/get-started" className="magnetic-btn btn-hero-primary btn-large">
            Start Saving Time <i className="ph ph-arrow-right" aria-hidden="true" />
          </Link>
          <motion.a href="#projects" className="magnetic-btn btn-hero-ghost btn-large" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            See Examples <i className="ph ph-eye" aria-hidden="true" />
          </motion.a>
        </motion.div>
        <motion.div variants={fadeUpVariant} className="hero-proof">
          <div className="proof-item">
            <span className="proof-number">100+</span>
            <span className="proof-label">Hours saved monthly</span>
          </div>
          <div className="proof-divider" />
          <div className="proof-item">
            <span className="proof-number">24/7</span>
            <span className="proof-label">Always running for you</span>
          </div>
          <div className="proof-divider" />
          <div className="proof-item">
            <span className="proof-number">100%</span>
            <span className="proof-label">No technical skills needed</span>
          </div>
        </motion.div>
      </motion.div>
    </header>
  );
}

// ─────────────────────────────────────
// Services Component
// ─────────────────────────────────────
const services = [
  {
    num: "01",
    title: "Connect Your Apps",
    desc: "Make your software talk to move files, emails, and data automatically.",
    benefits: ["Saves 10 to 20 hours a week", "Works with all your everyday apps", "Runs quietly in the background 24/7"]
  },
  {
    num: "02",
    title: "Custom Work Portals",
    desc: "Simple, private screens to manage jobs, clients, or orders without clutter.",
    benefits: ["No monthly fees per employee", "Only the buttons you actually need", "Fits how your team already works"]
  },
  {
    num: "03",
    title: "Smart Customer Follow-Ups",
    desc: "Text or email new clients the second they contact you. Stop losing sales.",
    benefits: ["Replies to inquiries in seconds", "Instant phone text notifications", "Spots your most interested buyers"]
  },
  {
    num: "04",
    title: "All-in-One Business Screen",
    desc: "See daily sales, active jobs, and progress in one simple screen. No math.",
    benefits: ["See your daily sales in real-time", "Ditch messy spreadsheets forever", "Know exactly where you make money"]
  },
];

function Services() {
  return (
    <section id="services" className="section section-services-redesign">
      <div className="container services-grid-layout">
        {/* Sticky Left Column */}
        <div className="services-left-col">
          <motion.div
            className="services-sticky-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
          >
            <span className="services-section-tag">SERVICES</span>
            <h2 className="section-title">What we build for you</h2>
            <p className="section-desc">
              We build simple, automated setups and screens that do the boring work for you.
            </p>
          </motion.div>
        </div>

        {/* Detailed Services Right Column */}
        <div className="services-right-col">
          <motion.div
            className="services-list"
            variants={staggerViewContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {services.map((s) => (
              <motion.div
                variants={fadeUpVariant}
                className="service-row"
                key={s.num}
              >
                <div className="service-num">{s.num}</div>
                <div className="service-content">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>

                  {/* Inline Value-Driven Benefit Tags */}
                  <div className="service-benefits-wrap">
                    {s.benefits.map((benefit, idx) => (
                      <span className="service-benefit-tag" key={idx}>
                        <i className="ph ph-sparkle benefit-icon" aria-hidden="true" />
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="service-arrow">
                  <i className="ph ph-arrow-right" aria-hidden="true" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────
// Automation Sandbox Component
// ─────────────────────────────────────
const triggers = [
  { id: "form", name: "Website Form Filled Out", icon: "ph ph-globe", desc: "A customer completes a form on your site." },
  { id: "call", name: "Incoming Business Call", icon: "ph ph-phone", desc: "A customer dials your business number." },
  { id: "pay", name: "Client Payment Received", icon: "ph ph-wallet", desc: "A customer sends you a direct payment." },
];

const filters = [
  { id: "verify", name: "Check and Sort Details", icon: "ph ph-brain", desc: "Checks if details are correct and filters them." },
  { id: "reply", name: "Draft Custom Reply", icon: "ph ph-sparkle", desc: "Drafts a friendly email response automatically." },
  { id: "route", name: "Send to Right Person", icon: "ph ph-git-fork", desc: "Alerts the correct person on your team." },
];

const actions = [
  { id: "whatsapp", name: "WhatsApp Phone Alert", icon: "ph ph-whatsapp-logo", desc: "Sends a text alert straight to your mobile phone." },
  { id: "sheets", name: "Update Google Sheet", icon: "ph ph-file-xls", desc: "Saves the customer's info in your spreadsheet." },
  { id: "email", name: "Email Custom Summary", icon: "ph ph-envelope", desc: "Emails you a neat summary of the request." },
];

function AutomationSandbox() {
  const [activeTrigger, setActiveTrigger] = useState("form");
  const [activeFilter, setActiveFilter] = useState("verify");
  const [activeAction, setActiveAction] = useState("whatsapp");
  const [simulating, setSimulating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [pulsePosition, setPulsePosition] = useState(0); // 0: Idle, 1: Trigger, 2: Filter, 3: Action, 4: Success

  const timeoutsRef = useRef([]);
  const confettiIntervalRef = useRef(null);

  const selectTrigger = (id) => {
    setActiveTrigger(id);
  };

  const selectFilter = (id) => {
    setActiveFilter(id);
  };

  const selectAction = (id) => {
    setActiveAction(id);
  };

  const handleReset = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
    if (confettiIntervalRef.current) {
      clearInterval(confettiIntervalRef.current);
      confettiIntervalRef.current = null;
    }
    setSimulating(false);
    setShowNotification(false);
    setPulsePosition(0);
  };

  const handleSimulate = () => {
    if (simulating) return;
    setSimulating(true);
    setPulsePosition(1);

    const t1 = setTimeout(() => setPulsePosition(2), 800);
    const t2 = setTimeout(() => setPulsePosition(3), 1600);
    const t3 = setTimeout(async () => {
      setPulsePosition(4);

      // Dynamically load confetti to prevent render-blocking hydration/routing delay
      const confetti = (await import("canvas-confetti")).default;

      // Burst 1: Central explosion
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#1e293b", "#3b82f6", "#8b5cf6", "#ffffff"],
        disableForReducedMotion: true,
      });

      // Continuous cross-fire confetti shower for 2.5 seconds
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1100 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          if (confettiIntervalRef.current === interval) {
            confettiIntervalRef.current = null;
          }
          return clearInterval(interval);
        }

        const particleCount = 45 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
      }, 250);
      confettiIntervalRef.current = interval;

      setShowNotification(true);
    }, 2400);

    const t4 = setTimeout(() => {
      setSimulating(false);
      setPulsePosition(0);
    }, 4500);

    const t5 = setTimeout(() => {
      setShowNotification(false);
    }, 9500);

    timeoutsRef.current = [t1, t2, t3, t4, t5];
  };

  const getFriendlyNotificationText = () => {
    return "Setup Connected! We successfully sent the trigger to your apps instantly.";
  };

  const handleAutomateThisWorkflow = () => {
    const triggerName = triggers.find(t => t.id === activeTrigger)?.name || "Trigger";
    const filterName = filters.find(f => f.id === activeFilter)?.name || "AI Logic";
    const actionName = actions.find(a => a.id === activeAction)?.name || "Action";
    const customText = `Hi Lucas! I tested your sandbox and would love to set up this custom automation: "${triggerName}" ➔ "${filterName}" ➔ "${actionName}" for my business. Let's discuss details!`;

    // Seamless UX redirect to Get Started Wizard pre-populated with sandbox presets
    window.location.href = `/get-started?preset=${encodeURIComponent(customText)}&trigger=${activeTrigger}&action=${activeAction}`;
  };

  return (
    <section id="test-our-workflow" className="section">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
        >
          <h2 className="section-title">Test Our Workflow</h2>
          <p className="section-desc">Design and test a custom automation in real time to see how we streamline operations.</p>
        </motion.div>

        <div className="sandbox-grid">
          <div className="sandbox-controls">
            {/* Control Group 1: Triggers */}
            <div className="control-group active-step">
              <h3 className="control-heading">01. Select a Trigger</h3>
              <div className="options-stack">
                {triggers.map((t) => (
                  <button
                    key={t.id}
                    className={`option-btn ${activeTrigger === t.id ? "selected" : ""}`}
                    onClick={() => selectTrigger(t.id)}
                    disabled={simulating}
                    aria-pressed={activeTrigger === t.id}
                  >
                    <i className={t.icon} aria-hidden="true" />
                    <div className="option-text">
                      <strong>{t.name}</strong>
                      <span>{t.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Control Group 2: Choose AI Logic */}
            <div className="control-group active-step">
              <h3 className="control-heading">02. Choose AI Logic</h3>
              <div className="options-stack">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    className={`option-btn ${activeFilter === f.id ? "selected" : ""}`}
                    onClick={() => selectFilter(f.id)}
                    disabled={simulating}
                    aria-pressed={activeFilter === f.id}
                  >
                    <i className={f.icon} aria-hidden="true" />
                    <div className="option-text">
                      <strong>{f.name}</strong>
                      <span>{f.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Control Group 3: Execute Action */}
            <div className="control-group active-step">
              <h3 className="control-heading">03. Execute Action</h3>
              <div className="options-stack">
                {actions.map((a) => (
                  <button
                    key={a.id}
                    className={`option-btn ${activeAction === a.id ? "selected" : ""}`}
                    onClick={() => selectAction(a.id)}
                    disabled={simulating}
                    aria-pressed={activeAction === a.id}
                  >
                    <i className={a.icon} aria-hidden="true" />
                    <div className="option-text">
                      <strong>{a.name}</strong>
                      <span>{a.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="sandbox-canvas-column">
            {/* Dynamic Live Status Bar */}
            <AnimatePresence mode="wait">
              <motion.div
                key={showNotification ? "success" : simulating ? "simulating" : "idle"}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: easeExpo }}
                className={`live-status-bar ${showNotification ? "success-state" : simulating ? "simulating-state" : "idle-state"}`}
              >
                <div className="live-status-left">
                  {showNotification ? (
                    <i className="ph ph-check-circle success-icon success-animate-scale" aria-hidden="true" />
                  ) : simulating ? (
                    <i className="ph ph-spinner animate-spin simulation-icon" aria-hidden="true" />
                  ) : (
                    <span className="live-dot" />
                  )}

                  {showNotification ? (
                    <div className="live-success-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <strong>Automation Active! 🎉</strong>
                      <p>{getFriendlyNotificationText()}</p>
                      <button
                        className="simulate-run-btn success-cta-btn"
                        onClick={handleAutomateThisWorkflow}
                        style={{
                          marginTop: "0.25rem",
                          padding: "0.45rem 1rem",
                          fontSize: "0.85rem",
                          background: "var(--color-primary)",
                          color: "var(--color-bg)",
                          border: "none",
                          borderRadius: "0.35rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          cursor: "pointer",
                          fontWeight: "600",
                          transition: "transform var(--duration-fast) var(--ease-out-expo), background-color var(--duration-fast) var(--ease-out-expo)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.backgroundColor = 'oklch(0.25 0.02 240)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                        }}
                      >
                        Automate This Workflow <i className="ph ph-arrow-right" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <span className="live-status-text">
                      {simulating ? (
                        pulsePosition === 1 ? "1. Spotting the trigger..." :
                          pulsePosition === 2 ? "2. Sorting the details..." :
                            pulsePosition === 3 ? "3. Finishing the task..." :
                              "Workflow running..."
                      ) : (
                        <>
                          System Ready &bull; <span className="text-muted">Select tool & execute workflow</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div className="live-status-right">
                  {showNotification ? (
                    <button className="live-status-close" onClick={() => setShowNotification(false)} aria-label="Close notification">
                      <i className="ph ph-x" aria-hidden="true" />
                    </button>
                  ) : (
                    <span className="live-status-pill">LIVE STATUS</span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="sandbox-canvas">
              <div className="canvas-grid-bg" />
              <div className="canvas-header">
                <span className="canvas-title">
                  <i className="ph ph-layout" aria-hidden="true" /> Automation Canvas
                </span>
              </div>

              <div className="flow-visualizer">
                <div className={`visual-node ${pulsePosition === 1 ? "pulse-active" : ""}`}>
                  <div className="node-icon-wrap">
                    <i className={triggers.find(t => t.id === activeTrigger)?.icon} aria-hidden="true" />
                  </div>
                  <span className="node-label">Trigger</span>
                  <span className="node-value">{triggers.find(t => t.id === activeTrigger)?.name}</span>
                </div>

                <div className="visual-pipeline">
                  {/* Horizontal Desktop Line */}
                  <svg className="pipeline-horizontal" width="100%" height="10" preserveAspectRatio="none">
                    <line x1="0" y1="5" x2="100%" y2="5" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="5 5" />
                    {pulsePosition === 1 && (
                      <motion.line
                        x1="0" y1="5" x2="100%" y2="5"
                        stroke="var(--color-accent)" strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: "linear" }}
                      />
                    )}
                  </svg>
                  {/* Vertical Mobile Line */}
                  <svg className="pipeline-vertical" width="10" height="100%" preserveAspectRatio="none">
                    <line x1="5" y1="0" x2="5" y2="100%" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="5 5" />
                    {pulsePosition === 1 && (
                      <motion.line
                        x1="5" y1="0" x2="5" y2="100%"
                        stroke="var(--color-accent)" strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: "linear" }}
                      />
                    )}
                  </svg>
                </div>

                <div className={`visual-node ${pulsePosition === 2 ? "pulse-active" : ""}`}>
                  <div className="node-icon-wrap">
                    <i className={filters.find(f => f.id === activeFilter)?.icon} aria-hidden="true" />
                  </div>
                  <span className="node-label">AI Logic</span>
                  <span className="node-value">{filters.find(f => f.id === activeFilter)?.name}</span>
                </div>

                <div className="visual-pipeline">
                  {/* Horizontal Desktop Line */}
                  <svg className="pipeline-horizontal" width="100%" height="10" preserveAspectRatio="none">
                    <line x1="0" y1="5" x2="100%" y2="5" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="5 5" />
                    {pulsePosition === 2 && (
                      <motion.line
                        x1="0" y1="5" x2="100%" y2="5"
                        stroke="var(--color-accent)" strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: "linear" }}
                      />
                    )}
                  </svg>
                  {/* Vertical Mobile Line */}
                  <svg className="pipeline-vertical" width="10" height="100%" preserveAspectRatio="none">
                    <line x1="5" y1="0" x2="5" y2="100%" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="5 5" />
                    {pulsePosition === 2 && (
                      <motion.line
                        x1="5" y1="0" x2="5" y2="100%"
                        stroke="var(--color-accent)" strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: "linear" }}
                      />
                    )}
                  </svg>
                </div>

                <div className={`visual-node ${pulsePosition === 3 ? "pulse-active" : ""}`}>
                  <div className="node-icon-wrap">
                    <i className={actions.find(a => a.id === activeAction)?.icon} aria-hidden="true" />
                  </div>
                  <span className="node-label">Action</span>
                  <span className="node-value">{actions.find(a => a.id === activeAction)?.name}</span>
                </div>
              </div>

              <div className="simulation-actions">
                <button
                  className="simulate-run-btn"
                  onClick={handleSimulate}
                  disabled={simulating}
                >
                  {simulating ? (
                    <>
                      <i className="ph ph-circle-notch ph-spin" aria-hidden="true" /> Executing Workflow...
                    </>
                  ) : (
                    <>
                      <i className="ph ph-play" aria-hidden="true" /> Execute Workflow
                    </>
                  )}
                </button>
                {(simulating || showNotification) && (
                  <button
                    className="simulate-reset-btn"
                    onClick={handleReset}
                  >
                    <i className="ph ph-stop" aria-hidden="true" /> Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────
// Projects Component
// ─────────────────────────────────────
const projects = [
  {
    image: "/Digital Invitation Card.jpeg",
    alt: "AI digital invitation card generation",
    tag: "AI Agent",
    title: "AI Wedding Cards",
    desc: "Creates beautiful, custom digital wedding cards using AI instantly.",
    tools: ["AI Agent", "Gemini", "Email"],
    result: "Instant custom designs",
  },
  {
    image: "/Website lead Automation.jpeg",
    alt: "Website lead tracking workflow",
    tag: "Workflow",
    title: "Lead Tracker",
    desc: "Catches site leads, checks for real emails, and logs them in a sheet.",
    tools: ["Webhook", "Sheets", "Email"],
    result: "Stops fake leads",
  },
  {
    image: "/Wellness_survey_and_report_card.jpeg",
    alt: "Mental health coach and report generation",
    tag: "Automation",
    title: "Wellness Coach",
    desc: "Builds a personalized health report and emails it to the user.",
    tools: ["OpenAI", "Gmail"],
    result: "Helpful custom reports",
  },
];

function Projects() {
  return (
    <section id="projects" className="section section-alt">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
        >
          <h2 className="section-title">Recent projects</h2>
          <p className="section-desc">Real automations we built for real businesses.</p>
        </motion.div>

        <motion.div
          className="projects-grid"
          variants={staggerViewContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {projects.map((p, i) => (
            <motion.article
              variants={fadeUpVariant}
              className="project-card"
              key={i}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", transition: { duration: 0.4, ease: easeExpo } }}
            >
              <div className="project-image">
                <Image src={p.image} alt={p.alt} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" style={{ objectFit: "cover" }} loading="lazy" />
                <span className="project-tag">{p.tag}</span>
              </div>
              <div className="project-info">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="project-tools">
                  {p.tools.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="project-result">
                  <i className="ph ph-arrow-up-right" aria-hidden="true" />
                  <span>{p.result}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="projects-more-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easeExpo }}
          viewport={{ once: true }}
        >
          <div className="projects-more-btn-wrap">
            <Link href="/projects" className="magnetic-btn show-more-projects-btn">
              View All Projects <i className="ph ph-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



// ─────────────────────────────────────
// Footer Component
// ─────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo">Lucas<span className="logo-dot">.</span></div>
          <p className="footer-tagline">Building automations that work while you sleep.</p>
        </div>
        <div className="footer-nav">
          <h2 className="footer-heading">Navigation</h2>
          <ul className="footer-nav-list">
            <li><a href="#services">Services</a></li>
            <li><a href="#test-our-workflow">Test Our Workflow</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><Link href="/get-started">Get Started</Link></li>
          </ul>
        </div>
        <div className="footer-social">
          <h2 className="footer-heading">Follow Us</h2>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/nitesh-nadar-19077040b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="ph ph-linkedin-logo" aria-hidden="true" /></a>
            <a href="https://www.instagram.com/nitesh_nadar08/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="ph ph-instagram-logo" aria-hidden="true" /></a>
            <a href="https://x.com/NiteshNadar26" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter"><i className="ph ph-x-logo" aria-hidden="true" /></a>
            <a href="https://github.com/NiteshNadar" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="ph ph-github-logo" aria-hidden="true" /></a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>&copy; {new Date().getFullYear()} Lucas Automation.</span>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────
// Smooth Scrolling Hook
// ─────────────────────────────────────
function SmoothScrollLinks() {
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const navbarHeight = 96;
          const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
      }
    };
    const links = document.querySelectorAll("a[href^='#']");
    links.forEach((link) => link.addEventListener("click", handleAnchorClick));
    return () => links.forEach((link) => link.removeEventListener("click", handleAnchorClick));
  }, []);
  return null;
}

// ─────────────────────────────────────
// Page Export
// ─────────────────────────────────────
export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Services />
        <AutomationSandbox />
        <Projects />
      </main>
      <Footer />
      <SmoothScrollLinks />
    </>
  );
}
