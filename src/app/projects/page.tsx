'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectDashboard from '@/components/dashboard/ProjectDashboard';
import TemplatesLibrary from '@/components/dashboard/TemplatesLibrary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FloatingCreateButton from '@/components/projects/FloatingCreateButton';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import { CreativeNavBar } from '@/components/CreativeNavBar';
import CreativeFooter from '@/components/CreativeFooter';
import { AnimatedBusinessBackground } from '@/components/AnimatedBusinessBackground';
import { 
  Sparkles, 
  Rocket, 
  Briefcase, 
  TrendingUp,
  Layers,
  Zap,
  Star,
  Target
} from 'lucide-react';

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState('projects');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const floatingIcons = [
    { Icon: Rocket, delay: 0, color: '#3B82F6' },
    { Icon: Sparkles, delay: 0.5, color: '#8B5CF6' },
    { Icon: Target, delay: 1, color: '#EC4899' },
    { Icon: Zap, delay: 1.5, color: '#F59E0B' },
    { Icon: Star, delay: 2, color: '#10B981' },
  ];

  return (
    <>
      <CreativeNavBar 
        showCustomizer={showCustomizer}
        setShowCustomizer={setShowCustomizer}
      />
      
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated Background */}
        <AnimatedBusinessBackground />
        
        {/* Floating Decorative Icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingIcons.map(({ Icon, delay, color }, index) => (
            <motion.div
              key={index}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
                x: [0, 30, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 6,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                left: `${10 + index * 20}%`,
                top: `${15 + (index % 3) * 25}%`,
              }}
            >
              <Icon size={48} color={color} strokeWidth={1.5} />
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <motion.div 
          className="relative z-10 container mx-auto px-4 pt-24 pb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Header Section */}
          <motion.div 
            className="mb-8 text-center"
            variants={itemVariants}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              className="inline-block mb-4"
            >
              <div className="relative">
                <div className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
                <Briefcase size={64} className="relative text-blue-600 dark:text-blue-400" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Projects Hub
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Organize, track, and deliver exceptional projects with style
            </motion.p>

            {/* Animated Stats Bar */}
            <motion.div 
              className="flex flex-wrap justify-center gap-6 mt-8"
              variants={itemVariants}
            >
              {[
                { label: 'Active Projects', value: '12', icon: Layers, color: 'from-blue-500 to-cyan-500' },
                { label: 'Completion Rate', value: '87%', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
                { label: 'Team Members', value: '24', icon: Star, color: 'from-purple-500 to-pink-500' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <stat.icon size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Tabs with Animation */}
          <motion.div variants={itemVariants}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-2 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                  <TabsTrigger 
                    value="projects"
                    className="relative rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
                  >
                    <Briefcase size={18} className="mr-2" />
                    Projects Dashboard
                  </TabsTrigger>
                  <TabsTrigger 
                    value="templates"
                    className="relative rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
                  >
                    <Sparkles size={18} className="mr-2" />
                    Templates Library
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="projects" className="mt-0">
                <motion.div
                  key="projects-content"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectDashboard />
                </motion.div>
              </TabsContent>

              <TabsContent value="templates" className="mt-0">
                <motion.div
                  key="templates-content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TemplatesLibrary />
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>

        {/* Enhanced Floating Action Button */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.5 
          }}
        >
          <FloatingCreateButton onClick={() => setIsCreateModalOpen(true)} />
        </motion.div>

        {/* Create Project Modal */}
        <CreateProjectModal 
          open={isCreateModalOpen} 
          onOpenChange={setIsCreateModalOpen} 
        />
      </div>

      <CreativeFooter />
    </>
  );
}
