import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const typeColors = {
  fire: ["#FF4C29", "#FF8C42"],
  water: ["#4158D0", "#48B2E5"],
  grass: ["#43A047", "#66BB6A"],
  electric: ["#FFD600", "#FFF176"],
  psychic: ["#C850C0", "#FF6EC4"],
  ice: ["#81D4FA", "#B3E5FC"],
  dragon: ["#5C6BC0", "#7986CB"],
  dark: ["#424242", "#616161"],
  fairy: ["#EC407A", "#F48FB1"],
  normal: ["#9E9E9E", "#BDBDBD"],
  fighting: ["#FF7043", "#FF8A65"],
  flying: ["#81D4FA", "#90CAF9"],
  poison: ["#AB47BC", "#CE93D8"],
  ground: ["#FF8F00", "#FFA726"],
  rock: ["#757575", "#9E9E9E"],
  bug: ["#7CB342", "#9CCC65"],
  ghost: ["#7E57C2", "#9575CD"],
  steel: ["#78909C", "#90A4AE"],
};

export const FocusCard = ({ pokemon, hovered, setHovered, onClick }) => {
  const mainType = pokemon.types[0];
  const colors = typeColors[mainType] || typeColors.normal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(pokemon.id)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "relative group cursor-pointer",
        "transform transition-all duration-300",
        hovered !== null && hovered !== pokemon.id && "opacity-50 scale-95"
      )}
    >
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
          filter: "blur(20px)",
        }}
      />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-6 h-[350px] overflow-hidden shadow-xl">
        <motion.img
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          src={pokemon.image}
          alt={pokemon.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
        />
        
        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <h2 className="text-2xl font-bold text-white capitalize mb-2">
            {pokemon.name}
          </h2>
          <div className="flex gap-2 flex-wrap">
            {pokemon.types.map((type) => (
              <span
                key={`${pokemon.id}-${type}`}
                className="px-3 py-1 rounded-full text-sm font-medium text-white bg-white/20 backdrop-blur-sm"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};