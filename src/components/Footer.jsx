import { Link } from "react-router";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { CONTACT, NAV, whatsappLink } from "../data/site";
import { services } from "../data/services";
import { Logo, Marquee, Reveal } from "./ui";

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <Marquee items={services.map((s) => s.title)} />
      <div className="footer__geo" aria-hidden="true" />
      <div className="container footer__grid">
        <Reveal className="footer__brand">
          <Link to="/" aria-label="Codefloor IT — home">
            <Logo />
          </Link>
          <p>
            Codefloor IT designs and develops custom software, web applications and websites for
            businesses building their next stage of digital growth.
          </p>
        </Reveal>

        <Reveal as="nav" delay={80} aria-label="Footer">
          <h2 className="footer__h">Company</h2>
          <ul>
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to}>{n.label}</Link></li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="nav" delay={160} aria-label="Services">
          <h2 className="footer__h">Services</h2>
          <ul>
            {services.map((s) => (
              <li key={s.slug}><Link to={`/services/${s.slug}`}>{s.title}</Link></li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={240}>
          <h2 className="footer__h">Contact</h2>
          <ul>
            <li>
              <a href={`mailto:${CONTACT.email}`}><Mail size={16} aria-hidden="true" /> {CONTACT.email}</a>
            </li>
            <li>
              <a href={CONTACT.phoneHref}><Phone size={16} aria-hidden="true" /> {CONTACT.phoneDisplay}</a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" /> WhatsApp</a>
            </li>
          </ul>
        </Reveal>
      </div>

      <div className="container footer__base">
        <p>© {YEAR} Codefloor IT. All rights reserved.</p>
        <ul>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/terms">Terms &amp; Conditions</Link></li>
        </ul>
      </div>
    </footer>
  );
}
