// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Motion, spring } from 'react-motion';

import { FONTS, LAYOUT, TRANSITIONS, Z_INDEX } from '../constants';
import { EXAMPLES } from '../data/examples';

const RISE_DELAY_MS = 280;

type Props = {
  isInverted: boolean,
  availableExamples: Array<string>,
  targetExampleId?: ?string,
};

type State = {
  shouldRise: boolean,
};

class ExampleDetailsColumn extends PureComponent<Props, State> {
  wrapperRef: ?HTMLElement = null;
  itemRefs: { [key: string]: ?HTMLElement } = {};
  riseTimeoutId: TimeoutID | null = null;

  state: State = {
    shouldRise: false,
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.targetExampleId !== prevProps.targetExampleId && this.props.targetExampleId) {
      this.scrollToExample(this.props.targetExampleId);
    }

    const isVisible = this.props.isInverted && this.props.availableExamples.length > 0;
    const wasVisible = prevProps.isInverted && prevProps.availableExamples.length > 0;

    if (isVisible && !wasVisible) {
      if (this.riseTimeoutId != null) clearTimeout(this.riseTimeoutId);
      this.riseTimeoutId = setTimeout(() => {
        this.riseTimeoutId = null;
        this.setState({ shouldRise: true });
      }, RISE_DELAY_MS);
    } else if (!isVisible) {
      if (this.riseTimeoutId != null) {
        clearTimeout(this.riseTimeoutId);
        this.riseTimeoutId = null;
      }
      this.setState({ shouldRise: false });
    }
  }

  componentWillUnmount() {
    if (this.riseTimeoutId != null) clearTimeout(this.riseTimeoutId);
  }

  scrollToExample = (exampleId: string) => {
    const item = this.itemRefs[exampleId];
    const wrapper = this.wrapperRef;

    if (item && wrapper) {
      const wrapperRect = wrapper.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const currentScroll = wrapper.scrollTop;
      const relativeTop = itemRect.top - wrapperRect.top;

      wrapper.scrollTo({
        top: currentScroll + relativeTop,
        behavior: 'smooth'
      });
    }
  };

  render() {
    const { isInverted, availableExamples } = this.props;
    const isVisible = isInverted && availableExamples.length > 0;
    const { shouldRise } = this.state;

    return (
      <Motion
        style={{
          translateY: spring(shouldRise ? 0 : 100, TRANSITIONS.spring),
          opacity: spring(shouldRise ? 1 : 0, TRANSITIONS.spring),
        }}
      >
        {({ translateY, opacity }) => (
          <ColumnWrapper
            innerRef={elem => (this.wrapperRef = elem)}
            style={{
              transform: `translateY(${translateY}%)`,
              opacity,
              pointerEvents: isVisible ? 'auto' : 'none',
            }}
            isInverted={isInverted}
          >
            <ExamplesList>
              {availableExamples.map(exampleId => {
                const example = EXAMPLES[exampleId];
                if (!example) return null;
                return (
                  <ExampleItem
                    key={exampleId}
                    innerRef={elem => (this.itemRefs[exampleId] = elem)}
                  >
                    <ImageWrapper>
                      <ExampleImage src={`${process.env.PUBLIC_URL || ''}${example.imagePath}`} alt={example.label} />
                      {example.imageBwPath && (
                        <ExampleImageBw src={`${process.env.PUBLIC_URL || ''}${example.imageBwPath}`} alt={example.label} />
                      )}
                    </ImageWrapper>
                    <ExampleDescription isInverted={isInverted}>
                      {example.description}
                    </ExampleDescription>
                  </ExampleItem>
                );
              })}
            </ExamplesList>
          </ColumnWrapper>
        )}
      </Motion>
    );
  }
}

const ColumnWrapper = styled.div`
  position: fixed;
  top: ${LAYOUT.exampleColumn.position.top};
  left: ${LAYOUT.exampleColumn.position.left};
  right: ${LAYOUT.exampleColumn.position.right};
  max-height: ${LAYOUT.exampleColumn.maxHeight};
  background: transparent;
  padding: ${LAYOUT.exampleColumn.padding};
  overflow-y: auto;
  z-index: ${Z_INDEX.exampleColumn};
  will-change: transform, opacity;

  /* Hide scrollbar but keep functionality */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ExamplesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${LAYOUT.exampleColumn.gap};
`;

const ExampleItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ExampleImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
`;

const ExampleImageBw = styled(ExampleImage)`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 1;
  transition: opacity 0.5s ease;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;

  &:hover ${ExampleImageBw} {
    opacity: 0;
  }
`;

const ExampleDescription = styled.p`
  font-family: ${FONTS.exampleDescription.fontFamily};
  font-size: ${FONTS.exampleDescription.fontSize};
  line-height: ${FONTS.exampleDescription.lineHeight};
  margin: 0;
  padding: 0;
  color: ${props => props.isInverted ? '#ffffff' : '#000000'};
  transition: color ${TRANSITIONS.theme};
`;

export default ExampleDetailsColumn;
