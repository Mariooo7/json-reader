export const formatJsonInText = (text: string): string => {
  try {
    // 尝试解析整个文本
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2);
  } catch {
    // 如果不是纯 JSON，尝试查找并格式化其中的 JSON 块（简化版，暂时只做全量尝试，复杂提取逻辑已有 extractor）
    // 用户需求是“粘贴一段 json...自动格式化”，通常指整段是 JSON。
    // 如果是混合文本，格式化可能会破坏原有结构，所以这里只针对纯 JSON 做格式化。
    return text;
  }
};
