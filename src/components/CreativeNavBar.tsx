'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  Users,
  ListChecks,
  Plus,
  Palette,
  Volume2,
  VolumeX,
  Zap,
  Star,
  Moon,
  Sun,
  Info,
  Mail,
  Home,
  BarChart3,
  Command,
  Search,
  Rocket,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  gradient: string;
  description: string;
}

interface CreativeNavBarProps {
  onThemeToggle?: () => void;
  showCustomizer?: boolean;
  setShowCustomizer?: (show: boolean) => void;
}

export function CreativeNavBar({
  onThemeToggle,
  showCustomizer = false,
  setShowCustomizer
}: CreativeNavBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navRef = useRef<HTMLDivElement>(null);

  // Smooth mouse tracking with spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 300 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 300 });

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', path: '/', icon: Home, gradient: 'from-blue-500 to-cyan-500', description: 'Dashboard & Overview' },
    { id: 'actions', label: 'Actions', path: '/actions', icon: ListChecks, gradient: 'from-green-500 to-emerald-500', description: 'Manage Tasks' },
    { id: 'projects', label: 'Projects', path: '/projects', icon: LayoutDashboard, gradient: 'from-purple-500 to-pink-500', description: 'Project Management' },
    { id: 'team', label: 'Team', path: '/team', icon: Users, gradient: 'from-orange-500 to-red-500', description: 'Team Collaboration' },
    { id: 'reports', label: 'Reports', path: '/reports', icon: BarChart3, gradient: 'from-indigo-500 to-blue-500', description: 'Analytics & Insights' },
    { id: 'about', label: 'About', path: '/about', icon: Info, gradient: 'from-violet-500 to-purple-500', description: 'Learn More' },
    { id: 'contact', label: 'Contact', path: '/contact', icon: Mail, gradient: 'from-teal-500 to-cyan-500', description: 'Get in Touch' },
  ];

  // Scroll detection for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Magnetic mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (path: string, label: string) => {
    if (isSoundEnabled) {
      const audio = new Audio('/sounds/nav-click.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }

    // Micro-confetti burst
    confetti({
      particleCount: 20,
      angle: 90,
      spread: 45,
      origin: { y: 0.1 },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899'],
      scalar: 0.6
    });

    toast.success(`${label}`, {
      description: 'Loading...',
      duration: 1500,
    });

    router.push(path);
  };

  const handleNewActionPlan = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']
    });

    if (isSoundEnabled) {
      const audio = new Audio('/sounds/success.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }

    toast.success('Creating New Action Plan', {
      description: 'What • Who • When',
      duration: 2000,
    });

    router.push('/actions/new');
  };

  const filteredNavItems = navItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={() => setShowCommandPalette(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101] px-4"
            >
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search actions, projects, team..."
                    className="flex-1 bg-transparent outline-none text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <kbd className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded">ESC</kbd>
                </div>
                <div className="max-h-96 overflow-y-auto p-2">
                  {filteredNavItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        handleNavClick(item.path, item.label);
                        setShowCommandPalette(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${item.gradient}`}>
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-slate-500">{item.description}</div>
                      </div>
                      <Command className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Glassmorphic Navbar */}
      <motion.header
        ref={navRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl shadow-xl border-b border-white/20'
            : 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl'
        }`}
      >
        {/* Ambient Light Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden opacity-30"
          style={{
            background: `radial-gradient(circle at ${smoothMouseX.get() + 500}px ${smoothMouseY.get() + 50}px, rgba(139, 92, 246, 0.15), transparent 40%)`
          }}
        />

        <div className="container mx-auto px-6 py-3 relative z-10">
          <div className="flex items-center justify-between">
            {/* Minimalist Logo */}
            <motion.div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => handleNavClick('/', 'Home')}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <motion.div
                className="relative group"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-2.5 rounded-xl">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
              </motion.div>
              
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
                  3W Action Tracker
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  What • Who • When
                </p>
              </div>
            </motion.div>

            {/* Center Navigation - Magnetic Dock Style */}
            <div className="flex-1 flex justify-center">
              <motion.div
                className="flex items-center gap-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-full px-2 py-1.5 border border-white/20 shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {navItems.map((item, index) => {
                  const isActive = pathname === item.path;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavClick(item.path, item.label)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`relative p-2.5 rounded-full transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      whileHover={{ scale: 1.2, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.05,
                        type: 'spring',
                        stiffness: 400,
                        damping: 17
                      }}
                    >
                      {/* Active Background */}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active"
                          className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-full`}
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                      
                      {/* Icon */}
                      <motion.div
                        className="relative z-10"
                        animate={hoveredItem === item.id ? { rotate: [0, -10, 10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        <item.icon className="w-4 h-4" />
                      </motion.div>

                      {/* Tooltip */}
                      <AnimatePresence>
                        {hoveredItem === item.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 45, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.8 }}
                            className="absolute left-1/2 -translate-x-1/2 bottom-0 pointer-events-none"
                          >
                            <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-xl">
                              {item.label}
                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-white rotate-45" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Command Palette Button */}
              <motion.button
                onClick={() => setShowCommandPalette(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline text-slate-600 dark:text-slate-400">Search</span>
                <kbd className="hidden sm:inline px-1.5 py-0.5 text-xs bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-600">
                  ⌘K
                </kbd>
              </motion.button>

              {/* Utility Buttons */}
              <div className="flex items-center gap-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-full px-1 py-1 border border-white/20">
                <motion.button
                  onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  title={isSoundEnabled ? 'Disable Sound' : 'Enable Sound'}
                >
                  {isSoundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </motion.button>

                <motion.button
                  onClick={() => setShowCustomizer?.(!showCustomizer)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  title="Customize Theme"
                >
                  <Palette className="w-4 h-4" />
                </motion.button>

                <div className="w-px h-6 bg-slate-300 dark:bg-slate-700" />

                <NotificationBell />
              </div>

              {/* New Action Button */}
              <motion.button
                onClick={handleNewActionPlan}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg font-medium text-sm relative overflow-hidden group"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Plus className="w-4 h-4" />
                </motion.div>
                <span className="hidden md:inline">New Action</span>
                
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}