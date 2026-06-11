"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ContactFormModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ContactFormModal({ open, onClose }: ContactFormModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { a, b, answer } = useMemo(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b, answer: a + b };
  }, [open]);

  const resetForm = useCallback(() => {
    setFullName("");
    setEmail("");
    setSubject("");
    setSummary("");
    setCaptchaAnswer("");
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const userAnswer = parseInt(captchaAnswer.trim(), 10);
      if (userAnswer !== answer) {
        setCaptchaError(true);
        return;
      }
      setCaptchaError(false);
      setSubmitError(null);
      setIsSubmitting(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: email,
            fromname: fullName,
            subject,
            body: summary,
          }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setSubmitError((data.error as string) ?? "Failed to send message");
          return;
        }
        resetForm();
        onClose();
        window.dispatchEvent(
          new CustomEvent("show-success-toast", {
            detail: "Response submitted. Our team will contact you soon.",
          }),
        );
      } catch {
        setSubmitError("Failed to send message");
      } finally {
        setIsSubmitting(false);
      }
    },
    [answer, captchaAnswer, email, fullName, onClose, resetForm, subject, summary],
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-[#17181c] p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="contact-modal-title"
          className="mb-6 font-bebas text-2xl font-normal uppercase tracking-[-0.31px] text-[#A80B09] sm:text-3xl"
        >
          Your Theatre Awaits
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full rounded-lg border border-[#333] bg-[#0d0e11] px-4 py-3 font-figtree text-[15px] text-white placeholder:text-[#666] focus:border-[#A80B09] focus:outline-none focus:ring-1 focus:ring-[#A80B09]"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-[#333] bg-[#0d0e11] px-4 py-3 font-figtree text-[15px] text-white placeholder:text-[#666] focus:border-[#A80B09] focus:outline-none focus:ring-1 focus:ring-[#A80B09]"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full rounded-lg border border-[#333] bg-[#0d0e11] px-4 py-3 font-figtree text-[15px] text-white placeholder:text-[#666] focus:border-[#A80B09] focus:outline-none focus:ring-1 focus:ring-[#A80B09]"
          />
          <textarea
            placeholder="A brief summary of what you are offering..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-lg border border-[#333] bg-[#0d0e11] px-4 py-3 font-figtree text-[15px] text-white placeholder:text-[#666] focus:border-[#A80B09] focus:outline-none focus:ring-1 focus:ring-[#A80B09]"
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-figtree text-[15px] text-white">
              {a} + {b} =
            </span>
            <input
              type="number"
              inputMode="numeric"
              value={captchaAnswer}
              onChange={(e) => {
                setCaptchaAnswer(e.target.value);
                setCaptchaError(false);
              }}
              className="w-20 rounded border border-[#333] bg-[#0d0e11] px-3 py-2 font-figtree text-[15px] text-white placeholder:text-[#666] focus:border-[#A80B09] focus:outline-none focus:ring-1 focus:ring-[#A80B09]"
              aria-invalid={captchaError}
              aria-describedby={captchaError ? "captcha-error" : undefined}
            />
            {captchaError && (
              <span
                id="captcha-error"
                className="font-figtree text-sm text-[#A80B09]"
              >
                Incorrect answer
              </span>
            )}
          </div>
          {submitError && (
            <p className="font-figtree text-sm text-[#A80B09]">{submitError}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full cursor-pointer rounded-lg bg-[#A80B09] px-6 py-4 font-figtree text-lg font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>

        <p className="mt-6 text-center font-figtree text-sm text-[#999]">
          Videomentum Privacy Policy
        </p>
      </div>
    </div>
  );
}
