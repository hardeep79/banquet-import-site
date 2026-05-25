"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StepOrder } from "./step-order";
import { StepProduct } from "./step-product";
import { StepContact } from "./step-contact";
import { Turnstile } from "./turnstile";
import type { QuoteFormState } from "./types";

const INITIAL: QuoteFormState = {
  businessType: "",
  orderSize: "",
  city: "",
  province: "",
  categories: [],
  products: [],
  budget: "",
  needBy: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  notes: "",
  consent: false,
  honeypot: "",
};

const STORAGE_KEY = "maison-banquet:quote-form";

export function QuoteForm() {
  const router = useRouter();
  const params = useSearchParams();
  const stepParam = Number(params.get("step") ?? "1");
  const step = Number.isFinite(stepParam) && stepParam >= 1 && stepParam <= 3 ? stepParam : 1;

  const [state, setState] = React.useState<QuoteFormState>(INITIAL);
  const [turnstileToken, setTurnstileToken] = React.useState<string>("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Hydrate from sessionStorage + URL prefills (?product=, ?notes=)
  // One-shot mount-time sync from browser-only sources; setState here is intentional.
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {
      // ignore
    }
    const prefillProduct = params.get("product");
    const prefillNotes = params.get("notes");
    if (prefillProduct) {
      setState((s) =>
        s.products.includes(prefillProduct) ? s : { ...s, products: [...s.products, prefillProduct] },
      );
    }
    if (prefillNotes) {
      setState((s) => (s.notes ? s : { ...s, notes: prefillNotes }));
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  // Persist on every change
  React.useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  function update(patch: Partial<QuoteFormState>) {
    setState((s) => ({ ...s, ...patch }));
  }

  function goto(newStep: number) {
    router.push(`/quote?step=${newStep}`, { scroll: false });
  }

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        source: "quote" as const,
        name: state.name,
        company: state.company,
        email: state.email,
        phone: state.phone,
        businessType: state.businessType || "other",
        orderSize: state.orderSize || "not-sure",
        city: state.city,
        province: state.province,
        categories: state.categories,
        products: state.products,
        budget: state.budget || "not-sure",
        needBy: state.needBy || "Flexible",
        notes: state.notes,
        consent: state.consent,
        honeypot: state.honeypot,
        turnstileToken,
      };
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      sessionStorage.removeItem(STORAGE_KEY);
      router.push("/quote/thanks");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <ol className="flex items-center gap-4 mb-12 text-xs uppercase tracking-wide">
        {["Order", "Product", "Contact"].map((label, i) => {
          const n = i + 1;
          const active = n === step;
          return (
            <li
              key={label}
              className={active ? "text-[var(--color-brand-gold)]" : "text-[var(--color-ink-muted)]"}
            >
              {n}. {label}
            </li>
          );
        })}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {step === 1 && <StepOrder value={state} onChange={update} />}
          {step === 2 && <StepProduct value={state} onChange={update} />}
          {step === 3 && (
            <>
              <StepContact value={state} onChange={update} />
              <div className="mt-6">
                <Turnstile onVerify={setTurnstileToken} />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {error && <p className="mt-6 text-sm text-red-400">Submission error: {error}</p>}

      <div className="mt-12 flex justify-between">
        <Button variant="ghost" size="md" disabled={step === 1} onClick={() => goto(step - 1)}>
          Back
        </Button>
        {step < 3 ? (
          <Button size="md" onClick={() => goto(step + 1)}>
            Next
          </Button>
        ) : (
          <Button
            size="md"
            disabled={submitting || !state.consent || !turnstileToken}
            onClick={submit}
          >
            {submitting ? "Sending…" : "Submit Request"}
          </Button>
        )}
      </div>
    </div>
  );
}
