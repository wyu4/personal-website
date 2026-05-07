import { useIsInView } from "@/app/hooks/view";
import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { getVar } from "@/utils/style-helpers";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { forwardRef, useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  velX: number;
  velY: number;
  opacity: number;
  color: string;
  finalOpacity: number;
  enabled: boolean;
};

export const GlowBackground = forwardRef<
  HTMLDivElement,
  DivAttributes & {
    cssVariable: string;
    count?: number;
  }
>(({ className, cssVariable, count = 1, ...props }, forwardedRef) => {
  const container = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const lastStep = useRef(0);
  const glowsRef = useRef<Particle[] | null>(null);

  const [isInView, setIsInView] = useState(false);

  const [create, cleanup] = useIsInView((is) => setIsInView(is), container, 0.01);

  useEffect(() => {
    create();
    return cleanup;
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !isInView) return;
    const color = getVar(cssVariable);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;

      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let glows: Particle[] | null = glowsRef.current;
    if (!glows) {
      glows = [];
      for (let i = 0; i < count; i++) {
        glows.push({
          color: color,
          opacity: gsap.utils.random(0.75, 0.1),
          finalOpacity: 1,
          enabled: true,
          x: Math.random(),
          y: Math.random(),
          velX: gsap.utils.random(-0.1, 0.1),
          velY: gsap.utils.random(-0.1, 0.1),
        });
      }
      glowsRef.current = glows;
    }

    let frame: number | undefined = undefined;

    const step = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      glows: Particle[],
    ) => {
      if (lastStep.current !== 0) {
        const deltaStep = (Date.now() - lastStep.current) / 1000;
        const bounds = canvas.getBoundingClientRect();
        const w = bounds.width;
        const h = bounds.height;
        const minDimension = Math.min(w, h);
        const rad = minDimension * 0.75;
        ctx.clearRect(0, 0, w, h);

        for (const glow of glows) {
          glow.x += glow.velX * deltaStep;
          glow.y += glow.velY * deltaStep;
          const isOutOfBounds = glow.x > 1 || glow.x < 0 || glow.y > 1 || glow.y < 0;
          if (isOutOfBounds) {
            glow.opacity -= 0.5 * deltaStep;
          } else {
            glow.opacity += gsap.utils.random(-0.1, 0.1) * deltaStep;
          }

          if (glow.opacity <= 0 && glow.enabled) {
            glow.enabled = false;
            glow.x = Math.random();
            glow.y = Math.random();
            glow.velX = gsap.utils.random(-0.1, 0.1);
            glow.velY = gsap.utils.random(-0.1, 0.1);
            glow.finalOpacity = gsap.utils.random(0.75, 0.1);
          } else if (!glow.enabled) {
            glow.opacity += 0.5 * deltaStep;
            glow.enabled = glow.opacity >= glow.finalOpacity || isOutOfBounds;
          }

          glow.opacity = gsap.utils.clamp(0, 1, glow.opacity);

          const x = glow.x * w;
          const y = glow.y * h;

          const alpha = Math.round(glow.opacity * 255)
            .toString(16)
            .padStart(2, "0");
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, rad);
          gradient.addColorStop(0, `${glow.color}${alpha}`);
          gradient.addColorStop(1, `${glow.color}00`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, rad, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      lastStep.current = Date.now();
      frame = requestAnimationFrame(() => step(ctx, canvas, glows));
    };
    frame = requestAnimationFrame(() => step(ctx, canvas, glows));

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [cssVariable, isInView]);

  return (
    <div
      ref={(node) => bindRefAndForwardRef(node, forwardedRef, container)}
      className={`grid place-items-center overflow-clip ${className}`}
      {...props}
    >
      <canvas className="w-full h-full" ref={canvasRef}></canvas>
    </div>
  );
});
