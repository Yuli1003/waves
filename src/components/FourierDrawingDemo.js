// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { scaleCanvas } from '../helpers/canvas.helpers';
import { COLORS, FONTS } from '../constants';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 320;
const MIN_POINTS_TO_ANIMATE = 6;
const SAMPLE_SKIP = 3; // subsample drawing for faster DFT and slightly simpler line

// --- Complex number and DFT (same math as the theorem) ---
class Complex {
  re: number;
  im: number;
  constructor(re: number, im: number) {
    this.re = re;
    this.im = im;
  }
  add(c: Complex): void {
    this.re += c.re;
    this.im += c.im;
  }
  mult(c: Complex): Complex {
    const re = this.re * c.re - this.im * c.im;
    const im = this.re * c.im + this.im * c.re;
    return new Complex(re, im);
  }
}

function dft(x: Array<Complex>): Array<{ freq: number, amp: number, phase: number }> {
  const N = x.length;
  const result = [];
  for (let k = 0; k < N; k++) {
    let sum = new Complex(0, 0);
    for (let n = 0; n < N; n++) {
      const phi = (2 * Math.PI * k * n) / N;
      const c = new Complex(Math.cos(phi), -Math.sin(phi));
      sum.add(x[n].mult(c));
    }
    sum.re /= N;
    sum.im /= N;
    const amp = Math.sqrt(sum.re * sum.re + sum.im * sum.im);
    const phase = Math.atan2(sum.im, sum.re);
    result.push({ freq: k, amp, phase });
  }
  return result;
}

const Wrapper = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CanvasWrapper = styled.div`
  position: relative;
  border: 1px solid ${COLORS.black[700]};
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
`;

const StyledCanvas = styled.canvas`
  display: block;
  cursor: ${props => (props.$isDrawing ? 'crosshair' : 'default')};
`;

const Instruction = styled.p`
  margin: 20px 0 0 0;
  font-family: ${FONTS.families.sans};
  font-size: 14px;
  color: ${COLORS.black[700]};
  text-align: center;
`;

type Point = { x: number, y: number };

type Props = {
  isInverted?: boolean,
};

type State = {
  state: -1 | 1; // -1: drawing, 1: animating
  drawing: Array<Point>;
  path: Array<Point>;
  fourierX: Array<{ freq: number, amp: number, phase: number }> | null;
  time: number;
};

export default class FourierDrawingDemo extends Component<Props, State> {
  canvasRef: HTMLCanvasElement | null = null;
  animationId: number | null = null;
  isDrawing = false;
  canvasRect: ClientRect | DOMRect | null = null;

  setCanvasRef = (el: HTMLCanvasElement | null) => {
    this.canvasRef = el;
  };

  state: State = {
    state: -1,
    drawing: [],
    path: [],
    fourierX: null,
    time: 0,
  };

