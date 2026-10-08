import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { formatName } from '../lib/pokemon';
import PokemonPanel from './PokemonPanel';

export default function PokemonDialog({ pokemon, favorite, onFavorite, onClose, onNavigate, maxId }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const activeElement = document.activeElement;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      dialog.close();
      activeElement?.focus();
    };
  }, []);
  return <dialog ref={ref} className="pokemon-dialog" aria-label={`${formatName(pokemon.name)} details`} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === ref.current) onClose(); }}><div className="dialog-toolbar"><span>YOUR POKÉMON FIELD NOTES</span><div><button className="icon-button" aria-label="Previous Pokémon" disabled={pokemon.id === 1} onClick={() => onNavigate(pokemon.id - 1)}><ChevronLeft size={19} /></button><button className="icon-button" aria-label="Next Pokémon" disabled={pokemon.id === maxId} onClick={() => onNavigate(pokemon.id + 1)}><ChevronRight size={19} /></button><span className="toolbar-divider" /><button className="icon-button" aria-label="Close Pokémon details" onClick={onClose}><X size={20} /></button></div></div><PokemonPanel key={pokemon.id} pokemon={pokemon} favorite={favorite} onFavorite={onFavorite} onNavigate={onNavigate} /></dialog>;
}
