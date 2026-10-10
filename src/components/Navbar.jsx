import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import { NAV } from "../data/site";
import { Btn, Logo } from "./ui";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""} ${open ? "nav--open" : ""}`}>
      <div className="nav__bar">
        <Link to="/" className="nav__logo" aria-label="Codefloor IT — home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="nav__links">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === "/"} className="nav__link">
              {n.label}
            </NavLink>
          ))}
        </nav>

        <Btn to="/contact" magnetic className="nav__cta">Let's Talk</Btn>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      <nav id="mobile-menu" aria-label="Mobile" className="nav__panel" inert={!open}>
        {NAV.map((n, i) => (
          <NavLink key={n.to} to={n.to} end={n.to === "/"} className="nav__plink" style={{ "--i": i }} onClick={() => setOpen(false)}>
            {n.label}
          </NavLink>
        ))}
        <Btn to="/contact" arrow className="nav__pcta" onClick={() => setOpen(false)}>Let's Talk</Btn>
      </nav>
    </header>
  );
}
