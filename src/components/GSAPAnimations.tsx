'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export function ScrollReveal({ 
  children, 
  className, 
  direction = 'up',
  delay = 0 
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const directions = {
      up: { y: 50 },
      down: { y: -50 },
      left: { x: 50 },
      right: { x: -50 },
    };

    const element = ref.current;
    
    gsap.fromTo(
      element,
      {
        opacity: 0,
        ...directions[direction],
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 1,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          end: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [direction, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxSection({ children, className, speed = 0.5 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.to(element, {
      y: () => element.offsetHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface CountUpProps {
  end: number;
  duration?: number;
  className?: string;
}

export function GSAPCountUp({ end, duration = 2, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const obj = { value: 0 };

    gsap.to(obj, {
      value: end,
      duration,
      ease: 'power1.out',
      onUpdate: () => {
        element.textContent = Math.floor(obj.value).toString();
      },
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }, [end, duration]);

  return <span ref={ref} className={className}>0</span>;
}

interface StaggeredCardsProps {
  children: React.ReactNode[];
  className?: string;
  stagger?: number;
}

export function StaggeredCards({ children, className, stagger = 0.1 }: StaggeredCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.children;

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 50,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [stagger]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

interface MorphingTextProps {
  texts: string[];
  className?: string;
  interval?: number;
}

export function MorphingText({ texts, className, interval = 3000 }: MorphingTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!ref.current || texts.length === 0) return;

    const element = ref.current;
    element.textContent = texts[0];

    const morphText = () => {
      indexRef.current = (indexRef.current + 1) % texts.length;
      const nextText = texts[indexRef.current];

      gsap.to(element, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
          element.textContent = nextText;
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 0.3,
          });
        },
      });
    };

    const intervalId = setInterval(morphText, interval);

    return () => clearInterval(intervalId);
  }, [texts, interval]);

  return <div ref={ref} className={className} />;
}

interface PinSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function PinSection({ children, className }: PinSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: '+=500',
      pin: true,
      pinSpacing: true,
    });
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
