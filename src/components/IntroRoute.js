// @flow
import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import { FONTS, LAYOUT, CONTROLS, TRANSITIONS, Z_INDEX } from '../constants';
import { debounce } from '../utils';
import { getWaveforms } from '../helpers/waveform.helpers';
import { getApproximateWindowHeight } from '../helpers/responsive.helpers';

import WaveformPlayer from './WaveformPlayer';
import IntroRouteWaveformWrapper from './IntroRouteWaveformWrapper';
import IntroRouteWaveform from './IntroRouteWaveform';
import IntroRouteWaveformAddition from './IntroRouteWaveformAddition';

import AudioOutput from './AudioOutput';
import Oscillator from './Oscillator';
import IntroRouteSection from './IntroRouteSection';

import VolumeAdjuster from './VolumeAdjuster';
import FadeTransition from './FadeTransition';
import WaveformControls from './WaveformControls';
import ScrollMenu from './ScrollMenu';
import ExampleDetailsColumn from './ExampleDetailsColumn';

import { steps, stepsArray, INTRO_STEPS } from './IntroRoute.steps';
import { getActiveSectionInWindow } from './IntroRoute.helpers';

import type { HarmonicsForShape } from '../types';
import type { IntroStep } from './IntroRoute.steps';


// At what point from the top should the active step switch?
const ACTIVE_STEP_ROLLOVER_RATIO = 0.45;

// Minimum intersection ratio required before switching step from intersection.
// Prevents fast scroll from briefly activating sections that only nicked the viewport.
const MIN_INTERSECTION_RATIO = 0.25;

// Debounce (ms) before committing intersection-based step change. Ensures we only
// switch after scroll has settled, avoiding rapid step flips during fast scroll.
const INTERSECT_DEBOUNCE_MS = 100;

// Mapping of steps to their example arrays (for scrolling through examples)
const STEP_TO_EXAMPLES = {
  'sound-decomposition-in-nature': ['ocean-in-a-seashell', 'blowing-over-a-bottle'],
  'waves-beyond-sound': ['ripples-in-a-pond', 'radio-wifi-tuners', 'thermal-imaging'],
  'light-decomposition': ['rainbows', 'cds-dvds', 'soap-bubbles'],
  'light-decomposition-nature': ['oil-slicks', 'opals', 'ice-halos'],
  'fourier-in-technology': ['active-sonar', 'seismographs', 'shazam'],
};

const STEP_TO_SCROLL_EXAMPLE = {
  'sound-decomposition-in-nature': 'ocean-in-a-seashell',
  'waves-beyond-sound': 'ripples-in-a-pond',
  'light-decomposition': 'rainbows',
  'fourier-in-technology': 'active-sonar',
};

// Get ALL examples up to and including the current step
const getAllExamplesUpToStep = (currentStep: string): Array<string> => {
  const invertedSteps = ['sound-decomposition-in-nature', 'waves-beyond-sound', 'light-decomposition', 'light-decomposition-nature', 'fourier-in-technology'];
  const currentIndex = invertedSteps.indexOf(currentStep);

  if (currentIndex === -1) return [];

  let allExamples: Array<string> = [];
  for (let i = 0; i <= currentIndex; i++) {
    const stepExamples = STEP_TO_EXAMPLES[invertedSteps[i]];
    if (stepExamples) {
      allExamples = allExamples.concat(stepExamples);
    }
  }
  return allExamples;
};

type Props = {
  history: { push: (path: string) => void },
};
type State = {
  currentStep: IntroStep,
  windowHeight: number,
  heroScrollProgress: number,
  globalScrollProgress: number,

  // Waveform data
  amplitude: number,
  frequency: number,

  // Waveform addition data
  harmonicsForShape: HarmonicsForShape,
  numOfHarmonics: number,
  convergence: number,
  phase: number,

  // Audio data
  audioVolume: number,
  audioMuted: boolean,
  audioEnabled: boolean,

  // Theme inversion
  isInverted: boolean,
};

