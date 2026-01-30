// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { FONTS, CONTROLS, TRANSITIONS } from '../constants';
import { VOICE_PATTERNS } from '../data/voicePatterns';
import type { VoicePattern } from '../types';

type Props = {
  selectedPattern: VoicePattern,
  onChange: (pattern: VoicePattern) => void,
  isInverted?: boolean,
};

class VoicePatternToggle extends Component<Props> {
  render() {
    const { selectedPattern, onChange, isInverted } = this.props;

    return (
      <Container>
        <Label isInverted={isInverted}>Voice Pattern:</Label>
        <ButtonGroup>
          <Button
            active={selectedPattern === 'ah'}
            onClick={() => onChange('ah')}
            isInverted={isInverted}
          >
            {VOICE_PATTERNS.ah.label}
          </Button>
          <Button
            active={selectedPattern === 'ee'}
            onClick={() => onChange('ee')}
            isInverted={isInverted}
          >
            {VOICE_PATTERNS.ee.label}
          </Button>
        </ButtonGroup>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.div`
  font-family: ${FONTS.voiceToggle.fontFamily};
  font-size: ${FONTS.voiceToggle.fontSize};
  font-weight: ${FONTS.voiceToggle.fontWeight};
  margin-bottom: 12px;
  color: ${props => props.isInverted ? '#ffffff' : '#020202'};
  transition: color ${TRANSITIONS.theme};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${CONTROLS.voiceToggle.gap};
`;

const Button = styled.button`
  font-family: 'Space Mono', monospace;
  font-size: ${FONTS.voiceToggle.fontSize};
  font-weight: ${props => (props.active ? '700' : '400')};
  padding: ${CONTROLS.voiceToggle.buttonPadding};
  background: ${props => {
    if (props.isInverted) {
      return props.active ? '#fff' : '#000';
    }
    return props.active ? '#000' : '#fff';
  }};
  color: ${props => {
    if (props.isInverted) {
      return props.active ? '#000' : '#fff';
    }
    return props.active ? '#fff' : '#000';
  }};
  border: ${props => props.isInverted ? '2px solid #fff' : '3px solid #000'};
  border-radius: ${CONTROLS.voiceToggle.buttonBorderRadius};
  cursor: pointer;
  transition: all 0.2s, background ${TRANSITIONS.theme}, color ${TRANSITIONS.theme}, border-color ${TRANSITIONS.theme};

  &:hover {
    background: ${props => {
    if (props.isInverted) {
      return props.active ? '#fff' : '#1a1a1a';
    }
    return props.active ? '#000' : '#f0f0f0';
  }};
  }
`;

export default VoicePatternToggle;
