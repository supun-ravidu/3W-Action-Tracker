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
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-purple-100'
            : 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo & Brand */}
            <motion.div
              className="flex items-center gap-4 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push('/admin/dashboard')}
            >
              <div className="relative">
                <motion.div
                  className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center shadow-lg"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(168, 85, 247, 0.4)',
                      '0 0 40px rgba(236, 72, 153, 0.6)',
                      '0 0 20px rgba(168, 85, 247, 0.4)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="h-7 w-7 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Admin Control Center
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Powered by <span className="text-purple-600">Advanced Analytics</span>
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <motion.div key={item.name} className="relative" whileHover={{ y: -2 }}>
                    <Button
                      variant={active ? 'default' : 'ghost'}
                      onClick={() => router.push(item.href)}
                      className={`gap-2 relative overflow-hidden ${
                        active
                          ? `bg-gradient-to-r ${item.color} text-white hover:opacity-90 shadow-lg`
                          : 'hover:bg-purple-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{item.name}</span>
                      {item.badge && <div className="ml-1">{item.badge}</div>}
                      {active && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 -z-10"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Time Display */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <Activity className="h-4 w-4 text-purple-600 animate-pulse" />
                <span className="text-sm font-semibold text-purple-700">{currentTime}</span>
              </div>

              {/* Quick Search */}
              <Button
                variant="outline"
                size="icon"
                className="hidden md:flex relative group hover:border-purple-300"
              >
                <Search className="h-4 w-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative hover:border-purple-300"
                  >
                    <Bell className="h-4 w-4 text-gray-600" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center animate-pulse">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-4 text-sm text-gray-500 text-center">
                    No new notifications
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden md:flex gap-2 hover:border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">Admin</p>
                      <p className="text-xs text-gray-500 truncate max-w-[100px]">
                        {user.email}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
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
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-purple-100 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-gray-600 font-medium">All Systems Operational</span>
                </div>
                <div className="hidden md:flex items-center gap-1.5">
                  <Rocket className="h-3 w-3 text-purple-600" />
                  <span className="text-gray-600">Firebase Connected</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs gap-1">
                  <Sparkles className="h-3 w-3" />
                  v2.0.0
                </Badge>
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
