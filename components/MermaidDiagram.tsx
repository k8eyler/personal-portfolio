"use client";

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export default function MermaidDiagram({ chart, className = "" }: MermaidDiagramProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      // Initialize mermaid
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Inter, system-ui, sans-serif',
      });

      // Clear previous content
      elementRef.current.innerHTML = '';

      // Render the diagram
      mermaid.render('mermaid-diagram', chart).then(({ svg }) => {
        if (elementRef.current) {
          elementRef.current.innerHTML = svg;
        }
      }).catch((error) => {
        console.error('Error rendering mermaid diagram:', error);
        if (elementRef.current) {
          elementRef.current.innerHTML = '<p className="text-red-500">Error rendering diagram</p>';
        }
      });
    }
  }, [chart]);

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