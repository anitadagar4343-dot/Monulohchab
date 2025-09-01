
import React from 'react';

interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  description: string;
}

const ParameterSlider: React.FC<ParameterSliderProps> = ({ label, value, min, max, step, onChange, description }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-studio-text">{label}</label>
        <span className="text-sm text-studio-text-secondary">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-studio-surface rounded-lg appearance-none cursor-pointer accent-studio-accent"
      />
      <p className="text-xs text-studio-text-secondary mt-1">{description}</p>
    </div>
  );
};

export default ParameterSlider;
