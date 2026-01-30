// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import { WAVEFORM_ASPECT_RATIO } from '../constants';
import WaveformMorph from './WaveformMorph';
import ScrollMenu from './ScrollMenu';

type Props = {
  history: { push: (path: string) => void },
};

type State = {
  scrollProgress: number,
  waveAnimationOffset: number,
  isWaveAnimating: boolean,
  isMounted: boolean,
};

class EndingRoute extends Component<Props, State> {
  state = {
    scrollProgress: 0,
    waveAnimationOffset: 50, // Start at 50 to flip the wave on X-axis
    isWaveAnimating: false,
    isMounted: false,
  };

  scrollTicking: boolean = false;
  animationFrameId: ?number = null;
  animationStartTime: number = 0;
  animationStartOffset: number = 0;

  static SCROLL_BACK_TOP_THRESHOLD = 30;

  componentDidMount() {
    // Disable browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Ensure inverted theme
    document.body.classList.add('inverted');

    // CRITICAL: Force scroll to top IMMEDIATELY and synchronously
    document.documentElement.style.scrollBehavior = 'auto';
    document.documentElement.style.scrollSnapType = 'none';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    window.scrollTo(0, 0);

    // Wait for scroll to be confirmed at 0, then show content
    const waitForScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      if (scrollY === 0) {
        // Scroll is at 0, safe to show content
        this.setState({
          scrollProgress: 0,
          isMounted: true
        });

        // Re-enable scrolling after state update
        setTimeout(() => {
          document.body.style.overflow = '';
          window.addEventListener('scroll', this.handleScroll);
        }, 50);
      } else {
        // Keep trying to scroll to top
        window.scrollTo(0, 0);
        requestAnimationFrame(waitForScroll);
      }
    };

    requestAnimationFrame(waitForScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    // Restore default cursor (remove inverted) when leaving ending
    document.body.classList.remove('inverted');
    // Restore scroll-snap and scroll-behavior so IntroRoute snap works when navigating back
    document.documentElement.style.scrollSnapType = '';
    document.documentElement.style.scrollBehavior = '';
  }

  startWaveAnimation = () => {
    if (this.state.isWaveAnimating) return;

    // Store the current offset (0) as the starting point
    this.animationStartOffset = this.state.waveAnimationOffset;
    this.animationStartTime = performance.now();
    this.setState({ isWaveAnimating: true }, () => {
      this.animateWave();
    });
  };

  animateWave = () => {
    if (!this.state.isWaveAnimating) return;

    const now = performance.now();
    const elapsed = (now - this.animationStartTime) / 1000; // Convert to seconds

    // Animate the wave offset continuously (one full cycle every 3 seconds)
    // Start from the initial offset (0) and add elapsed time
    const additionalOffset = (elapsed / 3) * 100; // 100 units per 3 seconds
    const newOffset = (this.animationStartOffset + additionalOffset) % 100;

    this.setState({ waveAnimationOffset: newOffset });

    this.animationFrameId = requestAnimationFrame(this.animateWave);
  };

  handleScrollToStep = (stepId: string) => {
    // Navigate back to the intro route and scroll to the chosen section
    this.props.history.push({
      pathname: '/waveforms-intro',
      state: { scrollToStep: stepId },
    });
  };

