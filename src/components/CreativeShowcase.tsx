'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Palette, 
  Music, 
  Zap, 
  Wand2,
  Flame,
  Star,
  Heart,
  Code
} from 'lucide-react';
import { toast } from 'sonner';
import { HighlightedText, AnimatedMetric } from './RoughAnnotations';
import { SpringCard, BouncyButton, AnimatedCounter, SpringProgressBar } from './SpringAnimations';
import { ScrollReveal, GSAPCountUp, MorphingText } from './GSAPAnimations';
import { FloatingBalls } from './PhysicsInteractions';
import { ColorPicker, PalettePicker } from './ColorCustomizer';
import { SoundButton } from './SoundEffects';

export function CreativeShowcase() {
  const [activeTab, setActiveTab] = useState('animations');
  const [progress, setProgress] = useState(75);
  const [selectedColor, setSelectedColor] = useState('#3b82f6');

  const presetColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Framer Motion',
      description: 'Smooth, declarative animations',
      demo: 'Drag & gesture support'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'GSAP',
      description: 'Professional-grade animations',
      demo: 'Scroll-triggered effects'
    },
    {
      icon: <Flame className="w-5 h-5" />,
      title: 'React Spring',
      description: 'Physics-based animations',
      demo: 'Natural motion'
    },
    {
      icon: <Wand2 className="w-5 h-5" />,
      title: 'Rough Notation',
      description: 'Hand-drawn annotations',
      demo: 'Sketchy highlights'
    },
    {
      icon: <Music className="w-5 h-5" />,
      title: 'Tone.js',
      description: 'Interactive sound design',
      demo: 'UI sound effects'
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: 'React Colorful',
      description: 'Beautiful color pickers',
      demo: 'Theme customization'
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: 'Matter.js',
      description: 'Physics engine',
      demo: 'Interactive physics'
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: 'Sonner',
      description: 'Beautiful notifications',
      demo: 'Animated toasts'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <ScrollReveal>
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Creative Features Showcase
            </Badge>
          </motion.div>
          
          <h2 className="text-4xl font-bold">
            <MorphingText
              texts={[
                '🎨 Visual Brilliance',
                '✨ Interactive Magic',
                '🚀 Modern Animations',
                '💎 Creative Excellence'
              ]}
              interval={2500}
            />
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of{' '}
            <HighlightedText type="circle" color="#3b82f6" delay={500}>
              8+ creative libraries
            </HighlightedText>
            {' '}working together seamlessly
          </p>
        </div>
      </ScrollReveal>

      {/* Feature Grid */}
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={`feature-${feature.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SpringCard className="p-4 bg-card border rounded-lg text-center space-y-2 hover:shadow-lg">
                <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
                <Badge variant="outline" className="text-xs">
                  {feature.demo}
                </Badge>
              </SpringCard>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* Interactive Demos */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Demonstrations</CardTitle>
          <CardDescription>Try out different creative features</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="animations">Animations</TabsTrigger>
              <TabsTrigger value="physics">Physics</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="sounds">Sounds</TabsTrigger>
            </TabsList>

            <TabsContent value="animations" className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Animated Counter</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-center">
                          <AnimatedCounter value={1234} duration={2000} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">GSAP Counter</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-center">
                          <GSAPCountUp end={9876} duration={2} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Annotated Metric</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <AnimatedMetric 
                          value="95%" 
                          label="Success" 
                          type="circle" 
                          color="#10b981" 
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Spring Progress Bar</label>
                    <SpringProgressBar progress={progress} className="mb-2" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                        +10%
                      </Button>
                      <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                        -10%
                      </Button>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <p className="text-lg">
                      This is{' '}
                      <HighlightedText type="highlight" color="#f59e0b">
                        hand-drawn highlighted text
                      </HighlightedText>
                      {' '}and{' '}
                      <HighlightedText type="box" color="#ef4444">
                        boxed annotations
                      </HighlightedText>
                    </p>
                    <p className="text-lg">
                      Also try{' '}
                      <HighlightedText type="underline" color="#8b5cf6">
                        underline
                      </HighlightedText>
                      {' '}and{' '}
                      <HighlightedText type="circle" color="#06b6d4">
                        circle
                      </HighlightedText>
                      {' '}styles!
                    </p>
                  </div>
              </TabsContent>

              <TabsContent value="physics" className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Drag the balls around! They respond with realistic physics.
                </p>
                <FloatingBalls />
              </TabsContent>

              <TabsContent value="colors" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Color Picker</label>
                    <ColorPicker color={selectedColor} onChange={setSelectedColor} />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Preset Palette</label>
                    <PalettePicker
                      colors={presetColors}
                      selectedColor={selectedColor}
                      onChange={setSelectedColor}
                    />
                  </div>

                  <div 
                    className="h-32 rounded-lg transition-colors duration-300"
                    style={{ backgroundColor: selectedColor }}
                  />
              </TabsContent>

              <TabsContent value="sounds" className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Click the buttons to hear different UI sound effects:
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <SoundButton
                      soundType="click"
                      onClick={() => toast.info('Click sound!')}
                      className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Click Sound
                    </SoundButton>
                    <SoundButton
                      soundType="success"
                      onClick={() => toast.success('Success sound!')}
                      className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Success Sound
                    </SoundButton>
                    <SoundButton
                      soundType="pop"
                      onClick={() => toast('Pop sound!')}
                      className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                    >
                      Pop Sound
                    </SoundButton>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Note:</strong> Sound effects use Tone.js for interactive audio.
                      Click the speaker icon in the bottom right to enable/disable sounds.
                    </p>
                  </div>
              </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <ScrollReveal>
        <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-primary/20">
          <CardContent className="pt-6 text-center space-y-4">
            <Star className="w-12 h-12 mx-auto text-yellow-500" />
            <h3 className="text-2xl font-bold">Ready to Create Something Amazing?</h3>
            <p className="text-muted-foreground">
              These creative enhancements make your dashboard truly stand out!
            </p>
            <BouncyButton
              onClick={() => {
                toast.success('🎉 Let\'s build something incredible!', {
                  description: 'All features are ready to use'
                });
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"
            >
              Start Building Now! ✨
            </BouncyButton>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
}
