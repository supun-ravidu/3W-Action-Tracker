'use client';

import { useEffect, useRef } from 'react';
import { annotate, annotationGroup } from 'rough-notation';

interface HighlightedTextProps {
  children: React.ReactNode;
  type?: 'underline' | 'box' | 'circle' | 'highlight' | 'strike-through' | 'crossed-off' | 'bracket';
  color?: string;
  animate?: boolean;
  delay?: number;
}

export function HighlightedText({ 
  children, 
  type = 'highlight', 
  color = '#3b82f6', 
  animate = true,
  delay = 0 
}: HighlightedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const annotation = annotate(ref.current, {
      type,
      color,
      strokeWidth: 2,
      animate,
      animationDuration: 800,
      iterations: 2,
    });

    const timer = setTimeout(() => {
      annotation.show();
    }, delay);

    return () => {
      clearTimeout(timer);
      annotation.remove();
    };
  }, [type, color, animate, delay]);

  return <span ref={ref}>{children}</span>;
}

interface AnimatedMetricProps {
  value: string | number;
  label: string;
  type?: 'underline' | 'box' | 'circle' | 'highlight';
  color?: string;
}

export function AnimatedMetric({ value, label, type = 'circle', color = '#10b981' }: AnimatedMetricProps) {
  const valueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!valueRef.current) return;

    const annotation = annotate(valueRef.current, {
      type,
      color,
      strokeWidth: 3,
      padding: 8,
      animate: true,
      animationDuration: 1000,
    });

    const timer = setTimeout(() => {
      annotation.show();
    }, 500);

    return () => {
      clearTimeout(timer);
      annotation.remove();
    };
  }, [type, color, value]);

  return (
    <div className="text-center space-y-2">
      <div ref={valueRef} className="text-4xl font-bold">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

interface AnnotationGroupProps {
  children: React.ReactNode;
  delay?: number;
}

export function AnnotationGroup({ children, delay = 500 }: AnnotationGroupProps) {
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    const elements = groupRef.current.querySelectorAll('[data-annotation]');
    const annotations = Array.from(elements).map((el) => {
      const type = el.getAttribute('data-annotation-type') || 'underline';
      const color = el.getAttribute('data-annotation-color') || '#3b82f6';
      
      return annotate(el as HTMLElement, {
        type: type as any,
        color,
        strokeWidth: 2,
        animate: true,
        animationDuration: 800,
      });
    });

    const group = annotationGroup(annotations);
    
    const timer = setTimeout(() => {
      group.show();
    }, delay);

    return () => {
      clearTimeout(timer);
      annotations.forEach((a) => a.remove());
    };
  }, [delay]);

  return <div ref={groupRef}>{children}</div>;
}
