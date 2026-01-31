// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import RcSlider, { createSliderWithTooltip } from 'rc-slider';

type Props = {
  width: number,
  label: string,
  min?: number,
  max?: number,
  step?: number,
  value?: number,
  defaultValue?: number,
  onChange: (val: number) => void,
  isInverted?: boolean,
  demoAnimation?: boolean, // Enable demo animation
  demoDelay?: number, // Delay before demo starts (ms)
  demoKey?: string, // Optional key for demo tracking; when set, allows re-demo in different contexts (e.g. same slider in different steps)
};

type State = {
  isPlayingDemo: boolean,
  demoComplete: boolean,
};

const RcSliderWithTooltip = createSliderWithTooltip(RcSlider);

// Track which slider labels have already played their demo animation
// so each slider only demos the first time it appears in the sequence.
const demoedSliderLabels = new Set();

class Slider extends Component<Props, State> {
  static defaultProps = {
    width: 100,
    demoAnimation: false,
    demoDelay: 0,
  };

  state = {
    isPlayingDemo: false,
    demoComplete: false,
  };

  demoTimeout: ?TimeoutID = null;
  animationFrameId: ?AnimationFrameID = null;
  originalValue: ?number = null;

  componentDidMount() {
    if (this.props.demoAnimation && !this.state.demoComplete) {
      this.startDemo();
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Start demo if demoAnimation becomes true
    if (this.props.demoAnimation && !prevProps.demoAnimation && !this.state.demoComplete) {
      this.startDemo();
    }
  }

  componentWillUnmount() {
    if (this.demoTimeout) clearTimeout(this.demoTimeout);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  startDemo = () => {
    const { demoDelay = 0, min = 0, max = 1, value = 0, onChange, step = 0.01, label, demoKey } = this.props;
    const trackingKey = demoKey != null ? demoKey : label;

    // Only demo each slider the first time it's seen (per tracking key)
    if (trackingKey && demoedSliderLabels.has(trackingKey)) {
      this.setState({ demoComplete: true });
      return;
    }

    // Store original value to restore after demo
    this.originalValue = value;

    this.demoTimeout = setTimeout(() => {
      this.setState({ isPlayingDemo: true });

      const duration = 2500; // 2.5 seconds total
      const startTime = performance.now();

      // Normalize position within the slider's range to decide direction.
      // If the handle is in the upper half, demo goes left first; otherwise right first.
      const normalizedPos = (max - min) > 0 ? (this.originalValue - min) / (max - min) : 0;
      const target = normalizedPos > 0.5 ? min : max;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease in-out: go from min to max (0-50%) then back to original (50-100%)
        let t;
        if (progress < 0.5) {
          // First half: go from current to target
          t = progress * 2; // 0 to 1
          const eased = t * t * (3 - 2 * t); // smoothstep
          const newValue = this.originalValue + (target - this.originalValue) * eased;
          const steppedValue = Math.round(newValue / step) * step;
          onChange(Math.min(max, Math.max(min, steppedValue)));
        } else {
          // Second half: go from target back to original
          t = (progress - 0.5) * 2; // 0 to 1
          const eased = t * t * (3 - 2 * t); // smoothstep
          const newValue = target - (target - this.originalValue) * eased;
          const steppedValue = Math.round(newValue / step) * step;
          onChange(Math.min(max, Math.max(min, steppedValue)));
        }

        if (progress < 1) {
          this.animationFrameId = requestAnimationFrame(animate);
        } else {
          // Restore original value and mark demo complete
          onChange(this.originalValue);
          if (trackingKey) demoedSliderLabels.add(trackingKey);
          this.setState({ isPlayingDemo: false, demoComplete: true });
        }
      };

      this.animationFrameId = requestAnimationFrame(animate);
    }, demoDelay);
  };

  render() {
    const { width, label, isInverted, min = 0, max = 1, value = 0, demoAnimation, demoDelay, ...delegatedProps } = this.props;

    // Calculate handle position as percentage
    const range = max - min;
    const normalizedValue = (value - min) / range;
    const handlePosition = normalizedValue * 94 + 3;

    return (
      <SliderContainer>
        {label && <Label isInverted={isInverted}>{label}</Label>}

        <TrackContainer isInverted={isInverted}>
          {/* Left end cap */}
          <EndCap isInverted={isInverted} />

          {/* Main track line */}
          <Track isInverted={isInverted}>
            {/* Handle */}
            <Handle
              isInverted={isInverted}
              style={{ left: `${handlePosition}%` }}
            />
          </Track>

          {/* Right end cap */}
          <EndCap isInverted={isInverted} />

          {/* Invisible slider overlay for interaction */}
          <SliderOverlay>
            <RcSliderWithTooltip
              {...delegatedProps}
              min={min}
              max={max}
              value={value}
              tipProps={{ placement: 'bottom', visible: false }}
            />
          </SliderOverlay>
        </TrackContainer>
      </SliderContainer>
    );
  }
}

const SliderContainer = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-left: 3px;
  margin-right: 0;

  &:last-child {
    margin-right: 0;
  }
`;

const Label = styled.div`
  font-family: 'Space grotesk', sans-serif;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
  color: ${props => props.isInverted ? '#fff' : '#000'};
  transition: color 800ms ease-in-out;
`;

const TrackContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 290px;
  height: 30px;
`;

const EndCap = styled.div`
  width: 2px;
  height: 16px;
  background-color: ${props => props.isInverted ? '#fff' : '#000'};
  transition: background-color 800ms ease-in-out;
  flex-shrink: 0;
`;

const Track = styled.div`
  position: relative;
  flex: 1;
  height: 2px;
  background-color: ${props => props.isInverted ? '#fff' : '#000'};
  transition: background-color 800ms ease-in-out;
`;

const Handle = styled.div`
  position: absolute;
  width: 14px;
  height: 20px;
  transform: translate(-50%, -50%);
  background-color: ${props => props.isInverted ? '#000000' : '#fff'};
  border: 2px solid ${props => props.isInverted ? '#fff' : '#000'};
  border-radius: 0;
  padding: 0;
  pointer-events: none;
  transition: background-color 800ms ease-in-out, border-color 800ms ease-in-out;
`;

const SliderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;

  .rc-slider {
    height: 100%;
    padding: 0;
  }
  .rc-slider-rail, .rc-slider-track {
    background: transparent;
    height: 100%;
  }
  .rc-slider-handle {
    background: transparent;
    border: none;
    cursor: pointer;
    width: 20px;
    height: 100%;
    margin-top: 0;
    top: 0;
  }
`;

export default Slider;
