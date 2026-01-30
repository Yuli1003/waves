import styled from 'styled-components';

import { BREAKPOINTS, FONTS, TRANSITIONS } from '../constants';

export default styled.h4`
  margin-bottom: 20px;
  padding-bottom: 5px;
  font-family: ${FONTS.heading.fontFamily};
  font-size: ${FONTS.heading.fontSize};
  font-weight: ${FONTS.heading.fontWeight};
  color: ${props => props.isInverted ? '#ffffff' : '#000'};
  letter-spacing: 0px;
  text-transform: none;
  line-height: ${FONTS.heading.lineHeight};
  -webkit-font-smoothing: antialiased;
  border-bottom: ${props => props.isInverted ? '2px solid #ffffff' : '2px solid #000'};
  transition: color ${TRANSITIONS.theme}, border-color ${TRANSITIONS.theme};

  @media ${BREAKPOINTS.sm} {
    font-size: 20px;
  }

  @media ${BREAKPOINTS.mdMin} {
    font-size: 24px;
  }
`;
