import { CONTACT, HOME_FAQ, PROCESS, whatsappLink } from "./site.js";
import { services } from "./services.js";
import { projects } from "./projects.js";

/* Everything Sukaram knows and says. The assistant UI only renders what this module
   returns, so company facts are edited here (or in the data files it reads), never in
   the components. Sukaram is scripted: answers come from the site's own content.
   Do not add prices, timelines, clients or claims that are not on the website. */

export const COMPANY = {
  name: "Codefloor IT",
  url: "https://codefloorit.in/",
  founded: 2025,
};

/** sessionStorage key: a project description typed to Sukaram, offered back by the contact form. */
export const BRIEF_KEY = "sukaram-brief";

const [FAQ_WHAT, , , FAQ_AFTER, FAQ_START] = HOME_FAQ;

/** localStorage key set once the hero introduction has played for this visitor. */
export const INTRO_SEEN_KEY = "sukaram-intro-seen";

/* The introduction Sukaram gives from the home page hero, one speech bubble per entry.
   `items` are listed under the text, `actions` are the buttons that close the introduction.
   Services and process come from the same data the rest of the site uses. */
export const INTRO = [
  { text: `Hey there! 👋 Welcome to ${COMPANY.name}! I'm Sukaram, your digital guide. Let me introduce you to what we do!` },
  {
    text: `Founded in ${COMPANY.founded}, ${COMPANY.name} is a technology company that helps businesses turn their ideas into digital solutions. We build modern websites and custom web applications designed around business needs.`,
  },
  {
    text: "Here's how we can help you!",
    items: services.map((s) => ({ to: `/services/${s.slug}`, title: s.title, text: s.short })),
  },
  {
    text: `Every project starts with understanding your requirements, then moves through ${PROCESS.length} stages: ${PROCESS.map((s) => s.title).join(", ")}.`,
  },
  {
    text: "That's us in a nutshell. Where would you like to go next?",
    actions: [
      { to: "/services", label: "Explore Our Services" },
      { to: "/work", label: "View Our Projects" },
      { to: "/contact", label: `Contact ${COMPANY.name}` },
    ],
  },
];

export const GREETING =
  `Hey there! 👋 Welcome to ${COMPANY.name}. I'm Sukaram, your virtual assistant. We've been building websites and custom software since ${COMPANY.founded}. I can help you explore our services, discover our work, and find the right digital solution for your business. What would you like to know?`;

export const SUGGESTIONS = [
  { label: `What is ${COMPANY.name}?`, node: "about" },
  { label: "What services do you offer?", node: "services" },
  { label: "Can you build a custom web application?", node: "webapp" },
  { label: "Can I see your projects?", node: "projects" },
  { label: "How does your development process work?", node: "process" },
  { label: `How can I contact ${COMPANY.name}?`, node: "contact" },
];

/* One-line tips Sukaram may offer when a section scrolls into view
   (sections opt in with data-robot-hint="<key>"). */
export const HINTS = {
  services: { text: "Looking at our services? I can sum each one up.", label: "What services do you offer?", node: "services" },
  work: { text: "This is work we have built. Want the short version?", label: "Can I see your projects?", node: "projects" },
  process: { text: "Curious how a project runs? I can walk you through it.", label: "How does your development process work?", node: "process" },
  contact: { text: "Ready to talk? I can show you the quickest way to reach us.", label: `How can I contact ${COMPANY.name}?`, node: "contact" },
};

const BACK = { label: "Back to start", node: "start" };
const START = { label: "I have a project in mind", node: "build" };
const TO = {
  services: { to: "/services", label: "Explore Services" },
  work: { to: "/work", label: "View Our Work" },
  contact: { to: "/contact", label: "Contact Us" },
};

/** Shown when a reply cannot be produced at all (e.g. a future backend is unreachable). */
export const FAILED = {
  text: "Sorry, I could not answer that just now. You can reach the team directly.",
  links: [{ href: `mailto:${CONTACT.email}`, label: CONTACT.email }, TO.contact],
  options: SUGGESTIONS,
};

