import { Blocks, LayoutDashboard, Globe, ShoppingCart, RefreshCw, LifeBuoy } from "lucide-react";

/* The only services Codefloor IT offers. Do not add to this list without approval. */
export const services = [
  {
    slug: "custom-software-development",
    seoTitle: "Custom Software Development Services",
    icon: Blocks,
    title: "Custom Software Development",
    short: "Software tailored to your business workflows and requirements.",
    intro:
      "Off-the-shelf software is built for the average of many businesses. When an important part of how you work is specific to you, generic tools create workarounds and side spreadsheets. We build software that fits the process you already have.",
    build: [
      "Client and record management systems",
      "Booking, scheduling and appointment systems",
      "Admin and operations dashboards",
      "Inventory, order and record tracking",
      "Role-based internal platforms",
      "Reporting built on your own data",
    ],
    approach: [
      { h: "Map the current process", p: "We document how the work happens today — the steps, people, decisions and edge cases — before designing anything." },
      { h: "Model the data", p: "We define the records, relationships and states the system needs, so reporting and future features are possible from day one." },
      { h: "Roles and permissions", p: "Different people need different views. Each user gets the information and actions relevant to them." },
    ],
    faqs: [
      { q: "When does custom software make sense over a ready-made product?", a: "When your core workflow is unusual, when existing tools force awkward workarounds, or when you need one connected system instead of several disconnected products." },
      { q: "Can custom software replace our spreadsheets?", a: "That is one of the most common starting points. We turn the logic living in spreadsheets into a structured system with validation, history, roles and reporting." },
    ],
    projects: ["patient-handling-system", "aranya-palace"],
  },
  {
    slug: "web-application-development",
    seoTitle: "Custom Web Application Development",
    icon: LayoutDashboard,
    title: "Web Application Development",
    short: "Scalable dashboards, portals, booking systems and business platforms.",
    intro:
      "A web application is software people log in to and get work done with — in any browser, on any device. We build dashboards, portals, booking systems and interactive platforms with the structure to grow as usage does.",
    build: [
      "Customer and partner portals",
      "Admin dashboards and internal tools",
      "Booking and reservation systems",
      "Multi-role business platforms",
      "Interactive, data-driven interfaces",
      "Search, filtering and status tracking",
    ],
    approach: [
      { h: "Start with the core task", p: "We identify the main job each user comes to do and design the shortest reliable path to it." },
      { h: "Structure for growth", p: "Clear separation between interface, logic and data keeps new features from turning into rewrites." },
      { h: "Build in increments", p: "You see working software early and often, not one big reveal at the end." },
    ],
    faqs: [
      { q: "What is the difference between a website and a web application?", a: "A website mainly communicates information. A web application supports tasks: accounts, data entry, dashboards, bookings or business processes. Many projects need elements of both." },
      { q: "Will it work on phones and tablets?", a: "Yes. We design responsive interfaces and test them across phone, tablet and desktop screen sizes." },
    ],
    projects: ["patient-handling-system", "aranya-palace"],
  },
  {
    slug: "business-website-development",
    seoTitle: "Business Website Development Services",
    icon: Globe,
    title: "Business Website Development",
    short: "Professional websites focused on clarity, credibility, usability and conversion.",
    intro:
      "A website is often the first serious impression a business makes. We build professional sites that explain what you do in plain language, earn trust quickly and make the next step obvious.",
    build: [
      "Business and corporate websites",
      "Service and practice-area pages",
      "Content your team can update in-house",
      "Contact and enquiry flows",
      "Landing pages for campaigns",
      "Search-friendly page structure",
    ],
    approach: [
      { h: "Structure before styling", p: "We map pages, content and visitor journeys first, so the site stands on a clear information architecture." },
      { h: "Written for your visitor", p: "Every page answers what a prospective customer is actually asking, and ends with a clear next step." },
      { h: "Fast and findable", p: "Semantic markup, correct headings, metadata and performance work are part of the build, not an afterthought." },
    ],
    faqs: [
      { q: "What does business website development include?", a: "Planning the pages and content structure, designing and building responsive pages, contact and enquiry flows, search-friendly titles, headings and metadata, and — where content changes often — a way for your team to edit it. The exact scope is agreed before the build starts." },
      { q: "What affects the cost of a business website?", a: "Mainly the number of unique page layouts, how much of the content is ready, custom functionality such as bookings or payments, and any integrations. We quote once we understand the scope rather than from a fixed price list." },
      { q: "Can our team update the content ourselves?", a: "Yes. Where content changes often we add a simple admin area or content system so you can update text and images without a developer." },
      { q: "How long does a business website take?", a: "It depends on the number of unique pages, how ready the content is and any custom functionality. We give a realistic timeline once we understand the scope." },
    ],
    projects: ["oracle-legal-consultancy", "aranya-palace"],
  },
  {
    slug: "ecommerce-development",
    seoTitle: "E-commerce Website Development",
    icon: ShoppingCart,
    title: "E-commerce Development",
    short: "Online shopping experiences and commerce systems with suitable payment options.",
    intro:
      "Selling online is more than a product grid and a checkout button. A store needs a catalog that is easy to maintain, an order process your team can manage and a checkout customers actually finish.",
    build: [
      "Product catalogs and categories",
      "Cart, checkout and online payments",
      "Order and fulfilment management",
      "Customer accounts and order history",
      "Offers and discount rules",
      "Store admin dashboards",
    ],
    approach: [
      { h: "A catalog that scales", p: "Products, variants and categories are structured so adding stock later is quick and consistent." },
      { h: "A checkout people finish", p: "We keep the path to purchase short and clear, with as few steps and surprises as possible." },
      { h: "The back office too", p: "Orders, stock and customers are manageable by your team, so running the store does not depend on a developer." },
    ],
    faqs: [
      { q: "Do you build custom stores or use an existing platform?", a: "Either, depending on the requirement. A platform-based store is faster to launch for standard catalogs; a custom build makes sense when products, pricing or checkout logic are unusual." },
      { q: "Can you set up payment gateways used in India?", a: "Yes. We set up the payment provider that suits your business, along with the order and confirmation flow around it." },
    ],
    projects: [],
  },
  {
    slug: "website-modernization",
    seoTitle: "Website Modernization & Redesign",
    icon: RefreshCw,
    title: "Website Modernization",
    short: "Better architecture, performance, usability and maintainability for existing sites.",
    intro:
      "An ageing website costs you quietly: slow pages, layouts that break on phones, content nobody can edit. We improve what you already have — or rebuild it where that is the more sensible route.",
    build: [
      "Performance and loading improvements",
      "Responsive redesign of existing pages",
      "Moving to a maintainable codebase",
      "Clearer navigation and content structure",
      "Accessibility and usability fixes",
      "Search-friendly markup and metadata",
    ],
    approach: [
      { h: "Review what exists", p: "We look at the current site's structure, speed and content to see what is worth keeping and what is holding it back." },
      { h: "Improve in priority order", p: "The changes with the most effect on visitors come first, so you see value before the whole job is done." },
      { h: "Keep what works", p: "Existing content, URLs and search visibility are carried over carefully rather than thrown away." },
    ],
    faqs: [
      { q: "How is an existing website modernized?", a: "We review the current site's speed, structure, content and code, then fix what affects visitors most first — loading speed, mobile layout, navigation, accessibility and metadata. If the foundation makes every change expensive, we recommend a rebuild that keeps your content and URLs." },
      { q: "Do we need a full rebuild?", a: "Not always. Sometimes targeted fixes are enough; sometimes the foundation makes every change expensive and a rebuild is cheaper in the long run. We tell you which we think applies and why." },
      { q: "Will we lose our search rankings?", a: "We plan the change to protect them: existing URLs are preserved or redirected, and titles, headings and content are carried across." },
    ],
    projects: [],
  },
  {
    slug: "maintenance-technical-support",
    seoTitle: "Website Maintenance & Technical Support",
    icon: LifeBuoy,
    title: "Maintenance & Technical Support",
    short: "Ongoing technical assistance, fixes and improvements after launch.",
    intro:
      "Software is never finished the day it goes live. Content changes, browsers update and new needs appear. We keep your website or application healthy and moving forward.",
    build: [
      "Bug fixes and troubleshooting",
      "Content and layout updates",
      "Software and dependency updates",
      "Small features and refinements",
      "Performance checks",
      "Help for your team when questions come up",
    ],
    approach: [
      { h: "Agree the scope", p: "We define what support covers and how requests are raised, so expectations are clear on both sides." },
      { h: "Fix the cause", p: "We look for why a problem happened, not just the quickest patch over the symptom." },
      { h: "Improve steadily", p: "Regular small improvements keep a product current and avoid the need for a costly overhaul later." },
    ],
    faqs: [
      { q: "What is included in website maintenance?", a: "Typically bug fixes, content and layout updates, software and dependency updates, performance checks and small improvements. The exact scope, and how requests are raised, is agreed with each client before support starts." },
      { q: "Can you maintain a site you did not build?", a: "Usually, yes. We first review the existing code to understand its condition, then tell you honestly what we can take on." },
      { q: "How is support arranged?", a: "That is agreed per client — it depends on how much change you expect and how quickly you need responses. We set it out clearly before starting." },
    ],
    projects: [],
  },
];

export const getService = (slug) => services.find((s) => s.slug === slug);
