import { COPY, type Project } from "@/lib/data";
export default function ProjectIllustration({ project }: { project: Project }) {
  const labels = COPY.work.ui[project.illustration];
  return (
    <div
      className={`project-illustration illustration-${project.illustration}`}
      aria-label={`${COPY.work.illustrative}: ${project.title}`}
    >
      <div className="mock-window">
        <div className="mock-toolbar">
          <span className="mock-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="mono">{project.title}</span>
          <span>↗</span>
        </div>
        <div className="mock-content">
          {project.illustration === "network" ? (
            <>
              <div className="network-orbit">
                <span className="network-core">
                  D<span>↗</span>
                </span>
                {labels.map((label, i) => (
                  <div key={label} className={`network-node node-${i}`}>
                    <span className="node-dot" />
                    {label}
                  </div>
                ))}
              </div>
              <div className="mock-mini-row">
                <span>{project.features[2]}</span>
                <span>{project.features[3]}</span>
              </div>
            </>
          ) : null}
          {project.illustration === "library" ? (
            <>
              <div className="book-shelf" aria-hidden="true">
                {[80, 115, 98, 130, 110, 90].map((h, i) => (
                  <span key={i} style={{ height: h }}>
                    <i />
                  </span>
                ))}
              </div>
              <div className="mock-list">
                {labels.map((l, i) => (
                  <span key={l}>
                    <span className="mono">0{i + 1}</span>
                    {l}
                    <b>↗</b>
                  </span>
                ))}
              </div>
            </>
          ) : null}
          {project.illustration === "audio" ? (
            <>
              <div className="audio-disc" aria-hidden="true">
                <i />
              </div>
              <div className="audio-wave" aria-hidden="true">
                {Array.from({ length: 27 }, (_, i) => (
                  <i
                    key={i}
                    style={{ height: 8 + Math.abs(Math.sin(i * 1.7)) * 39 }}
                  />
                ))}
              </div>
              <div className="audio-labels">
                {labels.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </>
          ) : null}
          {project.illustration === "agriculture" ? (
            <>
              <div className="leaf-diagram" aria-hidden="true">
                <svg
                  viewBox="0 0 200 170"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path d="M100 150V60M100 112C35 122 35 57 43 42c60 5 65 42 57 70Zm0-27C90 30 145 15 169 20c0 58-28 77-69 65Z M44 44l56 68m68-91-68 65" />
                  <circle cx="100" cy="85" r="72" strokeDasharray="3 6" />
                </svg>
              </div>
              <div className="mock-list">
                {labels.map((l) => (
                  <span key={l}>
                    {l}
                    <b>↗</b>
                  </span>
                ))}
              </div>
            </>
          ) : null}
          {project.illustration === "hotel" ? (
            <>
              <div className="hotel-grid" aria-hidden="true">
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i}>
                    <i />
                  </span>
                ))}
              </div>
              <div className="mock-list">
                {labels.map((l) => (
                  <span key={l}>
                    {l}
                    <b>↗</b>
                  </span>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
      <p className="mono mock-caption">
        {COPY.work.illustrative} <span>↗</span>
      </p>
      <style>{`
.project-illustration {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 25px 0 15px 15px;
}
.mock-window {
  background: #faf9f7;
  border: 1px solid #0d0d0d17;
  border-radius: 16px;
  box-shadow: 0 25px 40px #00000007;
  overflow: hidden;
  transform: rotate(-3deg);
  transition: transform 1s var(--ease);
}
.project-panel:hover .mock-window {
  transform: rotate(0);
}
.mock-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--line);
  padding: 14px 13px;
  gap: 10px;
}
.mock-toolbar > .mono {
  font-size: 6px;
}
.mock-toolbar > span:last-child {
  font-size: 12px;
}
.mock-dots {
  display: flex;
  gap: 4px;
}
.mock-dots i {
  width: 4px;
  height: 4px;
  border: 1px solid #b6b3ae;
  border-radius: 50%;
}
.mock-content {
  padding: 22px 16px;
  min-height: 280px;
}
.mock-caption {
  font-size: 7px;
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  color: var(--muted-text);
}
.network-orbit {
  position: relative;
  height: 216px;
  border: 1px dashed #d2cfc9;
  border-radius: 50%;
  margin: 5px 10px 15px;
}
.network-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--ink);
  color: white;
  border-radius: 20px;
  width: 77px;
  height: 77px;
  display: grid;
  place-items: center;
  font-size: 35px;
  font-weight: 500;
  box-shadow: 0 12px 26px #00000014;
}
.network-core > span {
  position: absolute;
  top: 9px;
  right: 10px;
  font-size: 12px;
}
.network-node {
  position: absolute;
  white-space: nowrap;
  padding: 10px 12px;
  background: white;
  border: 1px solid var(--line);
  box-shadow: 0 5px 15px #00000004;
  border-radius: 8px;
  font-size: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.node-dot {
  width: 5px;
  height: 5px;
  background: #888;
  border-radius: 50%;
}
.node-0 {
  top: 5px;
  left: 5px;
}
.node-1 {
  top: 94px;
  right: -12px;
}
.node-2 {
  bottom: 3px;
  left: 7px;
}
.mock-mini-row {
  display: flex;
  gap: 5px;
  justify-content: center;
  font-size: 6px;
}
.mock-mini-row > span {
  background: #eeece7;
  border-radius: 5px;
  padding: 8px 6px;
}
.book-shelf {
  height: 151px;
  border-bottom: 3px solid #444;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 5px;
  padding-inline: 10px;
}
.book-shelf > span {
  background: #ddd9d3;
  border: 1px solid #aba8a2;
  width: 27px;
  position: relative;
}
.book-shelf > span:nth-child(even) {
  background: #777;
  color: white;
}
.book-shelf i {
  position: absolute;
  top: 18px;
  width: 65%;
  height: 1px;
  background: #444;
  left: 18%;
}
.mock-list {
  display: flex;
  flex-direction: column;
  margin-top: 25px;
}
.mock-list > span {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 0;
  font-size: 9px;
  border-bottom: 1px solid var(--line);
}
.mock-list b {
  margin-left: auto;
  font-weight: 400;
}
.mock-list .mono {
  font-size: 7px;
  color: var(--muted-text);
}
.audio-disc {
  width: 146px;
  height: 146px;
  border-radius: 50%;
  background: var(--ink);
  margin: 0 auto;
  box-shadow:
    inset 0 0 0 10px #222,
    inset 0 0 0 11px #333,
    inset 0 0 0 18px #222,
    inset 0 0 0 19px #333,
    inset 0 0 0 28px #222,
    inset 0 0 0 29px #333;
  display: grid;
  place-items: center;
}
.audio-disc > i {
  width: 41px;
  height: 41px;
  background: #ccc;
  border-radius: 50%;
  border: 14px solid #aaa;
}
.audio-wave {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 65px;
  margin-top: 15px;
}
.audio-wave > i {
  width: 3px;
  background: #555;
  border-radius: 2px;
}
.audio-labels {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 6px;
  font-size: 8px;
}
.audio-labels > span:first-child,
.audio-labels > span:last-child {
  color: var(--muted-text);
}
.leaf-diagram {
  width: 190px;
  margin: 0 auto;
  color: #666;
}
.hotel-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 9px;
}
.hotel-grid > span {
  height: 40px;
  border: 1px solid #c9c6bf;
  border-radius: 4px;
  display: grid;
  place-items: center;
}
.hotel-grid > span:nth-child(3n) {
  background: #e4e1db;
}
.hotel-grid i {
  width: 12px;
  height: 17px;
  border: 1px solid #999;
}
.illustration-hotel .mock-content {
  padding-top: 35px;
}

.project-illustration {
  position: relative;
  isolation: isolate;
}
.project-illustration:before {
  content: "";
  position: absolute;
  inset: 35px -10px 55px 0;
  border: 1px solid var(--line);
  border-radius: 150px 150px 20px 20px;
  z-index: -1;
}
.mock-window {
  box-shadow: 0 22px 35px #0000000a;
  background: #faf9f7;
}
.mock-toolbar {
  background: white;
}
.mock-toolbar > .mono {
  font-size: 8px;
}
.mock-caption {
  font-size: 9px;
}
.network-core {
  border: 4px solid #333;
  outline: 1px solid #b9b6ae;
  outline-offset: 7px;
}
.audio-disc {
  box-shadow: 0 15px 24px #00000014;
}
.book-shelf > span {
  box-shadow: 3px 3px 0 #00000008;
}
.hotel-grid {
  transform: rotate(-4deg);
}
`}</style>
    </div>
  );
}
