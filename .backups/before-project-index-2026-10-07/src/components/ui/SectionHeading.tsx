import { COPY } from "@/lib/data";
export default function SectionHeading({
  section,
}: {
  section: keyof typeof COPY.sections;
}) {
  const data = COPY.sections[section];
  return (
    <header className="section-head rv">
      <p className="mono tag">
        {data.index} <span>—</span> {data.tag}
      </p>
      <h2 id={`${section}-title`} className="section-title rv-mask">
        <span>
          {data.title} <em>{data.accent}</em>
        </span>
      </h2>
    </header>
  );
}
