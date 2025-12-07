'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  UserPlus,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Zap,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Shield,
  Activity,
  Rocket,
  Crown,
  TrendingUp,
  Star,
  Globe,
  Command,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PendingRequestsBadge } from './PendingRequestsBadge';
import { PendingProjectRequestsBadge } from './PendingProjectRequestsBadge';

interface CreativeAdminNavbarProps {
  user: User;
}

export function CreativeAdminNavbar({ user }: CreativeAdminNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Project Approvals',
      href: '/admin/project-approvals',
      icon: FolderKanban,
      color: 'from-pink-500 to-rose-500',
      badge: <PendingProjectRequestsBadge />,
    },
    {
      name: 'Team Workload',
      href: '/admin/team-workload',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-gradient-to-r from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-2xl shadow-2xl border-b border-purple-500/30'
            : 'bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-blue-900/90 backdrop-blur-xl shadow-xl border-b border-purple-500/20'
        }`}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 lg:h-22">
            {/* Logo & Brand */}
            <motion.div
              className="flex items-center gap-4 cursor-pointer relative z-10"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin/dashboard')}
            >
              <div className="relative">
                <motion.div
                  className="h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl"
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(251, 191, 36, 0.6)',
                      '0 0 60px rgba(249, 115, 22, 0.8)',
                      '0 0 30px rgba(251, 191, 36, 0.6)',
                    ],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Crown className="h-8 w-8 text-white drop-shadow-lg" />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 h-5 w-5 bg-green-400 rounded-full border-2 border-white shadow-lg"
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Zap className="h-3 w-3 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -left-1"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                </motion.div>
              </div>
              <div className="hidden lg:block">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white drop-shadow-lg">
                    ADMIN COMMAND CENTER
                  </h1>
                  <Star className="h-5 w-5 text-yellow-300 animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-xs text-purple-200 font-bold uppercase tracking-wider">
                    <Layers className="inline h-3 w-3 mr-1" />
                    Next-Gen Analytics Dashboard
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-3 relative z-10">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <motion.div 
                    key={item.name} 
                    className="relative" 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      whileHover={{ y: -3, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={active ? 'default' : 'ghost'}
                        onClick={() => router.push(item.href)}
                        className={`gap-2 relative overflow-hidden font-bold transition-all duration-300 ${
                          active
                            ? `bg-gradient-to-r ${item.color} text-white hover:opacity-90 shadow-2xl border-2 border-white/30`
                            : 'text-white hover:bg-white/20 hover:text-white border-2 border-transparent hover:border-white/20'
                        }`}
                      >
                        {active && (
                          <motion.div
                            className="absolute inset-0 bg-white/20"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.3, 0, 0.3],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                        <Icon className={`h-5 w-5 ${active ? 'drop-shadow-lg' : ''}`} />
                        <span className={active ? 'drop-shadow-sm' : ''}>{item.name}</span>
                        {item.badge && <div className="ml-1">{item.badge}</div>}
                      </Button>
                    </motion.div>
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-1 left-0 right-0 h-1 bg-white rounded-full shadow-lg"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 relative z-10">
              {/* Time Display */}
              <motion.div 
                className="hidden xl:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <Activity className="h-4 w-4 text-yellow-300 animate-pulse" />
                <span className="text-sm font-bold text-white tracking-wide">{currentTime}</span>
              </motion.div>

              {/* Quick Search */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden md:flex relative group bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/50 backdrop-blur-md"
                >
                  <Search className="h-5 w-5 text-white group-hover:text-yellow-300 transition-colors" />
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-md"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Button>
              </motion.div>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/50 backdrop-blur-md"
                    >
                      <Bell className="h-5 w-5 text-white" />
                      <motion.span 
                        className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-br from-red-500 to-pink-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center shadow-lg"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        3
                      </motion.span>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white/95 backdrop-blur-xl">
                  <DropdownMenuLabel className="text-purple-900">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-4 text-sm text-gray-500 text-center">
                    No new notifications
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="hidden md:flex gap-2 bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/50 backdrop-blur-md"
                    >
                      <motion.div 
                        className="h-9 w-9 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center text-white font-black text-sm shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {user.email?.charAt(0).toUpperCase()}
                      </motion.div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-white flex items-center gap-1">
                          Admin
                          <Crown className="h-3 w-3 text-yellow-300" />
                        </p>
                        <p className="text-xs text-purple-200 truncate max-w-[100px]">
                          {user.email}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-white" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-xl">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/admin/profile')}>
                    <Users className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden bg-white/10 hover:bg-white/20 border-white/30 text-white"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Enhanced Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-white/20 bg-gradient-to-r from-purple-800/80 via-indigo-800/80 to-blue-800/80 backdrop-blur-xl relative overflow-hidden"
        >
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 relative z-10">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-6">
                <motion.div 
                  className="flex items-center gap-2"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="relative">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
                    <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-green-400 animate-ping" />
                  </div>
                  <span className="text-white font-bold uppercase tracking-wider">All Systems Operational</span>
                </motion.div>
                <div className="hidden md:flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-yellow-300" />
                  <span className="text-purple-200 font-semibold">Firebase Connected</span>
                </div>
                <div className="hidden lg:flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-300" />
                  <span className="text-purple-200 font-semibold">Performance: Excellent</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                >
                  <Badge variant="secondary" className="text-xs gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none font-bold shadow-lg">
                    <Sparkles className="h-3 w-3" />
                    v3.0.0 PRO
                  </Badge>
                </motion.div>
                <Globe className="h-4 w-4 text-blue-300 hidden sm:block" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-200 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Button
                    key={item.name}
                    variant={active ? 'default' : 'ghost'}
                    onClick={() => {
                      router.push(item.href);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start gap-2 ${
                      active
                        ? `bg-gradient-to-r ${item.color} text-white`
                        : 'hover:bg-purple-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                    {item.badge && <div className="ml-auto">{item.badge}</div>}
                  </Button>
                );
              })}
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 border-red-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