/** The scripted reply for a conversation node: { text, list?, links?, options, mood? }. */
export function reply(node) {
  const [kind, slug] = node.split(":");
  const service = services.find((s) => s.slug === slug);

  if (kind === "about") {
    return {
      text: `${COMPANY.name} was founded in ${COMPANY.founded}. ${FAQ_WHAT.a}`,
      links: [TO.services, TO.work, { to: "/about", label: "Read more about us" }],
      options: [START, BACK],
    };
  }
  if (kind === "me") {
    return {
      text: `I'm Sukaram, the virtual assistant of ${COMPANY.name}. I give prepared answers from our website — I'm not a live AI model — and the team is one message away for anything I can't cover.`,
      links: [TO.contact],
      options: SUGGESTIONS,
    };
  }
  if (kind === "services") {
    return {
      text: `We offer ${services.length} services. Pick one to hear what it solves.`,
      mood: "point",
      links: [TO.services],
      options: [...services.map((s) => ({ label: s.title, node: `service:${s.slug}` })), BACK],
    };
  }
  if (kind === "service" && service) {
    return {
      text: `${service.title}: ${service.short} ${service.intro}`,
      mood: "point",
      links: [
        { to: `/services/${service.slug}`, label: "Open the service page" },
        { to: `/contact?service=${service.slug}`, label: "Discuss this service" },
      ],
      options: [{ label: "Other services", node: "services" }, BACK],
    };
  }
  if (kind === "webapp") {
    const s = services.find((x) => x.slug === "web-application-development");
    return {
      text: `Yes, ${s.title} is one of our services. ${s.short} ${s.intro}`,
      mood: "happy",
      links: [
        { to: `/services/${s.slug}`, label: "Open the service page" },
        { to: `/contact?service=${s.slug}`, label: "Discuss your web application" },
      ],
      options: [{ label: "Other services", node: "services" }, BACK],
    };
  }
  if (kind === "projects") {
    return {
      text: "These are the projects we can show. Pick one for a summary.",
      mood: "point",
      links: [TO.work],
      options: [...projects.map((p) => ({ label: p.title, node: `project:${p.slug}` })), BACK],
    };
  }
  if (kind === "project") {
    const p = projects.find((x) => x.slug === slug);
    if (p) {
      return {
        text: `${p.title} (${p.category}, status: ${p.status}). ${p.summary}`,
        links: [{ to: `/work/${p.slug}`, label: "Read the case study" }, TO.work],
        options: [{ label: "Other projects", node: "projects" }, BACK],
      };
    }
  }
  if (kind === "process") {
    return {
      text: `Every project moves through ${PROCESS.length} stages:`,
      list: PROCESS.map((s) => `${s.title} — ${s.text}`),
      links: [{ to: "/contact", label: "Start a conversation" }],
      options: [START, BACK],
    };
  }
  if (kind === "after") {
    return { text: FAQ_AFTER.a, links: [TO.contact], options: [{ label: "How does a project run?", node: "process" }, BACK] };
  }
  if (kind === "contact") {
    return {
      text: "You can reach us directly, or send your project details through the contact form.",
      mood: "greet",
      links: [
        { href: `mailto:${CONTACT.email}`, label: CONTACT.email },
        { href: CONTACT.phoneHref, label: CONTACT.phoneDisplay },
        { href: whatsappLink(), label: "Chat on WhatsApp" },
        { to: "/contact", label: "Open the contact form" },
      ],
      options: [BACK],
    };
  }
  if (kind === "build") {
    return {
      text: "Happy to help. What would you like to build? Pick the closest fit and I'll point you to the contact form with it already selected.",
      mood: "happy",
      options: [
        ...services.map((s) => ({ label: s.title, node: `brief:${s.slug}` })),
        { label: "Not sure yet", node: "brief" },
        BACK,
      ],
    };
  }
  if (kind === "brief") {
    return {
      text: `${service ? `${service.title} it is. ` : "No problem. "}${FAQ_START.a} Nothing is sent until you submit the form yourself.`,
      links: [
        { to: service ? `/contact?service=${service.slug}` : "/contact", label: "Open the contact form" },
        { href: whatsappLink(), label: "Chat on WhatsApp" },
      ],
      options: [BACK],
    };
  }
  if (kind === "pricing") {
    return {
      text: `I can't quote prices, timelines or guarantees — they depend on what you need. ${FAQ_START.a}`,
      links: [TO.contact],
      options: [START, BACK],
    };
  }
  if (kind === "hello") {
    return {
      text: `Hello! I'm Sukaram. Ask me about ${COMPANY.name}'s services, projects, process or how to get in touch.`,
      mood: "greet",
      options: SUGGESTIONS,
    };
  }
  if (kind === "thanks") {
    return { text: "Glad I could help! Is there anything else you'd like to know?", mood: "happy", options: SUGGESTIONS };
  }
  if (kind === "bye") {
    return {
      text: `Goodbye, and thanks for visiting ${COMPANY.name}. I'm right here if you need me again.`,
      mood: "farewell",
      options: [BACK],
    };
  }
  if (kind === "unknown") {
    return {
      text: `I'm not completely sure about that yet, but our team can help you with the details. Would you like to contact ${COMPANY.name}?`,
      links: [TO.contact],
      options: SUGGESTIONS,
    };
  }
  return { text: "What else would you like to know?", options: SUGGESTIONS };
}

