import React, { useState } from 'react';
import { ChevronRight, Check, Box, List, Copy } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import clsx from 'clsx';
import { useTheme } from '../hooks/useTheme';

interface JsonTreeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  name?: string;
  isLast?: boolean;
  level?: number;
  initiallyExpanded?: boolean;
  forceExpandLevel?: number; // New prop to control expansion
}

const isMarkdown = (text: string): boolean => {
  if (typeof text !== 'string') return false;
  const hasNewLines = text.includes('\n');
  if (!hasNewLines && text.length < 50) return false;
  const markdownSymbols = ['#', '*', '`', '-', '> ', '[', ']('];
  return hasNewLines || markdownSymbols.some(s => text.includes(s));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ValueDisplay: React.FC<{ value: any }> = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const { isDark } = useTheme();

  if (value === null) return <span className="text-muted-foreground italic">null</span>;
  if (value === undefined) return <span className="text-muted-foreground italic">undefined</span>;
  
  if (typeof value === 'boolean') {
    return (
      <span className={clsx("font-medium", value ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
        {value.toString()}
      </span>
    );
  }
  
  if (typeof value === 'number') {
    return <span className="text-orange-600 dark:text-orange-400 font-mono">{value}</span>;
  }
  
  if (typeof value === 'string') {
    const isMd = isMarkdown(value);
    
    const handleCopy = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="w-full min-w-0">
        <div className="flex items-start gap-2 group w-full">
          {!isMd && (
             <span className={clsx("text-foreground/90 break-words whitespace-pre-wrap flex-1 font-sans", isDark && "text-foreground/90")}>
               {value}
             </span>
          )}
          
          {isMd && (
            <div className="flex-1 w-full min-w-0">
               <div className="mt-1 w-full border-l-2 border-primary/20 pl-3">
                 <MarkdownRenderer content={value} />
               </div>
            </div>
          )}

          {!isMd && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0"
              title="Copy value"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          )}
        </div>
      </div>
    );
  }

  return <span>{String(value)}</span>;
};

// Unused getTypeIcon removed

export const JsonTree: React.FC<JsonTreeProps> = ({ 
  data, 
  name, 
  level = 0,
  initiallyExpanded = true,
  forceExpandLevel
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  
  // React to forceExpandLevel changes
  React.useEffect(() => {
    if (forceExpandLevel !== undefined) {
      setIsExpanded(level < forceExpandLevel);
    }
  }, [forceExpandLevel, level]);

  const isObject = typeof data === 'object' && data !== null;
  const isArray = Array.isArray(data);
  const isEmpty = isObject && Object.keys(data).length === 0;

  // Render Primitive Key-Value Row
  if (!isObject) {
    return (
      <div className="flex items-start py-1 hover:bg-muted/30 rounded px-2 -ml-2 group transition-colors">
        <div className="flex items-center min-w-[150px] max-w-[250px] pr-4 shrink-0 select-none">
          {/* Indentation */}
          <div style={{ width: `${level * 16}px` }} className="shrink-0" />
          
          {/* Icon based on type (optional, maybe noise?) */}
          {/* <span className="mr-2 opacity-50">{getTypeIcon(data)}</span> */}
          
          {/* Key Name */}
          {name && (
            <span className="text-sm font-medium text-muted-foreground truncate" title={name}>
              {name}
            </span>
          )}
        </div>
        
        {/* Value */}
        <div className="flex-1 min-w-0 text-sm">
          <ValueDisplay value={data} />
        </div>
      </div>
    );
  }

  // Render Object/Array
  const keys = Object.keys(data);
  const itemCount = keys.length;

  return (
    <div className="text-sm">
      {/* Header Row for Object/Array */}
      <div 
        className="flex items-center py-1.5 hover:bg-muted/30 rounded px-2 -ml-2 cursor-pointer select-none group transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center flex-1">
          {/* Indentation */}
          <div style={{ width: `${level * 16}px` }} className="shrink-0" />
          
          {/* Expander Icon */}
          <span className={clsx("mr-1 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-90")}>
            <ChevronRight size={14} />
          </span>

          {/* Type Icon */}
          <span className="mr-2 opacity-70">
            {isArray ? <List size={14} className="text-blue-500" /> : <Box size={14} className="text-purple-500" />}
          </span>

          {/* Key Name (if exists) */}
          {name && (
            <span className="font-semibold text-foreground mr-2">
              {name}
            </span>
          )}

          {/* Meta Info (Item count) */}
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {itemCount} {isArray ? 'items' : 'props'}
          </span>
        </div>
      </div>

      {/* Children Container */}
      {isExpanded && !isEmpty && (
        <div className="relative">
           {/* Vertical Guide Line */}
           <div 
             className="absolute border-l border-border/50 bottom-0 top-0"
             style={{ left: `${(level + 1) * 16 - 9}px` }} 
           />
           
          {keys.map((key, index) => (
            <JsonTree
              key={key}
              name={isArray ? String(index) : key} // Array indices are shown as 0, 1, 2...
              data={data[key as keyof typeof data]}
              level={level + 1}
              initiallyExpanded={level < 1} // Auto expand first level only
              forceExpandLevel={forceExpandLevel}
            />
          ))}
        </div>
      )}
    </div>
  );
};
