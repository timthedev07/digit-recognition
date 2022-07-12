import React, { useEffect, useRef, useState } from "react";
import { Button } from "dragontail-experimental";
import { imgDataTo3DArr } from "../utils/canvasImgConverter";

const WIDTH = 280;
const HEIGHT = 280;
const DENSITY_SCALE = 1;
const CNN_INPUT_SHAPE = 28;

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const hiddenCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);

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
    const hiddenCtx = hiddenCtxRef.current;

    ctx?.clearRect(0, 0, WIDTH, HEIGHT);
    hiddenCtx?.clearRect(0, 0, WIDTH, HEIGHT);
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
    const hiddenCanvas = hiddenCanvasRef.current;

    if (!canvas || !hiddenCanvas) return;

    const ctx = canvas.getContext("2d");
    const hiddenCtx = hiddenCanvas.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.scale(DENSITY_SCALE, DENSITY_SCALE);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 20;

    ctxRef.current = ctx;
    hiddenCtxRef.current = hiddenCtx;
  }, []);

  const requestDetection = async () => {
    const ctx = ctxRef.current;
    const hiddenCtx = hiddenCtxRef.current;

    if (!ctx || !hiddenCtx) return;
    const canvasData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    // console.log(cnnInput)
    const t = await createImageBitmap(canvasData, {
      resizeWidth: CNN_INPUT_SHAPE,
      resizeHeight: CNN_INPUT_SHAPE,
    });
    hiddenCtx.drawImage(t, 0, 0);

    const imageData = hiddenCtx.getImageData(
      0,
      0,
      CNN_INPUT_SHAPE,
      CNN_INPUT_SHAPE
    );
    const converted = imgDataTo3DArr(imageData.data, CNN_INPUT_SHAPE);
    const cnnInput = [converted];

    const response = await fetch(`/api/proxy`, {
      method: "POST",
      body: JSON.stringify(cnnInput),
    });

    const result = await response.json();
    const dist = result.dist[0] as number[];

    let maxProb = 0;
    let pred = null;

    for (let i = 0; i < 10; ++i) {
      if (dist[i] > maxProb) {
        maxProb = dist[i];
        pred = i;
      }
    }

    setPrediction(pred);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      <canvas
        ref={hiddenCanvasRef}
        // hidden={true}
        className="w-[28px] h-[28px] rounded-md shadow-lg border-2 border-slate-400/60 bg-slate-700 relative" //"display-none"
        width={CNN_INPUT_SHAPE}
        height={CNN_INPUT_SHAPE}
      />
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
      <div className="flex flex-col gap-3">
        <div>Prediction: {prediction == null ? "" : prediction}</div>
        <div className="flex justify-center gap-4">
          <Button onClick={requestDetection}>Detect Digit</Button>
          <Button onClick={clearCanvas} color="orange">
            Clear Board
          </Button>
        </div>
      </div>
    </div>
  );
};
