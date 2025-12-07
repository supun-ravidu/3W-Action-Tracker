# 🎨 Quick Reference Guide - Creative Components

## Import Paths

```tsx
// Background
import { AnimatedBusinessBackground } from '@/components/AnimatedBusinessBackground';

// Physics
import { FloatingBalls, PhysicsCard } from '@/components/PhysicsInteractions';

// Annotations
import { HighlightedText, AnimatedMetric } from '@/components/RoughAnnotations';

// Spring Animations
import { 
  SpringCard, 
  BouncyButton, 
  AnimatedCounter, 
  SpringProgressBar, 
  FloatingElement 
} from '@/components/SpringAnimations';

// GSAP Animations
import { 
  ScrollReveal, 
  ParallaxSection, 
  GSAPCountUp, 
  MorphingText, 
  StaggeredCards, 
  PinSection 
} from '@/components/GSAPAnimations';

// Sound Effects
import { 
  SoundButton, 
  SoundToggle, 
  AmbientMusicPlayer, 
  useSoundEffects 
} from '@/components/SoundEffects';

// Colors
import { 
  ColorPicker, 
  PalettePicker, 
  ThemeCustomizer 
} from '@/components/ColorCustomizer';

// Showcase
import { CreativeShowcase } from '@/components/CreativeShowcase';
```

---

## Quick Examples

### 1. Animated Background
```tsx
<AnimatedBusinessBackground />
```

### 2. Scroll Reveal
```tsx
<ScrollReveal direction="up">
  <div>Content appears on scroll</div>
</ScrollReveal>
```

### 3. Spring Card with Tilt Effect
```tsx
<SpringCard className="p-6 bg-card">
  <h2>Interactive Card</h2>
  <p>Hover to see tilt effect</p>
</SpringCard>
```

### 4. Highlighted Text
```tsx
<HighlightedText type="highlight" color="#3b82f6">
  Important Text
</HighlightedText>
```

### 5. Animated Counter
```tsx
<AnimatedCounter value={1234} duration={2000} />
```

### 6. Sound Button
```tsx
<SoundButton 
  soundType="success"
  onClick={() => console.log('Clicked!')}
>
  Click Me
</SoundButton>
```

### 7. Morphing Text
```tsx
<MorphingText
  texts={['Text 1', 'Text 2', 'Text 3']}
  interval={3000}
/>
```

### 8. Progress Bar
```tsx
<SpringProgressBar progress={75} />
```

### 9. Staggered Cards
```tsx
<StaggeredCards stagger={0.1}>
  {items.map(item => <Card key={item.id}>{item.content}</Card>)}
</StaggeredCards>
```

### 10. Physics Card (Draggable)
```tsx
<PhysicsCard onInteract={() => console.log('Interacted!')}>
  <div>Drag me around!</div>
</PhysicsCard>
```

---

## Component Props Reference

### ScrollReveal
```tsx
{
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right'; // default: 'up'
  delay?: number; // default: 0
}
```

### HighlightedText
```tsx
{
  children: ReactNode;
  type?: 'underline' | 'box' | 'circle' | 'highlight' | 'strike-through' | 'crossed-off' | 'bracket';
  color?: string; // default: '#3b82f6'
  animate?: boolean; // default: true
  delay?: number; // default: 0
}
```

### AnimatedMetric
```tsx
{
  value: string | number;
  label: string;
  type?: 'underline' | 'box' | 'circle' | 'highlight'; // default: 'circle'
  color?: string; // default: '#10b981'
}
```

### SpringCard
```tsx
{
  children: ReactNode;
  className?: string;
}
```

### AnimatedCounter
```tsx
{
  value: number;
  duration?: number; // default: 1000 (ms)
}
```

### SpringProgressBar
```tsx
{
  progress: number; // 0-100
  className?: string;
}
```

### MorphingText
```tsx
{
  texts: string[];
  className?: string;
  interval?: number; // default: 3000 (ms)
}
```

### SoundButton
```tsx
{
  children: ReactNode;
  onClick?: () => void;
  soundType?: 'click' | 'success' | 'pop'; // default: 'click'
  className?: string;
}
```

### ColorPicker
```tsx
{
  color: string; // HEX format
  onChange: (color: string) => void;
  label?: string;
}
```

---

## Animation Types

### Rough Notation Types
- `underline` - Simple underline
- `box` - Rectangle around text
- `circle` - Circle around text
- `highlight` - Background highlight
- `strike-through` - Line through text
- `crossed-off` - X over text
- `bracket` - Brackets around text

### Scroll Reveal Directions
- `up` - Fade in from bottom
- `down` - Fade in from top
- `left` - Fade in from right
- `right` - Fade in from left

### Sound Types
- `click` - Quick beep
- `success` - Ascending chime
- `error` - Descending tone
- `hover` - Subtle high note
- `pop` - Drum pop
- `chime` - Metallic bell

---

## Color Presets

```tsx
const presetPalettes = {
  'Ocean Blue': ['#0ea5e9', '#06b6d4', '#8b5cf6', '#3b82f6', '#0284c7'],
  'Sunset': ['#f97316', '#fb923c', '#fbbf24', '#ef4444', '#ec4899'],
  'Forest': ['#10b981', '#059669', '#22c55e', '#84cc16', '#65a30d'],
  'Purple Dream': ['#8b5cf6', '#a855f7', '#c084fc', '#d946ef', '#e879f9'],
  'Monochrome': ['#1f2937', '#374151', '#6b7280', '#9ca3af', '#d1d5db'],
}
```

---

## Performance Tips

1. **Lazy Load Heavy Components**
```tsx
const FloatingBalls = dynamic(() => import('@/components/PhysicsInteractions').then(m => m.FloatingBalls), {
  ssr: false
});
```

2. **Conditional Rendering**
```tsx
{showPhysics && <FloatingBalls />}
```

3. **Use Will-Change Sparingly**
```tsx
className="will-change-transform"
```

4. **Optimize Scroll Listeners**
```tsx
// GSAP ScrollTrigger handles this automatically
```

---

## Accessibility

All components respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Troubleshooting

### Sound Not Playing
- First interaction with page is required (browser security)
- Click the speaker icon (🔊) to enable
- Check browser console for errors

### Physics Laggy
- Toggle off when not needed
- Reduce number of balls in FloatingBalls component
- Check GPU acceleration

### Animations Choppy
- Ensure using CSS transforms (not left/top)
- Check for layout thrashing
- Use `will-change` carefully

### Colors Not Applying
- Click "Apply Theme" button after selecting
- Check CSS variable support
- Clear browser cache

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS 14+, Android 5+)

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

---

## Useful Hooks

### useSoundEffects
```tsx
const { enabled, enable, playSound } = useSoundEffects();

// Enable sounds
await enable();

// Play a sound
playSound('success');
```

---

## File Structure

```
src/components/
├── AnimatedBusinessBackground.tsx  # Particle system
├── PhysicsInteractions.tsx         # Matter.js physics
├── RoughAnnotations.tsx            # Hand-drawn styles
├── SpringAnimations.tsx            # React Spring
├── GSAPAnimations.tsx              # GSAP effects
├── SoundEffects.tsx                # Tone.js audio
├── ColorCustomizer.tsx             # Color picker
└── CreativeShowcase.tsx            # Demo component
```

---

## License & Credits

All libraries are open source and can be used in commercial projects:
- Framer Motion: MIT
- GSAP: Business-friendly (free for most uses)
- React Spring: MIT
- Rough Notation: MIT
- Matter.js: MIT
- Tone.js: MIT
- React Colorful: MIT
- Sonner: MIT

Happy Creating! 🎨✨
