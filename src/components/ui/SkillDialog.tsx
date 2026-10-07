"use client";
import { useEffect, useRef, useState } from "react";
import { COPY, SKILLS, SKILL_DOCS, skillProjects } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { lockScroll, scrollToTarget } from "@/lib/scroll";
import TechLogo from "./TechLogo";

export default function SkillDialog({
  skill,
  onClose,
}: {
  skill: (typeof SKILLS)[number];
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finish = useRef<(project?: string) => void>(() => {});
  const backdropPressed = useRef(false);
  const [closing, setClosing] = useState(false);
  const docs = SKILL_DOCS[skill.name];
  const projects = skillProjects(skill.name);
  const label =
    docs?.kind === "docs" ? COPY.skills.documentation : COPY.skills.resource;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;
    const origin =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      modal.close();
      document.body.style.overflow = previousOverflow;
      lockScroll(false);
      origin?.focus({ preventScroll: true });
    };
    modal.showModal();
    modal.querySelector<HTMLButtonElement>(".skill-dialog-close")?.focus({preventScroll: true});
    document.body.style.overflow = "hidden";
    lockScroll(true);
    finish.current = (project) => {
      restore();
      onCloseRef.current();
      if (project) {
        window.dispatchEvent(
          new CustomEvent("select-project", { detail: project }),
        );
        requestAnimationFrame(() =>
          requestAnimationFrame(() => scrollToTarget("work")),
        );
      }
    };
    return () => {
      if (timer.current) clearTimeout(timer.current);
      restore();
    };
  }, []);
  const dismiss = (project?: string) => {
    if (timer.current !== null) return;
    setClosing(true);
    timer.current = setTimeout(
      () => finish.current(project),
      prefersReducedMotion() ? 0 : 260,
    );
  };
  return (
    <dialog
      ref={dialog}
      id="skill-detail-dialog"
      className={`skill-dialog ${closing ? "is-closing" : ""}`}
      aria-labelledby="skill-dialog-title"
      onKeyDown={event => {
        if(event.key !== "Tab") return;
        const items = event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]');
        const first = items[0], last = items[items.length - 1];
        if(event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if(!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onPointerDown={(event) => {
        backdropPressed.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (backdropPressed.current && event.target === event.currentTarget)
          dismiss();
      }}
    >
      <div className="skill-dialog-card">
        <header className="skill-dialog-header">
          <span className="mono">
            {COPY.skills.label}{" "}
            <span className="skill-dialog-number">
              {String(skill.number).padStart(2, "0")}
            </span>
          </span>
          <button
            type="button"
            className="skill-dialog-close"
            aria-label={COPY.skills.closeDialog}
            onClick={() => dismiss()}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>
        <div className="inspector-logo skill-dialog-logo">
          <span className="inspector-orbit" aria-hidden="true" />
          <span
            className="inspector-symbol"
            aria-hidden="true"
            data-symbol={skill.symbol}
          />
          <TechLogo name={skill.name} size={124} />
        </div>
        <div className="skill-dialog-body">
          <span className="mono skill-dialog-family">{skill.family}</span>
          <h2 id="skill-dialog-title">{skill.name}</h2>
          {docs && (
            <a
              className="skill-doc-link"
              href={docs.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label}: ${skill.name} — ${docs.provider}, ${COPY.skills.newTab}`}
            >
              <span className="skill-doc-icon" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path d="M12 5v15M3 4h5c2 0 4 1 4 3 0-2 2-3 4-3h5v15h-5c-2 0-4 1-4 2 0-1-2-2-4-2H3Z" />
                </svg>
              </span>
              <span className="skill-doc-copy">
                <span className="mono">{docs.provider}</span>
                <strong>{label}</strong>
              </span>
              <span className="skill-doc-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          )}
          <div className="inspector-divider" />
          <p className="mono skill-dialog-family">{COPY.skills.used}</p>
          <div className="inspector-projects">
            {projects.length ? (
              projects.map((project) => (
                <a
                  key={project.id}
                  href="#work"
                  onClick={(event) => {
                    event.preventDefault();
                    dismiss(project.id);
                  }}
                >
                  {project.title}
                  <span aria-hidden="true">↗</span>
                </a>
              ))
            ) : (
              <p>{COPY.skills.empty}</p>
            )}
          </div>
        </div>
      </div>
      <style>{`
.skill-dialog{position:fixed;inset:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;padding:20px;border:0;background:transparent;color:var(--ink);overflow:hidden}
.skill-dialog[open]{display:grid;place-items:center}
.skill-dialog::backdrop{background:#0d0d0d38;backdrop-filter:blur(7px);animation:skill-backdrop-in .4s var(--ease) both}
.skill-dialog-card{width:min(100%,430px);max-height:calc(100dvh - 40px);overflow-y:auto;overscroll-behavior:contain;background:var(--card);border:1px solid #ffffffb3;border-radius:28px;box-shadow:0 30px 100px #00000025,inset 0 0 0 1px var(--line);animation:skill-dialog-in .55s var(--ease) both;scrollbar-width:thin}
.skill-dialog-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 22px;border-bottom:1px solid var(--line)}
.skill-dialog-header>.mono{display:flex;align-items:center;gap:16px;font-size:9px;color:var(--muted-text)}.skill-dialog-number{font-size:17px;color:var(--ink)}
.skill-dialog-close{width:44px;height:44px;display:grid;place-items:center;flex:none;border:1px solid var(--line);border-radius:50%;transition:background .35s var(--ease),color .35s var(--ease),transform .4s var(--ease)}
.skill-dialog-close:hover{background:var(--ink);color:white;transform:rotate(90deg)}
.skill-dialog .skill-dialog-logo{height:205px;min-height:0;margin:0}.skill-dialog .inspector-orbit{width:172px;height:172px}.skill-dialog .inspector-logo>img,.skill-dialog .inspector-logo>svg{width:105px;height:105px;animation-delay:70ms}.skill-dialog .inspector-symbol{right:30px;font-size:115px}
.skill-dialog-body{padding:0 28px 28px;animation:skill-details-in .55s var(--ease) 90ms both}.skill-dialog-family{font-size:9px;color:var(--muted-text)}
.skill-dialog-body h2{font-size:clamp(29px,5vw,38px);font-weight:500;line-height:1.08;letter-spacing:-.045em;margin-top:8px;overflow-wrap:anywhere}
.skill-dialog .skill-doc-link{margin-top:20px}.skill-dialog .inspector-divider{margin-block:20px}.skill-dialog .inspector-projects{margin-top:8px}
.skill-dialog.is-closing .skill-dialog-card{animation:skill-dialog-out .26s var(--ease) both}.skill-dialog.is-closing::backdrop{animation:skill-backdrop-out .26s var(--ease) both}
@keyframes skill-dialog-in{from{opacity:0;transform:translateY(22px) scale(.94)}to{opacity:1;transform:none}}
@keyframes skill-dialog-out{from{opacity:1;transform:none}to{opacity:0;transform:translateY(12px) scale(.97)}}
@keyframes skill-details-in{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
@keyframes skill-backdrop-in{from{opacity:0}to{opacity:1}}@keyframes skill-backdrop-out{from{opacity:1}to{opacity:0}}
@media(max-width:600px){.skill-dialog{padding:16px}.skill-dialog-card{max-height:calc(100dvh - 32px);border-radius:25px}.skill-dialog-body{padding-inline:23px}.skill-dialog-header{padding-inline:20px}}
@media(prefers-reduced-motion:reduce){.skill-dialog-card,.skill-dialog::backdrop,.skill-dialog-body,.skill-dialog .inspector-logo>img,.skill-dialog .inspector-logo>svg{animation:none!important}.skill-dialog-close{transition:none;transform:none!important}}
`}</style>
    </dialog>
  );
}
