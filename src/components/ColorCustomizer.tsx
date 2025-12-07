'use client';

import { HexColorPicker, HexColorInput } from 'react-colorful';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="w-full h-10 rounded-md border-2 border-border hover:border-primary transition-colors"
            style={{ backgroundColor: color }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <HexColorPicker color={color} onChange={onChange} />
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">#</span>
            <HexColorInput
              color={color}
              onChange={onChange}
              className="flex-1 px-2 py-1 text-sm border rounded"
              prefixed={false}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface PalettePickerProps {
  colors: string[];
  selectedColor: string;
  onChange: (color: string) => void;
}

export function PalettePicker({ colors, selectedColor, onChange }: PalettePickerProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
            selectedColor === color
              ? 'border-primary ring-2 ring-primary/50'
              : 'border-border'
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

export function ThemeCustomizer() {
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [accentColor, setAccentColor] = useState('#8b5cf6');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const presetPalettes = {
    'Ocean Blue': ['#0ea5e9', '#06b6d4', '#8b5cf6', '#3b82f6', '#0284c7'],
    'Sunset': ['#f97316', '#fb923c', '#fbbf24', '#ef4444', '#ec4899'],
    'Forest': ['#10b981', '#059669', '#22c55e', '#84cc16', '#65a30d'],
    'Purple Dream': ['#8b5cf6', '#a855f7', '#c084fc', '#d946ef', '#e879f9'],
    'Monochrome': ['#1f2937', '#374151', '#6b7280', '#9ca3af', '#d1d5db'],
  };

  const [selectedPalette, setSelectedPalette] = useState<keyof typeof presetPalettes>('Ocean Blue');

  const applyTheme = () => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--accent', accentColor);
    document.documentElement.style.setProperty('--background', backgroundColor);
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Theme Customizer</h3>
        <p className="text-sm text-muted-foreground">
          Customize your dashboard colors
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <ColorPicker
          label="Primary Color"
          color={primaryColor}
          onChange={setPrimaryColor}
        />
        <ColorPicker
          label="Accent Color"
          color={accentColor}
          onChange={setAccentColor}
        />
        <ColorPicker
          label="Background"
          color={backgroundColor}
          onChange={setBackgroundColor}
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Preset Palettes</label>
        {Object.entries(presetPalettes).map(([name, colors]) => (
          <div key={name} className="space-y-2">
            <span className="text-sm text-muted-foreground">{name}</span>
            <PalettePicker
              colors={colors}
              selectedColor={primaryColor}
              onChange={(color) => {
                setPrimaryColor(color);
                setSelectedPalette(name as keyof typeof presetPalettes);
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={applyTheme}
        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Apply Theme
      </button>
    </div>
  );
}
