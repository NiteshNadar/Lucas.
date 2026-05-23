"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const easeExpo = [0.16, 1, 0.3, 1];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30, ease: easeExpo },
      opacity: { duration: 0.4 }
    }
  },
  exit: (direction) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30, ease: easeExpo },
      opacity: { duration: 0.3 }
    }
  })
};

const appOptions = [
  { id: "sheets", name: "Google Sheets / Excel", icon: "ph ph-file-xls" },
  { id: "whatsapp", name: "WhatsApp", icon: "ph ph-whatsapp-logo" },
  { id: "gmail", name: "Gmail / Outlook", icon: "ph ph-envelope-simple" },
  { id: "crm", name: "CRM (HubSpot, Zoho, Salesforce)", icon: "ph ph-users-three" },
  { id: "slack", name: "Slack / Teams", icon: "ph ph-chats" },
  { id: "trello", name: "Trello / Asana / Notion", icon: "ph ph-clipboard-text" },
  { id: "shopify", name: "Shopify / WooCommerce", icon: "ph ph-shopping-bag" },
  { id: "custom", name: "Other / Custom Tool", icon: "ph ph-cpu" }
];

const timeWastedOptions = [
  { id: "minor", label: "1 to 5 hours", desc: "Just a few annoying tasks here and there.", hours: "1-5" },
  { id: "moderate", label: "5 to 10 hours", desc: "Standard administrative busywork draining energy.", hours: "5-10" },
  { id: "severe", label: "10 to 20 hours", desc: "Heavy manual data entry or copy-pasting.", hours: "10-20" },
  { id: "critical", label: "20+ hours", desc: "Essentially a full-time job wasted on repetitive tasks.", hours: "20+" }
];

