// @flow
import React from 'react';
import styled from 'styled-components';

import { BREAKPOINTS } from '../constants';

const Header = () => {
  return (
    <HeaderElem>
      {/* Title removed - content starts directly */}
    </HeaderElem>
  );
};

const HeaderElem = styled.header`
  position: relative;
  height: 40px;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media ${BREAKPOINTS.lgMin} {
    margin-top: 120px;
  }
`;

export default Header;
