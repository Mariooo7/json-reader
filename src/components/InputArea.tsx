import React, { useCallback } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css'; // 使用适合深色模式的主题
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';

export const InputArea: React.FC = () => {
  const { inputText, setInputText } = useAppStore();
  const { isDark } = useTheme();

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    // 获取粘贴的文本
    const text = e.clipboardData.getData('text');
    
    // 尝试格式化
    try {
      const parsed = JSON.parse(text);
      // 如果成功解析，阻止默认粘贴，手动插入格式化后的 JSON
      e.preventDefault();
      const formatted = JSON.stringify(parsed, null, 2);
      document.execCommand('insertText', false, formatted);
    } catch {
      // 不是 JSON，允许默认粘贴
    }
  }, []);

  const highlight = useCallback((code: string) => {
    return Prism.highlight(code, Prism.languages.json, 'json');
  }, []);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-none p-4 border-b bg-muted/20 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Input / Paste
        </h2>
        <span className="text-xs text-muted-foreground">
          Auto-formats JSON on paste
        </span>
      </div>
      <div className="flex-1 relative overflow-auto custom-scrollbar">
        <Editor
          value={inputText}
          onValueChange={setInputText}
          highlight={highlight}
          padding={16}
          onPaste={handlePaste}
          textareaClassName="focus:outline-none"
          className="font-mono text-sm min-h-full"
          style={{
            fontFamily: '"Fira Code", "Fira Mono", monospace',
            fontSize: 14,
            backgroundColor: 'transparent',
            color: isDark ? '#f8f8f2' : '#2d2d2d', // 根据主题调整文字颜色
          }}
        />
        {/* 覆盖 Prism 默认的背景色，让它透明以便适应我们的主题 */}
        <style>{`
          .prism-editor-textarea {
             outline: none !important;
          }
          /* 调整 token 颜色以适应亮色模式，如果需要的话 */
          ${!isDark ? `
            code[class*="language-"], pre[class*="language-"] {
              text-shadow: none !important;
              color: #2d2d2d !important;
            }
            .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string {
              color: #a67f59 !important;
            }
            .token.string {
              color: #690 !important;
            }
            .token.number {
              color: #905 !important;
            }
          ` : ''}
        `}</style>
      </div>
    </div>
  );
};
