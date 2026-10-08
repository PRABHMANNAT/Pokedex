import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ theme, onToggle }) {
  return <button className="theme-toggle" role="switch" aria-checked={theme === 'dark'} aria-label="Night mode" onClick={onToggle} title={`Switch to ${theme === 'dark' ? 'day' : 'night'} mode`}><Sun size={15} /><span className="theme-track"><span className="pokeball-mark" /></span><Moon size={15} /></button>;
}
