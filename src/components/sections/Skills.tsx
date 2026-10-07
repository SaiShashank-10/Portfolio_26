"use client";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  COPY,
  SKILLS,
  SKILL_GROUPS,
  SKILL_DOCS,
  skillProjects,
} from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";
import TechLogo from "../ui/TechLogo";
import SkillDialog from "../ui/SkillDialog";

export default function Skills() {
  const [family, setFamily] = useState<string>("All"),
    [selected, setSelected] = useState(SKILLS[8]),
    [pinned, setPinned] = useState(false),
    [dialogOpen, setDialogOpen] = useState(false),
    [cursor, setCursor] = useState(SKILLS[8].name);
  const projects = skillProjects(selected.name);
  const documentation = SKILL_DOCS[selected.name];
  const docLabel =
    documentation?.kind === "docs"
      ? COPY.skills.documentation
      : COPY.skills.resource;
  const grid = useRef<HTMLDivElement>(null);
  const filters = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const container = filters.current;
    const indicator = marker.current;
    if (!container || !indicator) return;
    const update = () => {
      const button =
        container.querySelector<HTMLButtonElement>("button.selected");
      if (!button) return;
      indicator.style.width = `${button.offsetWidth}px`;
      indicator.style.height = `${button.offsetHeight}px`;
      indicator.style.transform = `translate(${button.offsetLeft}px, ${button.offsetTop}px)`;
      indicator.style.opacity = "1";
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [family]);
  const selectFamily = (value: string) => {
    setFamily(value);
    setPinned(false);
    if (value !== "All" && selected.family !== value) {
      const first = SKILLS.find((skill) => skill.family === value)!;
      setSelected(first);
      setCursor(first.name);
    }
  };
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const columns = matchMedia("(max-width: 600px)").matches ? 4 : 8;
    const offsets: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: columns,
      ArrowUp: -columns,
      Home: -index,
      End: SKILLS.length - 1 - index,
    };
    if (!(event.key in offsets)) return;
    event.preventDefault();
    const next = Math.max(
      0,
      Math.min(SKILLS.length - 1, index + offsets[event.key]),
    );
    grid.current?.querySelectorAll<HTMLButtonElement>("button")[next].focus();
  };
  return (
    <section
      id="skills"
      className="section skills site-container"
      aria-labelledby="skills-title"
    >
      <SectionHeading section="skills" />
      <div className="stack-overview rv">
        <span className="mono">{COPY.skills.inventory}</span>
        <div>
          <span>
            <strong>{String(SKILLS.length).padStart(2, "0")}</strong>{" "}
            {COPY.skills.elements}
          </span>
          <span>
            <strong>{String(SKILL_GROUPS.length).padStart(2, "0")}</strong>{" "}
            {COPY.skills.families}
          </span>
        </div>
      </div>
      <div className="skill-toolbar rv">
        <div
          ref={filters}
          className="family-filters"
          role="group"
          aria-label={COPY.sections.skills.tag}
        >
          <span ref={marker} className="family-marker" aria-hidden="true" />
          <button
            className={family === "All" ? "selected" : ""}
            aria-pressed={family === "All"}
            onClick={() => selectFamily("All")}
          >
            {COPY.skills.all}
          </button>
          {SKILL_GROUPS.map((group) => (
            <button
              key={group.family}
              className={family === group.family ? "selected" : ""}
              aria-pressed={family === group.family}
              onClick={() => selectFamily(group.family)}
            >
              {group.family}{" "}
              <span className="filter-count">{group.skills.length}</span>
            </button>
          ))}
        </div>
        <p className="mono" id="skill-instructions">
          {COPY.skills.selectionHint}
        </p>
      </div>
      <div className="mobile-skill-selection">
        <TechLogo name={selected.name} size={24} />
        <span>{selected.name}</span>
        <a href="#skill-inspector">{COPY.improvements.skillDetails}</a>
      </div>
      <p className="sr-only" role="status">
        {selected.name}, {selected.family}.{" "}
        {pinned ? COPY.skills.pinned : COPY.skills.preview}
      </p>
      <div className="skill-layout">
        <div
          ref={grid}
          className="periodic-grid"
          aria-describedby="skill-instructions"
        >
          {SKILLS.map((skill, i) => (
            <button
              key={skill.name}
              className={`element rv ${selected.name === skill.name ? `active ${pinned ? "is-pinned" : ""}` : ""} ${family !== "All" && family !== skill.family ? "dimmed" : ""}`}
              style={
                {
                  "--i": (Math.floor(i / 8) + (i % 8)) * 0.57,
                  "--mobile-i": (Math.floor(i / 4) + (i % 4)) * 0.57,
                } as CSSProperties
              }
              aria-haspopup="dialog"
              aria-pressed={selected.name === skill.name}
              aria-label={`${skill.name}, ${skill.family}`}
              tabIndex={cursor === skill.name ? 0 : -1}
              onKeyDown={(event) => navigate(event, i)}
              onPointerMove={(event) => {
                if (
                  !pinned &&
                  event.pointerType === "mouse" &&
                  selected.name !== skill.name
                ) {
                  setSelected(skill);
                  setCursor(skill.name);
                }
              }}
              onFocus={() => {
                setCursor(skill.name);
                if (!pinned) setSelected(skill);
              }}
              onClick={() => {
                setSelected(skill);
                setCursor(skill.name);
                setPinned(true);
                setDialogOpen(true);
              }}
            >
              <span className="element-number mono">
                {String(skill.number).padStart(2, "0")}
              </span>
              <span className="element-logo" aria-hidden="true">
                <TechLogo name={skill.name} size={22} />
              </span>
              <span className="element-symbol">{skill.symbol}</span>
              <span className="element-name">{skill.name}</span>
              <span className="element-family mono">{skill.family}</span>
            </button>
          ))}
        </div>
        <aside
          id="skill-inspector"
          className={`skill-inspector card ${pinned ? "is-pinned" : ""}`}
          aria-label={COPY.skills.label}
        >
          <div className="inspector-meta mono">
            <span className="inspector-selection-label">
              <span className="selection-dot" aria-hidden="true" />
              {pinned ? COPY.skills.pinned : COPY.skills.label}
            </span>
            <button
              type="button"
              className="skill-pin-toggle"
              aria-pressed={pinned}
              aria-label={
                pinned ? COPY.skills.unpinLabel : COPY.skills.pinLabel
              }
              onClick={() => setPinned((value) => !value)}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m9 3 6 0-1 7 4 4v2H6v-2l4-4-1-7Zm3 13v6" />
              </svg>
              {pinned ? COPY.skills.unpin : COPY.skills.pin}
            </button>
            <span>{String(selected.number).padStart(2, "0")}</span>
          </div>
          <div className="inspector-logo" key={selected.name}>
            <span className="inspector-orbit" aria-hidden="true" />
            <span
              className="inspector-symbol"
              aria-hidden="true"
              data-symbol={selected.symbol}
            />
            <TechLogo name={selected.name} size={150} />
          </div>
          <div className="inspector-body" key={`body-${selected.name}`}>
            <span className="mono">{selected.family}</span>
            <h3>{selected.name}</h3>
            {documentation && (
              <a
                className="skill-doc-link"
                href={documentation.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${docLabel}: ${selected.name} — ${documentation.provider}, ${COPY.skills.newTab}`}
              >
                <span className="skill-doc-icon" aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v15M3 4h5c2 0 4 1 4 3 0-2 2-3 4-3h5v15h-5c-2 0-4 1-4 2 0-1-2-2-4-2H3Z" />
                  </svg>
                </span>
                <span className="skill-doc-copy">
                  <span className="mono">{documentation.provider}</span>
                  <strong>{docLabel}</strong>
                </span>
                <span className="skill-doc-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            )}
            <div className="inspector-divider" />
            <p className="mono">{COPY.skills.used}</p>
            <div className="inspector-projects">
              {projects.length ? (
                projects.map((p) => (
                  <a
                    key={p.id}
                    href="#work"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("select-project", { detail: p.id }),
                      )
                    }
                  >
                    {p.title}
                    <span>↗</span>
                  </a>
                ))
              ) : (
                <p>{COPY.skills.empty}</p>
              )}
            </div>
          </div>
        </aside>
      </div>
      {dialogOpen && (
        <SkillDialog skill={selected} onClose={() => setDialogOpen(false)} />
      )}
      <style>{`
.inspector-selection-label{display:flex;align-items:center;gap:7px}.selection-dot{width:5px;height:5px;border-radius:50%;border:1px solid currentColor;flex:none;transition:background .35s var(--ease)}
.skill-pin-toggle{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:44px;padding:8px 10px;border:1px solid var(--line);border-radius:99px;font-family:var(--font-sans);font-size:11px;letter-spacing:0;text-transform:none;color:var(--ink);transition:background .35s var(--ease),color .35s var(--ease),border-color .35s var(--ease)}
.skill-pin-toggle svg{transition:transform .45s var(--ease)}.skill-pin-toggle:hover{background:var(--soft)}
.skill-inspector.is-pinned .skill-pin-toggle{background:var(--ink);color:white;border-color:var(--ink)}.skill-inspector.is-pinned .skill-pin-toggle svg{transform:rotate(-30deg)}
.skill-inspector.is-pinned .selection-dot{background:var(--ink);border-color:var(--ink)}
.skill-inspector.is-pinned{box-shadow:inset 0 0 0 1px #0d0d0d40,0 24px 65px #00000008}
.element.active.is-pinned{border-color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink),0 12px 28px #0000000c}
.element.is-pinned .element-number{color:var(--ink)}
@media(prefers-reduced-motion:reduce){.skill-pin-toggle,.skill-pin-toggle svg,.selection-dot{transition:none}}
.skills{border-top:1px solid var(--line)}
.stack-overview{display:flex;justify-content:space-between;align-items:center;gap:20px;padding-block:22px;margin-bottom:22px;border-block:1px solid var(--line)}
.stack-overview>.mono{font-size:10px;color:var(--muted-text)}
.stack-overview>div{display:flex;gap:30px;font-size:12px;color:var(--muted-text)}
.stack-overview strong{font-family:var(--font-mono);font-size:19px;font-weight:400;color:var(--ink);margin-right:7px}
.skill-toolbar{margin-bottom:30px}.family-filters{position:relative;isolation:isolate;display:flex;flex-wrap:wrap;gap:7px;margin-bottom:20px}
.family-filters button{position:relative;display:inline-flex;align-items:center;gap:9px;border:1px solid var(--line);padding:11px 16px;min-height:44px;border-radius:99px;font-size:12px;background:transparent;transition:color .4s var(--ease),border-color .4s var(--ease)}
.family-filters button.selected{color:white;border-color:transparent}.family-filters button:hover:not(.selected){border-color:var(--ink)}
.family-marker{position:absolute;top:0;left:0;z-index:-1;border-radius:99px;background:var(--ink);opacity:0;transition:transform .6s var(--ease),width .6s var(--ease),height .6s var(--ease)}
.filter-count{font-family:var(--font-mono);font-size:9px;opacity:.75}.skill-toolbar>p{font-size:10px;color:var(--muted-text);line-height:1.8}
.skill-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:28px;align-items:start}
.periodic-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px}
.element{position:relative;min-width:0;height:151px;display:flex;flex-direction:column;align-items:flex-start;padding:12px 10px;border:1px solid #0d0d0d16;border-radius:14px;background:#ffffff80;text-align:left;transition:background .45s var(--ease),border-color .45s var(--ease),box-shadow .45s var(--ease),transform .55s var(--ease),opacity .6s var(--ease),translate .8s var(--ease);transition-delay:0s,0s,0s,0s,0s,calc(var(--i)*70ms)}
.element-number{font-size:9px;color:var(--muted-text)}
.element-symbol{font-size:36px;line-height:1.1;letter-spacing:-.05em;font-weight:550;margin-top:17px;transition:transform .55s var(--ease)}
.element-name{font-size:10px;line-height:1.3;margin-top:auto;overflow-wrap:anywhere}.element-family{font-size:8px;letter-spacing:0;color:var(--muted-text);margin-top:5px;line-height:1.3}
.element-logo{position:absolute;right:8px;top:8px;display:grid;place-items:center;width:27px;height:27px;border-radius:8px;background:white;opacity:0;transform:translateY(5px) scale(.75);transition:opacity .4s var(--ease),transform .55s var(--ease)}
.element.active,.element:hover,.element:focus-visible{z-index:1;background:white;border-color:#0d0d0d70;transform:translateY(-5px);box-shadow:0 14px 28px #0d0d0d0d}
.element.active .element-logo,.element:hover .element-logo,.element:focus-visible .element-logo{opacity:1;transform:none}
.element.active .element-symbol{transform:translateY(-2px)}
.element.dimmed{background:transparent;border-color:#0d0d0d09;box-shadow:none}.element.dimmed:not(.active) .element-symbol{color:#77746e}.element.dimmed:not(.active) .element-number{opacity:.6}
.element.dimmed.active{border-color:#0d0d0d50;background:white}
.skill-inspector{position:sticky;top:108px;overflow:hidden;min-height:570px;border-radius:28px;box-shadow:inset 0 0 0 1px var(--line),0 24px 65px #00000006;scroll-margin-top:120px}
.inspector-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:16px 20px;font-size:9px;color:var(--muted-text);border-bottom:1px solid var(--line)}
.inspector-meta>span:last-child{font-size:16px;color:var(--ink)}
.inspector-logo{position:relative;isolation:isolate;height:250px;display:grid;place-items:center;overflow:hidden}
.inspector-logo>img,.inspector-logo>svg{position:relative;z-index:2;width:124px;height:124px;animation:stack-logo-enter .65s var(--ease) both}
.inspector-orbit{position:absolute;width:202px;height:202px;border:1px solid var(--line);border-radius:50%;animation:stack-ring-enter .85s var(--ease) both}
.inspector-orbit:before{content:"";position:absolute;inset:16px;border:1px dashed #0d0d0d16;border-radius:50%}
.inspector-orbit:after{content:"";position:absolute;top:28px;right:25px;width:6px;height:6px;border-radius:50%;background:var(--ink)}
.inspector-symbol{position:absolute;right:16px;bottom:-15px;font-size:132px;line-height:1;letter-spacing:-.07em;color:#0d0d0d06;z-index:-1}.inspector-symbol:before{content:attr(data-symbol)}
.inspector-body{padding:10px 26px 28px;animation:stack-details-enter .55s var(--ease) both}
.inspector-body>span{font-size:9px;color:var(--muted-text)}.inspector-body h3{font-size:clamp(27px,2.4vw,36px);line-height:1.1;letter-spacing:-.045em;font-weight:500;margin-top:9px;overflow-wrap:anywhere}
.inspector-divider{height:1px;background:var(--line);margin-block:24px;transform-origin:left;animation:stack-rule-enter .7s var(--ease) both}
.inspector-body>p{font-size:9px;color:var(--muted-text)}.inspector-projects{display:flex;flex-direction:column;margin-top:12px}
.inspector-projects>a{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:48px;padding-block:12px;font-size:14px;border-bottom:1px solid var(--line);transition:padding .4s var(--ease)}
.inspector-projects>a:hover,.inspector-projects>a:focus-visible{padding-inline:6px}.inspector-projects>a>span{transition:transform .4s var(--ease)}.inspector-projects>a:hover>span{transform:translate(3px,-3px)}
.inspector-projects>p{font-size:13px;line-height:1.7;color:var(--muted-text)}
.mobile-skill-selection{display:none}
@keyframes stack-logo-enter{from{opacity:0;transform:translateY(14px) scale(.88)}to{opacity:1;transform:none}}
@keyframes stack-ring-enter{from{opacity:0;transform:rotate(-40deg) scale(.9)}to{opacity:1;transform:none}}
@keyframes stack-details-enter{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes stack-rule-enter{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media(max-width:1200px){.skill-layout{grid-template-columns:minmax(0,1fr) 280px;gap:20px}.element{padding:10px 8px;height:149px}.element-symbol{font-size:30px}.element-logo{width:23px;height:23px;right:5px;top:5px}.element-logo img,.element-logo svg{width:18px;height:18px}}
@media(max-width:1000px){.skill-layout{grid-template-columns:1fr}.skill-inspector{position:relative;top:0;display:grid;grid-template-columns:240px minmax(0,1fr);min-height:300px}.inspector-meta{grid-column:1/-1}.inspector-logo{height:260px}.inspector-body{padding-top:25px}.mobile-skill-selection{position:sticky;top:80px;z-index:30;display:flex;align-items:center;gap:12px;padding:12px 16px;margin-bottom:18px;border:1px solid var(--line);border-radius:16px;background:#f4f2eef5;backdrop-filter:blur(12px);box-shadow:0 8px 28px #00000005}.mobile-skill-selection>span{font-size:14px}.mobile-skill-selection>a{margin-left:auto;font-size:12px;white-space:nowrap;min-height:32px;display:flex;align-items:center}.skill-inspector{scroll-margin-top:160px}}
@media(max-width:600px){.stack-overview{align-items:flex-start;flex-direction:column;gap:12px}.stack-overview>div{gap:24px}.family-filters{gap:6px}.family-filters button{font-size:11px;padding:10px 12px;gap:6px}.periodic-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.element{height:143px;padding:10px 8px;--i:var(--mobile-i)!important}.element-symbol{font-size:32px}.element-name{font-size:10px}.element-family{font-size:8px}.element-logo{top:7px;right:6px}.skill-inspector{display:block;min-height:0}.inspector-logo{height:235px}.inspector-body{padding:8px 24px 28px}.inspector-body h3{font-size:32px}.inspector-projects>a{min-height:48px}.mobile-skill-selection{top:77px}}
.skill-doc-link{display:flex;align-items:center;gap:12px;margin-top:22px;padding:15px 13px;border:1px solid var(--line);border-radius:16px;background:#f4f2ee66;box-shadow:0 2px 0 #0d0d0d03;transition:background .4s var(--ease),color .4s var(--ease),border-color .4s var(--ease),transform .4s var(--ease),box-shadow .4s var(--ease)}
.skill-doc-icon{display:grid;place-items:center;width:32px;height:36px;flex:none;border-right:1px solid var(--line);padding-right:10px}
.skill-doc-copy{display:flex;flex-direction:column;gap:6px;min-width:0}.skill-doc-copy>.mono{font-size:8px;letter-spacing:.07em;line-height:1.4;color:var(--muted-text);overflow-wrap:anywhere}.skill-doc-copy>strong{font-size:12px;font-weight:500;line-height:1.3;letter-spacing:-.01em}
.skill-doc-arrow{margin-left:auto;flex:none;font-size:19px;transition:transform .4s var(--ease)}
.skill-doc-link:is(:hover,:focus-visible){background:var(--ink);color:white;border-color:var(--ink);transform:translateY(-2px);box-shadow:0 8px 20px #00000012}.skill-doc-link:is(:hover,:focus-visible) .mono{color:#d4d4d4}.skill-doc-link:is(:hover,:focus-visible) .skill-doc-icon{border-color:#ffffff33}.skill-doc-link:is(:hover,:focus-visible) .skill-doc-arrow{transform:translate(2px,-2px)}
@media(prefers-reduced-motion:reduce){.skill-doc-link,.skill-doc-arrow{transition:none;transform:none!important}}
@media(prefers-reduced-motion:reduce){.family-marker,.element,.element-logo,.element-symbol,.inspector-projects>a,.inspector-projects>a>span{transition:none}.element.active,.element:hover,.element:focus-visible{transform:none}.inspector-logo>img,.inspector-logo>svg,.inspector-orbit,.inspector-body,.inspector-divider{animation:none}}
`}</style>
    </section>
  );
}
