// @flow
import React, { Component, PureComponent } from 'react';
import styled, { injectGlobal } from 'styled-components';
import { withRouter } from 'react-router-dom';
import { range } from '../utils';
import RcSlider from 'rc-slider';

// Removed the external import to use the local definition below
// import ScrollMenu from './ScrollMenu';

injectGlobal`
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap');
  
  body {
    background-color: #fff;
    margin: 0;
    scrollbar-width: none;
    -ms-overflow-style: none; /* IE and Edge */
  }

  body::-webkit-scrollbar {
    display: none;
  }
`;

type Props = {
  history: any,
};

type State = {
  scrollProgress: number,
  viewportHeight: number,
  audioVolume: number,
  audioMuted: boolean,
  dummySliderValue: number,
};

class SpectralDecomposition extends Component<Props, State> {
  state = {
    scrollProgress: 0,
    viewportHeight: 0,
    audioVolume: 0.5,
    audioMuted: false,
    dummySliderValue: 50,
  };

  rafId: ?number = null;

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
    this.setState({ viewportHeight: window.innerHeight });
    this.handleScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  handleResize = () => {
    this.setState({ viewportHeight: window.innerHeight });
  }

  handleScrollTo = (progress: number) => {
    const viewportHeight = window.innerHeight;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewportHeight);
    const targetScroll = progress * maxScroll;
    window.scrollTo(0, targetScroll);
  }

  handleScroll = () => {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - viewportHeight);

      const progress = (scrollY / maxScroll) * 7.5;

      if (progress >= 7.0) {
        // Prevent browser scroll restoration
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual';
        }
        // Temporarily disable scroll-snap and smooth scroll to prevent snapping to wrong section
        const html = document.documentElement;
        html.style.scrollSnapType = 'none';
        html.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        this.props.history.push('/waveforms-intro');
        // Re-enable after navigation (small delay for route change)
        setTimeout(() => {
          html.style.scrollSnapType = '';
          html.style.scrollBehavior = '';
        }, 100);
        return;
      }

      this.setState({ scrollProgress: progress });
    });
  };

  handleUpdateAudioVolume = (audioVolume: number) => {
    this.setState({ audioVolume, audioMuted: false });
  };

  handleToggleMuteAudio = () => {
    this.setState({ audioMuted: !this.state.audioMuted });
  };

  handleDummySliderChange = (val: number) => {
    this.setState({ dummySliderValue: val });
  };

  renderWaveText() {
    const { scrollProgress } = this.state;

    const text1 = "Every complex signal is just a stack of simple, pure waves added together.";
    const titleText1 = "Spectral Decomposition";
    const text2 = "is the process of taking a complex signal and breaking it apart to reveal the simple waves hidden inside.";
    const text3 = "We actually see this phenomenon happening around us all the time.";
    const titleText2 = "";

    const crossfadeStart = 1.3;
    const crossfadeEnd = 1.5;
    const crossfadeProgress = Math.max(0, Math.min((scrollProgress - crossfadeStart) / (crossfadeEnd - crossfadeStart), 1));
    const showFirst = crossfadeProgress < 1;

    // Timeline logic
    const slide1FadeOutStart = 3.0;
    const slide1FadeOutEnd = 3.6;
    const slide2FadeInStart = 3.2;
    const explanationFadeInStart = 4.8;
    const explanationFadeInEnd = 5.3;
    const explanationFadeOutStart = 6.5;
    const explanationFadeOutEnd = 7.0;

    const title1FadeInStart = 2.0;
    const title1FadeInEnd = 2.3;
    const title1FadeOutStart = 2.8;
    const title1FadeOutEnd = 2.9;

    const title2FadeInStart = 3.6;
    const title2FadeInEnd = 3.8;
    const title2FadeOutStart = 4.3;
    const title2FadeOutEnd = 4.4;

    // Opacity Calculations
    let slide1Opacity = 1;
    if (scrollProgress >= slide1FadeOutStart) {
      slide1Opacity = 1 - Math.max(0, Math.min((scrollProgress - slide1FadeOutStart) / (slide1FadeOutEnd - slide1FadeOutStart), 1));
    }

    let title1Opacity = 0;
    if (scrollProgress >= title1FadeInStart && scrollProgress < title1FadeInEnd) {
      title1Opacity = (scrollProgress - title1FadeInStart) / (title1FadeInEnd - title1FadeInStart);
    } else if (scrollProgress >= title1FadeInEnd && scrollProgress < title1FadeOutStart) {
      title1Opacity = 1;
    } else if (scrollProgress >= title1FadeOutStart) {
      title1Opacity = 1 - Math.max(0, Math.min((scrollProgress - title1FadeOutStart) / (title1FadeOutEnd - title1FadeOutStart), 1));
    }

    let slide2Opacity = 0;
    if (scrollProgress >= slide2FadeInStart) {
      const slide2FadeOutStart = 4.0;
      if (scrollProgress < slide2FadeOutStart) {
        slide2Opacity = Math.max(0, Math.min((scrollProgress - slide2FadeInStart) / (3.8 - slide2FadeInStart), 1));
      } else {
        slide2Opacity = 1 - Math.max(0, Math.min((scrollProgress - slide2FadeOutStart) / (4.5 - slide2FadeOutStart), 1));
      }
    }

    let title2Opacity = 0;
    if (scrollProgress >= title2FadeInStart && scrollProgress < title2FadeInEnd) {
      title2Opacity = (scrollProgress - title2FadeInStart) / (title2FadeInEnd - title2FadeInStart);
    } else if (scrollProgress >= title2FadeInEnd && scrollProgress < title2FadeOutStart) {
      title2Opacity = 1;
    } else if (scrollProgress >= title2FadeOutStart) {
      title2Opacity = 1 - Math.max(0, Math.min((scrollProgress - title2FadeOutStart) / (title2FadeOutEnd - title2FadeOutStart), 1));
    }

    let explanationOpacity = 0;
    if (scrollProgress >= explanationFadeInStart && scrollProgress < explanationFadeInEnd) {
      explanationOpacity = (scrollProgress - explanationFadeInStart) / (explanationFadeInEnd - explanationFadeInStart);
    } else if (scrollProgress >= explanationFadeInEnd && scrollProgress < explanationFadeOutStart) {
      explanationOpacity = 1;
    } else if (scrollProgress >= explanationFadeOutStart) {
      explanationOpacity = 1 - Math.max(0, Math.min((scrollProgress - explanationFadeOutStart) / (explanationFadeOutEnd - explanationFadeOutStart), 1));
    }

    const showSlide1 = scrollProgress >= crossfadeStart && scrollProgress < slide1FadeOutEnd;
    const showSlide2 = scrollProgress >= 3.2 && scrollProgress < 4.5;
    const showExplanation = scrollProgress >= explanationFadeInStart && scrollProgress < explanationFadeOutEnd;

    let waveAmplitude = 0;
    if (scrollProgress < 0.7) waveAmplitude = (scrollProgress / 0.7) * 35;
    else if (scrollProgress < 1.0) waveAmplitude = 35 + ((scrollProgress - 0.7) / 0.3) * 15;
    else if (scrollProgress < 1.5) waveAmplitude = 50;
    else if (scrollProgress < 2.0) waveAmplitude = 50 * (1 - (scrollProgress - 1.5) / 0.5);
    else if (scrollProgress < 2.8) waveAmplitude = 0;
    else if (scrollProgress < 4.0) waveAmplitude = Math.sin(((scrollProgress - 2.8) / 1.2) * Math.PI) * 50;
    else waveAmplitude = 0;

    const renderWaveLetters = (text, fontFamily, fontSize) => {
      const letters = text.split('');
      return letters.map((letter, index) => {
        const frequency = 0.5;
        const waveOffset = Math.sin(index * frequency + scrollProgress * Math.PI * 2) * waveAmplitude;
        return (
          <AnimatedLetter
            key={index}
            style={{
              transform: `translateY(${waveOffset}px)`,
              fontFamily: fontFamily,
              fontSize: fontSize,
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </AnimatedLetter>
        );
      });
    };

    const firstOpacity = 1 - crossfadeProgress;

    return (
      <React.Fragment>
        {/* Intro Text */}
        {showFirst && (
          <CenteredTextWrapper style={{ opacity: firstOpacity, position: 'absolute' }}>
            {renderWaveLetters(text1, "'Space Mono', monospace", '24px')}
          </CenteredTextWrapper>
        )}

        {/* Slide 1 */}
        {showSlide1 && (
          <div style={{
            position: 'absolute', maxWidth: '2000px', textAlign: 'center', color: '#000000',
            opacity: slide1Opacity, pointerEvents: 'none'
          }}>
            <h2 style={{
              fontFamily: 'DM Serif Display', fontSize: '45px', fontWeight: 700, margin: '0 auto 1rem',
              letterSpacing: '2px', opacity: title1Opacity, transition: 'opacity 0.1s linear',
              transform: 'translateY(-22px)'
            }}>
              {titleText1}
            </h2>
            <p style={{
              fontFamily: "'Space Mono', monospace", fontSize: '24px', lineHeight: '1.4',
              fontWeight: 200, margin: 0, opacity: Math.min(crossfadeProgress, 1),
              transform: 'translateY(-22px)'
            }}>
              {renderWaveLetters(text2, "'Space Mono', monospace", '24px')}
            </p>
          </div>
        )}

        {/* Slide 2 */}
        {showSlide2 && (
          <div style={{
            position: 'absolute', maxWidth: '2000px', textAlign: 'center', color: '#000000',
            opacity: slide2Opacity
          }}>
            <h2 style={{
              fontFamily: 'DM Serif Display', fontSize: '34px', fontWeight: 700, margin: '0 auto 1rem',
              letterSpacing: '0px', opacity: 0, pointerEvents: 'none', visibility: 'hidden'
            }}>
              {titleText1}
            </h2>
            <p style={{
              fontFamily: "'Space Mono', monospace", fontSize: '24px', lineHeight: '1.4',
              fontWeight: 200, margin: 0
            }}>
              {renderWaveLetters(text3, "'Space Mono', monospace", '24px')}
            </p>
            <h2 style={{
              fontFamily: 'Panchang', fontSize: '34px', fontWeight: 700, margin: '1rem auto 0',
              letterSpacing: '0px', opacity: title2Opacity, transition: 'opacity 0.1s linear'
            }}>
              {titleText2}
            </h2>
          </div>
        )}

        {/* --- EXPLANATION SLIDE (THE FIXED PART) --- */}
        {showExplanation && (
          <div style={{
            position: 'absolute', width: '100%', maxWidth: '771px', textAlign: 'center', color: '#150101',
            opacity: explanationOpacity, padding: '0 20px', pointerEvents: 'auto',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10rem'
          }}>

            {/* Volume Section */}
            <div>
              <DesignText>
                use the volume control to hear the wave during the relevent parts
              </DesignText>
              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                <Volume
                  currentVolume={this.state.audioVolume}
                  isMuted={this.state.audioMuted}
                  onAdjustVolume={this.handleUpdateAudioVolume}
                  onToggleMute={this.handleToggleMuteAudio}
                  isInverted={false}
                />
              </div>
            </div>

            {/* Slider Section */}
            <div>
              <DesignText>
                the sliders help you control the wave using different parameters
              </DesignText>
              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                <Slider
                  min={0}
                  max={100}
                  value={this.state.dummySliderValue}
                  onChange={this.handleDummySliderChange}
                />
              </div>
            </div>

            {/* Scroll Section */}
            <div>
              <DesignText>
                click on the scroll bar to see the timeline and jump to different episodes
              </DesignText>
            </div>

          </div>
        )}
      </React.Fragment>
    );
  }

  render() {
    const { scrollProgress } = this.state;
    const blackFadeStart = 7.0;
    const blackFadeEnd = 7.4;
    const blackOpacity = Math.max(0, Math.min((scrollProgress - blackFadeStart) / (blackFadeEnd - blackFadeStart), 1));

    return (
      <PageWrapper>
        {/* Added the ScrollMenu with items={[]} as requested */}
        <ScrollMenu variant="intro" items={[]} />

        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#ffffff', opacity: blackOpacity, pointerEvents: 'none', zIndex: 2000
        }} />
        <CenteredSection>
          {this.renderWaveText()}
        </CenteredSection>
      </PageWrapper>
    );
  }
}

