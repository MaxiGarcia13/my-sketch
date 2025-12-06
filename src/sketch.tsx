import canvasSketch from 'canvas-sketch';
import { lerp } from 'canvas-sketch-util/math';
import random from 'canvas-sketch-util/random';
import { useEffect, useRef } from 'react';

const palettes = [
  ['#8ecae6', '#219ebc', '#023047', '#ffb703', '#fb8500'],
  ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
  ['#2d3142', '#bfc0c0', '#ffffff ', '#ef8354', '#4f5d75'],
  ['#5f0f40', '#9a031e', '#fb8b24 ', '#e36414', '#0f4c5c'],
  ['#641220', '#6e1423', '#85182a', '#a11d33', '#a71e34', '#b21e35', '#c71f37'],
  ['#606c38', '#283618', '#fefae0', '#dda15e', '#bc6c25'],
];

const letters = [
  '_.',
  '=-|',
  '.=',
  '=.',
];

const values = [
  0.3,
  0.04,
  0.07,
];

const many = [
  30,
  40,
  25,
];

export function Sketch() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const settings = {
      dimensions: 'A4',
      parent: container.current ?? window.document.body,
      orientation: random.pick(['landscape', 'portrait']),
    };

    const sketch = ({ width }) => {
      const count = random.pick(many);
      const margin = width * 0.15;
      const maxColors = random.rangeFloor(2, 6);
      const fontFamily = '"Fira Code"';
      const palette = random.shuffle(random.pick(palettes)).slice(0, maxColors);
      const background = random.pick(['#f4f4f4', '#1c1b22', '#fff']);
      const characters = random.pick(letters).split('');

      const createGrid = () => {
        const points = [];
        const frequency = random.range(0.75, 1.25);
        const dim = random.pick(values);
        for (let x = 0; x < count; x++) {
          for (let y = 0; y < count; y++) {
            let u = x / count;
            let v = y / count;

            const [dx, dy] = random.insideSphere(0.04);
            u += dx;
            v += dy;

            const n = random.noise2D(u * frequency, v * frequency);
            const size = n * 0.5 + dim;
            const baseSize = width * dim;
            const sizeOffset = width * dim;

            points.push({
              color: random.pick(palette),
              size: Math.abs(baseSize * size + random.gaussian() * sizeOffset),
              rotation: n * Math.PI * 0.4,
              character: random.pick(characters),
              position: [u, v],
            });
          }
        }
        return points;
      };

      const grid = createGrid();

      return ({ context, width, height }) => {
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);

        grid.forEach(({ position, rotation, size, color, character }) => {
          const [u, v] = position;
          const x = lerp(margin, width - margin, u);
          const y = lerp(margin, height - margin, v);

          context.fillStyle = color;
          context.strokeStyle = color;
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.font = `${size}px ${fontFamily}`;

          context.save();
          context.translate(x, y);
          context.rotate(rotation);
          context.globalAlpha = 0.85;
          context.fillText(character, 0, 0);
          context.restore();
        });
      };
    };

    canvasSketch(sketch, settings);
  }, []);

  return (
    <div ref={container} className="sketch"></div>
  );
};