/* Typed questions: first matching pattern wins, so order matters (specific before general).
   ponytail: keyword matching, not language understanding — swap respond() for a backend call when that stops being enough. */
const INTENTS = [
  [/\b(price|prices|pricing|cost|costs|budget|quote|charges?|fees?|rates?|how much|timeline|deadline|how long|how fast|guarantee\w*)\b/, "pricing"],
  [/\b(are you (an? )?(ai|bot|robot|human|real|person)|who are you|your name|sukaram)\b/, "me"],
  [/\b(contact|email|e-mail|mail|phone|call|whats\s?app|reach|get in touch|talk to|number)\b/, "contact"],
  [/\b(process|workflow|how do you work|steps?|stages?|methodology|approach)\b/, "process"],
  [/\b(after (launch|delivery|the project)|post-?launch|once it is live|handover)\b/, "after"],
  [/\b(e-?commerce|online (store|shop)|web ?shop|shopping|payments?)\b/, "service:ecommerce-development"],
  [/\b(web[\s-]?app(lication)?s?|dashboards?|portals?|booking|saas|platforms?)\b/, "webapp"],
  [/\b(moderni[sz]\w*|redesign\w*|revamp\w*|rebuild|outdated|old (web)?site|existing (web)?site)\b/, "service:website-modernization"],
  [/\b(maintenance|maintain\w*|support|bugs?|fix(es|ing)?|updates?)\b/, "service:maintenance-technical-support"],
  [/\b(custom software|software|crm|erp|inventory|automation|automate|internal tool|management system)\b/, "service:custom-software-development"],
  [/\b(web ?sites?|landing pages?|web ?pages?)\b/, "service:business-website-development"],
  [/\b(have (a|an|my) (project|idea)|(start|starting|begin) (a|my|our) project|new project|hire you|work with you|get started)\b/, "build"],
  [/\b(projects?|portfolio|case stud(y|ies)|(your|past|previous|our) work|examples?|clients?)\b/, "projects"],
  [/\b(services?|offer\w*|provide|what (do|can) you do)\b/, "services"],
  [/\b(need|want|build|make|create|develop|looking for)\b/, "build"],
  [/\b(codefloor|company|founded|history|about (you|us)|who (are|is) (you|they|behind))\b/, "about"],
  [/\b(thanks?|thank you|thx)\b/, "thanks"],
  [/\b(bye|goodbye|see you)\b/, "bye"],
  [/\b(hi|hello|hey|namaste|good (morning|afternoon|evening))\b/, "hello"],
];

/** The conversation node a typed question maps to; "unknown" when nothing fits. */
export function match(text) {
  const t = text.toLowerCase();
  return INTENTS.find(([re]) => re.test(t))?.[1] ?? "unknown";
}

/* The one place a typed question becomes an answer. To add real AI later, replace the
   body with a fetch to your own backend and keep the returned shape — never put a
   model API key in frontend code. */
export async function respond(text) {
  return reply(match(text));
}