class IntroRoute extends PureComponent<Props, State> {
  state = {
    currentStep: INTRO_STEPS[0],
    windowHeight: getApproximateWindowHeight(),
    globalScrollProgress: 0,
    amplitude: 1,
    frequency: 1,
    harmonicsForShape: 'square',
    numOfHarmonics: 2,
    convergence: 0,
    phase: 0,
    voicePattern: 'ah',
    audioVolume: 0.5,
    audioMuted: true,
    audioEnabled: false,
    isInverted: false,
  };

  sectionRefs: Array<HTMLElement> = [];
  heroRef: ?HTMLElement = null;
  scrollTicking: boolean = false;
  exitScrollTimeout: ?TimeoutID = null;
  menuScrollTimeout: ?TimeoutID = null;
  intersectDebounceTimeout: ?TimeoutID = null;
  pendingIntersectStep: ?IntroStep = null;

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('scroll', this.handleGlobalScroll);
    window.addEventListener('keydown', this.handleKeydown);

    // Initial global scroll calculation
    this.handleGlobalScroll();

    const scrollToStep = this.props.location.state && this.props.location.state.scrollToStep;
    const stepIndex = scrollToStep ? INTRO_STEPS.indexOf(scrollToStep) : -1;

    if (stepIndex !== -1) {
      // Coming from ending menu: set current step and scroll to that section after refs are ready
      this.setState({ currentStep: scrollToStep });
      const prevBehavior = document.documentElement.style.scrollBehavior;
      try {
        document.documentElement.style.scrollBehavior = 'auto';
        setTimeout(() => {
          this.handleScrollToStep(scrollToStep);
        }, 0);
      } catch (e) {
        // ignore
      } finally {
        document.documentElement.style.scrollBehavior = prevBehavior;
      }
    } else {
      // Coming from spectral decomp or direct load: always reach the top of the intro route
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      const prevBehavior = document.documentElement.style.scrollBehavior;
      const prevSnap = document.documentElement.style.scrollSnapType;
      try {
        document.documentElement.style.scrollBehavior = 'auto';
        document.documentElement.style.scrollSnapType = 'none';
        window.scrollTo(0, 0);
      } catch (e) {
        // ignore
      } finally {
        document.documentElement.style.scrollBehavior = prevBehavior;
        document.documentElement.style.scrollSnapType = prevSnap;
      }
      // Re-apply scroll to top after layout and after spectral decomp's 100ms snap re-enable
      const scrollToTopAgain = () => {
        document.documentElement.style.scrollBehavior = 'auto';
        document.documentElement.style.scrollSnapType = 'none';
        window.scrollTo(0, 0);
        requestAnimationFrame(() => {
          document.documentElement.style.scrollSnapType = '';
          document.documentElement.style.scrollBehavior = '';
        });
      };
      requestAnimationFrame(() => {
        scrollToTopAgain();
        setTimeout(scrollToTopAgain, 120);
      });
    }
  }

  handleGlobalScroll = () => {
    if (this.scrollTicking) return;

    this.scrollTicking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      let globalScrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

      // "זיוף" גלילה: אם המשתמש עבר את ה-96% מהדף, אנחנו כבר נחשיב את זה כ-100%
      // זה מבטיח שהידית תיצמד למטה גם אם יש באגים של כמה פיקסלים בדפדפן
      const fakedThreshold = 0.96;
      if (globalScrollProgress > fakedThreshold) {
        globalScrollProgress = 1; // כאן אנחנו כופים 100%
      }

      this.setState({ globalScrollProgress });
      this.scrollTicking = false;
    });
  };

  inversionTimeout: ?TimeoutID = null;
  inversionLockUntil: number = 0;

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { currentStep } = this.state;
    const currentIndex = INTRO_STEPS.indexOf(currentStep);
    const invertedStartIndex = INTRO_STEPS.indexOf('sound-decomposition-in-nature');
    const shouldBeInverted = currentIndex >= invertedStartIndex;

    // Collect all state changes to batch them in a single setState
    const nextState: any = {};
    let needsUpdate = false;

    // Handle inversion changes
    if (shouldBeInverted !== this.state.isInverted) {
      const now = Date.now();
      if (now >= this.inversionLockUntil) {
        if (this.inversionTimeout) clearTimeout(this.inversionTimeout);

        this.inversionTimeout = setTimeout(() => {
          const currentIdx = INTRO_STEPS.indexOf(this.state.currentStep);
          const stillShouldBeInverted = currentIdx >= invertedStartIndex;

          if (stillShouldBeInverted && !this.state.isInverted) {
            document.body.classList.add('inverted');
            this.setState({ isInverted: true });
            this.inversionLockUntil = Date.now() + 800;
          } else if (!stillShouldBeInverted && this.state.isInverted) {
            document.body.classList.remove('inverted');
            this.setState({ isInverted: false });
            this.inversionLockUntil = Date.now() + 800;
          }
        }, 150);
      }
    }

    // Handle step changes
    if (this.state.currentStep !== prevState.currentStep) {
      const stepData = steps[this.state.currentStep];
      const overrideableFields = [
        'frequency',
        'amplitude',
        'harmonicsForShape',
        'numOfHarmonics',
        'convergence',
        'phase',
        'audioVolume',
      ];

      overrideableFields.forEach(field => {
        const fieldOverride = `${field}Override`;
        if (stepData[fieldOverride] != null) {
          nextState[field] = stepData[fieldOverride];
          needsUpdate = true;
        }
      });

      // When entering the fourier exit step, wait for the slide-to-center
      // animation to finish, then navigate to the ending route.
      // Skip if a menu-initiated scroll is in progress to avoid interrupting it.
      if (this.state.currentStep === 'fourier-in-technology-exit' && !this.menuScrollTimeout) {
        if (this.exitScrollTimeout) clearTimeout(this.exitScrollTimeout);

        this.exitScrollTimeout = setTimeout(() => {
          // Disable scroll restoration before navigation
          if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
          }
          
          // Navigate to the ending route
          const html = document.documentElement;
          html.style.scrollSnapType = 'none';
          html.style.scrollBehavior = 'auto';
          
          // Ensure we're at top before navigating
          window.scrollTo(0, 0);
          
          this.props.history.push('/ending');
        }, 1800);
      }
    }

    if (needsUpdate) {
      this.setState(nextState);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('scroll', this.handleGlobalScroll);
    if (this.inversionTimeout) clearTimeout(this.inversionTimeout);
    if (this.exitScrollTimeout) clearTimeout(this.exitScrollTimeout);
    if (this.menuScrollTimeout) clearTimeout(this.menuScrollTimeout);
    if (this.intersectDebounceTimeout) clearTimeout(this.intersectDebounceTimeout);
    document.documentElement.style.scrollSnapType = '';
  }

  handleUpdateField = (field: string) => (val: any) => {
    this.setState({ [field]: val }, () => {
      if (field === 'amplitude') {
        window.dispatchEvent(new CustomEvent('amplitudeChange', {
          detail: { amplitude: val }
        }));
      }
    });
  };

  handleUpdateAmplitude = this.handleUpdateField('amplitude');
  handleUpdateFrequency = this.handleUpdateField('frequency');
  handleUpdateHarmonicsForShape = this.handleUpdateField('harmonicsForShape');

  handleScrollTo = (progress: number) => {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const targetScroll = progress * maxScroll;
    window.scrollTo(0, targetScroll);
  };

  handleScrollToStep = (stepId: string) => {
    const stepIndex = INTRO_STEPS.indexOf(stepId);
    if (stepIndex !== -1 && this.sectionRefs[stepIndex]) {
      // Prevent exit-step auto-scrolls from interrupting this navigation
      if (this.exitScrollTimeout) clearTimeout(this.exitScrollTimeout);
      if (this.menuScrollTimeout) clearTimeout(this.menuScrollTimeout);
      this.menuScrollTimeout = setTimeout(() => {
        this.menuScrollTimeout = null;
      }, 2000);

      const sectionEl = this.sectionRefs[stepIndex];
      const sectionTop = sectionEl.getBoundingClientRect().top + window.scrollY;
      const offset = 100;
      window.scrollTo({
        top: sectionTop - offset,
        behavior: 'smooth'
      });
    }
  };

  handleUpdateNumOfHarmonics = this.handleUpdateField('numOfHarmonics');
  handleUpdateConvergence = this.handleUpdateField('convergence');
  handleUpdatePhase = this.handleUpdateField('phase');

  handleVoicePatternChange = (voicePattern) => {
    this.setState({ voicePattern });
  };

  handleUpdateAudioVolume = (audioVolume: number) => {
    this.setState({ audioVolume, audioMuted: false, audioEnabled: true });
  };

  handleToggleMuteAudio = () => {
    this.setState({ audioMuted: !this.state.audioMuted, audioEnabled: true });
  };

  handleKeydown = (ev: SyntheticKeyboardEvent<*>) => {
    const { keyCode } = ev;
    const key = String.fromCharCode(keyCode);
    const isNumber = !isNaN(Number(key));

    if (isNumber) {
      this.handleUpdateAudioVolume(key / 10);
    } else if (key === 'M') {
      this.handleToggleMuteAudio();
    }
  };

  handleResize = debounce(() => {
    this.setState({ windowHeight: getApproximateWindowHeight() });
  }, 500);

  handleScroll = debounce(() => {
    const activeSection = getActiveSectionInWindow(
      this.sectionRefs,
      ACTIVE_STEP_ROLLOVER_RATIO
    );
    if (!activeSection) return;

    if (activeSection !== this.state.currentStep) {
      this.setState({ currentStep: activeSection });
    }
  }, 100);

  handleIntersect = (id: IntroStep, entry: IntersectionObserverEntry) => {
    // Ignore sections that only barely entered the viewport (fast scroll glitch).
    const ratio = entry && typeof entry.intersectionRatio === 'number' ? entry.intersectionRatio : 1;
    if (ratio < MIN_INTERSECTION_RATIO) return;

    const intersectStepIndex = INTRO_STEPS.indexOf(id);
    const direction = id === this.state.currentStep ? 'backwards' : 'forwards';
    const nextStep = direction === 'forwards'
      ? INTRO_STEPS[intersectStepIndex]
      : INTRO_STEPS[intersectStepIndex - 1];

    if (!nextStep) return;

    // Debounce: commit to this step only after scroll has settled, so fast scroll
    // doesn't flip through multiple steps and trigger wrong waveform/video playback.
    this.pendingIntersectStep = nextStep;
    if (this.intersectDebounceTimeout) clearTimeout(this.intersectDebounceTimeout);
    this.intersectDebounceTimeout = setTimeout(() => {
      if (this.pendingIntersectStep != null) {
        this.setState({ currentStep: this.pendingIntersectStep });
        this.pendingIntersectStep = null;
      }
      this.intersectDebounceTimeout = null;
    }, INTERSECT_DEBOUNCE_MS);
  };

  renderAudio() {
    const { currentStep, amplitude, frequency, phase, harmonicsForShape, numOfHarmonics, audioVolume, audioMuted, audioEnabled } = this.state;

    if (!audioEnabled) return null;

    const stepData = steps[currentStep];
    const effectiveAudioVolume = (audioMuted ? 0 : audioVolume) * 0.5;
    const adjustedAudibleFrequency = frequency * 130.81;

    return (
      <AudioOutput masterVolume={effectiveAudioVolume}>
        {(audioCtx, masterOut) =>
          stepData.useWaveformAddition ? (
            getWaveforms({
              type: stepData.waveformAdditionType,
              baseFrequency: adjustedAudibleFrequency,
              baseAmplitude: amplitude,
              harmonicsForShape,
              phase,
              numOfHarmonics,
            })
              .filter(({ frequency }) => frequency < 20000)
              .map(({ frequency, amplitude, offset }, index, waveforms) => {
                if (stepData.waveformAdditionType === 'phase') {
                  const waveformWithOffset = waveforms[0];
                  const { offset } = waveformWithOffset;
                  const absoluteOffset = Math.abs(50 - offset) * 2 / 100;
                  amplitude *= absoluteOffset;
                }
                return (
                  <Oscillator key={index} shape="sine" amplitude={amplitude} frequency={frequency} audioCtx={audioCtx} masterOut={masterOut} />
                );
              })
          ) : (
            <Oscillator key="base-frequency" slidePitch shape={stepData.waveformShape} amplitude={amplitude} frequency={adjustedAudibleFrequency} audioCtx={audioCtx} masterOut={masterOut} />
          )
        }
      </AudioOutput>
    );
  }

  renderVolumeControl(isNarrowed) {
    const { currentStep, audioVolume, audioMuted, isInverted } = this.state;
    const stepData = steps[currentStep];

    return (
      <VolumeAdjusterLayer isNarrowed={isNarrowed}>
        <FadeTransition isVisible={stepData.showVolumeControls}>
          <VolumeAdjusterWrapper>
            <VolumeAdjuster
              currentVolume={audioVolume}
              isMuted={audioMuted}
              onAdjustVolume={this.handleUpdateAudioVolume}
              onToggleMute={this.handleToggleMuteAudio}
              isInverted={isInverted}
            />
          </VolumeAdjusterWrapper>
        </FadeTransition>
      </VolumeAdjusterLayer>
    );
  }

  renderWaveformColumn(amplitude: number, frequency: number, convergence: number, phase: number, progress: number) {
    const { currentStep, harmonicsForShape, numOfHarmonics, voicePattern, isInverted } = this.state;

    const originalStepData = steps[currentStep];

    const isNarrowed = isInverted || originalStepData.narrowWaveform || originalStepData.platesNarrow;
    const isExtraNarrowed = originalStepData.narrowWaveform && !isInverted;
    const isPlatesNarrow = originalStepData.platesNarrow && !isInverted;
    const isSlideOut = originalStepData.slideOutWaveform;
    const isCentered = originalStepData.centerWaveform;

    return (
      <WaveformColumn isVisible={originalStepData.showWaveform} isNarrowed={isNarrowed} isExtraNarrowed={isExtraNarrowed} isPlatesNarrow={isPlatesNarrow}>
        <IntroRouteWaveformWrapper isInverted={isInverted}>
          {(width: number) => (
            <FlexParent>
              <WaveformWrapper isNarrowed={isNarrowed} isSlideOut={isSlideOut} isCentered={isCentered}>
                {!originalStepData.useWaveformAddition && (
                  <IntroRouteWaveform
                    width={width}
                    amplitude={amplitude}
                    frequency={frequency}
                    progress={progress}
                    stepData={originalStepData}
                    isInverted={isInverted}
                  />
                )}

                {originalStepData.useWaveformAddition && (
                  <IntroRouteWaveformAddition
                    type={originalStepData.waveformAdditionType}
                    width={width}
                    stepData={originalStepData}
                    baseAmplitude={amplitude}
                    baseFrequency={frequency}
                    harmonicsForShape={harmonicsForShape}
                    numOfHarmonics={numOfHarmonics}
                    convergence={convergence}
                    phase={phase}
                    progress={progress}
                    voicePattern={voicePattern}
                    isInverted={isInverted}
                    secondaryWaveformColor={originalStepData.secondaryWaveformColor}
                  />
                )}
              </WaveformWrapper>

              <SlidersRow isNarrowed={isNarrowed} isSlideOut={isSlideOut}>
                <WaveformControls
                  key={currentStep}
                  width={width}
                  amplitude={amplitude}
                  frequency={frequency}
                  numOfHarmonics={numOfHarmonics}
                  convergence={convergence}
                  phase={phase}
                  voicePattern={voicePattern}
                  handleUpdateAmplitude={this.handleUpdateAmplitude}
                  handleUpdateFrequency={this.handleUpdateFrequency}
                  handleUpdateNumOfHarmonics={this.handleUpdateNumOfHarmonics}
                  handleUpdateConvergence={this.handleUpdateConvergence}
                  handleUpdatePhase={this.handleUpdatePhase}
                  onVoicePatternChange={this.handleVoicePatternChange}
                  stepData={originalStepData}
                  isInverted={isInverted}
                  demoAnimation={true}
                />
              </SlidersRow>

              {this.renderVolumeControl(isNarrowed)}
            </FlexParent>
          )}
        </IntroRouteWaveformWrapper>
      </WaveformColumn>
    );
  }

  renderTutorialColumn(amplitude: number, frequency: number, progress: number) {
    const { currentStep, windowHeight, isInverted, voicePattern } = this.state;
    const stepData = steps[currentStep];
    const isNarrowed = isInverted;
    const isExpanded = (stepData.narrowWaveform || stepData.platesNarrow) && !isInverted;
    const isSlideOut = stepData.slideOutWaveform;

    return (
      <TutorialColumn
        isInverted={isInverted}
        isNarrowed={isNarrowed}
        isExpanded={isExpanded}
        isSlideOut={isSlideOut}
      >
        <StickyFadeContainer>
          <WhiteFadeLayer isInverted={isInverted} />
          <BlackFadeLayer isInverted={isInverted} />
        </StickyFadeContainer>

        {stepsArray.map((section, index) => (
          <IntroRouteSection
            key={section.id}
            id={section.id}
            currentStep={currentStep}
            margin={section.getMargin(windowHeight)}
            onIntersect={this.handleIntersect}
            rolloverRatio={ACTIVE_STEP_ROLLOVER_RATIO}
            innerRef={elem => (this.sectionRefs[index] = elem)}
            isInverted={isInverted}
            disableSnap={section.isEnding}
            scrollSnapMarginTop={section.scrollSnapMarginTop}
            scrollSnapAlign={section.scrollSnapAlign}
          >
            {typeof section.children === 'function'
              ? section.children({
                amplitude,
                frequency,
                progress,
                currentStep,
                voicePattern,
              })
              : section.children}
          </IntroRouteSection>
        ))}
      </TutorialColumn>
    );
  }

  render() {
    const {
      currentStep,
      amplitude,
      frequency,
      convergence,
      phase,
      globalScrollProgress,
      isInverted,
    } = this.state;

    const stepData = steps[currentStep];
    const targetExampleId = STEP_TO_SCROLL_EXAMPLE[currentStep];

    return (
      <Fragment>
        <ScrollMenu
          variant="intro"
          scrollProgress={globalScrollProgress}
          onScrollTo={this.handleScrollTo}
          onScrollToStep={this.handleScrollToStep}
          isInverted={isInverted}
          currentStep={currentStep}
        />

        <PageBackground isInverted={isInverted}>
          <FullWidthWrapper>
            {this.renderAudio()}

            {stepData.tldr && (
              <TldrContainer>
                <TypewriterTldr text={stepData.tldr} key={currentStep} isInverted={isInverted} />
              </TldrContainer>
            )}

            <WaveformPlayer
              isPlaying={stepData.isPlaying}
              amplitude={amplitude}
              frequency={frequency}
              convergence={convergence}
              phase={phase}
            >
              {({ amplitude, frequency, convergence, phase, progress }) => (
                <MainContent>
                  {this.renderWaveformColumn(amplitude, frequency, convergence, phase, progress)}
                  {this.renderTutorialColumn(amplitude, frequency, progress)}
                </MainContent>
              )}
            </WaveformPlayer>
          </FullWidthWrapper>
        </PageBackground>

        <ExampleDetailsColumn
          isInverted={isInverted}
          availableExamples={getAllExamplesUpToStep(currentStep)}
          targetExampleId={targetExampleId}
        />

      </Fragment>
    );
  }
}


