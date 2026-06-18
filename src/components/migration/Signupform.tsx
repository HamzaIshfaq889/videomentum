"use client";

import { useCallback, useState } from "react";

const perks = [
  "Fast-track onboarding for established creators",
  "Dedicated onboarding support team",
  "Featured placement on launch",
  "Earn credits from your first view",
  "No content suppression — ever",
];

export const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [audienceSize, setAudienceSize] = useState("");
  const [contentDescription, setContentDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);
      setIsSubmitting(true);

      const body = [
        `Name: ${name}`,
        `Platform(s): ${platform}`,
        `Channel / Profile URL: ${profileUrl}`,
        `Audience Size: ${audienceSize}`,
        `Content Description: ${contentDescription}`,
      ].join("\r\n");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_PATH}/api/email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              from: email,
              fromname: name,
              subject: "Creator Application",
              body,
            }),
          },
        );

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setSubmitError(
            (data.error as string) ?? "Failed to submit application.",
          );
          return;
        }

        // Reset
        setName("");
        setEmail("");
        setPlatform("YouTube");
        setProfileUrl("");
        setAudienceSize("Under 1,000");
        setContentDescription("");

        window.dispatchEvent(
          new CustomEvent("show-success-toast", {
            detail: "Application submitted. We'll be in touch within 48 hours.",
          }),
        );
      } catch {
        setSubmitError("Failed to submit application.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, email, platform, profileUrl, audienceSize, contentDescription],
  );

  return (
    <section
      id="migration-signup"
      className="bg-black border-b border-[#1e1e1e]"
      style={{ scrollMarginTop: "120px" }}
    >
      <style>{`
        .form-input,
        .form-select {
          width: 100%;
          background: #000000;
          border: 1px solid #2a2a2a;
          border-radius: 4px;
          padding: 12px 14px;
          font-size: 13px;
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
          display: block;
        }
        .form-input:focus  { border-color: #A80B09; }
        .form-input::placeholder { color: #444444; }
        .form-select { color: #888888; appearance: none; }

        /* Tablet ≤1024px */
        @media (max-width: 1024px) {
          .signup-section-inner { padding: 40px 28px !important; grid-template-columns: 1fr !important; gap: 32px !important; }
          .signup-title         { font-size: 40px !important; }
        }

        /* Mobile ≤680px */
        @media (max-width: 680px) {
          .signup-section-inner { padding: 36px 16px !important; }
          .signup-title         { font-size: 34px !important; }
          .signup-form-card     { padding: 24px 20px !important; }
          .form-input,
          .form-select          { font-size: 12px; padding: 10px 12px; }
        }

        /* Small mobile ≤420px */
        @media (max-width: 420px) {
          .signup-title { font-size: 28px !important; }
          .form-input,
          .form-select  { font-size: 12px; padding: 10px 12px; }
        }
      `}</style>

      <div className="signup-section-inner px-16 py-16 grid grid-cols-2 gap-16 items-start">
        {/* Left */}
        <div>
          <p className="text-[10px] font-bold text-[#A80B09] tracking-[3px] uppercase mb-2.5">
            Get Started
          </p>
          <h2
            className="signup-title text-[48px] text-white leading-[1.0] tracking-[0.5px] mb-3"
            style={{ fontFamily: "'Bebas Neue', cursive" }}
          >
            Ready to
            <br />
            <span className="text-[#A80B09]">Expand</span> Your
            <br />
            Reach?
          </h2>
          <p className="text-[14px] text-[#888888] font-light leading-[1.65] mb-6">
            Fill in the form and our team will be in touch within 48 hours.
            Fast-tracked for creators with existing audiences.
          </p>

          <div className="flex flex-col gap-2.5">
            {perks.map((perk) => (
              <div
                key={perk}
                className="flex items-center gap-2.5 text-[13px] text-[#cccccc]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#A80B09] flex-shrink-0" />
                {perk}
              </div>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div
          id="migration-signup-form"
          className="signup-form-card bg-[#111111] border border-[#1e1e1e] rounded-[10px] p-9"
          style={{ scrollMarginTop: "120px" }}
        >
          <p
            className="text-[24px] text-white mb-1 tracking-[0.5px]"
            style={{ fontFamily: "'Bebas Neue', cursive" }}
          >
            Work With Videomentum
          </p>
          <p className="text-[12px] text-[#888888] mb-6">
            Takes less than 3 minutes. We&apos;ll handle the rest.
          </p>

          <form onSubmit={handleSubmit} noValidate={false}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#cccccc] tracking-[1px] uppercase mb-1.5">
                  Your Name
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Jane Okafor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#cccccc] tracking-[1px] uppercase mb-1.5">
                  Email Address
                </label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#cccccc] tracking-[1px] uppercase mb-1.5">
                  Current Platform(s)
                </label>
                <select
                  className="form-select"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a platform
                  </option>
                  <option value="YouTube">YouTube</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="X">X</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#cccccc] tracking-[1px] uppercase mb-1.5">
                  Channel / Profile URL
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="https://youtube.com/c/yourchannel"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#cccccc] tracking-[1px] uppercase mb-1.5">
                  Total Monthly Viewers
                </label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="e.g. 250000"
                  min={0}
                  value={audienceSize}
                  onChange={(e) => setAudienceSize(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#cccccc] tracking-[1px] uppercase mb-1.5">
                  Brief Description of Your Content
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. AI-generated action shorts, martial arts films..."
                  value={contentDescription}
                  onChange={(e) => setContentDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            {submitError && (
              <p className="text-[12px] text-[#A80B09] mt-3">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#A80B09] text-white text-[14px] font-semibold py-3.5 rounded border-none cursor-pointer mt-4 transition-colors duration-200 hover:bg-[#c70d0a] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.3px",
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit Application →"}
            </button>

            <p className="text-[11px] text-[#888888] text-center mt-3 italic">
              We respond within 48 hours. No commitment required.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
