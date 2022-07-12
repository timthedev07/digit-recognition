import React, { useEffect, useRef, useState } from "react";
import { Button, Select } from "dragontail-experimental";

const WIDTH = 280;
const HEIGHT = 280;
const DENSITY_SCALE = 1;

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing: React.MouseEventHandler<HTMLCanvasElement> = ({
    nativeEvent,
  }) => {
    const ctx = ctxRef.current;

    if (!ctx) return;
    setIsDrawing(true);

    const { offsetX: x, offsetY: y } = nativeEvent;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const endDrawing = () => {
    const ctx = ctxRef.current;

    if (!ctx) return;

    ctx.closePath();
    setIsDrawing(false);
  };
  const clearCanvas = () => {
    const ctx = ctxRef.current;
    ctx?.clearRect(0, 0, WIDTH, HEIGHT);
  };
  const draw: React.MouseEventHandler<HTMLCanvasElement> = ({
    nativeEvent,
  }) => {
    const ctx = ctxRef.current;

    if (!ctx) return;

    if (!isDrawing) return;

    const { offsetX: x, offsetY: y } = nativeEvent;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  type TEH = React.TouchEventHandler<HTMLCanvasElement>;

  const touchEnd: TEH = () => {
    endDrawing();
  };
  const touchMove: TEH = (e) => {
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();

    if (!rect) return;

    const offsetX = touch.pageX - rect.left;
    const offsetY = touch.pageY - rect.top;
    draw({
      nativeEvent: {
        offsetX,
        offsetY,
      },
    } as any);
  };
  const touchStart: TEH = (e) => {
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();

    if (!rect) return;

    const offsetX = touch.pageX - rect.left;
    const offsetY = touch.pageY - rect.top;
    startDrawing({
      nativeEvent: {
        offsetX,
        offsetY,
      },
    } as any);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.scale(DENSITY_SCALE, DENSITY_SCALE);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 5;

    ctxRef.current = ctx;
  }, []);

  return (
    <div className="flex flex-col gap-6 select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        onTouchEnd={touchEnd}
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        className={`rounded-md shadow-lg border-2 border-slate-400/60 bg-slate-700 relative`}
        style={{
          width: WIDTH,
          height: HEIGHT,
        }}
        height={HEIGHT * DENSITY_SCALE}
        width={WIDTH * DENSITY_SCALE}
      />
      <div className="flex justify-center gap-4">
        <Button>Detect Digit</Button>
        <Button onClick={clearCanvas} color="orange">
          Clear Board
        </Button>
      </div>
    </div>
  );
};
