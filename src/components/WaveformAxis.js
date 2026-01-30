// @flow
import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components';

import {
  COLORS,
  DEFAULT_WAVEFORM_SIZE,
  WAVEFORM_ASPECT_RATIO,
  IS_MOBILE_USER_AGENT,
} from '../constants/index';
import { range } from '../utils';

import FadeTransition from './FadeTransition';

import type { Linecap } from '../types';

const SIDE_AXIS_SPACING = 10;
const TOP_AXIS_SPACING = 10;
const STROKE_DASHARRAY = 3;

type Props = {
  y: boolean,
  x: boolean,
  waveformSize: number,
  color: string,
  strokeWidth: number,
  strokeLinecap: Linecap,
  opacity: number,
  showLabels: boolean,
  isInverted?: boolean,
};

class WaveformAxis extends PureComponent<Props> {
  static defaultProps = {
    y: false,
    x: false,
    waveformSize: DEFAULT_WAVEFORM_SIZE,
    color: COLORS.gray[900],
    strokeWidth: 1,
    strokeLinecap: 'square',
    opacity: 1,
    showLabels: false,
  };

  render() {
    const {
      y,
      x,
      waveformSize,
      color,
      strokeWidth,
      strokeLinecap,
      opacity,
      showLabels,
      isInverted,
    } = this.props;

    if (x && y) {
      throw new Error(
        'You provided both `x` and `y`, but these are mutually exclusive. Please supply a single axis to render to WaveformAxis'
      );
    }

    if (!x && !y) {
      throw new Error(
        'You need to specify either `x` or `y` for WaveformAxis. Which axis do you wish to show?'
      );
    }

    const width = waveformSize;
    const height = waveformSize * WAVEFORM_ASPECT_RATIO;

    const axisWidth = width + SIDE_AXIS_SPACING * 2;
    const axisHeight = height + TOP_AXIS_SPACING * 2;

    const halfHeight = Math.round(height / 2);

    const showXLabels = x && showLabels;
    const showYLabels = y && showLabels;

    const coordinates = x
      ? {
        x1: -SIDE_AXIS_SPACING,
        y1: halfHeight,
        x2: width + SIDE_AXIS_SPACING,
        y2: halfHeight,
      }
      : {
        x1: 0,
        y1: -TOP_AXIS_SPACING,
        x2: 0,
        y2: height + TOP_AXIS_SPACING,
      };

    // Use inverted colors when needed
    const strokeColor = isInverted ? '#ffffff' : color;
    const labelLineColor = isInverted ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
    const textColor = isInverted ? '#ffffff' : '#000000';

    const labelLineStyles = {
      stroke: labelLineColor,
      strokeDasharray: STROKE_DASHARRAY,
      style: { transition: 'stroke 800ms ease-in-out' }
    };

    const yAxisGuideSquish = IS_MOBILE_USER_AGENT
      ? -SIDE_AXIS_SPACING
      : SIDE_AXIS_SPACING;

    return (
      <WaveformAxisSvg width={width} height={height}>
        <FadeTransition isVisible={showXLabels} typeName="g">
          {range(0, 1, 0.25).map(i => {
            return (
              <Fragment key={i}>
                {i > 0 && (
                  <line
                    x1={width * i}
                    y1={-TOP_AXIS_SPACING}
                    x2={width * i}
                    y2={height + TOP_AXIS_SPACING}
                    {...labelLineStyles}
                  />
                )}

                <text
                  x={width * i + 4}
                  y={height / 2 + 16}
                  style={{ fontSize: 14, fill: textColor, transition: 'fill 800ms ease-in-out' }}
                >
                  {i}s
                </text>
              </Fragment>
            );
          })}
        </FadeTransition>
        <FadeTransition isVisible={showYLabels} typeName="g">
          <Fragment>
            <line
              x1={-SIDE_AXIS_SPACING}
              y1={-3}
              x2={width + yAxisGuideSquish}
              y2={-3}
              {...labelLineStyles}
            />
            <text
              x={axisWidth}
              y={0}
              dx={yAxisGuideSquish}
              dy={4}
              style={{ fontSize: 14, textAnchor: 'end', fill: textColor, transition: 'fill 800ms ease-in-out' }}
            >
              +1
            </text>

            <line
              x1={-SIDE_AXIS_SPACING}
              y1={halfHeight}
              x2={width + yAxisGuideSquish}
              y2={halfHeight}
              {...labelLineStyles}
            />
            <text
              x={axisWidth}
              y={halfHeight}
              dx={yAxisGuideSquish}
              dy={4}
              style={{ fontSize: 14, textAnchor: 'end', fill: textColor, transition: 'fill 800ms ease-in-out' }}
            >
              0
            </text>

            <line
              x1={-SIDE_AXIS_SPACING}
              y1={height + 3}
              x2={width + yAxisGuideSquish}
              y2={height + 3}
              {...labelLineStyles}
            />
            <text
              x={axisWidth}
              dx={yAxisGuideSquish}
              y={axisHeight}
              dy={-16}
              style={{ fontSize: 14, textAnchor: 'end', fill: textColor, transition: 'fill 800ms ease-in-out' }}
            >
              -1
            </text>
          </Fragment>
        </FadeTransition>
        <line
          {...coordinates}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
          style={{ opacity, transition: `opacity ${500}ms, stroke 800ms ease-in-out` }}
        />
      </WaveformAxisSvg>
    );
  }
}

const WaveformAxisSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: ${props => props.width + 'px'};
  height: ${props => props.height + 'px'};
  overflow: visible;
`;

export default WaveformAxis;
