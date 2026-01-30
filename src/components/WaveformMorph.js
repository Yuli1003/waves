// @flow
/**
 * WaveformMorph - Morphs a sine wave into a circle based on morphProgress (0-1)
 * At morphProgress=0: Normal sine wave
 * At morphProgress=1: Perfect circle
 */
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { WAVEFORM_ASPECT_RATIO } from '../constants';

type Props = {
  width: number,
  morphProgress: number, // 0 = wave, 1 = circle
  offset: number, // For wave animation
  amplitude: number,
  frequency: number,
  color: string,
  strokeWidth: number,
};

class WaveformMorph extends PureComponent<Props> {
  static defaultProps = {
    color: '#ffffff',
    strokeWidth: 3,
    amplitude: 0.75,
    frequency: 1,
    offset: 0,
  };

  // Generate points for a sine wave
  getWavePoints(numPoints: number, width: number, height: number) {
    const { amplitude, frequency, offset } = this.props;
    const points = [];
    const centerY = height / 2;
    const maxAmplitude = (height / 2) * 0.8 * amplitude;

    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * width;
      const progress = (i / numPoints) * frequency * Math.PI * 2 + (offset / 100) * Math.PI * 2;
      const y = centerY + Math.sin(progress) * maxAmplitude;
      points.push({ x, y });
    }

    return points;
  }

  // Generate points for a circle
  getCirclePoints(numPoints: number, width: number, height: number) {
    const points = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.25;

    for (let i = 0; i <= numPoints; i++) {
      // Start from the left side of the circle and go clockwise
      const angle = (i / numPoints) * Math.PI * 2 - Math.PI;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      points.push({ x, y });
    }

    return points;
  }

  // Linear interpolation between two values
  lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  // Interpolate between wave and circle points
  getMorphedPoints(numPoints: number, width: number, height: number) {
    const { morphProgress } = this.props;
    const wavePoints = this.getWavePoints(numPoints, width, height);
    const circlePoints = this.getCirclePoints(numPoints, width, height);

    return wavePoints.map((wavePoint, i) => {
      const circlePoint = circlePoints[i];
      return {
        x: this.lerp(wavePoint.x, circlePoint.x, morphProgress),
        y: this.lerp(wavePoint.y, circlePoint.y, morphProgress),
      };
    });
  }

  // Create SVG path from points
  createPath(points: Array<{ x: number, y: number }>) {
    if (points.length === 0) return '';

    const pathData = points.reduce((acc, point, index) => {
      if (index === 0) {
        return `M ${point.x},${point.y}`;
      }
      return `${acc} L ${point.x},${point.y}`;
    }, '');

    return pathData;
  }

  render() {
    const { width, color, strokeWidth } = this.props;
    const height = Math.round(width * WAVEFORM_ASPECT_RATIO);
    const numPoints = 200; // Number of points for smooth curves

    const points = this.getMorphedPoints(numPoints, width, height);
    const pathData = this.createPath(points);

    return (
      <Wrapper width={width} height={height}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ overflow: 'visible' }}
        >
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;

export default WaveformMorph;
