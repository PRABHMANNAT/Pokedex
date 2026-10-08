import { useState } from 'react';
import { artwork, formatName } from '../lib/pokemon';

export default function PokemonImage({ id, name, shiny = false, eager = false, className = '' }) {
  const [failedSource, setFailedSource] = useState(null);
  const source = artwork(id, shiny);
  const failed = failedSource === source;
  return failed ? (
    <div
      className={`art-fallback ${className}`}
      role="img"
      aria-label={`${formatName(name)} artwork unavailable`}
    >
      <span className="pokeball-mark" />
      <small>Artwork unavailable</small>
    </div>
  ) : (
    <img
      className={className}
      src={source}
      alt={formatName(name)}
      width="475"
      height="475"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailedSource(source)}
    />
  );
}
