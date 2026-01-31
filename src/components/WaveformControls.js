// @flow
import React from 'react';
import styled, { keyframes } from 'styled-components';

import Slider from './Slider';
import VoicePatternToggle from './VoicePatternToggle';

import type { StepData } from './IntroRoute.steps';

type Props = {
  width: number,

  amplitude: number,
  frequency: number,
  phase: number,
  numOfHarmonics: number,
  convergence: number,
  voicePattern?: string,

  handleUpdateAmplitude: (amplitude: number) => void,
  handleUpdateFrequency: (frequency: number) => void,
  handleUpdateNumOfHarmonics: (val: number) => void,
  handleUpdateConvergence: (val: number) => void,
  handleUpdatePhase: (val: number) => void,
  onVoicePatternChange?: (pattern: string) => void,

  stepData: StepData,
  isInverted?: boolean,
  demoAnimation?: boolean, // Enable demo animation for sliders
  currentStep?: string, // Current intro step ID (used to re-demo sliders in specific steps, e.g. light-decomposition)
};

const WaveformControls = ({
  width,
  amplitude,
  frequency,
  convergence,
  numOfHarmonics,
  phase,
  voicePattern,
  handleUpdateAmplitude,
  handleUpdateFrequency,
  handleUpdateConvergence,
  handleUpdateNumOfHarmonics,
  handleUpdatePhase,
  onVoicePatternChange,
  stepData,
  isInverted,
  demoAnimation = false,
  currentStep,
}: Props) => {
  // Calculate slider width to fill the available space.
  // We have a gap of 10px between potential columns.
  const sliderWidth = (width - 10) / 2;

  // Track slider position for staggered demo animation
  // Left slider plays first (delay 500ms), right slider plays second (delay 2000ms)
  let sliderIndex = 0;
  const getSliderDelay = () => {
    const delay = sliderIndex === 0 ? 500 : 2000;
    sliderIndex++;
    return delay;
  };

  return (
    <ControlsWrapper>


      {stepData.showAmplitudeSlider && (
        <Control width={sliderWidth}>
          <Slider
            label="Amplitude"
            width={sliderWidth}
            min={0}
            max={1}
            step={0.01}
            defaultValue={1}
            value={amplitude}
            onChange={handleUpdateAmplitude}
            isInverted={isInverted}
            demoAnimation={demoAnimation}
            demoDelay={getSliderDelay()}
          />
        </Control>
      )}

      {stepData.showFrequencySlider && (
        <Control width={sliderWidth}>
          <Slider
            label="Frequency"
            width={sliderWidth}
            min={stepData.frequencySliderMin}
            max={stepData.frequencySliderMax}
            step={stepData.frequencySliderStep}
            defaultValue={1}
            value={frequency}
            onChange={handleUpdateFrequency}
            isInverted={isInverted}
            demoAnimation={demoAnimation}
            demoDelay={getSliderDelay()}
          />
        </Control>
      )}

      {stepData.showConvergenceSlider && (
        <Control width={sliderWidth}>
          <Slider
            label="Convergence"
            width={sliderWidth}
            min={0}
            max={1}
            step={0.01}
            defaultValue={0}
            value={convergence}
            onChange={handleUpdateConvergence}
            isInverted={isInverted}
            demoAnimation={demoAnimation}
            demoDelay={getSliderDelay()}
            demoKey={currentStep === 'light-decomposition' ? 'light-decomposition:Convergence' : undefined}
          />
        </Control>
      )}

      {stepData.showNumOfHarmonicsSlider && (
        <Control width={sliderWidth}>
          <Slider
            label="# of Harmonics"
            width={sliderWidth}
            min={0}
            max={75}
            step={1}
            defaultValue={1}
            value={numOfHarmonics}
            onChange={handleUpdateNumOfHarmonics}
            isInverted={isInverted}
            demoAnimation={demoAnimation}
            demoDelay={getSliderDelay()}
          />
        </Control>
      )}

      {stepData.showPhaseSlider && (
        <Control width={sliderWidth}>
          <Slider
            label="Phase"
            width={sliderWidth}
            min={0}
            max={360}
            step={2}
            defaultValue={0}
            value={phase}
            onChange={handleUpdatePhase}
            isInverted={isInverted}
            demoAnimation={demoAnimation}
            demoDelay={getSliderDelay()}
          />
        </Control>
      )}

      {stepData.showVoicePatternToggle && voicePattern && onVoicePatternChange && (
        <VoicePatternToggle
          selectedPattern={voicePattern}
          onChange={onVoicePatternChange}
          isInverted={isInverted}
        />
      )}
    </ControlsWrapper>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
`;

const Control = styled.div`
  display: inline-block;
  min-width: 150px;
  max-width: ${props => props.width + 'px'};
  animation: ${fadeIn} 750ms;
`;

export default WaveformControls;
