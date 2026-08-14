export const contactCopy = {
  label: "Contact",
  title: "Discuss a project",
  body: "Tell us about the facility, the location and what needs to be built or converted.",
  submit: "Send enquiry",
  success:
    "Thank you. We have received your enquiry and will respond shortly.",
  close: "Close",
  detailsLabel: "Nødvendig Holding AS",
} as const;

export const contactFields = {
  name: { id: "name", label: "Name", required: true },
  company: { id: "company", label: "Company", required: true },
  email: { id: "email", label: "Email", required: true },
  phone: { id: "phone", label: "Phone", required: false },
  location: { id: "location", label: "Project location", required: true },
  type: { id: "type", label: "Project type", required: true },
  message: { id: "message", label: "Message", required: true },
} as const;

export const projectTypeOptions = [
  "Data Center Construction",
  "Facility Conversion",
  "Structural & Building Modifications",
  "Site Execution",
] as const;
