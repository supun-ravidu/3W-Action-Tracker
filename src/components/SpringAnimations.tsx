'use client';

import { useEffect, useState } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';

interface SpringCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SpringCard({ children, className }: SpringCardProps) {
  const [{ x, y, rotateX, rotateY, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    config: config.wobbly,
  }));

  const bind = useGesture({
    onHover: ({ hovering }) => {
      api.start({
        scale: hovering ? 1.05 : 1,
        config: config.wobbly,
      });
    },
    onMove: ({ xy: [px, py], dragging }) => {
      if (dragging) return;
      
      const x = px - window.innerWidth / 2;
      const y = py - window.innerHeight / 2;
      
      api.start({
        rotateX: -(y / window.innerHeight) * 20,
        rotateY: (x / window.innerWidth) * 20,
      });
    },
    onDrag: ({ offset: [ox, oy], down }) => {
      api.start({
        x: down ? ox : 0,
        y: down ? oy : 0,
        scale: down ? 1.1 : 1,
        config: config.gentle,
      });
    },
  });

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        y,
        scale,
        rotateX,
        rotateY,
      }}
      className={className}
    >
      {children}
    </animated.div>
  );
}

interface BouncyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function BouncyButton({ children, onClick, className }: BouncyButtonProps) {
  const [springs, api] = useSpring(() => ({
    scale: 1,
    config: config.wobbly,
  }));

  return (
    <animated.button
      style={springs}
      onMouseEnter={() => api.start({ scale: 1.1 })}
      onMouseLeave={() => api.start({ scale: 1 })}
      onMouseDown={() => api.start({ scale: 0.95 })}
      onMouseUp={() => api.start({ scale: 1.1 })}
      onClick={onClick}
      className={className}
    >
      {children}
    </animated.button>
  );
}

interface CounterProps {
  value: number;
  duration?: number;
}

export function AnimatedCounter({ value, duration = 1000 }: CounterProps) {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 200,
    config: { duration },
  });

  return <animated.span>{number.to((n) => n.toFixed(0))}</animated.span>;
}

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function SpringProgressBar({ progress, className }: ProgressBarProps) {
  const springs = useSpring({
    width: `${progress}%`,
    config: config.molasses,
  });

  return (
    <div className={`h-2 bg-muted rounded-full overflow-hidden ${className}`}>
      <animated.div
        style={springs}
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
      />
    </div>
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
}

export function FloatingElement({ children, className }: FloatingElementProps) {
  const springs = useSpring({
    from: { y: 0 },
    to: [{ y: -10 }, { y: 0 }],
    loop: true,
    config: config.slow,
  });

  return (
    <animated.div style={springs} className={className}>
      {children}
    </animated.div>
  );
}

interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
}

export function StaggeredList({ children, className }: StaggeredListProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const transitions = children.map((_, index) => {
    return useSpring({
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: {
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0px)' : 'translateY(20px)',
      },
      delay: index * 100,
      config: config.gentle,
    });
  });

  return (
    <div className={className}>
      {children.map((child, index) => (
        <animated.div key={index} style={transitions[index]}>
          {child}
        </animated.div>
      ))}
    </div>
  );
}
