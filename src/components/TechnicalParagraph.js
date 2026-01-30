import styled from 'styled-components';

import { COLORS, BREAKPOINTS } from '../constants';

export default styled.p`
  margin-bottom: 25px;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.6;
  color: ${COLORS.gray[900]};
  font-family: 'Space Mono', monospace;
  -webkit-font-smoothing: 'antialiased';
  padding-left: 20px;
  border-left: 2px solid ${COLORS.gray[400]};
  position: relative;

  @media ${BREAKPOINTS.sm} {
    font-size: 13px;
  }

  @media ${BREAKPOINTS.mdMin} {
    font-size: 14px;
  }
`;
