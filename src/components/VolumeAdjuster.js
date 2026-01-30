// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import VolumeOff from 'react-icons/lib/md/volume-off';
import VolumeOn from 'react-icons/lib/md/volume-up';

import { COLORS, FONTS, CONTROLS, TRANSITIONS } from '../constants';
import { range } from '../utils';

type Props = {
  blockSize: number,
  currentVolume: number,
  steps: number,
  isMuted: boolean,
  onAdjustVolume: (volume: number) => void,
  onToggleMute: () => void,
  isInverted?: boolean,
};

class VolumeAdjuster extends PureComponent<Props> {
  static defaultProps = {
    blockSize: 18,
    steps: CONTROLS.volume.barCount,
    isMuted: false,
  };

  render() {
    const { blockSize, currentVolume, steps, isMuted, isInverted } = this.props;

    const isAudible = !isMuted && currentVolume > 0;
    const VolumeIcon = isAudible ? VolumeOn : VolumeOff;

    return (
      <Wrapper>
        <Label isInverted={isInverted}>Volume</Label>

        <ControlsRow>
          <VolumeBlocks>
            {range(1, steps).map(index => {
              const volumeLevel = index / steps;
              const isFilled = volumeLevel <= currentVolume && !isMuted;

              return (
                <VolumeBlock
                  key={index}
                  size={blockSize}
                  onClick={() => this.props.onAdjustVolume(volumeLevel)}
                  isInverted={isInverted}
                  isFilled={isFilled}
                />
              );
            })}
          </VolumeBlocks>

          <MuteButton onClick={this.props.onToggleMute}>
            <VolumeIcon
              color={isInverted ? '#ffffff' : (isAudible ? '#000000' : COLORS.gray[500])}
            />
          </MuteButton>
        </ControlsRow>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  touch-action: none;
`;

const Label = styled.div`
  font-family: ${FONTS.volumeLabel.fontFamily};
  font-size: ${FONTS.volumeLabel.fontSize};
  font-weight: ${FONTS.volumeLabel.fontWeight};
  letter-spacing: ${FONTS.volumeLabel.letterSpacing};
  margin-bottom: 12px;
  color: ${props => props.isInverted ? '#fff' : '#000'};
  transition: color ${TRANSITIONS.theme};
`;


const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const VolumeBlocks = styled.div`
  display: flex;
  gap:6px;
`;

const MuteButton = styled.button`
  background: transparent;
  border: none;
  padding: 5px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
`;

const VolumeBlock = styled.button`
  position: relative;
  width: 14px;
  height: 20px;
  background-color: ${props => {
    if (props.isFilled) {
      return props.isInverted ? '#000' : '#fff';
    }
    return props.isInverted ? '#000' : '#fff';
  }};
  border: 2px solid ${props => props.isInverted ? '#fff' : '#000'};
  border-radius: 0;
  padding: 0;
  outline: none;
  cursor: pointer;
  transition: background-color ${TRANSITIONS.theme}, border-color ${TRANSITIONS.theme};

  &:hover {
    background-color: ${props => {
    return props.isInverted ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  }};
  }

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    background-color: ${props => {
    if (props.isFilled) {
      return props.isInverted ? '#fff' : '#000';
    }
    return 'transparent';
  }};
    transition: background-color 150ms ease;
  }
`;

export default VolumeAdjuster;