const VolumeAdjusterLayer = styled.div`
  z-index: ${Z_INDEX.volume};
  position: fixed;
  bottom: ${CONTROLS.volume.position.bottom};
  left: ${CONTROLS.volume.position.left};
  pointer-events: none;
  & > * { pointer-events: auto; }
`;

const VolumeAdjusterWrapper = styled.div`
  background: transparent;
  padding: 0;
`;

const FullWidthWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-left: ${LAYOUT.pagePadding.horizontal};
  padding-right: ${LAYOUT.pagePadding.horizontal};
  @media (max-width: 768px) {
    padding-left: ${LAYOUT.pagePadding.horizontalMobile};
    padding-right: ${LAYOUT.pagePadding.horizontalMobile};
  }
`;

const PageBackground = styled.div`
  background-color: ${props => props.isInverted ? '#000000' : '#ffffff'};
  transition: background-color ${TRANSITIONS.theme};
  min-height: 100vh;
  will-change: background-color;
`;

const MainContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
`;

const WaveformColumn = styled.div`
  flex: ${props => {
    if (props.isPlatesNarrow) return LAYOUT.waveformColumn.platesNarrow.flex;
    if (props.isExtraNarrowed) return LAYOUT.waveformColumn.extraNarrowed.flex;
    if (props.isNarrowed) return LAYOUT.waveformColumn.narrowed.flex;
    return LAYOUT.waveformColumn.normal.flex;
  }};
  max-width: ${props => {
    if (props.isPlatesNarrow) return LAYOUT.waveformColumn.platesNarrow.maxWidth;
    if (props.isExtraNarrowed) return LAYOUT.waveformColumn.extraNarrowed.maxWidth;
    if (props.isNarrowed) return LAYOUT.waveformColumn.narrowed.maxWidth;
    return LAYOUT.waveformColumn.normal.maxWidth;
  }};
  min-width: 0;
  transition: flex ${TRANSITIONS.layout}, max-width ${TRANSITIONS.layout}, margin-right ${TRANSITIONS.layout};
  will-change: flex, max-width, margin-right;

  @media (orientation: landscape) {
    margin-right: ${props => (props.isExtraNarrowed || props.isPlatesNarrow)
    ? LAYOUT.columnGutterExtraNarrowed / 2 + 'px'
    : LAYOUT.columnGutter / 2 + 'px'};
  }
`;

