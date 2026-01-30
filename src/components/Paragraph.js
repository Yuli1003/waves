import styled from 'styled-components';

import { BREAKPOINTS, FONTS, TRANSITIONS } from '../constants';

export default styled.p`
  margin-bottom: 25px;
  font-family: ${FONTS.paragraph.fontFamily};
  font-size: ${FONTS.paragraph.fontSize};
  font-weight: ${FONTS.paragraph.fontWeight};
  line-height: ${FONTS.paragraph.lineHeight};
  color: ${props => props.isInverted ? '#ffffff' : '#000'};
  -webkit-font-smoothing: 'antialiased';
  transition: color ${TRANSITIONS.theme};

  @media ${BREAKPOINTS.sm} {
    font-size: 16px;
  }

  @media ${BREAKPOINTS.mdMin} {
    font-size: 18px;
  }
`;
