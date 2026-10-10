/**
 * Real projects only. Keep the `status` field honest:
 *   "Completed"       — delivered and in use
 *   "In Development"  — actively being built, not a live production system
 *   "Upcoming"        — planned, not started
 */

export const projects = [
  {
    slug: "oracle-legal-consultancy",
    title: "Oracle Legal Consultancy",
    category: "Legal & Professional Services",
    industry: "Legal",
    filters: ["web"],
    status: "Completed",
    scene: "legal",
    order: 1,
    summary:
      "A professional digital platform for a legal consultancy — a credible online presence with structured content and admin-managed information.",
    description:
      "A professional digital platform created for a legal consultancy business, combining a modern online presence with structured content and business-focused functionality.",
    tech: ["React", "Vite", "Node.js", "Responsive UI", "SEO structure"],
    overview:
      "Oracle Legal Consultancy is a modern website and content platform built for a legal consultancy business. It gives the practice a professional, trustworthy online presence and organises its services, vision, and background into a structure that prospective clients can follow easily.",
    challenge:
      "Legal consultancy is a credibility business. Potential clients research quietly before they ever make contact, and an outdated or confusing website costs enquiries before a conversation can happen. The consultancy needed a digital presence that signalled professionalism, explained its services in plain language, and made getting in touch straightforward — without depending on a developer every time the content changed.",
    approach: [
      "We started with the questions a prospective client is actually asking: what does this firm do, is it credible, and how do I reach it. Everything on the site is organised to answer those quickly.",
      "We designed a restrained, professional interface — typography and spacing that read as considered rather than flashy — and structured the content into clear sections for services, vision, and background.",
      "Because the practice needed to keep information current, we built an admin-managed content layer so key sections can be updated in-house without touching code.",
    ],
    solution:
      "Codefloor IT designed and developed a responsive website with a professional visual identity, a clear service presentation, a vision section, admin-controlled dynamic content, and a contact and enquiry flow. The structure is SEO-friendly, with semantic markup and correct heading hierarchy, so the practice can be found for the services it offers.",
    featureGroups: [
      {
        h: "Presence & content",
        items: [
          "Professional, responsive website",
          "Structured service presentation",
          "Vision and background sections",
          "Admin-controlled dynamic content",
        ],
      },
      {
        h: "Client interaction",
        items: [
          "Contact and enquiry functionality",
          "Clear calls to action on every page",
          "Mobile-friendly navigation",
        ],
      },
      {
        h: "Foundations",
        items: ["SEO-friendly structure", "Semantic HTML and heading hierarchy", "Fast, lightweight pages"],
      },
    ],
    ux:
      "The experience is built to reduce friction for someone deciding whether to reach out. Information is scannable, the tone is professional, and the path from landing on the site to sending an enquiry is short and obvious on any device.",
    outcome:
      "The result is a clearer, more credible digital front door for the consultancy. Prospective clients get a straightforward route from discovering the practice to understanding its services and making contact, and the team can keep the content current without external help.",
    seoTitle: "Oracle Legal Consultancy — Legal Consultancy Website Development | Codefloor IT",
    seoDescription:
      "How Codefloor IT designed and developed a professional legal consultancy website with structured content, admin-managed sections, an enquiry flow, and an SEO-friendly structure.",
    seoTopics: [
      "legal consultancy website development",
      "law firm website development",
      "professional services website",
      "custom business website",
    ],
    relatedInsights: ["professional-business-website", "website-vs-web-application", "choose-software-company"],
    relatedIndustry: "legal",
  },
  {
    slug: "aranya-palace",
    title: "Aranya Palace",
    category: "Hospitality / Hotel Technology",
    industry: "Hospitality",
    filters: ["web", "software"],
    status: "Completed",
    scene: "hotel",
    order: 2,
    summary:
      "A hotel and hospitality platform giving guests an engaging digital experience while supporting booking and management operations.",
    description:
      "A modern hotel and hospitality platform designed to provide guests with an engaging digital experience while supporting hotel booking and management operations.",
    tech: ["React", "Vite", "Node.js", "Responsive UI"],
    overview:
      "Aranya Palace is a hospitality platform built around two audiences: guests deciding where to stay, and the team running the property. For guests, it presents the hotel, its rooms, and its offers in a way that builds confidence before booking. For the property, it supports the booking and management side of day-to-day operations.",
    challenge:
      "Guests rarely book a hotel they cannot picture. They want to see the rooms, understand what is included, check offers, and reach a booking decision quickly — usually on a phone. At the same time, the property needs those enquiries and bookings to arrive in a form the team can actually manage, rather than scattered across calls and messages.",
    approach: [
      "We designed the guest journey first: discover the property, browse rooms, view details and imagery, check offers, and move toward a booking without dead ends.",
      "We treated photography and room presentation as core functionality, not decoration — the gallery and room detail views are built to do the persuading.",
      "On the operations side, we structured bookings and guest information so they land in an organised, reviewable place instead of an inbox.",
    ],
    solution:
      "Codefloor IT designed and developed a responsive hotel website with room discovery, detailed room pages, a booking-oriented flow, an offers section, and a property gallery — paired with booking and customer management support and an admin view for the team.",
    featureGroups: [
      {
        h: "Guest experience",
        items: [
          "Hotel website with property storytelling",
          "Room discovery and filtering",
          "Detailed room pages",
          "Offers and packages",
          "Property gallery",
        ],
      },
      {
        h: "Booking",
        items: ["Booking flow and enquiry", "Date and room selection", "Guest information capture"],
      },
      {
        h: "Management",
        items: [
          "Booking management view",
          "Customer / guest records",
          "Admin dashboard for the property team",
        ],
      },
    ],
    ux:
      "The guest side is visual, fast, and mobile-first, with room information laid out the way people compare options. The management side turns what would otherwise be loose enquiries into a structured list the team can work through.",
    outcome:
      "Aranya Palace gives the property a polished digital front door and a more organised way to receive and handle bookings — the information a guest needs to choose it, and the structure the team needs to run it.",
    seoTitle: "Aranya Palace — Hotel Website & Booking System Development | Codefloor IT",
    seoDescription:
      "A case study on the Aranya Palace hotel website and booking platform built by Codefloor IT — room discovery, a booking flow, offers, gallery, and booking management for the property team.",
    seoTopics: [
      "hotel website development",
      "hotel booking website",
      "hotel booking system",
      "hotel management software",
      "hospitality software development",
      "hotel reservation system",
    ],
    relatedInsights: ["modern-hotel-website", "hotel-booking-system", "hotel-website-vs-platform"],
    relatedIndustry: "hospitality",
  },
  {
    slug: "patient-handling-system",
    title: "Patient Handling & Doctor Appointment Management System",
    category: "Healthcare Software",
    industry: "Healthcare",
    filters: ["software", "dev"],
    status: "In Development",
    scene: "healthcare",
    order: 3,
    summary:
      "A healthcare management platform in development — patient handling, doctor scheduling, appointment management, and role-based dashboards in one system.",
    description:
      "A healthcare management platform being developed to simplify patient handling, doctor scheduling, appointment management, and administrative workflows.",
    tech: ["React", "Node.js", "Express", "PostgreSQL", "Role-based access"],
    overview:
      "This is a healthcare management platform currently in development. Its goal is to bring patient handling, doctor scheduling, appointment management, and administrative workflows into one centralised system, with dedicated dashboards for administrators, doctors, and patients.",
    challenge:
      "Many clinics still coordinate appointments by phone, keep patient details on paper or in separate spreadsheets, and have little shared visibility into the day's schedule. That makes it hard to see who is coming in, when a doctor is free, or what a patient's history is — and every change means another call.",
    approach: [
      "We are modelling the core records first — patients, doctors, appointments, and their states — so the system has a solid data foundation before screens are built on top of it.",
      "We are designing three distinct experiences, one per role, because an administrator, a doctor, and a patient each need a different view of the same information.",
      "We are building in working increments and validating each workflow — registration, scheduling, rescheduling, cancellation — against how a clinic actually operates.",
    ],
    solution:
      "The planned platform centralises patient information, structures the appointment lifecycle, coordinates doctor availability, and gives each role a dashboard focused on its own tasks. It is being built to be extended as requirements from real clinic use become clearer.",
    featureGroups: [
      {
        h: "Patient management",
        items: [
          "Patient registration and profiles",
          "Contact information",
          "Appointment and visit history",
          "Search, filtering, and patient status",
        ],
      },
      {
        h: "Doctor management",
        items: [
          "Doctor profiles and specialisations",
          "Availability and schedule management",
          "Doctor-side appointment management",
        ],
      },
      {
        h: "Appointment management",
        items: [
          "Appointment booking with date and time selection",
          "Doctor-availability-aware scheduling",
          "Appointment status tracking",
          "Rescheduling and cancellation",
          "Appointment history",
        ],
      },
      {
        h: "Role-based dashboards",
        items: [
          "Admin dashboard — totals, today's and upcoming appointments, doctors, activity",
          "Doctor dashboard — today's schedule, upcoming appointments, availability, patient info",
          "Patient dashboard — upcoming and previous appointments, doctor info, profile, status",
        ],
      },
    ],
    ux:
      "The intent is to replace repeated phone calls and scattered records with one place where each person — front desk, doctor, patient — can see and manage exactly what is relevant to them.",
    outcome:
      "This project is in active development and is not a live production healthcare system. Current work focuses on structured workflows and role-based dashboards for clinics, individual doctors, and multi-doctor practices.",
    seoTitle: "Patient Handling & Doctor Appointment Management System | Codefloor IT",
    seoDescription:
      "An in-development healthcare management platform by Codefloor IT for patient handling, doctor scheduling, appointment management, and role-based admin, doctor, and patient dashboards.",
    seoTopics: [
      "patient management software",
      "patient management system",
      "patient handling software",
      "doctor appointment software",
      "doctor appointment booking system",
      "clinic management software",
      "healthcare management software",
      "appointment management system",
    ],
    relatedInsights: [
      "patient-management-software",
      "doctor-appointment-software",
      "manual-vs-digital-patient-records",
    ],
    relatedIndustry: "healthcare",
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);

export const FILTERS = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "software", label: "Business Software" },
  { id: "ecommerce", label: "E-Commerce" },
  { id: "dev", label: "In Development" },
];
