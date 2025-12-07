'use client';

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { motion } from 'framer-motion';

interface PhysicsCardProps {
  children: React.ReactNode;
  className?: string;
  onInteract?: () => void;
}

export function PhysicsCard({ children, className, onInteract }: PhysicsCardProps) {
  return (
    <motion.div
      drag
      dragElastic={0.2}
      dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
      whileHover={{ scale: 1.02, rotateZ: 1 }}
      whileTap={{ scale: 0.98 }}
      className={className}
      onClick={onInteract}
    >
      {children}
    </motion.div>
  );
}

export function FloatingBalls() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const { Engine, Render, Bodies, World, Mouse, MouseConstraint, Runner } = Matter;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;
    engine.gravity.y = 0.5;

    // Create renderer
    const render = Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: 400,
        wireframes: false,
        background: 'transparent',
      },
    });

    // Create boundaries
    const wallOptions = { isStatic: true, render: { visible: false } };
    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      400,
      window.innerWidth,
      10,
      wallOptions
    );
    const leftWall = Bodies.rectangle(0, 200, 10, 400, wallOptions);
    const rightWall = Bodies.rectangle(window.innerWidth, 200, 10, 400, wallOptions);
    const ceiling = Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 10, wallOptions);

    // Create colorful balls
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
    const balls = Array.from({ length: 12 }, () => {
      const radius = Math.random() * 20 + 15;
      return Bodies.circle(
        Math.random() * (window.innerWidth - 100) + 50,
        Math.random() * 100,
        radius,
        {
          restitution: 0.8,
          friction: 0.001,
          render: {
            fillStyle: colors[Math.floor(Math.random() * colors.length)],
            opacity: 0.7,
          },
        }
      );
    });

    // Add mouse control
    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    // Add everything to world
    World.add(engine.world, [ground, leftWall, rightWall, ceiling, ...balls, mouseConstraint]);

    // Run the engine and renderer
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Handle resize
    const handleResize = () => {
      render.canvas.width = window.innerWidth;
      render.options.width = window.innerWidth;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="relative w-full h-[400px] overflow-hidden rounded-lg border border-border/40 bg-gradient-to-br from-background/50 to-muted/30 backdrop-blur-sm">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-4xl font-bold text-muted-foreground/20">Loading Physics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg border border-border/40 bg-gradient-to-br from-background/50 to-muted/30 backdrop-blur-sm">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className="text-4xl font-bold text-muted-foreground/20">Interactive Physics Demo</p>
      </div>
    </div>
  );
}
