"use client";

import { useEffect, useRef } from 'react';

interface TubesApp {
  tubes: {
    setColors: (colors: string[]) => void;
    setLightsColors: (colors: string[]) => void;
  };
  destroy?: () => void;
}

interface WindowWithTubes extends Window {
  initTubesApp?: (canvas: HTMLCanvasElement) => TubesApp;
}

export default function TubesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let app: TubesApp | undefined;
    const win = window as unknown as WindowWithTubes;
    
    const initTubes = () => {
      if (win.initTubesApp && canvasRef.current) {
        app = win.initTubesApp(canvasRef.current);
      }
    };

    // We inject a native module script to bypass Next.js/Webpack compilation of HTTP imports
    if (!win.initTubesApp) {
      const script = document.createElement('script');
      script.type = 'module';
      script.innerHTML = `
        import TubesCursor from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";
        window.initTubesApp = function(canvas) {
          return TubesCursor(canvas, {
            tubes: {
              colors: ["#f967fb", "#53bc28", "#6958d5"],
              lights: {
                intensity: 200,
                colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
              }
            }
          });
        };
        window.dispatchEvent(new Event('tubesLoaded'));
      `;
      document.body.appendChild(script);
      
      window.addEventListener('tubesLoaded', initTubes, { once: true });
    } else {
      initTubes();
    }

    const handleClick = () => {
      if (!app || !app.tubes) return;
      const colors = randomColors(3);
      const lightsColors = randomColors(4);
      app.tubes.setColors(colors);
      app.tubes.setLightsColors(lightsColors);
    };
    
    function randomColors(count: number) {
      return new Array(count)
        .fill(0)
        .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
    }

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
      if (app && typeof app.destroy === 'function') {
        app.destroy();
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
