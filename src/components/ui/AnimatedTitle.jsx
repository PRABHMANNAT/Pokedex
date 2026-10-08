import React from "react";

export function AnimatedTitle() {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative px-7 py-4 bg-white dark:bg-gray-900 ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center">
        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
          className="w-8 h-8 animate-bounce"
          alt="Pokeball"
        />
        <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Pokédex
        </span>
      </div>
    </div>
  );
}