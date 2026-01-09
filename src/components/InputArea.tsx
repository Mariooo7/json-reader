import React, { useCallback } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';
import { useAppStore } from '../store/useAppStore';

export const InputArea: React.FC = () => {
  const { inputText, setInputText } = useAppStore();

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
          // 添加 prism-editor-wrapper 类名以匹配 CSS 选择器
          className="font-mono text-sm min-h-full prism-editor-wrapper"
          style={{
            fontFamily: '"Fira Code", "Fira Mono", monospace',
            fontSize: 14,
            backgroundColor: 'transparent',
            // 使用 CSS 变量，让浏览器自动处理颜色切换
            color: 'hsl(var(--foreground))',
          }}
        />
        <style>{`
          .prism-editor-textarea {
             outline: none !important;
          }
        `}</style>
      </div>
    </div>
  );
};
