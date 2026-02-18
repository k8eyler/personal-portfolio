"use client";

import { useEffect, useRef, useId } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

let renderCounter = 0;

export default function MermaidDiagram({ chart, className = "" }: MermaidDiagramProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!elementRef.current) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
    });

    const container = elementRef.current;
    container.innerHTML = '';

    const uniqueId = `mermaid-${id.replace(/:/g, '')}-${++renderCounter}`;

    mermaid.render(uniqueId, chart).then(({ svg }) => {
      container.innerHTML = svg;
    }).catch((error) => {
      console.error('Error rendering mermaid diagram:', error);
      container.innerHTML = '<p class="text-red-500">Error rendering diagram</p>';
    });

    return () => {
      container.innerHTML = '';
      const orphan = document.getElementById(uniqueId);
      orphan?.remove();
    };
  }, [chart, id]);

  return (
    <div 
      ref={elementRef} 
      className={`mermaid-diagram ${className}`}
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '200px'
      }}
    />
  );
} 