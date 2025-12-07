'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreativeNavBar } from '@/components/CreativeNavBar';
import { ThemeCustomizer } from '@/components/ColorCustomizer';
import { AnimatedMascot } from '@/components/AnimatedMascot';
import { HighlightedText } from '@/components/RoughAnnotations';
import { SpringCard } from '@/components/SpringAnimations';
import { 
  Users, Target, Zap, Heart, Star, Award, Lightbulb, Rocket, 
  Code, Database, Cloud, Lock, Palette, Smartphone, Globe, 
  ArrowRight, CheckCircle, PlayCircle, GitBranch, Layers, 
  Server, Shield, Workflow, Mail, MapPin, Calendar, Trophy,
  Sparkles
} from 'lucide-react';

export default function AboutPage() {
  const [showCustomizer, setShowCustomizer] = useState(false);

  const webProcessSteps = [
    {
      icon: Lightbulb,
      title: 'Planning & Research',
      description: 'Requirements gathering, user research, and strategic planning for optimal solutions.',
      color: 'from-blue-500 to-cyan-500',
      phase: 'Phase 1'
    },
    {
      icon: Palette,
      title: 'Design & Prototype',
      description: 'Creating intuitive UI/UX designs with modern aesthetics and user-centered approach.',
      color: 'from-purple-500 to-pink-500',
      phase: 'Phase 2'
    },
    {
      icon: Code,
      title: 'Development',
      description: 'Building robust, scalable applications using Next.js, React, TypeScript, and modern frameworks.',
      color: 'from-green-500 to-emerald-500',
      phase: 'Phase 3'
    },
    {
      icon: Database,
      title: 'Backend & Database',
      description: 'Implementing Firebase, Firestore, authentication, and secure data management systems.',
      color: 'from-orange-500 to-red-500',
      phase: 'Phase 4'
    },
    {
      icon: GitBranch,
      title: 'Testing & QA',
      description: 'Comprehensive testing, debugging, and quality assurance for reliable performance.',
      color: 'from-indigo-500 to-blue-500',
      phase: 'Phase 5'
    },
    {
      icon: Rocket,
      title: 'Deployment & Launch',
      description: 'Cloud deployment, optimization, and continuous monitoring for peak performance.',
      color: 'from-pink-500 to-rose-500',
      phase: 'Phase 6'
    }
  ];

  const technologies = [
    { name: 'Next.js', icon: '⚡', color: 'from-black to-gray-700' },
    { name: 'React', icon: '⚛️', color: 'from-blue-400 to-cyan-400' },
    { name: 'TypeScript', icon: '📘', color: 'from-blue-600 to-blue-800' },
    { name: 'Firebase', icon: '🔥', color: 'from-yellow-500 to-orange-500' },
    { name: 'Tailwind CSS', icon: '🎨', color: 'from-cyan-500 to-blue-500' },
    { name: 'Framer Motion', icon: '✨', color: 'from-purple-500 to-pink-500' },
    { name: 'Node.js', icon: '🟢', color: 'from-green-600 to-green-800' },
    { name: 'Vercel', icon: '▲', color: 'from-gray-800 to-black' }
  ];

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

      <div className="container mx-auto px-8 py-16 space-y-20">
        {/* Hero Section with Developer Info */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center items-center gap-4 mb-6"
            >
              <Sparkles className="w-8 h-8 text-yellow-500" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                About 3W Tracker
              </h1>
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </motion.div>
            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <HighlightedText type="underline" color="#8b5cf6">
                A modern project management solution powered by the 3W Framework
              </HighlightedText>
            </motion.p>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          >
            <AnimatedMascot completionRate={95} />
          </motion.div>
        </motion.section>

        {/* Developer Profile Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                Meet The Developer
              </motion.h2>
              <p className="text-lg text-muted-foreground">
                Crafted with passion and expertise from Sri Lanka 🇱🇰
              </p>
            </div>

            <SpringCard className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
              
              <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12">
                {/* Developer Image */}
                <motion.div 
                  className="relative"
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-75 group-hover:opacity-100 blur-lg transition duration-500" />
                    <img
                      src="https://image2url.com/images/1765119184924-7e9efe3c-4c0c-435e-a102-89e2c9dc6a46.jpg"
                      alt="Supun Rathnayaka"
                      className="relative w-full aspect-square object-cover rounded-2xl shadow-2xl transform group-hover:scale-105 transition duration-500"
                    />
                    <motion.div 
                      className="absolute -bottom-4 -right-4 w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center"
                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <span className="text-5xl">🇱🇰</span>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Developer Info */}
                <motion.div 
                  className="flex flex-col justify-center space-y-6"
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="space-y-3">
                    <motion.h3 
                      className="text-3xl md:text-4xl font-bold text-gray-900"
                      whileHover={{ scale: 1.05 }}
                    >
                      Supun Rathnayaka
                    </motion.h3>
                    <div className="flex items-center gap-2 text-xl text-blue-600 font-semibold">
                      <Code className="w-6 h-6" />
                      <span>Full Stack Developer</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span className="flex items-center gap-2">
                        Sri Lanka <span className="text-2xl">🇱🇰</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Trophy className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                      <p className="text-gray-700">
                        Specialized in building modern, scalable web applications with cutting-edge technologies
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                      <p className="text-gray-700">
                        Expert in Next.js, React, TypeScript, Firebase, and cloud-based solutions
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Heart className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                      <p className="text-gray-700">
                        Passionate about creating intuitive user experiences and efficient project management tools
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-3">
                      {['Next.js', 'React', 'TypeScript', 'Firebase', 'Node.js'].map((tech, i) => (
                        <motion.span
                          key={tech}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-semibold shadow-lg"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ scale: 1.1 }}
                          viewport={{ once: true }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </SpringCard>
          </div>
        </motion.section>

        {/* Web Development Process */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Workflow className="w-10 h-10 text-blue-600" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Complete Web Development Process
              </h2>
            </motion.div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From concept to deployment - A comprehensive approach to building world-class web applications
            </p>
          </div>

          <div className="relative">
            {/* Process Flow Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform -translate-x-1/2" />

            <div className="space-y-16">
              {webProcessSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative grid md:grid-cols-2 gap-8 items-center ${
                    index % 2 === 0 ? '' : 'md:grid-flow-dense'
                  }`}
                >
                  {/* Phase Number Circle */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-2xl items-center justify-center z-10 border-4 border-purple-500">
                    <span className="text-xl font-bold text-purple-600">{index + 1}</span>
                  </div>

                  {/* Content Card */}
                  <div className={index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-2'}>
                    <SpringCard className="p-8 space-y-4 hover:shadow-2xl transition-shadow duration-300">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <step.icon className="w-8 h-8 text-white" />
                        </motion.div>
                        <div>
                          <span className="text-sm font-semibold text-purple-600">{step.phase}</span>
                          <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{step.description}</p>
                      <div className="flex items-center gap-2 text-sm text-purple-600 font-semibold">
                        <PlayCircle className="w-4 h-4" />
                        <span>Essential Phase</span>
                      </div>
                    </SpringCard>
                  </div>

                  {/* Visual Element */}
                  <div className={`hidden md:block ${index % 2 === 0 ? 'md:col-start-2' : 'md:col-start-1'}`}>
                    <motion.div
                      className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 10, repeat: Infinity }}
                      >
                        <step.icon className="w-32 h-32 text-purple-600 opacity-30" />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Technologies Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Technologies & Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with modern, industry-leading technologies for optimal performance and scalability
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <SpringCard className="p-6 text-center space-y-3 h-full">
                  <div className={`text-5xl mb-2`}>{tech.icon}</div>
                  <h3 className={`text-lg font-bold bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
                    {tech.name}
                  </h3>
                </SpringCard>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-4xl font-bold text-gray-900">The 3W Framework</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              A structured methodology that eliminates ambiguity, ensures accountability, and drives results
              by transforming strategic goals into clear, trackable actions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <SpringCard className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-white" />
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
                <Calendar className="w-8 h-8 text-white" />
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

        {/* Key Features Section */}
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
                <SpringCard className="p-6 text-center space-y-4 h-full hover:shadow-xl transition-shadow">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </SpringCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Project Stats */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden"
        >
          <SpringCard className="relative p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
            <div className="relative grid md:grid-cols-4 gap-8 text-center">
              {[
                { icon: Rocket, label: 'Modern Tech Stack', value: '8+', color: 'from-blue-500 to-cyan-500' },
                { icon: Shield, label: 'Secure & Reliable', value: '99.9%', color: 'from-purple-500 to-pink-500' },
                { icon: Zap, label: 'Lightning Fast', value: '<100ms', color: 'from-green-500 to-emerald-500' },
                { icon: Globe, label: 'Global Ready', value: '🇱🇰', color: 'from-orange-500 to-red-500' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </SpringCard>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden"
        >
          <SpringCard className="relative p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
            
            <motion.div
              className="relative space-y-6"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.div
                animate={{
                  rotate: [0, 360]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  rotate: [360, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-pink-500/30 to-orange-500/30 rounded-full blur-3xl"
              />

              <div className="space-y-4">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  Ready to Transform Your Projects?
                </motion.h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join teams worldwide using the 3W Framework to achieve their goals with clarity and efficiency
                </p>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                <motion.button
                  onClick={() => window.location.href = '/actions/new'}
                  className="px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all text-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Rocket className="w-6 h-6" />
                  Start Your Journey
                </motion.button>
                <motion.button
                  onClick={() => window.location.href = '/contact'}
                  className="px-10 py-5 bg-white border-2 border-purple-300 text-purple-700 font-bold rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-6 h-6" />
                  Get In Touch
                </motion.button>
              </motion.div>

              <motion.div
                className="pt-8 border-t border-gray-200 mt-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  Proudly crafted in Sri Lanka 🇱🇰 by Supun Rathnayaka
                  <Heart className="w-4 h-4 text-pink-500" />
                </p>
              </motion.div>
            </motion.div>
          </SpringCard>
        </motion.section>

        {/* Footer Credits */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center py-8 space-y-4"
        >
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
            >
              <Code className="w-4 h-4" />
              <span>Built with Next.js</span>
            </motion.div>
            <span className="text-gray-400">•</span>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
            >
              <Database className="w-4 h-4" />
              <span>Powered by Firebase</span>
            </motion.div>
            <span className="text-gray-400">•</span>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
            >
              <Shield className="w-4 h-4" />
              <span>Secure & Scalable</span>
            </motion.div>
          </div>
          
          <motion.p 
            className="text-xs text-gray-500"
            whileHover={{ scale: 1.05 }}
          >
            © 2024 3W Action Tracker. Developed by Supun Rathnayaka 🇱🇰
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}