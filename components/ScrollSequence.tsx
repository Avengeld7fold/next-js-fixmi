"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 192;
const FOLDER_PATH = "/sequence";

const formatFrame = (index: number) => {
  return `${FOLDER_PATH}/frame_${index.toString().padStart(6, "0")}.jpg`;
};

export default function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const frameCounterRef = useRef<HTMLSpanElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [activeTitle, setActiveTitle] = useState<string>(
    "DIAGNOSIS PRESISI."
  );
  const [activeDetail, setActiveDetail] = useState<string>(
    "Mendeteksi secara mikro setiap titik kerusakan pada struktur sirkuit internal perangkat Anda melalui pemindaian telemetri digital menyeluruh."
  );
  const [activeStep, setActiveStep] = useState<string>("01 / 05");

  // Cover calculation for drawing images on Canvas without stretching
  const drawImage = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    } else {
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Adjust canvas size based on DPR to prevent blurriness
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    drawImage(currentFrameRef.current);
  };

  // Preloading image frames into buffer
  useEffect(() => {
    let loadedCount = 0;

    // Load first frame immediately for instant paint
    const firstImg = new Image();
    firstImg.src = formatFrame(0);
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      // If canvas is already sized, draw immediately
      drawImage(0);
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (i === 0) {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        continue;
      }

      const img = new Image();
      img.src = formatFrame(i);
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoading(false);
        }
      };
      imagesRef.current[i] = img;
    }

    // Cleanup images on unmount
    return () => {
      imagesRef.current = [];
    };
  }, []);

  // Debounced resize handler to prevent layout thrashing
  useEffect(() => {
    if (isLoading) return;

    let timeoutId: NodeJS.Timeout;
    
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleResize();
      }, 100); // 100ms debounce
    };

    // Initialize sizes once loaded
    handleResize();
    ScrollTrigger.refresh();

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [isLoading]);

  // Update caption text efficiently based on active frame
  const updateCaption = (idx: number) => {
    let title = "";
    let detail = "";
    let step = "";

    if (idx < 35) {
      title = "DIAGNOSIS PRESISI.";
      detail = "Mendeteksi secara mikro setiap titik kerusakan pada struktur sirkuit internal perangkat Anda melalui pemindaian telemetri digital menyeluruh.";
      step = "01 / 05";
    } else if (idx < 75) {
      title = "DEKONSOLIDASI AMAN.";
      detail = "Pelepasan panel display OLED menggunakan suhu panas yang terkalibrasi khusus guna melindungi sirkuit display dan lapisan sensitif di bawahnya.";
      step = "02 / 05";
    } else if (idx < 120) {
      title = "UJI MOTHERBOARD.";
      detail = "Melakukan pengujian isolasi arus dan kalibrasi daya pada jalur sirkuit utama untuk memastikan stabilitas kelistrikan tanpa risiko korsleting.";
      step = "03 / 05";
    } else if (idx < 160) {
      title = "REPARASI MIKRO.";
      detail = "Proses micro-soldering presisi tinggi pada konektor sirkuit dan port daya menggunakan mikroskop optik modern oleh teknisi tersertifikasi.";
      step = "04 / 05";
    } else {
      title = "KALIBRASI TOTAL.";
      detail = "Pemasangan kembali komponen dengan sealant tahan air standar pabrikan, diikuti uji kelayakan fungsi diagnostik menyeluruh.";
      step = "05 / 05";
    }

    setActiveTitle((prev) => (prev !== title ? title : prev));
    setActiveDetail((prev) => (prev !== detail ? detail : prev));
    setActiveStep((prev) => (prev !== step ? step : prev));
  };

  useGSAP(
    () => {
      if (isLoading) return;

      // Animation target
      const frameObj = { index: 0 };

      // Pin scroll container and scrub through frame indices
      const scrollTriggerInstance = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", // Duration is 300% of viewport height
        scrub: 0.5, // Smooth transition inertia
        pin: true,
        onUpdate: (self) => {
          // Calculate the target frame index linearly based on progress
          const index = Math.min(
            TOTAL_FRAMES - 1,
            Math.floor(self.progress * TOTAL_FRAMES)
          );

          if (index !== currentFrameRef.current) {
            currentFrameRef.current = index;
            drawImage(index);
            updateCaption(index);
            if (frameCounterRef.current) {
              frameCounterRef.current.textContent = index.toString().padStart(3, "0");
            }
          }
        },
      });

      return () => {
        scrollTriggerInstance.kill();
      };
    },
    { dependencies: [isLoading], scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-background">
      {isLoading ? (
        // Technical Diagnostics Buffering Loader
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono select-none pointer-events-none bg-background z-20">
          <div className="mb-2 text-xs uppercase tracking-widest text-primary animate-pulse">
            BUFFERING HARDWARE MEMORY
          </div>
          <div className="w-64 h-1 bg-surface-alt border border-border rounded overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-150 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] text-text-muted uppercase">
            Frame Buffer: {loadProgress}% / {TOTAL_FRAMES} Frames Loaded
          </div>
        </div>
      ) : (
        // Fullscreen Interactive Scroll Teardown Display
        <div className="relative w-full h-screen overflow-hidden">
          {/* Main Fullscreen Canvas - promoted to GPU with will-change */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover block"
            style={{ willChange: "transform" }}
          />

          {/* HUD Overlay Interface */}
          <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between pointer-events-none z-10">
            {/* Top HUD Row */}
            <div className="flex items-start justify-between w-full font-mono text-xs text-text-secondary select-none">
              <div className="flex items-center gap-2 border border-border bg-background/80 px-3 py-1.5 rounded-md backdrop-blur-sm">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                <span>DIAGNOSTIC TELEMETRY</span>
              </div>
              <div className="border border-border bg-background/80 px-3 py-1.5 rounded-md backdrop-blur-sm">
                FRAME:{" "}
                <span ref={frameCounterRef} className="text-foreground">
                  000
                </span>{" "}
                / {TOTAL_FRAMES}
              </div>
            </div>

            {/* Bottom HUD Row */}
            <div className="flex items-end justify-end w-full">
              {/* Progress counter step index */}
              <div className="border border-border bg-background/80 px-4 py-3 rounded-md backdrop-blur-sm text-right select-none font-mono">
                <div className="text-[10px] text-text-muted mb-0.5 uppercase tracking-widest">
                  TAHAPAN
                </div>
                <span className="text-lg font-bold text-primary">{activeStep}</span>
              </div>
            </div>
          </div>

          {/* Left-Centered Huge Caption */}
          <div className="absolute left-6 md:left-16 lg:left-24 top-1/2 -translate-y-1/2 w-[90%] max-w-[500px] md:max-w-[700px] lg:max-w-[850px] pointer-events-none z-10 text-left select-none">
            <div className="font-mono text-[10px] md:text-xs text-primary mb-3 uppercase tracking-widest">
              INSTRUMEN BENCH PROSES
            </div>
            <h2
              style={{
                fontFamily: "var(--font-bayon), sans-serif",
                fontSize: "clamp(36px, 5.5vw, 100px)",
                lineHeight: 0.9,
                letterSpacing: "0.03em",
                color: "var(--fixmi-primary)",
                textTransform: "uppercase" as const,
                margin: 0,
              }}
            >
              {activeTitle}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-neue-montreal), sans-serif",
                fontSize: "clamp(14px, 1.1vw, 18px)",
                fontWeight: 400,
                lineHeight: 1.6,
                color: "var(--fixmi-text-secondary)",
                margin: "24px 0 0 0",
                maxWidth: "600px",
              }}
            >
              {activeDetail}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
