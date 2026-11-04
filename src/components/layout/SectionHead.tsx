/**
 * The header at the top of each home-page section: a huge title on the left
 * and a short two-line caption on the right, with any controls (`children`)
 * above the caption.
 * Styles: styles/layout.css (.section-head)
 */
type Props = { title: string; caption: [React.ReactNode, React.ReactNode]; children?: React.ReactNode };

export function SectionHead({ title, caption, children }: Props) {
  const cap = (
    <span className="cap">
      {caption[0]}
      <br />
      {caption[1]}
    </span>
  );
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {children ? (
        <div className="section-head-side">
          {children}
          {cap}
        </div>
      ) : (
        cap
      )}
    </div>
  );
}
