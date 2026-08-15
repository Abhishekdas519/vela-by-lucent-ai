import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  isAgentSpeaking?: boolean;
  barCount?: number;
  height?: number;
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isActive,
  isAgentSpeaking = false,
  barCount = 24,
  height = 48,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const barWidth = width / barCount - 3;
      const centerY = canvas.height / 2;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;
        if (isActive) {
          const frequency = isAgentSpeaking ? 0.35 : 0.2;
          const amplitude = isAgentSpeaking ? (height / 2) * 0.9 : (height / 2) * 0.45;
          const wave = Math.sin(i * frequency + phase) * Math.cos(i * 0.15 + phase * 0.5);
          barHeight = Math.max(4, Math.abs(wave) * amplitude + (Math.random() * (isAgentSpeaking ? 8 : 4)));
        }

        const x = i * (barWidth + 3);
        const y = centerY - barHeight / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isAgentSpeaking) {
          gradient.addColorStop(0, '#38bdf8'); // Cyan
          gradient.addColorStop(0.5, '#818cf8'); // Indigo
          gradient.addColorStop(1, '#c084fc'); // Purple
        } else if (isActive) {
          gradient.addColorStop(0, '#34d399'); // Emerald
          gradient.addColorStop(1, '#059669');
        } else {
          gradient.addColorStop(0, '#475569');
          gradient.addColorStop(1, '#334155');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      phase += isActive ? (isAgentSpeaking ? 0.15 : 0.08) : 0.02;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, isAgentSpeaking, barCount, height]);

  return (
    <canvas
      ref={canvasRef}
      width={barCount * 12}
      height={height}
      className={`w-full max-w-xs h-[${height}px] ${className}`}
    />
  );
};