  handleScroll = () => {
    // Don't process scroll events until fully mounted
    if (!this.state.isMounted) return;
    if (this.scrollTicking) return;
    this.scrollTicking = true;

    requestAnimationFrame(() => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

      // Clamp to valid range
      const clampedProgress = Math.min(1, Math.max(0, progress));

      this.setState({ scrollProgress: clampedProgress });

      // Start wave animation once user scrolls past threshold
      const waveAnimStartPoint = 0.05;
      if (clampedProgress > waveAnimStartPoint) {
        this.startWaveAnimation();
      }

      this.scrollTicking = false;
    });
  };

  render() {
    const { waveAnimationOffset, isMounted } = this.state;

    // CRITICAL: Always read scroll position directly to avoid flash
    // On first render, force to 0 regardless of actual scroll
    let safeScrollProgress = 0;
    if (isMounted) {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      safeScrollProgress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
    }

    // Text broken into multiple sequential parts
    const texts = [
      {
        id: 'title',
        content: <span>Waves Are Everywhere</span>,
        fadeInStart: 0.06,
        fadeInEnd: 0.11,
        fadeOutStart: 0.19,
        fadeOutEnd: 0.24,
        isTitle: false,
        verticalOffset: '90vh'
      },
      {
        id: 'paragraph-1',
        content: (
          <span>
            From the smallest vibrations in atoms to waves crossing galaxies,
            we are surrounded by invisible rhythms.
          </span>
        ),
        fadeInStart: 0.24,
        fadeInEnd: 0.29,
        fadeOutStart: 0.39,
        fadeOutEnd: 0.44,
        isTitle: false,
        verticalOffset: '90vh'
      },
      {
        id: 'paragraph-2',
        content: (
          <span>
            They affect everything that happens — defining the colors we see,
            the sounds we hear, and the signals we send.
          </span>
        ),
        fadeInStart: 0.48,
        fadeInEnd: 0.53,
        fadeOutStart: 0.63,
        fadeOutEnd: 0.68,
        isTitle: false,
        verticalOffset: '90vh'
      },
      {
        id: 'paragraph-3',
        content: (
          <span>
            Learning to understand them unlocks a hidden dimension of reality.
          </span>
        ),
        fadeInStart: 0.72,
        fadeInEnd: 0.77,
        fadeOutStart: 0.85,
        fadeOutEnd: 0.90,
        isTitle: false,
        verticalOffset: '90vh'
      },
    ];

    const getOpacity = (item) => {
      const { fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd } = item;
      if (safeScrollProgress < fadeInStart) return 0;
      if (safeScrollProgress < fadeInEnd) {
        return (safeScrollProgress - fadeInStart) / (fadeInEnd - fadeInStart);
      }
      if (safeScrollProgress < fadeOutStart) return 1;
      if (safeScrollProgress < fadeOutEnd) {
        return 1 - (safeScrollProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
      }
      return 0;
    };

    // Wave movement - use continuous animation offset
    // Start animation after initial hold period
    const waveAnimStartPoint = 0.05;
    let waveOffset = 50; // Start flipped on X-axis
    if (safeScrollProgress > waveAnimStartPoint) {
      waveOffset = waveAnimationOffset;
    }

    // Morph progress: wave → circle
    // Start morphing after user has seen the wave animate a bit
    const morphTriggerPoint = 0.12;
    const morphEndPoint = 0.75;
    let morphProgress = 0;
    if (safeScrollProgress >= morphTriggerPoint) {
      morphProgress = (safeScrollProgress - morphTriggerPoint) / (morphEndPoint - morphTriggerPoint);
      morphProgress = Math.min(1, Math.max(0, morphProgress));
    }

    // Earth transition: circle → spinning earth
    const earthTriggerPoint = 0.88;
    const earthCompletePoint = 0.96;
    let earthOpacity = 0;
    let waveformMorphOpacity = 1;
    if (safeScrollProgress >= earthTriggerPoint) {
      const earthProgress = (safeScrollProgress - earthTriggerPoint) / (earthCompletePoint - earthTriggerPoint);
      earthOpacity = Math.min(1, Math.max(0, earthProgress));
      waveformMorphOpacity = 1 - earthOpacity;
    }

    // Calculate Earth size to match the WaveformMorph circle
    const morphWidth = Math.min(window.innerWidth * 0.7, 900);
    const morphHeight = Math.round(morphWidth * WAVEFORM_ASPECT_RATIO);
    const circleRadius = Math.min(morphWidth, morphHeight) * 0.25;
    const earthSize = circleRadius / 0.45;

    // Before mounting, show ONLY the initial waveform with a black overlay
    if (!isMounted) {
      return (
        <PageWrapper style={{ minHeight: '100vh' }}>
          <LoadingOverlay>
            <WaveformMorph
              width={morphWidth}
              morphProgress={0}
              offset={50}
              amplitude={0.5}
              frequency={1.5}
              color="#ffffff"
              strokeWidth={3}
            />
          </LoadingOverlay>
        </PageWrapper>
      );
    }

    return (
      <PageWrapper>
        <ScrollMenu
          variant="intro"
          onScrollToStep={this.handleScrollToStep}
          currentStep="ending"
          isInverted={true}
        />
        <EndSequenceWrapper>
          <EndSequenceContentContainer>
            {texts.map((item) => {
              const opacity = getOpacity(item);
              if (opacity <= 0.01) return null;

              return (
                <EndSequenceTextLine
                  key={item.id}
                  style={{ opacity, top: item.verticalOffset || '0' }}
                  isTitle={item.isTitle}
                >
                  {item.content}
                </EndSequenceTextLine>
              );
            })}
          </EndSequenceContentContainer>

          <WaveformMorphContainer style={{ opacity: waveformMorphOpacity }}>
            <WaveformMorph
              width={morphWidth}
              morphProgress={morphProgress}
              offset={waveOffset}
              amplitude={0.6}
              frequency={1.51}
              color="#ffffff"
              strokeWidth={3}
            />
          </WaveformMorphContainer>

          {earthOpacity > 0.01 && (
            <EarthContainer style={{ opacity: earthOpacity }}>
              <SpinningEarth size={earthSize} />
            </EarthContainer>
          )}
        </EndSequenceWrapper>
      </PageWrapper>
    );
  }
}