const FlexParent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const WaveformWrapper = styled.div`
  position: fixed;
  z-index: ${Z_INDEX.waveform};
  will-change: left, right, top, width, height, opacity, transform;
  transition: all 0.8s ease-in-out;

  ${props => props.isCentered ? `
    /* CENTERED STATE: Waveform sliding to center before ending */
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    transform: translate(-50%, -50%);
    width: 70vw;
    max-width: 900px;
    opacity: 1;
  ` : `
    /* NORMAL STATE */
    bottom: ${LAYOUT.waveformWrapper.bottom};
    left: ${props.isSlideOut ? LAYOUT.waveformWrapper.leftSlideOut : LAYOUT.waveformWrapper.left};
    right: ${props.isNarrowed ? LAYOUT.waveformWrapper.rightNarrowed : LAYOUT.waveformWrapper.rightNormal};
    transform: translateY(0);
    opacity: 1;
  `}
`;

const SlidersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${CONTROLS.slider.gap};
  position: fixed;
  bottom: ${CONTROLS.slider.position.bottom};
  left: ${props => props.isSlideOut ? '-100%' : CONTROLS.slider.position.left};
  right: ${props => props.isNarrowed ? CONTROLS.slider.position.rightNarrowed : CONTROLS.slider.position.rightNormal};
  z-index: ${Z_INDEX.sliders};
  transition: left ${TRANSITIONS.slideOut}, right ${TRANSITIONS.layout};
  will-change: left, right;
  overflow: hidden;
  @media (max-width: 768px) {
    left: ${props => props.isSlideOut ? '-100%' : LAYOUT.pagePadding.horizontalMobile};
    right: ${LAYOUT.pagePadding.horizontalMobile};
  }
