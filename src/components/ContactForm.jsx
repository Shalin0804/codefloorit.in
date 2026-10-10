import { useEffect, useState } from "react";
import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import { CONTACT, whatsappLink } from "../data/site";
import { services } from "../data/services";
import { BRIEF_KEY } from "../data/sukaram";

/* Set VITE_CONTACT_ENDPOINT (see .env.example) to a URL that accepts a JSON POST.
   Without it nothing can be delivered from this page, so the form opens WhatsApp
   with the message filled in instead — and says so. */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT;

const SERVICE_OPTIONS = [...services.map((s) => s.title), "Not sure yet"];
const EMPTY = { name: "", email: "", phone: "", company: "", service: "", details: "", website: "" };

export function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Enter a valid email address, like name@company.com.";
  if (f.phone.trim() && !/^\+?[\d\s()-]{7,20}$/.test(f.phone.trim())) e.phone = "Enter a valid phone number, or leave this empty.";
  if (!f.service) e.service = "Choose the service you need.";
  if (f.details.trim().length < 20) e.details = "Tell us a little more — at least 20 characters.";
  return e;
}

const summary = (f) =>
  [
    `Name: ${f.name}`,
    `Email: ${f.email}`,
    `Phone: ${f.phone || "-"}`,
    `Company: ${f.company || "-"}`,
    `Service required: ${f.service}`,
    "",
    f.details,
  ].join("\n");

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | failed | handoff

  // Preselect the service when arriving from a service page (/contact?service=<slug>).
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    const match = services.find((s) => s.slug === slug);
    // oxlint-disable-next-line react/set-state-in-effect -- read after hydration so server and client markup match
    if (match) setForm((f) => ({ ...f, service: match.title }));
    // Carry over a project description the visitor already typed to Sukaram. Nothing is sent until they submit.
    try {
      const brief = sessionStorage.getItem(BRIEF_KEY);
      // oxlint-disable-next-line react/set-state-in-effect -- same reason as above
      if (brief) setForm((f) => (f.details ? f : { ...f, details: brief }));
    } catch {
      /* storage blocked: the field just starts empty */
    }
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const blur = (k) => () => setErrors((prev) => ({ ...prev, [k]: validate(form)[k] }));

  async function onSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) return document.getElementById(`cf-${first}`)?.focus();
    if (form.website) return; // honeypot: real visitors never see or fill this field

    if (!ENDPOINT) {
      window.open(whatsappLink(`Project enquiry — Codefloor IT\n\n${summary(form)}`), "_blank", "noopener");
      return setStatus("handoff");
    }

    setStatus("sending");
    try {
      const { website: _honeypot, ...payload } = form;
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setForm(EMPTY);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  const field = (k, label, props = {}, optional = false) => (
    <div className="field">
      <label htmlFor={`cf-${k}`}>
        {label} {optional && <span className="field__opt">(optional)</span>}
      </label>
      <input
        id={`cf-${k}`}
        name={k}
        value={form[k]}
        onChange={set(k)}
        onBlur={blur(k)}
        aria-invalid={errors[k] ? "true" : undefined}
        aria-describedby={errors[k] ? `cf-${k}-err` : undefined}
        required={!optional}
        {...props}
      />
      <FieldError id={`cf-${k}-err`} msg={errors[k]} />
    </div>
  );

  return (
    <form className="cform" onSubmit={onSubmit} noValidate aria-label="Project enquiry">
      <div className="cform__row">
        {field("name", "Full Name", { autoComplete: "name" })}
        {field("email", "Business Email", { type: "email", autoComplete: "email", inputMode: "email" })}
      </div>
      <div className="cform__row">
        {field("phone", "Phone Number", { type: "tel", autoComplete: "tel" }, true)}
        {field("company", "Company Name", { autoComplete: "organization" }, true)}
      </div>

      <div className="field">
        <label htmlFor="cf-service">Service Required</label>
        <select
          id="cf-service"
          name="service"
          value={form.service}
          onChange={set("service")}
          onBlur={blur("service")}
          aria-invalid={errors.service ? "true" : undefined}
          aria-describedby={errors.service ? "cf-service-err" : undefined}
          required
        >
          <option value="" disabled>Select a service</option>
          {SERVICE_OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <FieldError id="cf-service-err" msg={errors.service} />
      </div>

      <div className="field">
        <label htmlFor="cf-details">Project Details</label>
        <textarea
          id="cf-details"
          name="details"
          rows={5}
          value={form.details}
          onChange={set("details")}
          onBlur={blur("details")}
          aria-invalid={errors.details ? "true" : undefined}
          aria-describedby={errors.details ? "cf-details-err" : undefined}
          placeholder="What do you want to build, who is it for, and what problem does it solve?"
          required
        />
        <FieldError id="cf-details-err" msg={errors.details} />
      </div>

      {/* Honeypot — hidden from people and assistive tech, tempting to bots. */}
      <div className="cform__hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
      </div>

      <button type="submit" className="btn btn--primary cform__submit" disabled={status === "sending"}>
        {status === "sending" ? (
          <><LoaderCircle size={18} className="spin" aria-hidden="true" /> Sending…</>
        ) : (
          <>{ENDPOINT ? "Send Message" : "Send on WhatsApp"} <Send size={18} aria-hidden="true" /></>
        )}
      </button>

      {!ENDPOINT && (
        <p className="cform__note">
          This opens WhatsApp with your message filled in. Nothing is sent until you press send there.
        </p>
      )}

      <output className="cform__status">
        {status === "sent" && (
          <p className="cform__msg cform__msg--ok">
            <CircleCheck size={20} aria-hidden="true" /> Thank you. Your message has been sent and we will reply by email.
          </p>
        )}
        {status === "handoff" && (
          <p className="cform__msg cform__msg--ok">
            <CircleCheck size={20} aria-hidden="true" />
            <span>
              WhatsApp should now be open with your message ready — press send there. If it did not open,{" "}
              <a href={whatsappLink(summary(form))} target="_blank" rel="noopener noreferrer">open WhatsApp</a> or email{" "}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            </span>
          </p>
        )}
        {status === "failed" && (
          <p className="cform__msg cform__msg--err">
            <CircleAlert size={20} aria-hidden="true" />
            <span>
              Sorry, your message could not be sent. Please try again, or email{" "}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> directly.
            </span>
          </p>
        )}
      </output>
    </form>
  );
}

function FieldError({ id, msg }) {
  if (!msg) return null;
  return (
    <p className="field__err" id={id}>
      <CircleAlert size={15} aria-hidden="true" /> {msg}
    </p>
  );
}
