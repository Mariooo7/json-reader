import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import { Mermaid } from './Mermaid';
import { Code, Eye } from 'lucide-react';
import clsx from 'clsx';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [mode, setMode] = useState<'preview' | 'source'>('preview');

  // 预处理内容：尝试修复一些常见的非标准 Markdown 格式
  // 例如：包含空格的加粗 ** text ** -> **text**
  const processedContent = React.useMemo(() => {
    let text = content;
    // 修复 ** text ** 为 **text** (简单正则，可能误伤，需谨慎)
    // 更加安全的做法是只替换那些明显意图是加粗的
    text = text.replace(/\*\*\s+(.+?)\s+\*\*/g, '**$1**');
    return text;
  }, [content]);

  useEffect(() => {
    if (mode === 'preview') {
      Prism.highlightAll();
    }
  }, [mode, processedContent]);

  return (
    <div className="relative group border border-border rounded-md overflow-hidden bg-background">
      {/* Header / Toggle */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
        <span className="text-xs text-muted-foreground font-medium">Markdown</span>
        <div className="flex bg-muted/50 rounded-md p-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); setMode('preview'); }}
            className={clsx(
              "px-2 py-0.5 text-xs rounded-sm flex items-center gap-1.5 transition-all",
              mode === 'preview' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye size={12} /> Preview
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setMode('source'); }}
            className={clsx(
              "px-2 py-0.5 text-xs rounded-sm flex items-center gap-1.5 transition-all",
              mode === 'source' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code size={12} /> Source
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
        {mode === 'preview' ? (
          <div className="prose prose-sm dark:prose-invert max-w-none 
            prose-headings:font-bold prose-headings:text-foreground prose-headings:border-b prose-headings:border-border prose-headings:pb-2 prose-headings:mt-6 prose-headings:mb-4
            prose-p:leading-loose prose-p:my-3 prose-p:text-foreground/90
            prose-li:my-1 prose-li:leading-relaxed
            prose-strong:text-foreground prose-strong:font-black prose-strong:bg-muted/30 prose-strong:px-1 prose-strong:rounded-sm
            prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:font-mono prose-code:text-sm
            prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-pre:my-4 prose-pre:rounded-lg
            prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-border prose-table:my-4 prose-table:shadow-sm
            prose-th:bg-muted/40 prose-th:p-3 prose-th:border prose-th:border-border prose-th:text-left prose-th:font-bold prose-th:text-foreground
            prose-td:p-3 prose-td:border prose-td:border-border prose-td:text-foreground/90
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            ">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  
                  if (!inline && language === 'mermaid') {
                    return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                  }

                  return !inline && match ? (
                    <pre className={className}>
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {processedContent}
            </ReactMarkdown>
          </div>
        ) : (
          <pre className="text-sm font-mono whitespace-pre-wrap break-words text-muted-foreground">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
};
