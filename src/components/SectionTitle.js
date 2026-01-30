import styled from 'styled-components';

import { BREAKPOINTS, FONTS, TRANSITIONS } from '../constants';

export default styled.h2`
  margin-bottom: 10px;
  padding-bottom: 5px;
  font-family: ${FONTS.sectionTitle.fontFamily};
  font-weight: ${FONTS.sectionTitle.fontWeight};
  font-size: ${FONTS.sectionTitle.fontSize};
  line-height: ${FONTS.sectionTitle.lineHeight};
  letter-spacing: ${FONTS.sectionTitle.letterSpacing};
  color: ${props => props.isInverted ? '#ffffff' : '#000'};
  border-bottom: ${props => props.isInverted ? '2px solid #ffffff' : '2px solid #000'};
  text-transform: none;
  transition: color ${TRANSITIONS.theme}, border-color ${TRANSITIONS.theme};

  @media ${BREAKPOINTS.sm} {
    font-size: 22px;
  }

  @media ${BREAKPOINTS.mdMin} {
    font-size: 26px;
  }
`;