// --- STYLES ---

const PageWrapper = styled.div`
  min-height: 1200vh;
`;

const CenteredSection = styled.section`
  position: fixed; top: 0; left: 0; right: 0; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  text-align: center; padding: 2rem; width: 100%; pointer-events: none;
`;

const CenteredTextWrapper = styled.p`
  font-family: 'Space Mono', monospace; font-size: 20px; line-height: 1.6;
  color: #000; width: 100%; display: inline;
`;

const AnimatedLetter = styled.span`
  display: inline-block; will-change: transform, opacity; transition: letter-spacing 0.1s ease-out;
`;

// New Text Style matching your Figma "Space Grotesk" 20px
const DesignText = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 20px;
  line-height: normal;
  color: #150101;
  margin: 0;
`;

class Slider extends Component<Props> {
  static defaultProps = {
    label: null,
  };

  render() {
    const { label, isInverted = false, min = 0, max = 100, value = 0, onChange, ...delegatedProps } = this.props;
    const range = max - min;
    const percentage = ((value - min) / range) * 100;

    return (
      <SliderContainer>
        {label && <Label isInverted={isInverted}>{label}</Label>}

        <TrackContainer>
          <EndCap isInverted={isInverted} />
          <Track isInverted={isInverted}>
            <Handle
              isInverted={isInverted}
              style={{ left: `${percentage}%` }}
            />
          </Track>
          <EndCap isInverted={isInverted} />
          <SliderOverlay>
            <RcSlider
              min={min}
              max={max}
              value={value}
              onChange={onChange}
              {...delegatedProps}
            />
          </SliderOverlay>
        </TrackContainer>
      </SliderContainer>
    );
  }
}

const SliderContainer = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-left: 3px;
  margin-right: 0;

  &:last-child {
    margin-right: 0;
  }
`;