// --- SPINNING EARTH COMPONENT ---

class SpinningEarth extends Component {
  svgRef = null;
  animationId = null;
  rotation = 0;
  lastTime = null;

  componentDidMount() {
    this.lastTime = performance.now();
    this.animate();
  }

  componentWillUnmount() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }

  animate = () => {
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    this.rotation = (this.rotation + dt * 20) % 360;

    this.updateMeridians();
    this.animationId = requestAnimationFrame(this.animate);
  };

  updateMeridians = () => {
    if (!this.svgRef) return;
    const meridians = this.svgRef.querySelectorAll('.earth-meridian');
    const { size } = this.props;
    const r = size * 0.45;
    const rotRad = this.rotation * Math.PI / 180;
    const numMeridians = meridians.length;

    meridians.forEach((el, i) => {
      const baseAngle = (i / numMeridians) * Math.PI;
      const angle = baseAngle + rotRad;
      const rx = Math.abs(r * Math.sin(angle));

      if (rx < 2) {
        el.setAttribute('opacity', '0');
      } else {
        el.setAttribute('rx', String(rx));
        el.setAttribute('opacity', '0.3');
      }
    });
  };

  render() {
    const { size } = this.props;
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.45;

    const latitudes = [-60, -30, 0, 30, 60];
    const numMeridians = 6;

    return (
      <svg
        ref={el => { this.svgRef = el; }}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Outer circle - sphere outline */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ffffff" strokeWidth="1.5" />

        {/* Latitude lines */}
        {latitudes.map((lat, idx) => {
          const latRad = lat * Math.PI / 180;
          const y = cy - r * Math.sin(latRad);
          const latR = r * Math.cos(latRad);
          const isEquator = lat === 0;
          return (
            <ellipse
              key={`lat-${idx}`}
              cx={cx}
              cy={y}
              rx={latR}
              ry={latR * 0.12}
              fill="none"
              stroke="#ffffff"
              strokeWidth={isEquator ? '1' : '0.6'}
              opacity={isEquator ? 0.6 : 0.3}
            />
          );
        })}

        {/* Meridian lines (animated via DOM manipulation) */}
        {Array.from({ length: numMeridians }, (_, i) => (
          <ellipse
            key={`mer-${i}`}
            className="earth-meridian"
            cx={cx}
            cy={cy}
            rx={r * 0.5}
            ry={r}
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.6"
            opacity="0.3"
          />
        ))}
      </svg>
    );
  }
}

// --- STYLES ---

const PageWrapper = styled.div`
  min-height: 900vh;
  background: #000000;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000000;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EndSequenceWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const EndSequenceContentContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 10vh;
`;

const EndSequenceTextLine = styled.div`
  position: absolute;
  color: ${props => props.isTitle ? '#ffffff' : '#ffffff'};
  font-family: 'DM Serif Text', serif;
  text-align: center;
  width: 100%;
  line-height: 1.4;
  text-shadow: 0 0 30px rgba(0,0,0,0.5);


  font-size: ${props => props.isTitle ? '70px' : '17px'};
  letter-spacing: ${props => props.isTitle ? '4px' : '2px'};

  max-width:'100%';
  padding: 0 20px;

  & * {
    font-family: inherit;
  }

  strong {
    color: ${props => props.isTitle ? 'transparent' : '#ffffff'};
    -webkit-text-stroke: ${props => props.isTitle ? 'inherit' : 'transparent'};
    font-weight: normal;
  }

  @media (max-width: 768px) {
    font-size: ${props => props.isTitle ? '40px' : '20px'};
    line-height: 1.5;
    -webkit-text-stroke-width: ${props => props.isTitle ? '1.5px' : '0'};
  }
`;

const WaveformMorphContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  pointer-events: none;
  transition: opacity 0.8s ease-in-out;
`;

const EarthContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 6;
  pointer-events: none;
  transition: opacity 1s ease-in-out;
`;

export default withRouter(EndingRoute);
