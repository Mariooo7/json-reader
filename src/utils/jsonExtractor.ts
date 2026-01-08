export interface JSONBlock {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  startIndex: number;
  endIndex: number;
  type: 'object' | 'array';
}

// 简单的 ID 生成器
const generateId = () => Math.random().toString(36).substr(2, 9);

export const extractJSONBlocks = (text: string): JSONBlock[] => {
  const blocks: JSONBlock[] = [];
  if (!text) return blocks;

  // 1. 尝试直接解析整个文本
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === 'object' && parsed !== null) {
      return [{
        id: generateId(),
        content: parsed,
        startIndex: 0,
        endIndex: text.length,
        type: Array.isArray(parsed) ? 'array' : 'object'
      }];
    }
  } catch {
    // 忽略错误，继续寻找子串
  }

  // 2. 寻找潜在的 JSON 开始和结束符号
  // 这是一个简化的实现，为了处理嵌套，我们需要通过堆栈匹配
  let depth = 0;
  let start = -1;
  let inString = false;
  let escape = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inString) {
      if (char === '\\' && !escape) {
        escape = true;
      } else if (char === '"' && !escape) {
        inString = false;
      } else {
        escape = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{' || char === '[') {
      if (depth === 0) {
        start = i;
      }
      depth++;
    } else if (char === '}' || char === ']') {
      depth--;
      if (depth === 0 && start !== -1) {
        const potentialJson = text.substring(start, i + 1);
        try {
          const parsed = JSON.parse(potentialJson);
          // 确保是对象或数组
          if (typeof parsed === 'object' && parsed !== null) {
            blocks.push({
              id: generateId(),
              content: parsed,
              startIndex: start,
              endIndex: i + 1,
              type: Array.isArray(parsed) ? 'array' : 'object'
            });
          }
        } catch {
          // 解析失败，可能是无效的 JSON
        }
        start = -1;
      }
    }
  }

  return blocks;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatJSON = (data: any): string => {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
};