  componentDidMount() {
    const canvas = this.canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    scaleCanvas(canvas, ctx);
    this.drawInitial();
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    if (this.animationId != null) cancelAnimationFrame(this.animationId);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  getCanvasCoords = (clientX: number, clientY: number): Point | null => {
    const canvas = this.canvasRef;
    const rect = this.canvasRect || (canvas ? canvas.getBoundingClientRect() : null);
    if (!rect) return null;
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    if (x >= 0 && x <= CANVAS_WIDTH && y >= 0 && y <= CANVAS_HEIGHT) {
      return { x, y };
    }
    return null;
  };

  drawInitial = () => {
    const canvas = this.canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  drawPathFromPoints = (points: Array<Point>, offsetX: number, offsetY: number) => {
    const canvas = this.canvasRef;
    if (!canvas || points.length < 2) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x + offsetX, points[0].y + offsetY);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x + offsetX, points[i].y + offsetY);
    }
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  epicycles = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    rotation: number,
    fourier: Array<{ freq: number, amp: number, phase: number }>,
    time: number
  ): Point => {
    let x = startX;
    let y = startY;
    for (let i = 0; i < fourier.length; i++) {
      const { freq, amp, phase } = fourier[i];
      const prevX = x;
      const prevY = y;
      x += amp * Math.cos(freq * time + phase + rotation);
      y += amp * Math.sin(freq * time + phase + rotation);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(prevX, prevY, amp, amp, 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    return { x, y };
  };

  runAnimationFrame = () => {
    const { state, fourierX, path, time } = this.state;
    if (state !== 1 || !fourierX || fourierX.length === 0) return;

    const canvas = this.canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = CANVAS_WIDTH / 2;
    const cy = CANVAS_HEIGHT / 2;
    const dt = (2 * Math.PI) / fourierX.length;
    let newTime = time + dt;
    let newPath = [this.epicycles(ctx, cx, cy, 0, fourierX, time), ...path];

    const completed = newTime > 2 * Math.PI;
    if (completed) {
      newTime = 2 * Math.PI; // freeze at end; don't add closing point (open shape)
    }

    // Redraw full frame
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.epicycles(ctx, cx, cy, 0, fourierX, completed ? newTime : time);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (newPath.length > 1) {
      ctx.moveTo(newPath[0].x, newPath[0].y);
      for (let i = 1; i < newPath.length; i++) {
        ctx.lineTo(newPath[i].x, newPath[i].y);
      }
    }
    ctx.stroke();

    this.setState({ time: newTime, path: newPath });
    if (!completed) {
      this.animationId = requestAnimationFrame(this.runAnimationFrame);
    } else {
      this.animationId = null;
    }
  };

  handleMouseDown = (e: SyntheticMouseEvent<HTMLCanvasElement>) => {
    if (this.state.state !== -1) return;
    const pt = this.getCanvasCoords(e.clientX, e.clientY);
    if (!pt) return;
    this.isDrawing = true;
    this.canvasRect = this.canvasRef ? this.canvasRef.getBoundingClientRect() : null;
    const drawing = [...this.state.drawing, pt];
    this.setState({ drawing });
    this.redrawDrawing(drawing);
  };

  handleMouseMove = (e: SyntheticMouseEvent<HTMLCanvasElement>) => {
    if (!this.isDrawing || this.state.state !== -1) return;
    const pt = this.getCanvasCoords(e.clientX, e.clientY);
    if (!pt) return;
    const drawing = [...this.state.drawing, pt];
    this.setState({ drawing });
    this.redrawDrawing(drawing);
  };

  handleMouseUp = (e: SyntheticMouseEvent<HTMLCanvasElement>) => {
    if (this.state.state !== -1) return;
    const pt = this.getCanvasCoords(e.clientX, e.clientY);
    if (pt) {
      const drawing = [...this.state.drawing, pt];
      this.setState({ drawing });
    }
    this.isDrawing = false;

    const { drawing } = this.state;
    const effectiveDrawing = pt ? [...drawing, pt] : drawing;
    if (effectiveDrawing.length >= MIN_POINTS_TO_ANIMATE) {
      const smallerDrawing = [];
      for (let i = 0; i < effectiveDrawing.length; i += SAMPLE_SKIP) {
        const p = effectiveDrawing[i];
        smallerDrawing.push(new Complex(p.x - CANVAS_WIDTH / 2, p.y - CANVAS_HEIGHT / 2));
      }
      let fourierX = dft(smallerDrawing);
      fourierX = fourierX.sort((a, b) => b.amp - a.amp);
      this.setState({
        state: 1,
        fourierX,
        path: [],
        time: 0,
      });
      this.animationId = requestAnimationFrame(this.runAnimationFrame);
    }
  };

  handleMouseLeave = () => {
    this.isDrawing = false;
  };

  redrawDrawing = (drawing: Array<Point>) => {
    const canvas = this.canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.drawPathFromPoints(drawing, 0, 0);
  };

  reset = () => {
    if (this.animationId != null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.setState({
      state: -1,
      drawing: [],
      path: [],
      fourierX: null,
      time: 0,
    });
    this.drawInitial();
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'r' || e.key === 'R') this.reset();
  };

  render() {
    const { state } = this.state;
    const isDrawingState = state === -1;

    return (
      <Wrapper>
        <CanvasWrapper>
          <StyledCanvas
            innerRef={this.setCanvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}
            onMouseLeave={this.handleMouseLeave}
            $isDrawing={isDrawingState}
          />
        </CanvasWrapper>
        <Instruction>Draw a shape, then release the mouse to see it rebuilt. Press R to reset.</Instruction>
      </Wrapper>
    );
  }
}
