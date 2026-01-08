import React from 'react';
import { Undo, Redo, Trash2, FileJson, Sun, Moon } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTheme } from '../hooks/useTheme';

export const Toolbar: React.FC = () => {
  const { 
    undo, redo, clear, canUndo, canRedo, jsonBlocks 
  } = useAppStore();
  const { isDark, toggleTheme } = useTheme();

  useHotkeys('meta+z', (e) => { e.preventDefault(); undo(); });
  useHotkeys('meta+shift+z', (e) => { e.preventDefault(); redo(); });
  useHotkeys('ctrl+y', (e) => { e.preventDefault(); redo(); });

  return (
    <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-4 justify-between select-none z-50 relative">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-4">
           <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
             <FileJson size={18} />
           </div>
           <h1 className="font-bold text-lg hidden sm:block">JSON Reader</h1>
        </div>
        
        <div className="h-6 w-px bg-border mx-2" />
        
        <div className="flex bg-muted/50 rounded-lg p-1 gap-1">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-1.5 hover:bg-background rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all shadow-sm disabled:shadow-none"
            title="Undo (Cmd+Z)"
          >
            <Undo size={16} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-1.5 hover:bg-background rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all shadow-sm disabled:shadow-none"
            title="Redo (Cmd+Shift+Z)"
          >
            <Redo size={16} />
          </button>
        </div>
        
        <button
            onClick={clear}
            className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md transition-colors ml-1"
            title="Clear All"
          >
            <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {jsonBlocks.length > 0 && (
          <div className="flex items-center text-sm text-muted-foreground">
            {jsonBlocks.length} JSON block{jsonBlocks.length > 1 ? 's' : ''} detected
          </div>
        )}
        
        <div className="h-6 w-px bg-border mx-1" />

        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-accent rounded-full transition-colors text-foreground"
          title="Toggle Theme"
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </div>
  );
};
