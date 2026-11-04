/**
 * The header at the top of each home-page section: a huge title on the left
 * and a short two-line caption on the right.
 * Styles: styles/layout.css (.section-head)
 */
export function SectionHead({ title, caption }: { title: string; caption: [React.ReactNode, React.ReactNode] }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      <span className="cap">
        {caption[0]}
        <br />
        {caption[1]}
      </span>
    </div>
  );
}
