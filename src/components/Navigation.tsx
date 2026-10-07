"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { COPY, NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false),
    [active, setActive] = useState(""),
    [open, setOpen] = useState(false),
    [closing, setClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTarget = useRef<string | undefined>(undefined);
  const closeMenu = (target?: string) => {
    if (closeTimer.current !== null) return;
    setClosing(true);
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 420;
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      pendingTarget.current = target;
      setOpen(false);
      setClosing(false);
    }, duration);
  };
  useEffect(
    () => () => {
      if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    },
    [],
  );
  const progress = useRef<HTMLDivElement>(null),
    pill = useRef<HTMLDivElement>(null),
    indicator = useRef<HTMLSpanElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(scrollY > 40);
      const p =
        scrollY /
        Math.max(1, document.documentElement.scrollHeight - innerHeight);
      progress.current?.style.setProperty("transform", `scaleX(${p})`);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActive(entry.target.id === "hero" ? "" : entry.target.id);
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["hero", ...NAV.map((n) => n.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      io.disconnect();
    };
  }, []);
  useEffect(() => {
    const update = () => {
      const link = pill.current?.querySelector<HTMLElement>(
        `a[href="#${active}"]`,
      );
      const el = indicator.current;
      if (!el) return;
      el.style.opacity = link ? "1" : "0";
      if (link) {
        el.style.width = `${link.offsetWidth}px`;
        el.style.transform = `translateX(${link.offsetLeft}px)`;
      }
    };
    update();
    addEventListener("resize", update);
    return () => removeEventListener("resize", update);
  }, [active]);
  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;
    let navigationFrame = 0;
    const oldOverflow = document.body.style.overflow;
    if (open) {
      modal.showModal();
      document.body.style.overflow = "hidden";
      lockScroll(true);
    } else if (modal.open) {
      modal.close();
      trigger.current?.focus({ preventScroll: true });
      if (pendingTarget.current) {
        const target = pendingTarget.current;
        pendingTarget.current = undefined;
        navigationFrame = requestAnimationFrame(() => {
          navigationFrame = requestAnimationFrame(() => scrollToTarget(target));
        });
      }
    }
    return () => {
      cancelAnimationFrame(navigationFrame);
      document.body.style.overflow = oldOverflow;
      lockScroll(false);
    };
  }, [open]);
  useEffect(() => {
    const mq = matchMedia("(min-width: 1000px)");
    const resize = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", resize);
    return () => mq.removeEventListener("change", resize);
  }, []);
  const navigate = (id: string) => {
    if (open) closeMenu(id);
    else scrollToTarget(id);
  };
  return (
    <>
      <div ref={progress} className="page-progress" aria-hidden="true" />
      <nav
        className={`navigation ${scrolled ? "scrolled" : ""}`}
        aria-label={COPY.ui.nav}
      >
        <a
          className="identity"
          href="#hero"
          aria-label={`${PROFILE.initials} ${PROFILE.name}`}
          onClick={(e) => {
            e.preventDefault();
            navigate("hero");
          }}
        >
          <span className="initials" aria-hidden="true">
            {PROFILE.initials}
          </span>
          <span className="identity-name">{PROFILE.name}</span>
        </a>
        <div ref={pill} className="nav-pill">
          <span ref={indicator} className="nav-indicator" />
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              aria-current={active === n.id ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigate(n.id);
              }}
            >
              {n.label}
            </a>
          ))}
        </div>
        <button
          ref={trigger}
          className="menu-toggle button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          {COPY.ui.menu}
          <span aria-hidden="true">＋</span>
        </button>
      </nav>
      <dialog
        id="mobile-menu"
        ref={dialog}
        className={`mobile-menu ${closing ? "is-closing" : ""}`}
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        aria-label={COPY.ui.nav}
      >
        <div className="menu-top">
          <span className="initials">{PROFILE.initials}</span>
          <button className="button" onClick={() => closeMenu()}>
            {COPY.ui.close} ×
          </button>
        </div>
        <div className="mobile-links">
          {NAV.map((n, i) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              aria-current={active === n.id ? "location" : undefined}
              style={{ "--i": i } as CSSProperties}
              onClick={(e) => {
                e.preventDefault();
                navigate(n.id);
              }}
            >
              <span className="mono">0{i + 1}</span>
              <span className="menu-label">{n.label}</span>
              <span className="menu-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </div>
        <a className="menu-email" href={`mailto:${PROFILE.email}`}>
          {PROFILE.email}
        </a>
      </dialog>
      <style>{`
.page-progress {
  position: fixed;
  inset: 0 0 auto;
  height: 2px;
  transform: scaleX(0);
  transform-origin: left;
  background: var(--ink);
  z-index: 110;
}
.navigation {
  position: fixed;
  top: 23px;
  left: var(--gutter);
  right: var(--gutter);
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  pointer-events: none;
}
.navigation > * {
  pointer-events: auto;
}
.identity {
  display: flex;
  align-items: center;
  gap: 12px;
}
.initials {
  width: 44px;
  height: 44px;
  flex: none;
  display: grid;
  place-items: center;
  border: 1px solid var(--ink);
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.03em;
  transition:
    transform 0.9s var(--ease),
    background 0.5s,
    color 0.5s;
}
.identity:hover .initials {
  transform: rotate(360deg);
}
.identity-name {
  font-size: 13px;
  transition: opacity 0.4s var(--ease);
  font-weight: 500;
}
.scrolled .identity-name {
  opacity: 0;
}
.scrolled .initials {
  background: var(--ink);
  color: white;
}
.nav-pill {
  position: relative;
  display: flex;
  align-items: center;
  padding: 6px;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid transparent;
  border-radius: 99px;
  transition:
    background 0.4s,
    border-color 0.4s,
    box-shadow 0.4s;
}
.scrolled .nav-pill {
  background: rgba(255, 255, 255, 0.84);
  backdrop-filter: blur(12px);
  border-color: var(--line);
  box-shadow: 0 6px 32px #00000005;
}
.nav-pill a {
  position: relative;
  z-index: 1;
  font-size: 12px;
  padding: 12px 18px;
  transition: color 0.35s;
}
.nav-pill a[aria-current] {
  color: white;
}
.nav-indicator {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 0;
  background: var(--ink);
  border-radius: 99px;
  opacity: 0;
  transition:
    transform 0.5s var(--ease),
    width 0.5s var(--ease),
    opacity 0.3s;
}
.menu-toggle {
  display: none;
  background: var(--paper);
  padding: 10px 20px;
  min-height: 44px;
}
.mobile-menu {
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: 100%;
  height: 100svh;
  max-height: 100svh;
  padding: 24px var(--gutter);
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  border: none;
  z-index: 100;
  overflow-y: auto;
}
.mobile-menu[open] {
  animation: menu-reveal 0.6s var(--ease);
}
.mobile-menu::backdrop {
  background: rgba(13,13,13,.12);
}
.menu-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mobile-links {
  display: flex;
  flex-direction: column;
  margin-block: 45px;
}
.mobile-links a {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: clamp(30px, 7vh, 54px);
  letter-spacing: -0.04em;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  animation: none;
}
.mobile-links .mono {
  color: var(--muted-text);
}
.menu-arrow {
  margin-left: auto;
  font-size: 24px;
}
.menu-email {
  font-size: 14px;
  overflow-wrap: anywhere;
}
@keyframes menu-reveal {
  from {
    clip-path: inset(0 0 100% 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
@keyframes link-reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@media (max-width: 999px) {
  .nav-pill {
    display: none;
  }
  .menu-toggle {
    display: flex;
  }
  .navigation {
    top: 18px;
  }
  .identity-name {
    max-width: 150px;
    line-height: 1.2;
  }
}
@media (max-width: 420px) {
  .identity-name {
    font-size: 12px;
    max-width: 115px;
  }
}

.nav-pill a {
  font-size: 13px;
  padding: 12px 18px;
  min-height: 44px;
}
.identity-name {
  font-size: 14px;
}
.nav-pill a:not([aria-current]):hover {
  color: var(--muted-text);
}
.mobile-links a {
  padding-block: 14px;
}
.menu-email {
  padding-block: 15px;
  display: inline-block;
}
.scrolled .nav-pill {
  box-shadow: 0 8px 32px #00000006;
}
.identity:focus-visible {
  border-radius: 30px;
}
@media (max-width: 420px) {
  .identity-name {
    font-size: 12px;
  }
}

.nav-pill {
  box-shadow: inset 0 0 0 1px #ffffff60;
  transition:
    box-shadow 0.6s var(--ease),
    background 0.6s var(--ease);
}
.scrolled .nav-pill {
  box-shadow:
    inset 0 0 0 1px #0d0d0d0b,
    0 8px 30px #00000005;
}
.identity-name {
  letter-spacing: -0.025em;
}
.initials {
  box-shadow: 0 0 0 5px #f4f2ee80;
}
.mobile-links a {
  border-bottom: 1px solid var(--line);
}
.mobile-links .menu-arrow {
  transition: transform 0.4s var(--ease);
}
.mobile-links a:hover .menu-arrow {
  transform: translate(5px, -5px);
}
.menu-email {
  padding-bottom: 8px;
  border-bottom: 1px solid var(--line);
}

/* The native dialog stays modal and scroll-locked through its exit. */
.mobile-menu[open]{animation:menu-reveal 700ms var(--ease) both}
.mobile-menu[open] .mobile-links a{animation:link-reveal 800ms var(--ease) both;animation-delay:calc(100ms + var(--i) * 65ms)}
.mobile-menu[open] .menu-top{animation:link-reveal 650ms var(--ease) both}
.mobile-menu[open] .menu-email{animation:link-reveal 750ms var(--ease) 350ms both}
.mobile-links a{position:relative;isolation:isolate}
.mobile-links a::after{content:"";position:absolute;inset:auto 0 -1px;height:1px;background:var(--ink);transform:scaleX(0);transform-origin:left;transition:transform 600ms var(--ease)}
.menu-label{display:block;transition:transform 650ms var(--ease)}
.mobile-links a:is(:hover,:focus-visible) .menu-label{transform:translateX(12px)}
.mobile-links a:is(:hover,:focus-visible)::after{transform:scaleX(1)}
.mobile-links a:focus-visible .menu-arrow{transform:translate(5px,-5px)}
.mobile-links a[aria-current] .mono{color:var(--ink);font-weight:700}
.mobile-menu.is-closing[open]{animation:menu-dismiss 420ms var(--ease) both}
.mobile-menu.is-closing[open] .mobile-links a,
.mobile-menu.is-closing[open] .menu-top,
.mobile-menu.is-closing[open] .menu-email{animation:menu-content-dismiss 260ms var(--ease) both}
@keyframes menu-dismiss{from{clip-path:inset(0 0 0 0)}to{clip-path:inset(0 0 100% 0)}}
@keyframes menu-content-dismiss{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-12px)}}
@media(prefers-reduced-motion:reduce){
 .mobile-menu[open],.mobile-menu[open] .mobile-links a,.mobile-menu[open] .menu-top,.mobile-menu[open] .menu-email{animation:none!important}
 .mobile-links .menu-label,.mobile-links .menu-arrow,.mobile-links a::after{transition:none;transform:none!important}
}
`}</style>
    </>
  );
}
