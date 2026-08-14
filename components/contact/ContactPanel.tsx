"use client";

import { useState } from "react";
import { contact, company } from "@/data/company";
import {
  contactCopy,
  contactFields,
  projectTypeOptions,
} from "@/data/contact";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";

const fieldClassName =
  "w-full border-b border-line bg-transparent py-3 text-[15px] text-carbon outline-none transition-colors duration-300 ease-out-expo placeholder:text-steel/50 focus:border-carbon";

type ContactPanelProps = {
  className?: string;
};

export const ContactPanel = ({ className }: ContactPanelProps) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={cn("grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10", className)}>
      <div className="lg:col-span-7">
        <SectionLabel>{contactCopy.label}</SectionLabel>
        <h2 className="text-display-l mt-5 max-w-[12ch] font-medium">
          {contactCopy.title}
        </h2>
        <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-steel">
          {contactCopy.body}
        </p>

        {submitted ? (
          <p className="mt-10 max-w-[42ch] text-base leading-relaxed" role="status">
            {contactCopy.success}
          </p>
        ) : (
          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field
                id={contactFields.name.id}
                label={contactFields.name.label}
                required
              />
              <Field
                id={contactFields.company.id}
                label={contactFields.company.label}
                required
              />
              <Field
                id={contactFields.email.id}
                label={contactFields.email.label}
                type="email"
                required
              />
              <Field
                id={contactFields.phone.id}
                label={contactFields.phone.label}
                type="tel"
              />
              <Field
                id={contactFields.location.id}
                label={contactFields.location.label}
                required
              />
              <div>
                <label
                  htmlFor={contactFields.type.id}
                  className="technical-label text-steel"
                >
                  {contactFields.type.label}
                </label>
                <select
                  id={contactFields.type.id}
                  name={contactFields.type.id}
                  required
                  defaultValue=""
                  className={cn(fieldClassName, "mt-2 appearance-none rounded-none")}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {projectTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor={contactFields.message.id}
                className="technical-label text-steel"
              >
                {contactFields.message.label}
              </label>
              <textarea
                id={contactFields.message.id}
                name={contactFields.message.id}
                required
                rows={4}
                className={cn(fieldClassName, "mt-2 resize-y")}
              />
            </div>
            <Button type="submit">{contactCopy.submit}</Button>
          </form>
        )}
      </div>

      <aside className="lg:col-span-4 lg:col-start-9">
        <p className="technical-label text-steel">{contactCopy.detailsLabel}</p>
        <dl className="mt-8 space-y-8">
          {contact.email ? (
            <div>
              <dt className="technical-label text-steel">Email</dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[1.05rem] text-carbon transition-opacity duration-300 ease-out-expo hover:opacity-55"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="technical-label text-steel">Phone</dt>
            <dd className="mt-2">
              <a
                href={contact.phoneHref}
                className="text-[1.05rem] text-carbon transition-opacity duration-300 ease-out-expo hover:opacity-55"
              >
                {contact.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="technical-label text-steel">Address</dt>
            <dd className="mt-2 text-[1.05rem] leading-relaxed text-carbon">
              <p>{contact.address.line1}</p>
              <p>{contact.address.line2}</p>
              <p>{contact.address.country}</p>
            </dd>
          </div>
          <div>
            <dt className="technical-label text-steel">Org.nr</dt>
            <dd className="mt-2 text-[1.05rem] text-carbon">{contact.orgNr}</dd>
          </div>
        </dl>
        <p className="technical-label mt-12 text-steel">
          {company.technicalLabel}
        </p>
      </aside>
    </div>
  );
};

type FieldProps = {
  id: string;
  label: string;
  type?: "text" | "email" | "tel";
  required?: boolean;
};

const Field = ({ id, label, type = "text", required = false }: FieldProps) => (
  <div>
    <label htmlFor={id} className="technical-label text-steel">
      {label}
      {required ? null : (
        <span className="ml-2 text-steel/60">Optional</span>
      )}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      required={required}
      className={cn(fieldClassName, "mt-2")}
    />
  </div>
);
