// @flow
/**
 * This wrapper shares a lot in common with `IntroRouteWaveform`.
 * Still not sure if it should be standalone, or merged in.
 */
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { WAVEFORM_ASPECT_RATIO } from '../constants';
import { getWaveforms, convertProgressToCycle } from '../helpers/waveform.helpers';

import WaveformAddition from './WaveformAddition';
import WaveformAxis from './WaveformAxis';
import FadeTransition from './FadeTransition';

import type { WaveformShape, WaveformAdditionType } from '../types';
import type { StepData } from './IntroRoute.steps';

type Props = {
  type: WaveformAdditionType,
  width: number,
  stepData: StepData,
  baseFrequency: number,
  baseAmplitude: number,
  phase: number,
  harmonicsForShape: WaveformShape,
  numOfHarmonics: number,
  convergence: number,
  phase: number,
  progress: number,
  voicePattern?: string,
  isInverted?: boolean,
  secondaryWaveformColor?: ?string,
};

class IntroRouteWaveformAddition extends PureComponent<Props> {
  render() {
    const { width, convergence, stepData, isInverted, progress } = this.props;

    // Convert progress to offset for animation (same as IntroRouteWaveform)
    const offset = convertProgressToCycle(progress);

    // Create waveforms with animation offset applied
    const waveforms = getWaveforms(this.props).map(waveform => ({
      ...waveform,
      offset: (waveform.offset || 0) + offset,
    }));

    return (
      <Wrapper width={width}>
        <WaveformAddition
          size={width}
          waveforms={waveforms}
          convergence={convergence}
          isInverted={isInverted}
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
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => Math.round(props.width * WAVEFORM_ASPECT_RATIO)}px;
`;

export default IntroRouteWaveformAddition;
