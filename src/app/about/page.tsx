'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreativeNavBar } from '@/components/CreativeNavBar';
import { ThemeCustomizer } from '@/components/ColorCustomizer';
import { AnimatedMascot } from '@/components/AnimatedMascot';
import { HighlightedText } from '@/components/RoughAnnotations';
import { SpringCard } from '@/components/SpringAnimations';
import { Users, Target, Zap, Heart, Star, Award, Lightbulb, Rocket } from 'lucide-react';

export default function AboutPage() {
  const [showCustomizer, setShowCustomizer] = useState(false);

  const features = [
    {
      icon: Target,
      title: 'Structured Planning',
      description: 'Transform complex projects into actionable tasks with the proven 3W Framework methodology.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Real-time collaboration with comments, approvals, and workload distribution across teams.'
    },
    {
      icon: Zap,
      title: 'Multiple Views',
      description: 'Kanban boards, Gantt charts, calendars, and table views for flexible project visualization.'
    },
    {
      icon: Heart,
      title: 'Analytics & Reporting',
      description: 'Comprehensive insights with performance metrics, forecasting, and exportable reports.'
    }
  ];

  const team = [
    {
      name: 'Alex Thompson',
      role: 'Project Manager',
      bio: 'Specializing in agile methodologies and cross-functional team coordination.'
    },
    {
      name: 'Jordan Lee',
      role: 'Senior Developer',
      bio: 'Building scalable solutions with Next.js, TypeScript, and modern web technologies.'
    },
    {
      name: 'Sam Patel',
      role: 'UX/UI Designer',
      bio: 'Creating intuitive interfaces that make complex project management feel effortless.'
    },
    {
      name: 'Casey Morgan',
      role: 'Data Analyst',
      bio: 'Turning project data into actionable insights through advanced analytics.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Creative Navigation Bar */}
      <CreativeNavBar
        showCustomizer={showCustomizer}
        setShowCustomizer={setShowCustomizer}
      />

      {/* Theme Customizer Panel */}
      {showCustomizer && (
        <div className="fixed top-0 right-0 h-screen w-full md:w-96 bg-background border-l shadow-2xl z-40 overflow-y-auto p-6">
          <button
            onClick={() => setShowCustomizer(false)}
            className="absolute top-4 right-4 text-2xl"
          >
            ✕
          </button>
          <ThemeCustomizer />
        </div>
      )}

      <div className="container mx-auto px-8 py-16 space-y-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <motion.h1
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              About 3W Tracker
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <HighlightedText type="underline" color="#8b5cf6">
                Empowering teams to achieve their goals through structured action planning
              </HighlightedText>
            </motion.p>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          >
            <AnimatedMascot completionRate={85} />
          </motion.div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              We empower organizations to execute their strategies effectively through structured action planning.
              The 3W Framework (What, Who, When) eliminates ambiguity, ensures accountability, and drives results
              by transforming strategic goals into clear, trackable actions that teams can execute with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <SpringCard className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold">What</h3>
              <p className="text-muted-foreground">
                Define clear, measurable objectives and deliverables. Break down strategic initiatives into actionable tasks with specific success criteria.
              </p>
            </SpringCard>

            <SpringCard className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold">Who</h3>
              <p className="text-muted-foreground">
                Assign clear ownership and responsibilities. Track workload distribution and ensure every team member knows their role and contributions.
              </p>
            </SpringCard>

            <SpringCard className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold">When</h3>
              <p className="text-muted-foreground">
                Establish realistic timelines with milestones and deadlines. Monitor progress in real-time and adjust schedules proactively.
              </p>
            </SpringCard>

            <SpringCard className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold">Results</h3>
              <p className="text-muted-foreground">
                Drive measurable outcomes with data-driven insights, performance analytics, and continuous improvement through structured execution.
              </p>
            </SpringCard>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Why Choose 3W Tracker?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform combining powerful project management capabilities with intuitive design
              to help teams execute strategies efficiently and achieve measurable results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <SpringCard className="p-6 text-center space-y-4 h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </SpringCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A dedicated team of professionals committed to helping organizations execute their strategies
              through innovative project management solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <SpringCard className="p-6 text-center space-y-4 h-full">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-blue-600 font-medium">{member.role}</p>
                  </div>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </SpringCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Ready to Transform Your Project Management?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start executing your strategies with clarity, accountability, and measurable results using the 3W Framework.
            </p>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={() => window.location.href = '/actions/new'}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Action Plan
            </motion.button>
            <motion.button
              onClick={() => window.location.href = '/contact'}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.button>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}