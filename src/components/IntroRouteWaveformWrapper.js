// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import AvailableWidth from './AvailableWidth';

type Props = {
  children: (width: number) => React$Node,
};

const IntroRouteWaveformWrapper = ({ children }: Props) => (
  <Fragment>
    {/*
      InitialSpacer is used on desktop to align the waveform with the
      title. position: sticky takes over but we need this to offset it
      initially
    */}
    <InitialSpacer />

    <Wrapper>
      <AvailableWidth>{children}</AvailableWidth>
    </Wrapper>
  </Fragment>
);

const InitialSpacer = styled.div`
  @media (orientation: landscape) {
    height: 175px;
  }
`;

const Wrapper = styled.div`
  @media (orientation: landscape) {
    position: sticky;
    top: 19vh;
  }

`;

export default IntroRouteWaveformWrapper;