export default function GetStartedClient() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // -1 for back, 1 for next

  const [formData, setFormData] = useState(() => {
    const presetParam = searchParams ? searchParams.get("preset") : null;
    const triggerParam = searchParams ? searchParams.get("trigger") : null;
    const actionParam = searchParams ? searchParams.get("action") : null;

    const appMapping = {
      form: "crm", // Map homepage 'form' trigger to wizard 'crm' pill
      call: "custom", // Map homepage 'call' trigger to wizard 'custom' pill
      pay: "shopify", // Map homepage 'pay' trigger to wizard 'shopify' pill
      sheets: "sheets", // Direct mapping
      whatsapp: "whatsapp", // Direct mapping
      email: "gmail", // Map homepage 'email' action to wizard 'gmail' pill
    };

    const preselectedApps = [];
    if (presetParam) {
      const triggerApp = appMapping[triggerParam] || triggerParam;
      const actionApp = appMapping[actionParam] || actionParam;

      if (triggerApp && appOptions.some(opt => opt.id === triggerApp)) {
        preselectedApps.push(triggerApp);
      }
      if (actionApp && appOptions.some(opt => opt.id === actionApp)) {
        preselectedApps.push(actionApp);
      }
    }

    return {
      businessName: "",
      industry: "",
      selectedApps: preselectedApps,
      customTools: "",
      bottleneck: presetParam || "",
      hoursWasted: "",
      name: "",
      phone: "",
      email: ""
    };
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | submitted | error
  const [errorMessage, setErrorMessage] = useState("");

  const handleTextChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const toggleAppSelection = (appId) => {
    setFormData((prev) => {
      const selected = prev.selectedApps.includes(appId)
        ? prev.selectedApps.filter((id) => id !== appId)
        : [...prev.selectedApps, appId];

      if (errors.selectedApps && selected.length > 0) {
        setErrors((err) => ({ ...err, selectedApps: false }));
      }
      return { ...prev, selectedApps: selected };
    });
  };

  const selectTimeOption = (optionId) => {
    setFormData((prev) => ({ ...prev, hoursWasted: optionId }));
    if (errors.hoursWasted) {
      setErrors((prev) => ({ ...prev, hoursWasted: false }));
    }
  };

  // Step-level validation
  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.businessName.trim()) newErrors.businessName = true;
      if (!formData.industry.trim()) newErrors.industry = true;
    } else if (step === 2) {
      if (formData.selectedApps.length === 0) newErrors.selectedApps = true;
    } else if (step === 3) {
      if (formData.bottleneck.trim().length < 10) newErrors.bottleneck = true;
    } else if (step === 4) {
      if (!formData.hoursWasted) newErrors.hoursWasted = true;
    } else if (step === 5) {
      const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      const nameRegex = /^[\p{L}\s.\-']{2,50}$/u;

      if (!nameRegex.test(formData.name.trim())) newErrors.name = true;
      if (!phoneRegex.test(formData.phone.trim())) newErrors.phone = true;
      if (!emailRegex.test(formData.email.trim())) newErrors.email = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setStatus("submitting");
    setErrorMessage("");

    // Package contextual details into structured markdown string for standard API
    const appNames = formData.selectedApps
      .map((id) => {
        if (id === "custom" && formData.customTools && formData.customTools.trim()) {
          return `Other/Custom (${formData.customTools.trim()})`;
        }
        return appOptions.find((o) => o.id === id)?.name || id;
      })
      .join(", ");

    const timeText = timeWastedOptions.find((o) => o.id === formData.hoursWasted)?.label || formData.hoursWasted;

    const formattedDescription = `### 📋 AUTOMATION AUDIT REQUEST DETAILS
- **Business Name**: ${formData.businessName.trim()}
- **Industry/Sector**: ${formData.industry.trim()}
- **Daily Software/Apps**: ${appNames}
- **Hours Wasted Weekly**: ${timeText}

### ⚠️ MANUAL WORK PROBLEM / BOTTLENECK
${formData.bottleneck.trim()}`;

    const submissionPayload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      description: formattedDescription
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionPayload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Submission failed. Please try again.");
      }

      setStatus("submitted");
      
      // Dynamically load confetti to prevent render-blocking hydration/routing delay
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#8b5cf6", "#1e293b", "#ffffff"],
        disableForReducedMotion: true
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  };

  // Allow pressing enter to go to next step
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && step < 5) {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="wizard-layout-container" onKeyDown={handleKeyDown}>
      {/* Premium Header */}
      <header className="wizard-header">
        <Link href="/" className="wizard-logo">
          Lucas<span className="logo-dot">.</span>
        </Link>
        <Link href="/" className="wizard-close-btn" aria-label="Exit wizard and return home">
          <i className="ph ph-x" aria-hidden="true" />
        </Link>
      </header>

      <main className="wizard-main">
        {status !== "submitted" ? (
          <div className="wizard-card-wrap">
            {/* Visual Progress Stepper */}
            <div className="wizard-progress-section">
              <div className="wizard-progress-bar-container">
                <div
                  className="wizard-progress-bar-fill"
                  style={{ width: `${(step / 5) * 100}%` }}
                />
              </div>
              <div className="wizard-step-indicator">
                <span className="step-badge">Step {step} of 5</span>
                <span className="step-percentage">{Math.round((step / 5) * 100)}% Complete</span>
              </div>
            </div>

            <div className="wizard-form-container">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="wizard-step-slide"
                >
                  {/* Step 1: Business Details */}
                  {step === 1 && (
                    <div className="wizard-step-content">
                      <h1 className="wizard-step-title">Let&apos;s start with your business.</h1>
                      <p className="wizard-step-subtitle">This helps us to know about your potential automation setups for your business niche.</p>

                      <div className="form-group-stack">
                        <div className={`form-group ${errors.businessName ? "show-error" : ""}`}>
                          <label htmlFor="businessName">What is your company or business name?</label>
                          <input
                            type="text"
                            id="businessName"
                            placeholder="e.g., Summit Agency, Lucas Trading"
                            value={formData.businessName}
                            onChange={(e) => handleTextChange("businessName", e.target.value)}
                            className={errors.businessName ? "error" : ""}
                            autoFocus
                            required
                          />
                          <span className="form-error" role="alert">Please enter your business name.</span>
                        </div>

                        <div className={`form-group ${errors.industry ? "show-error" : ""}`}>
                          <label htmlFor="industry">What industry or line of work are you in?</label>
                          <input
                            type="text"
                            id="industry"
                            placeholder="e.g., Real Estate, E-commerce, Logistics, Local Service"
                            value={formData.industry}
                            onChange={(e) => handleTextChange("industry", e.target.value)}
                            className={errors.industry ? "error" : ""}
                            required
                          />
                          <span className="form-error" role="alert">Please specify your industry.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Stack (Interactive Pills) */}
                  {step === 2 && (
                    <div className="wizard-step-content">
                      <h1 className="wizard-step-title">Which tools does your team use daily?</h1>
                      <p className="wizard-step-subtitle">Select all the apps you currently use for your operations (we will link them together).</p>

                      <div className="pills-grid-container">
                        <div className="pills-grid">
                          {appOptions.map((opt) => {
                            const isSelected = formData.selectedApps.includes(opt.id);
                            return (
                              <button
                                type="button"
                                key={opt.id}
                                className={`pill-option-btn ${isSelected ? "selected" : ""}`}
                                onClick={() => toggleAppSelection(opt.id)}
                                aria-pressed={isSelected}
                              >
                                <i className={`${opt.icon} pill-icon`} aria-hidden="true" />
                                <span className="pill-name">{opt.name}</span>
                                {isSelected && <i className="ph ph-check-circle pill-check-icon" aria-hidden="true" />}
                              </button>
                            );
                          })}
                        </div>

                        <AnimatePresence>
                          {formData.selectedApps.includes("custom") && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.3, ease: easeExpo }}
                              className="form-group custom-tool-input-group"
                              style={{ overflow: "hidden" }}
                            >
                              <label htmlFor="customTools" style={{ marginBottom: "0.5rem", display: "block", fontSize: "0.9rem", fontWeight: 500, color: "var(--color-primary)" }}>
                                Specify your other/custom tool(s):
                              </label>
                              <input
                                type="text"
                                id="customTools"
                                placeholder="e.g., Salesforce, Custom ERP, Proprietary CRM"
                                value={formData.customTools}
                                onChange={(e) => handleTextChange("customTools", e.target.value)}
                                className="wizard-custom-input"
                                style={{
                                  width: "100%",
                                  padding: "0.85rem 1rem",
                                  fontSize: "0.95rem",
                                  borderRadius: "0.5rem",
                                  border: "1.5px solid var(--color-border)",
                                  backgroundColor: "var(--color-surface)",
                                  color: "var(--color-primary)",
                                  outline: "none",
                                  transition: "border-color var(--duration-normal) var(--ease-out-expo), box-shadow var(--duration-normal) var(--ease-out-expo)"
                                }}
                                autoFocus
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {errors.selectedApps && (
                          <span className="form-error show-error-block" role="alert">
                            Please select at least one software/app to proceed.
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Biggest Manual Bottleneck */}
                  {step === 3 && (
                    <div className="wizard-step-content">
                      <h1 className="wizard-step-title">What is your single biggest manual bottleneck?</h1>
                      <p className="wizard-step-subtitle">Tell us about the repetitive tasks, double data entry, or processes that slow you down the most.</p>

                      <div className={`form-group ${errors.bottleneck ? "show-error" : ""}`}>
                        <label htmlFor="bottleneck">Describe the manual process or task (Minimum 10 characters)</label>
                        <textarea
                          id="bottleneck"
                          rows={6}
                          placeholder="e.g., Every time we get a lead, we manually copy-paste details into a Google Sheet, send a Slack alert to sales, and draft a custom greeting email. It takes 15 minutes per lead and leads to missed follow-ups."
                          value={formData.bottleneck}
                          onChange={(e) => handleTextChange("bottleneck", e.target.value)}
                          className={errors.bottleneck ? "error" : ""}
                          autoFocus
                          required
                        />
                        <span className="form-error" role="alert">Please write a brief description (at least 10 characters).</span>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Weekly Time Waste */}
                  {step === 4 && (
                    <div className="wizard-step-content">
                      <h1 className="wizard-step-title">Estimate hours wasted weekly on this manual work.</h1>
                      <p className="wizard-step-subtitle">Be honest. How many combined hours does your team lose every single week to this boring bottleneck?</p>

                      <div className="time-waste-stack">
                        {timeWastedOptions.map((opt) => {
                          const isSelected = formData.hoursWasted === opt.id;
                          return (
                            <button
                              type="button"
                              key={opt.id}
                              className={`time-waste-row-btn ${isSelected ? "selected" : ""}`}
                              onClick={() => selectTimeOption(opt.id)}
                              aria-pressed={isSelected}
                            >
                              <div className="time-waste-left">
                                <span className="time-waste-badge">{opt.hours} hrs</span>
                                <div className="time-waste-meta">
                                  <strong className="time-waste-label">{opt.label}</strong>
                                  <span className="time-waste-desc">{opt.desc}</span>
                                </div>
                              </div>
                              <div className={`time-waste-check ${isSelected ? "checked" : ""}`}>
                                {isSelected && <i className="ph ph-check" aria-hidden="true" />}
                              </div>
                            </button>
                          );
                        })}
                        {errors.hoursWasted && (
                          <span className="form-error show-error-block" role="alert">
                            Please select an estimated hourly tier to proceed.
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 5: Contact Details */}
                  {step === 5 && (
                    <div className="wizard-step-content">
                      <h1 className="wizard-step-title">Who should receive the automation audit?</h1>
                      <p className="wizard-step-subtitle">Provide your direct details. We will analyze your inputs and send you a custom automation blueprint.</p>

                      <div className="form-group-stack">
                        <div className={`form-group ${errors.name ? "show-error" : ""}`}>
                          <label htmlFor="name">Your Name</label>
                          <input
                            type="text"
                            id="name"
                            placeholder="John Smith"
                            value={formData.name}
                            onChange={(e) => handleTextChange("name", e.target.value)}
                            className={errors.name ? "error" : ""}
                            autoComplete="name"
                            autoFocus
                            required
                          />
                          <span className="form-error" role="alert">Please enter your name.</span>
                        </div>

                        <div className="form-row-grid">
                          <div className={`form-group ${errors.phone ? "show-error" : ""}`}>
                            <label htmlFor="phone">Phone Number</label>
                            <input
                              type="tel"
                              id="phone"
                              placeholder="+91 98765 43210"
                              value={formData.phone}
                              onChange={(e) => handleTextChange("phone", e.target.value)}
                              className={errors.phone ? "error" : ""}
                              autoComplete="tel"
                              required
                            />
                            <span className="form-error" role="alert">Please enter a valid phone number.</span>
                          </div>

                          <div className={`form-group ${errors.email ? "show-error" : ""}`}>
                            <label htmlFor="email">Work Email</label>
                            <input
                              type="email"
                              id="email"
                              placeholder="john@company.com"
                              value={formData.email}
                              onChange={(e) => handleTextChange("email", e.target.value)}
                              className={errors.email ? "error" : ""}
                              autoComplete="email"
                              required
                            />
                            <span className="form-error" role="alert">Please enter a valid email address.</span>
                          </div>
                        </div>

                        {status === "error" && (
                          <div className="wizard-alert-error" role="alert">
                            <i className="ph ph-warning-circle" aria-hidden="true" />
                            <span>{errorMessage}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stepper Navigation Actions */}
            <div className="wizard-navigation-actions">
              {step > 1 ? (
                <button
                  type="button"
                  className="wizard-btn-secondary"
                  onClick={handleBack}
                  disabled={status === "submitting"}
                >
                  <i className="ph ph-arrow-left" aria-hidden="true" /> Back
                </button>
              ) : (
                <div /> // placeholder for alignment
              )}

              {step < 5 ? (
                <button
                  type="button"
                  className="wizard-btn-primary"
                  onClick={handleNext}
                >
                  Continue <i className="ph ph-arrow-right" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  className={`wizard-btn-primary btn-submit ${status === "submitting" ? "submitting" : ""}`}
                  onClick={handleSubmit}
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    <span className="btn-loader">
                      <i className="ph ph-circle-notch ph-spin" aria-hidden="true" /> Creating Audit Blueprint...
                    </span>
                  ) : (
                    <>
                      Submit Audit Request <i className="ph ph-check" aria-hidden="true" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Success Screen */
          <motion.div
            className="wizard-success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: easeExpo }}
          >
            <div className="success-icon-container success-animate-scale">
              <span className="success-brand-letter">L<span style={{ color: "var(--color-accent)" }}>.</span></span>
            </div>
            <h1 className="success-title">Your Blueprint is on the way!</h1>
            <p className="success-desc">
              Excellent! We have gathered details for <strong>{formData.businessName}</strong>. Our experts are already calculating the custom workflow architecture to recover your <strong>{timeWastedOptions.find((o) => o.id === formData.hoursWasted)?.hours} wasted hours</strong> weekly.
            </p>

            <div className="success-next-steps">
              <h2>What happens next?</h2>
              <ul className="success-steps-list">
                <li>
                  <div className="step-num-bubble">1</div>
                  <div className="step-desc-content">
                    <strong>Initial Automation Review</strong>
                    <span>We look closely at the manual process you described: <em>&ldquo;{formData.bottleneck.length > 80 ? `${formData.bottleneck.substring(0, 80)}...` : formData.bottleneck}&rdquo;</em>.</span>
                  </div>
                </li>
                <li>
                  <div className="step-num-bubble">2</div>
                  <div className="step-desc-content">
                    <strong>App Connectivity Mapping</strong>
                    <span>We structure the integration layout connecting your selected apps.</span>
                  </div>
                </li>
                <li>
                  <div className="step-num-bubble">3</div>
                  <div className="step-desc-content">
                    <strong>Direct Blueprint Dispatch</strong>
                    <span>A direct email analysis will be sent to <strong>{formData.email}</strong> within 24 hours. Keep an eye on your inbox!</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="success-action-wrap">
              <Link href="/" className="wizard-btn-primary success-home-btn">
                Return to Homepage <i className="ph ph-arrow-right" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
