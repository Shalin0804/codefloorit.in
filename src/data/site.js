export const CONTACT = {
  email: "info@codefloorit.in",
  phoneDisplay: "+91 76984 75791",
  phoneHref: "tel:+917698475791",
  whatsapp: "917698475791",
  location: "Ahmedabad, Gujarat, India",
};

/** WhatsApp chat link, optionally with a pre-filled message. */
export const whatsappLink = (text) =>
  `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const NAV = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Solutions", to: "/solutions" },
  { label: "Our Work", to: "/work" },
  { label: "About Us", to: "/about" },
  { label: "Insights", to: "/insights" },
  { label: "Contact", to: "/contact" },
];

export const PROCESS = [
  { n: "01", title: "Discover", text: "We learn your business goals, users and requirements before proposing anything technical." },
  { n: "02", title: "Define", text: "We plan features, architecture, scope and milestones you can review and agree to." },
  { n: "03", title: "Design", text: "We shape user-focused interfaces and experiences around the real workflow." },
  { n: "04", title: "Develop", text: "We implement the solution in working increments and validate functionality as we go." },
  { n: "05", title: "Launch", text: "We release after testing and your approval, and hand over what your team needs." },
  { n: "06", title: "Improve", text: "We provide the agreed support and build future improvements as needs change." },
];

export const WHY = [
  { title: "Solutions designed around your requirements", text: "We start from how your business works and shape the product around it, not around a template." },
  { title: "Clear communication", text: "You know what is being built, what comes next and where the project stands." },
  { title: "Practical technology choices", text: "Well-supported tools chosen because they fit the problem, not because they are new." },
  { title: "Responsive user experiences", text: "Interfaces designed and tested for phones, tablets and desktops." },
  { title: "Maintainable development", text: "Structured code that can be extended, handed over and grown with the business." },
  { title: "Performance-conscious implementation", text: "Page weight, loading behaviour and responsiveness are considered throughout the build." },
];

export const PRINCIPLES = [
  { title: "Understand the requirement", text: "We ask how the work happens today before we suggest what to build." },
  { title: "Build what is practical", text: "We solve the problem in front of us instead of engineering for problems you do not have." },
  { title: "Design with care", text: "Clear, usable interfaces are part of the engineering, not decoration added later." },
  { title: "Keep it maintainable", text: "Software should be straightforward to change a year from now." },
  { title: "Communicate openly", text: "Honest status on scope, timeline and progress, including when something is harder than expected." },
  { title: "Keep improving", text: "Launch is a milestone. Products get better through feedback and steady iteration." },
];

export const HOME_FAQ = [
  {
    q: "What does Codefloor IT build?",
    a: "We design and develop custom software, web applications, business websites and e-commerce experiences. We also modernize existing websites and provide ongoing maintenance and technical support.",
  },
  {
    q: "Do I need to know which technology I need before contacting you?",
    a: "No. Most projects start with a business problem, not a tech stack. We help you work out the right approach, the features that matter and the next steps.",
  },
  {
    q: "Can you build software around our existing workflow?",
    a: "Yes. We map how your business runs today, then design the screens, data, roles and processes so the software supports that workflow rather than replacing it with something generic.",
  },
  {
    q: "What happens after a project launches?",
    a: "We hand over what your team needs and remain available for the agreed support, fixes and future improvements.",
  },
  {
    q: "How do we start?",
    a: "Send us a short description of what you want to build, who it is for and the problem it solves. We will reply with an honest read on scope, approach and fit.",
  },
];
