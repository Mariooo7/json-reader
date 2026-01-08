import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../hooks/useTheme';

export const Mermaid: React.FC<{ chart: string }> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState('');
  const { isDark } = useTheme();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
    });
  }, [isDark]);

  useEffect(() => {
    const renderChart = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
      } catch (error) {
        console.error('Mermaid render error:', error);
        setSvg(`<div class="text-red-500 text-xs">Mermaid syntax error</div>`);
      }
    };

    if (chart) {
      renderChart();
    }
  }, [chart, isDark]);

  return <div ref={ref} className="my-4 flex justify-center" dangerouslySetInnerHTML={{ __html: svg }} />;
};
