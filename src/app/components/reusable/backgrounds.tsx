import { useRootClass } from "@/app/hooks/misc";
import { useIsInView } from "@/app/hooks/view";
import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { getVar } from "@/utils/style-helpers";
import gsap from "gsap";
import { DrawSVGPlugin, MotionPathHelper } from "gsap/all";
import { forwardRef, useEffect, useRef, useState } from "react";

gsap.registerPlugin(DrawSVGPlugin, MotionPathHelper);

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
>(({ className, cssVariable, hidden, count = 1, ...props }, forwardedRef) => {
  const container = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const lastStep = useRef(0);
  const glowsRef = useRef<Particle[] | null>(null);

  const [isInView, setIsInView] = useState(false);

  const [create, cleanup] = useIsInView((is) => setIsInView(is), container);
  const rootClasses = useRootClass();

  useEffect(() => {
    create();
    return cleanup;
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !isInView || hidden) return;
    let color: string | undefined = undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let w = 1;
    let h = 1;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;

      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      w = canvas.width;
      h = canvas.height;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let glows: Particle[] | null = glowsRef.current;
    if (!glows) {
      glows = [];
      for (let i = 0; i < count; i++) {
        glows.push({
          color: "",
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
      if (!color) {
        color = getVar(cssVariable);
      }
      if (lastStep.current !== 0) {
        const deltaStep = (Date.now() - lastStep.current) / 1000;

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
          gradient.addColorStop(0, `${color}${alpha}`);
          gradient.addColorStop(1, `${color}00`);

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
  }, [cssVariable, isInView, hidden, rootClasses]);

  return (
    <div
      hidden={hidden}
      ref={(node) => bindRefAndForwardRef(node, forwardedRef, container)}
      className={`grid place-items-center overflow-clip ${className}`}
      {...props}
    >
      <canvas className="w-full h-full" ref={canvasRef}></canvas>
    </div>
  );
});

type BeamBackgroundProps = DivAttributes & {
  pathColor: string;
  pathAmount: number;
};

export const BeamBackground = forwardRef<HTMLDivElement, BeamBackgroundProps>(
  ({ pathColor, pathAmount, className, ...props }, forwardedRef) => {
    const container = useRef<HTMLDivElement>(null);

    const [size, setSize] = useState({ width: 0, height: 0 });
    const [beamPaths, setBeamPaths] = useState<string[]>([]);
    const pathGroupRef = useRef<SVGGElement>(null);

    useEffect(() => {
      if (!container.current) return;
      const observer = new ResizeObserver(([entry]) =>
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        }),
      );
      observer.observe(container.current);
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      if (size.width === 0 || size.height === 0) return;
      const w = size.width;
      const h = size.height;
      const paths: string[] = [];
      const generate = (hOffset: number) => {
        return `M 0 ${hOffset - h / 2 - h * 0.25} C ${w * 0.25} ${h * 0.75 + hOffset - h / 2}, ${w * 0.75} ${h * 0.5 + hOffset - h / 2}, ${w} ${h * 1.25 + hOffset - h / 2}`;
      };
      for (let i = 0; i < pathAmount; i++) {
        paths.push(generate((h / (pathAmount * 0.75)) * i));
      }
      setBeamPaths(paths);
    }, [size, pathAmount]);

    useEffect(() => {
      if (!pathGroupRef.current || beamPaths.length === 0) return;

      const tracePaths = Array.from(pathGroupRef.current.querySelectorAll("path"));
      const animations: gsap.core.Timeline[] = [];

      gsap.set(tracePaths, { drawSVG: "0% 0%" });

      const animatePath = (index: number, path: Element, firstTime: boolean = false) => {
        if (!animations[index]) {
          animations[index] = gsap.timeline();
        }
        const tl = animations[index];

        const duration = gsap.utils.random(3, 4);
        const downTime = gsap.utils.random(0, 1);
        const easeIn = gsap.utils.random(1, 4, 1);
        const easeOut = gsap.utils.random(1, 4, 1);

        gsap.set(path, { drawSVG: "0% 0%" });

        tl.delay(firstTime ? gsap.utils.random(0, 4) : 0)
          .to(path, {
            drawSVG: "0% 100%",
            duration,
            ease: `power${easeIn}.in`,
          })
          .to(path, { drawSVG: "100% 100%", duration, ease: `power${easeOut}.out` })
          .call(() => animatePath(index, path), [], `+=${downTime}`);
      };

      tracePaths.forEach((path, i) => animatePath(i, path, true));

      return () => animations.forEach((t) => t?.kill());
    }, [beamPaths]);

    return (
      <div
        ref={(node) => bindRefAndForwardRef(node, forwardedRef, container)}
        className={`grid place-items-center overflow-clip ${className}`}
        {...props}
      >
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${size.width} ${size.height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g ref={pathGroupRef}>
            {beamPaths.map((path, i) => (
              <path
                key={`background-path-${i}`}
                d={path}
                fill="none"
                stroke={pathColor}
                strokeWidth={1}
              />
            ))}
          </g>
          <g>
            {beamPaths.map((path, i) => (
              <path
                opacity={0.25}
                key={`background-track-${i}`}
                d={path}
                fill="none"
                stroke={pathColor}
                strokeWidth={1}
              />
            ))}
          </g>
        </svg>
      </div>
    );
  },
);

type LaserBackgroundProps = DivAttributes & {
  color?: string;
};
export const LaserBackground = forwardRef<HTMLDivElement, LaserBackgroundProps>(
  ({ className, color = "var(--gray-100)" }, forwardedRef) => {
    const container = useRef<HTMLDivElement>(null);
    return (
      <div
        ref={(node) => bindRefAndForwardRef(node, forwardedRef, container)}
        className={` ${className}`}
      ></div>
    );
  },
);
