'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreativeNavBar } from '@/components/CreativeNavBar';
import { ThemeCustomizer } from '@/components/ColorCustomizer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpringCard } from '@/components/SpringAnimations';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Calendar,
  Sparkles,
  Heart,
  Star,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'supunravidubandara@gmail.com',
      description: 'Send us an email anytime',
      color: 'from-blue-500 to-cyan-500',
      link: 'mailto:supunravidubandara@gmail.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+94 77 682 4351',
      description: 'Available for inquiries',
      color: 'from-green-500 to-emerald-500',
      link: 'tel:+94776824351'
    },
    {
      icon: MapPin,
      title: 'Find Us',
      details: 'Sri Lanka 🇱🇰',
      description: 'Kandy District',
      color: 'from-orange-500 to-red-500',
      link: '#location'
    },
    {
      icon: Clock,
      title: 'Response Time',
      details: 'Within 24 hours',
      description: 'Quick and reliable',
      color: 'from-purple-500 to-pink-500',
      link: null
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success('Message sent successfully!', {
      description: 'We\'ll get back to you within 24 hours.',
      duration: 5000,
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center items-center gap-4 mb-6"
            >
              <MessageCircle className="w-12 h-12 text-blue-600" />
              <motion.h1
                className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Get In Touch
              </motion.h1>
              <Sparkles className="w-12 h-12 text-yellow-500" />
            </motion.div>
            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Have questions about 3W Tracker? We'd love to hear from you.
              <br />
              <span className="text-orange-600 font-semibold">Proudly serving from Sri Lanka 🇱🇰</span>
            </motion.p>
          </div>

          {/* Animated decorative elements */}
          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[Star, Heart, Sparkles].map((Icon, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <Icon className="w-8 h-8 text-purple-500" />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Contact Info Cards */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.a
                href={info.link || '#'}
                className="block"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <SpringCard className="p-8 text-center space-y-4 h-full hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <info.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">{info.title}</h3>
                    <p className={`font-semibold text-lg bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}>
                      {info.details}
                    </p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </div>
                </SpringCard>
              </motion.a>
            </motion.div>
          ))}
        </motion.section>

        {/* Contact Form & Map */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.section
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MessageSquare className="w-6 h-6" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.section>

          {/* Map/Location Section */}
          <motion.section
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="shadow-2xl border-2 border-orange-100" id="location">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-orange-600" />
                  Find Us in Sri Lanka 🇱🇰
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 rounded-xl overflow-hidden border-2 border-orange-200">
                  {/* Animated background pattern */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%']
                    }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(251,146,60,0.1) 1px, transparent 1px)',
                      backgroundSize: '50px 50px'
                    }}
                  />
                  
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center space-y-6 p-8">
                      <motion.div
                        animate={{
                          y: [0, -10, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="relative inline-block">
                          <motion.div
                            className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-50 blur-2xl"
                            animate={{
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                          <MapPin className="relative w-20 h-20 text-orange-600 mx-auto" />
                        </div>
                      </motion.div>
                      
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                          <Globe className="w-6 h-6 text-orange-600" />
                          Our Location
                        </h3>
                        <div className="space-y-2">
                          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                            🇱🇰 Sri Lanka
                          </p>
                          <p className="text-xl font-semibold text-orange-700">
                            Kandy District
                          </p>
                          <p className="text-sm text-muted-foreground italic">
                            The Pearl of the Indian Ocean
                          </p>
                        </div>
                      </div>

                      <motion.div
                        className="flex justify-center gap-3 mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {['🏔️', '🌴', '☕', '🏛️'].map((emoji, i) => (
                          <motion.span
                            key={i}
                            className="text-3xl"
                            animate={{
                              rotate: [0, 10, -10, 0]
                            }}
                            transition={{
                              duration: 2,
                              delay: i * 0.2,
                              repeat: Infinity
                            }}
                          >
                            {emoji}
                          </motion.span>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="shadow-2xl border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  Quick Answers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div 
                  className="space-y-2 p-4 bg-green-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-semibold flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    How quickly do you respond?
                  </h4>
                  <p className="text-sm text-gray-700 ml-7">
                    We typically respond within 24 hours. For urgent matters, please call directly.
                  </p>
                </motion.div>

                <motion.div 
                  className="space-y-2 p-4 bg-blue-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-semibold flex items-center gap-2 text-blue-800">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    Do you offer support?
                  </h4>
                  <p className="text-sm text-gray-700 ml-7">
                    Yes! We provide comprehensive support and consultation for all users.
                  </p>
                </motion.div>

                <motion.div 
                  className="space-y-2 p-4 bg-orange-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-semibold flex items-center gap-2 text-orange-800">
                    <Phone className="w-5 h-5 text-orange-600" />
                    Need to call?
                  </h4>
                  <p className="text-sm text-gray-700 ml-7">
                    Reach us at <a href="tel:+94776824351" className="font-semibold text-orange-700 hover:underline">+94 77 682 4351</a> for direct assistance.
                  </p>
                </motion.div>

                <motion.div 
                  className="space-y-2 p-4 bg-purple-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-semibold flex items-center gap-2 text-purple-800">
                    <Globe className="w-5 h-5 text-purple-600" />
                    International inquiries?
                  </h4>
                  <p className="text-sm text-gray-700 ml-7">
                    Based in Sri Lanka 🇱🇰, we serve clients globally with modern communication tools.
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.section>
        </div>

        {/* Developer Showcase */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <SpringCard className="relative overflow-hidden p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-blue-500/10 to-purple-500/10" />
            
            <div className="relative text-center space-y-6">
              <motion.div
                animate={{
                  rotate: [0, 360]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl"
              />

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                    Developed with Pride in Sri Lanka
                  </h2>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  A world-class project management solution crafted with expertise and dedication from the heart of Asia
                </p>
              </div>

              <motion.div
                className="flex items-center justify-center gap-4 py-6"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="text-center space-y-2">
                  <motion.div
                    className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <span className="text-4xl">🇱🇰</span>
                  </motion.div>
                  <p className="text-sm font-semibold text-gray-700">Sri Lanka</p>
                  <p className="text-xs text-muted-foreground">Kandy District</p>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6 pt-6">
                <motion.div
                  className="text-center space-y-2"
                  whileHover={{ y: -5 }}
                >
                  <Phone className="w-10 h-10 mx-auto text-green-600" />
                  <p className="font-semibold text-gray-900">Direct Contact</p>
                  <a href="tel:+94776824351" className="text-green-600 hover:underline font-medium">
                    +94 77 682 4351
                  </a>
                </motion.div>

                <motion.div
                  className="text-center space-y-2"
                  whileHover={{ y: -5 }}
                >
                  <Mail className="w-10 h-10 mx-auto text-blue-600" />
                  <p className="font-semibold text-gray-900">Email Address</p>
                  <a href="mailto:supunravidubandara@gmail.com" className="text-blue-600 hover:underline font-medium break-all">
                    supunravidubandara@gmail.com
                  </a>
                </motion.div>

                <motion.div
                  className="text-center space-y-2"
                  whileHover={{ y: -5 }}
                >
                  <MapPin className="w-10 h-10 mx-auto text-orange-600" />
                  <p className="font-semibold text-gray-900">Location</p>
                  <p className="text-orange-600 font-medium">
                    Kandy District, Sri Lanka 🇱🇰
                  </p>
                </motion.div>
              </div>
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
          <div className="relative text-center space-y-8 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 text-white shadow-2xl">
            <motion.div
              animate={{
                rotate: [0, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-60 h-60 bg-white/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                rotate: [360, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/20 rounded-full blur-3xl"
            />

            <div className="relative z-10 space-y-6">
              <div className="space-y-4">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold"
                  whileHover={{ scale: 1.05 }}
                >
                  Ready to Transform Your Projects?
                </motion.h2>
                <p className="text-xl opacity-95 max-w-2xl mx-auto">
                  Experience the power of the 3W Framework and elevate your team's productivity today
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
                  className="px-10 py-5 bg-white text-purple-600 hover:bg-gray-100 font-bold rounded-xl shadow-2xl text-lg transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Your Journey 🚀
                </motion.button>
                <motion.button
                  onClick={() => window.location.href = '/about'}
                  className="px-10 py-5 bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold rounded-xl text-lg transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More About Us
                </motion.button>
              </motion.div>

              <motion.p
                className="text-sm opacity-90 pt-6 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Heart className="w-4 h-4" />
                Built with excellence in Sri Lanka 🇱🇰
                <Heart className="w-4 h-4" />
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center py-8 space-y-3"
        >
          <p className="text-sm text-gray-600">
            © 2024 3W Action Tracker • Developed by Supun Rathnayaka
          </p>
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <Globe className="w-4 h-4" />
            Proudly serving clients worldwide from Sri Lanka 🇱🇰
          </p>
        </motion.div>
      </div>
    </div>
  );
}