`;

const TldrContainer = styled.div`
  position: sticky;
  top: ${LAYOUT.tldrContainer.top};
  z-index: ${Z_INDEX.tldr};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: color ${TRANSITIONS.theme};
`;

const TldrText = styled.p`
  font-family: ${FONTS.tldr.fontFamily};
  font-size: ${FONTS.tldr.fontSize};
  font-weight: ${FONTS.tldr.fontWeight};
  line-height: ${FONTS.tldr.lineHeight};
  color: ${props => props.isInverted ? '#ffffff' : '#000'};
  margin: 0;
  text-align: center;
  transition: color ${TRANSITIONS.theme};
  white-space: nowrap;
`;

class TypewriterTldr extends React.Component<{ text: string, isInverted?: boolean }, { displayedText: string, currentIndex: number }> {
  timeout: ?TimeoutID = null;
  state = { displayedText: '', currentIndex: 0 };
  componentDidMount() { this.typeNextChar(); }
  componentWillUnmount() { if (this.timeout) clearTimeout(this.timeout); }
  typeNextChar = () => {
    const { text } = this.props;
    const { currentIndex } = this.state;
    if (currentIndex < text.length) {
      this.setState({
        displayedText: text.slice(0, currentIndex + 1),
        currentIndex: currentIndex + 1,
      });
      this.timeout = setTimeout(this.typeNextChar, 15);
    }
  };
  render() {
    return <TldrText isInverted={this.props.isInverted}>{this.state.displayedText}</TldrText>;
  }
}

const TutorialColumn = styled.div`
  flex: ${props => props.isNarrowed ? 'none' : LAYOUT.tutorialColumn.normal.flex};
  width: ${props => props.isNarrowed ? LAYOUT.tutorialColumn.narrowed.width : 'auto'};
  max-width: ${props => {
    if (props.isNarrowed) return LAYOUT.tutorialColumn.narrowed.maxWidth;
    if (props.isExpanded) return '1500px';
    return LAYOUT.tutorialColumn.normal.maxWidth;
  }};
  margin-left: ${props => props.isNarrowed ? LAYOUT.tutorialColumn.narrowed.marginLeft : '0'};
  position: relative;
  transform: ${props => props.isSlideOut ? 'translateX(200%)' : 'translateX(0)'};
  transition: flex ${TRANSITIONS.layout}, max-width ${TRANSITIONS.layout}, width ${TRANSITIONS.layout}, margin-left ${TRANSITIONS.layout}, transform ${TRANSITIONS.slideOut};
  will-change: flex, max-width, width, margin-left, transform;
  @media (orientation: landscape) {
    margin-left: ${props => props.isNarrowed ? 'auto' : LAYOUT.tutorialColumn.normal.marginLeft};
  }
`;

const StickyFadeContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 200px;
  pointer-events: none;
  margin-bottom: -200px;
`;

const FadeLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 800ms ease-in-out;
  will-change: opacity;
`;

const WhiteFadeLayer = styled(FadeLayer)`
  background: linear-gradient(to bottom, #ffffff 15%, rgba(255,255,255,0) 100%);
  opacity: ${props => props.isInverted ? 0 : 1};
  transition: opacity ${props => props.isInverted ? '0ms' : '5000ms'} ease-in-out;
`;

const BlackFadeLayer = styled(FadeLayer)`
  background: linear-gradient(to bottom, #000000 15%, rgba(0,0,0,0) 100%);
  opacity: ${props => props.isInverted ? 1 : 0};
  transition: opacity ${props => props.isInverted ? '5000ms' : '0ms'} ease-in-out;
`;

export default withRouter(IntroRoute);