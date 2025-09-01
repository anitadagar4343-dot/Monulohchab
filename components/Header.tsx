import React from 'react';
import { AppMode } from '../types';
import { IconSparkles, IconMessage, IconImage, IconVideo } from '../constants';

interface HeaderProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange }) => {
  const NavButton = ({ mode, icon, label }: { mode: AppMode; icon: React.ReactNode; label: string }) => {
    const isActive = currentMode === mode;
    return (
      <button
        onClick={() => onModeChange(mode)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'bg-studio-accent-dark text-white'
            : 'text-studio-text-secondary hover:bg-studio-surface'
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <header className="w-full flex items-center justify-between p-2 bg-studio-panel border-b border-studio-border">
      <h1 className="text-xl font-bold flex items-center gap-2 text-studio-text">
        <IconSparkles className="w-6 h-6 text-studio-accent" />
        <span>Gemini AI Studio</span>
      </h1>
      <nav className="flex items-center bg-studio-surface p-1 rounded-lg">
        <NavButton mode={AppMode.Freeform} icon={<IconSparkles className="w-4 h-4" />} label="Freeform" />
        <NavButton mode={AppMode.Chat} icon={<IconMessage className="w-4 h-4" />} label="Chat" />
        <NavButton mode={AppMode.Image} icon={<IconImage className="w-4 h-4" />} label="Image" />
        <NavButton mode={AppMode.Video} icon={<IconVideo className="w-4 h-4" />} label="Video" />
      </nav>
      <div className="w-1/4"></div>
    </header>
  );
};

export default Header;