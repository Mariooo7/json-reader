import { create } from 'zustand';
import { extractJSONBlocks, JSONBlock } from '../utils/jsonExtractor';

interface HistoryState {
  inputText: string;
  jsonBlocks: JSONBlock[];
}

interface AppState {
  inputText: string;
  jsonBlocks: JSONBlock[];
  
  // History
  history: HistoryState[];
  historyIndex: number;
  
  // Actions
  setInputText: (text: string) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  
  // Computed helpers (optional, can be derived in components)
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  inputText: '',
  jsonBlocks: [],
  history: [{ inputText: '', jsonBlocks: [] }],
  historyIndex: 0,

  setInputText: (text: string) => {
    const { history, historyIndex } = get();
    
    // Extract JSON blocks immediately
    const blocks = extractJSONBlocks(text);
    
    // Create new history entry
    const newEntry: HistoryState = { inputText: text, jsonBlocks: blocks };
    
    // Truncate future history if we are in the middle
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newEntry);
    
    // Limit history size (optional, e.g., 50 entries)
    if (newHistory.length > 50) {
      newHistory.shift();
    }

    set({
      inputText: text,
      jsonBlocks: blocks,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      set({
        inputText: state.inputText,
        jsonBlocks: state.jsonBlocks,
        historyIndex: newIndex,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      set({
        inputText: state.inputText,
        jsonBlocks: state.jsonBlocks,
        historyIndex: newIndex,
      });
    }
  },

  clear: () => {
    get().setInputText('');
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}));
