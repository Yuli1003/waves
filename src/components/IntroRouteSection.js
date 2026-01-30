// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import IntersectionObserver from './IntersectionObserver';

import { INTRO_STEPS } from './IntroRoute.steps';

import type { IntroStep } from './IntroRoute.steps';

type Props = {
  id: IntroStep,
  currentStep: IntroStep,
  margin?: number,
  onIntersect: (id: IntroStep) => void,
  // Used by IntersectionObserver to determine at which point this step
  // should become active
  rolloverRatio: number,
  innerRef: (elem: HTMLElement) => void,
  children: React$Node,
  isInverted?: boolean,
  disableSnap?: boolean,
  scrollSnapMarginTop?: string,
  scrollSnapAlign?: string,
};

class IntroRouteSection extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    if (nextProps.id === nextProps.currentStep) {
      return true;
    }

    const delta = Math.abs(
      INTRO_STEPS.indexOf(nextProps.id) -
      INTRO_STEPS.indexOf(nextProps.currentStep)
    );

    return delta <= 1;
  }

  // Recursively clone children and pass isInverted prop
  cloneChildrenWithProps = (children, props) => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        const childProps = { ...props };

        // If child has its own children, recursively clone them
        if (child.props && child.props.children) {
          childProps.children = this.cloneChildrenWithProps(child.props.children, props);
        }

        return React.cloneElement(child, childProps);
      }
      return child;
    });
  };

  render() {
    const {
      id,
      currentStep,
      onIntersect,
      margin = 0,
      rolloverRatio,
      innerRef,
      children,
      isInverted,
      disableSnap = false,
      scrollSnapMarginTop = '9vh',
      scrollSnapAlign = 'start',
    } = this.props;

    const isSelected = id === currentStep;

    // Recursively clone children and pass isInverted prop to all nested components
    const childrenWithProps = this.cloneChildrenWithProps(children, { isInverted });

    return (
      <IntersectionObserver
        onlyFireOn="enter"
        id={id}
        onIntersect={onIntersect}
        rootMargin={`0px 0px -${window.innerHeight *
          (1 - rolloverRatio)}px 0px`}
      >
        <IntroRouteSectionElem
          innerRef={innerRef}
          margin={margin}
          isSelected={isSelected}
          disableSnap={disableSnap}
          scrollSnapMarginTop={scrollSnapMarginTop}
          scrollSnapAlign={scrollSnapAlign}
        >
          {childrenWithProps}
        </IntroRouteSectionElem>
      </IntersectionObserver>
    );
  }
}

const IntroRouteSectionElem = styled.div`
  margin-top: ${props => props.margin + 'px'};
  margin-bottom: 50vh;
  opacity: ${props => (props.isSelected ? 1 : 0.4)};
  transition: opacity 400ms;

  /* Snap each section to align just below waveform on desktop */
  /* Disable snap for conclusion/over steps to prevent oscillation */
  @media (orientation: landscape) {
    scroll-snap-align: ${props => props.disableSnap ? 'none' : (props.scrollSnapAlign || 'start')};
    scroll-margin-top: ${props => props.scrollSnapMarginTop || '9vh'};
    scroll-snap-stop: ${props => props.disableSnap ? 'normal' : 'normal'};
  }
`;

export default IntroRouteSection;
