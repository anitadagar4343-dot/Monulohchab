
import React from 'react';
import type { HistoryItem } from '../types';

interface SidebarProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ history, onSelectHistory }) => {
  return (
    <aside className="w-64 bg-studio-panel p-4 flex flex-col border-r border-studio-border">
      <h2 className="text-xl font-bold mb-4 text-studio-text">History</h2>
      <div className="overflow-y-auto flex-grow">
        {history.length === 0 ? (
          <p className="text-studio-text-secondary text-sm">Your prompt history will appear here.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSelectHistory(item)}
                  className="w-full text-left p-2 rounded-md bg-studio-surface hover:bg-studio-border transition-colors"
                >
                  <p className="text-sm font-medium text-studio-text truncate">{item.prompt}</p>
                  <p className="text-xs text-studio-text-secondary">{item.timestamp}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
