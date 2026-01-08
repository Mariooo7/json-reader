import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { JsonTree } from './JsonTree';
import { FileJson, ChevronDown, ChevronRight, Check, FileText, FileCode, Maximize2, Minimize2 } from 'lucide-react';
import { formatJSON } from '../utils/jsonExtractor';

// Helper for text copy format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toYamlLike = (obj: any, level = 0): string => {
  const indent = '  '.repeat(level);
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        return `${indent}-\n${toYamlLike(item, level + 1)}`;
      }
      return `${indent}- ${item}`;
    }).join('\n');
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        if (Object.keys(value).length === 0) return `${indent}${key}: ${Array.isArray(value) ? '[]' : '{}'}`;
        return `${indent}${key}:\n${toYamlLike(value, level + 1)}`;
      }
      return `${indent}${key}: ${value}`;
    }).join('\n');
  }
  return String(obj);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const JsonBlockCard: React.FC<{ block: any, index: number }> = ({ block, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copyStatus, setCopyStatus] = useState<'json' | 'text' | 'md' | null>(null);
  const [expandAllLevel, setExpandAllLevel] = useState<number>(1); // Default expand level 1

  const handleCopy = (e: React.MouseEvent, type: 'json' | 'text' | 'md') => {
    e.stopPropagation();
    let text = '';
    if (type === 'json') {
      text = formatJSON(block.content);
    } else if (type === 'text') {
      text = toYamlLike(block.content);
    } else if (type === 'md') {
      text = "```json\n" + formatJSON(block.content) + "\n```";
    }

    navigator.clipboard.writeText(text);
    setCopyStatus(type);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const toggleExpandAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Toggle between collapsed (0) and fully expanded (10)
    // Or just increment level? Let's simplify: Toggle All vs Collapse All
    setExpandAllLevel(prev => prev > 0 ? 0 : 10);
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden mb-4 transition-all">
      <div 
        className="flex items-center justify-between p-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="font-semibold text-sm">JSON #{index + 1}</span>
          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
            {block.type === 'array' ? 'Array' : 'Object'}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatJSON(block.content).length} bytes
          </span>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Expand/Collapse All Control */}
          <button
            onClick={toggleExpandAll}
            className="p-1.5 rounded-md hover:bg-background text-muted-foreground hover:text-foreground transition-colors mr-2"
            title={expandAllLevel > 0 ? "Collapse All" : "Expand All"}
          >
            {expandAllLevel > 0 ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Copy Actions */}
          <button
            onClick={(e) => handleCopy(e, 'json')}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-background rounded text-xs font-medium transition-colors"
            title="Copy JSON"
          >
            {copyStatus === 'json' ? <Check size={12} className="text-green-500" /> : <span className="text-yellow-600 dark:text-yellow-400 font-bold">{`{}`}</span>}
            <span className="hidden sm:inline">JSON</span>
          </button>
          
          <button
            onClick={(e) => handleCopy(e, 'text')}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-background rounded text-xs font-medium transition-colors"
            title="Copy Text"
          >
            {copyStatus === 'text' ? <Check size={12} className="text-green-500" /> : <FileText size={12} className="text-blue-500" />}
            <span className="hidden sm:inline">Text</span>
          </button>

          <button
            onClick={(e) => handleCopy(e, 'md')}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-background rounded text-xs font-medium transition-colors"
            title="Copy Markdown"
          >
            {copyStatus === 'md' ? <Check size={12} className="text-green-500" /> : <FileCode size={12} className="text-purple-500" />}
            <span className="hidden sm:inline">MD</span>
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 overflow-x-auto bg-background text-foreground rounded-b-lg">
          <JsonTree 
            data={block.content} 
            forceExpandLevel={expandAllLevel} 
          />
        </div>
      )}
    </div>
  );
};

export const JsonViewer: React.FC = () => {
  const { jsonBlocks, inputText } = useAppStore();

  if (jsonBlocks.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <FileJson size={32} />
        </div>
        <h3 className="text-lg font-medium mb-2">No JSON Detected</h3>
        <p className="text-sm max-w-xs">
          {inputText.length > 0 
            ? "We couldn't find any valid JSON objects in your text." 
            : "Paste your text containing JSON in the input area to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 bg-muted/10">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Detected JSON ({jsonBlocks.length})
        </h2>
      </div>
      <div className="max-w-4xl mx-auto">
        {jsonBlocks.map((block, index) => (
          <JsonBlockCard key={block.id} block={block} index={index} />
        ))}
      </div>
    </div>
  );
};
