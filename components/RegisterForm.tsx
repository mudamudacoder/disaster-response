"use client";

import { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { DONATION_TYPES } from "@/types";

const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center rounded-md border border-neutral-300 bg-neutral-100 text-sm text-neutral-500">
      Loading map...
    </div>
  ),
});

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function RegisterForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );

  function toggleType(type: string) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const initiative_name = String(formData.get("initiative_name") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const contact_details = String(formData.get("contact_details") || "").trim();
    const operational_hours = String(formData.get("operational_hours") || "").trim();
    const registration_number = String(formData.get("registration_number") || "").trim();
    const website = String(formData.get("website") || "").trim();
    const notes = String(formData.get("notes") || "").trim();

    if (!initiative_name || !address || !contact_details || !operational_hours) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    if (!position) {
      setErrorMessage("Please choose the center's location on the map.");
      return;
    }
    const { lat: latitude, lng: longitude } = position;
    if (selectedTypes.length === 0) {
      setErrorMessage("Please select at least one type of donation accepted.");
      return;
    }

    setState("submitting");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("donation_centers").insert({
        initiative_name,
        address,
        latitude,
        longitude,
        contact_details,
        operational_hours,
        donation_types: selectedTypes,
        registration_number: registration_number || null,
        website: website || null,
        notes: notes || null,
        status: "pending",
      });

      if (error) {
        console.log(error);
        throw error;
      }

      setState("success");
      form.reset();
      setSelectedTypes([]);
      setPosition(null);
    } catch {
      setState("error");
      setErrorMessage(
        "Something went wrong submitting your donation center. Please try again."
      );
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-5 text-green-800">
        <p className="font-semibold">Submission received.</p>
        <p className="mt-1 text-sm">
          Your donation center has been submitted and will appear publicly
          after verification.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {errorMessage && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <Field label="Initiative name" required>
        <input name="initiative_name" required className={inputClass} />
      </Field>

      <Field label="Location / address" required>
        <input name="address" required className={inputClass} />
      </Field>

      <Field label="Location on map" required>
        <LocationPicker
          value={position}
          onChange={(lat, lng) => setPosition({ lat, lng })}
        />
      </Field>

      <Field label="Contact details" required>
        <input
          name="contact_details"
          required
          placeholder="Phone number, email, or both"
          className={inputClass}
        />
      </Field>

      <Field label="Operational hours" required>
        <input
          name="operational_hours"
          required
          placeholder="e.g. Daily 8am - 6pm"
          className={inputClass}
        />
      </Field>

      <Field label="Types of donations accepted" required>
        <div className="flex flex-wrap gap-2">
          {DONATION_TYPES.map((type) => {
            const active = selectedTypes.includes(type);
            return (
              <button
                type="button"
                key={type}
                onClick={() => toggleType(type)}
                aria-pressed={active}
                className={`min-h-[40px] rounded-full border px-3 py-1.5 text-sm font-medium ${
                  active
                    ? "border-brand-navy bg-brand-navy text-white"
                    : "border-neutral-300 bg-white text-neutral-700"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Registration number (optional)">
        <input name="registration_number" className={inputClass} />
      </Field>

      <Field label="Website / social media (optional)">
        <input name="website" type="url" placeholder="https://" className={inputClass} />
      </Field>

      <Field label="Additional notes (optional)">
        <textarea name="notes" rows={3} className={inputClass} />
      </Field>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="min-h-[44px] rounded-md bg-brand-crimson px-4 py-2 font-semibold text-white hover:bg-brand-crimsonDark disabled:opacity-60"
      >
        {state === "submitting" ? "Submitting..." : "Submit for verification"}
      </button>
    </form>
  );
}

const inputClass =
  "min-h-[44px] w-full rounded-md border border-neutral-300 px-3 py-2 text-base focus:border-brand-navy";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-neutral-800">
        {label}
        {required && <span className="text-brand-crimson"> *</span>}
      </span>
      {children}
    </label>
  );
}