const Label = styled.div`
  font-family: 'Space Grotesk', sans-serif; 
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
  color: ${props => props.isInverted ? '#fff' : '#000'};
  transition: color 800ms ease-in-out;
`;

const TrackContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 290px;
  height: 30px;
`;

const EndCap = styled.div`
  width: 2px;
  height: 16px;
  background-color: ${props => props.isInverted ? '#fff' : '#000'};
  transition: background-color 800ms ease-in-out;
  flex-shrink: 0;
`;

const Track = styled.div`
  position: relative;
  flex: 1;
  height: 2px;
  background-color: ${props => props.isInverted ? '#fff' : '#000'};
  transition: background-color 800ms ease-in-out;
`;

const Handle = styled.div`
  position: absolute;
  width: 14px;
  height: 20px;
  transform: translate(-50%, -50%);
  background-color: ${props => props.isInverted ? '#000000' : '#fff'};
  border: 2px solid ${props => props.isInverted ? '#fff' : '#000'};
  border-radius: 0;
  padding: 0;
  pointer-events: none;
  transition: background-color 800ms ease-in-out, border-color 800ms ease-in-out;
`;

const SliderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 10; 

  .rc-slider {
    height: 100%;
    padding: 0;
  }
  .rc-slider-rail, .rc-slider-track {
    background: transparent;
    height: 100%;
  }
  .rc-slider-handle {
    background: transparent;
    border: none;
    cursor: pointer;
    width: 20px;
    height: 100%;
    margin-top: 0;
    top: 0;
  }
`;


