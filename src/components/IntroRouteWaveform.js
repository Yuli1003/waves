// @flow
import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components';

import { WAVEFORM_ASPECT_RATIO } from '../constants';
import { convertProgressToCycle } from '../helpers/waveform.helpers';

import Waveform from './Waveform';
import WaveformTween from './WaveformTween';
import WaveformAxis from './WaveformAxis';
import WaveformIntercept from './WaveformIntercept';
import WaveformCycleIndicator from './WaveformCycleIndicator';
import FadeTransition from './FadeTransition';

import type { StepData } from './IntroRoute.steps';

type Props = {
  width: number,
  amplitude: number,
  frequency: number,
  progress: number,
  handleUpdateAmplitude: (amplitude: number) => void,
  handleUpdateFrequency: (frequency: number) => void,
  stepData: StepData,
  isInverted?: boolean,
};

class IntroRouteWaveform extends PureComponent<Props> {
  render() {
    const { width, amplitude, frequency, progress, stepData, isInverted } = this.props;

    // `progress` is an ever-increasing decimal value representing how many
    // iterations of the loop have occured.
    // Transform this value into a circular value between 0 and 99.
    const offset = convertProgressToCycle(progress);

    // Use inverted color if needed, otherwise use stepData color
    const waveformColor = isInverted ? '#ffffff' : stepData.waveformColor;

    return (
      <Wrapper width={width}>
        <WaveformTween
          shape={stepData.waveformShape}
          amplitude={amplitude}
          frequency={frequency}
          offset={offset}
          width={width}
        >
          {({ points }) => (
            <Fragment>
              <Waveform
                points={points}
                frequency={frequency}
                amplitude={amplitude}
                offset={offset}
                color={waveformColor}
                strokeWidth={3}
                opacity={stepData.waveformOpacity}
                size={width}
              />

              <FadeTransition isVisible={stepData.showXAxis}>
                <WaveformAxis
                  x
                  strokeWidth={2}
                  waveformSize={width}
                  showLabels={stepData.showXAxisLabels}
                  opacity={stepData.xAxisOpacity}
                  isInverted={isInverted}
                />
              </FadeTransition>
              <FadeTransition isVisible={stepData.showYAxis}>
                <WaveformAxis
                  y
                  strokeWidth={2}
                  waveformSize={width}
                  showLabels={stepData.showYAxisLabels}
                  opacity={stepData.yAxisOpacity}
                  isInverted={isInverted}
                />
              </FadeTransition>

              <FadeTransition isVisible={stepData.showYAxisIntercept}>
                <WaveformIntercept
                  size={20}
                  color={isInverted ? '#ffffff' : '#000000'}
                  waveformSize={width}
                  waveformShape={stepData.waveformShape}
                  frequency={frequency}
                  amplitude={amplitude}
                  offset={offset}
                />
              </FadeTransition>

              <FadeTransition
                typeName="div"
                isVisible={stepData.showCycleIndicator}
              >
                <WaveformCycleIndicator frequency={frequency} />
              </FadeTransition>
            </Fragment>
          )}
        </WaveformTween>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => Math.round(props.width * WAVEFORM_ASPECT_RATIO)}px;
`;

export default IntroRouteWaveform;
