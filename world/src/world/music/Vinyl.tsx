/** A record with the album art as its label. Spins while music plays. */
export function Vinyl({ cover, spinning, size }: { cover: string; spinning: boolean; size: number }) {
  return (
    <span className={`vinyl${spinning ? " is-spinning" : ""}`} style={{ width: size, height: size }} aria-hidden="true">
      <span className="vinyl__disc">
        <img src={cover} alt="" />
      </span>
      <span className="vinyl__shine" />
    </span>
  );
}