class Volume extends PureComponent<Props> {
  static defaultProps = {
    blockSize: 12,
    steps: 8,
    isMuted: false,
  };

  render() {
    const { blockSize, currentVolume, steps, isMuted, isInverted } = this.props;

    return (
      <Wrapper>
        <VolumeBlocks>
          {range(1, steps).map(index => {
            const volumeLevel = index / steps;
            const isFilled = volumeLevel <= currentVolume && !isMuted;

            return (
              <VolumeBlock
                key={index}
                size={blockSize}
                onClick={() => this.props.onAdjustVolume(volumeLevel)}
                isInverted={isInverted}
                isFilled={isFilled}
              />
            );
          })}
        </VolumeBlocks>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  touch-action: none;
`;

const VolumeBlocks = styled.div`
  display: flex;
  gap: 4px;
`;

const VolumeBlock = styled.button`
  position: relative;
  width: 14px;
  height: 20px;
  border: 2px solid ${props => props.isInverted ? '#fff' : '#000'};
  background-color: ${props => {
    if (props.isFilled) return props.isInverted ? '#fff' : '#000';
    return 'transparent';
  }};
  padding: 0;
  outline: none;
  cursor: pointer;
  transition: background-color 150ms ease;
`;

// --- SCROLL MENU COMPONENTS ---

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
`;

const ScrollHandle = styled.div`
  position: fixed;
  /* Open: Push left by panel width. Closed: Stick to right edge (margin 10px) */
  right: ${props => props.isOpen ? `${props.isIntro ? '160px' : '180px'}` : '10px'};
  top: ${props => props.top}px;
  width: 20px;
  height: 60px;
  background-color: ${props => props.isInverted ? '#FFFFFF' : (props.isIntro ? '#000000' : '#FFFFFF')};
  border-right: none;
  cursor: pointer !important;
  pointer-events: auto;
  transition: top 0.1s ease-out, right 0.3s ease-in-out, background-color 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const MenuPanel = styled.div`
  position: fixed;
  top: ${props => props.top}px;
  /* Open: 0 (visible). Closed: -150px (hidden to the right) */
  right: ${props => props.isOpen ? '0' : `${props.isIntro ? '-150px' : '-190px'}`};
  width: ${props => props.isIntro ? '150px' : '190px'};
  height: 112px; /* Matched to Figma Image 75 */
  background-color: ${props => props.isInverted ? '#FFFFFF' : (props.isIntro ? '#000000' : '#FFFFFF')};
  border-right: none;
  transition: right 0.3s ease-in-out, top 0.1s ease-out, background-color 0.3s ease;
  pointer-events: auto;
  padding: 20px;
  box-sizing: border-box;
  cursor: default !important;
  display: flex;
  flex-direction: column;
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// --- LOCALLY DEFINED SCROLLMENU ---
class ScrollMenu extends Component {
  state = {
    isOpen: false,
    isDragging: false,
  };

  toggleMenu = () => {
    this.setState(prev => ({ isOpen: !prev.isOpen }));
  };

  render() {
    const { variant } = this.props;
    const { isOpen } = this.state;
    const isIntro = variant === 'intro';

    // Position fixed at 74px top to match design
    const topPosition = 74;

    return (
      <Container>
        <MenuPanel isOpen={isOpen} isIntro={isIntro} top={topPosition}>
          <MenuContent>
            {/* Content is empty as requested, items=[] */}
          </MenuContent>
        </MenuPanel>

        <ScrollHandle
          isOpen={isOpen}
          isIntro={isIntro}
          top={topPosition}
          onClick={this.toggleMenu}
        />
      </Container>
    );
  }
}

export default withRouter(SpectralDecomposition);