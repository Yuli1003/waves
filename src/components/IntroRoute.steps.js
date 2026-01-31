import React, { Fragment, Component } from 'react';
import styled from 'styled-components';

import { COLORS, DEFAULT_WAVEFORM_SHAPE, FONTS } from '../constants';

import Header from './Header';
import Paragraph from './Paragraph';
import SectionTitle from './SectionTitle';
import Heading from './Heading';
import WaveformEquation from './WaveformEquation';
import UnorderedList from './UnorderedList';
import FourierDrawingDemo from './FourierDrawingDemo';

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 30px;
  margin-bottom: 10px;

  &:hover .bw-image {
    opacity: 0;
  }
`;

const StyledImage = styled.img`
  width: 60%;
  height: auto;
  display: block;
  margin: 0 auto;
`;

const BwImage = styled(StyledImage)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  opacity: 1;
  transition: opacity 0.5s ease;
`;

const Caption = styled.p`
  font-family: ${FONTS.families.serifText};
  font-size: 17px;
  color: ${COLORS.black[700]};
  margin-top: 20px;
  line-height: 1.4;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 30px;
  margin-bottom: 10px;
`;

const StyledVideo = styled.video`
  width: 90%;
  height: auto;
  display: block;
  margin: 0 auto;
`;

// Controlled video component that plays/pauses based on shouldPlay prop
class ControlledVideo extends Component {
  videoRef = null;

  setVideoRef = (el) => {
    this.videoRef = el;
  };

  componentDidMount() {
    this.updatePlayback();
    // Pause video when page becomes hidden
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.shouldPlay !== this.props.shouldPlay) {
      this.updatePlayback();
    }
  }

  componentWillUnmount() {
    // Ensure video is paused when component unmounts
    if (this.videoRef) {
      this.videoRef.pause();
      this.videoRef.currentTime = 0;
    }
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  handleVisibilityChange = () => {
    if (document.hidden && this.videoRef) {
      this.videoRef.pause();
    } else if (!document.hidden && this.props.shouldPlay && this.videoRef) {
      this.videoRef.play().catch(() => { });
    }
  };

  updatePlayback = () => {
    const video = this.videoRef;
    if (!video) return;

    if (this.props.shouldPlay) {
      video.play().catch(() => {
        // Autoplay may be blocked, ignore the error
      });
    } else {
      video.pause();
      video.currentTime = 0; // Reset to beginning when stopping
    }
  };

  render() {
    const { src, shouldPlay, ...rest } = this.props;
    return (
      <StyledVideo
        innerRef={this.setVideoRef}
        src={src}
        loop
        playsInline
        {...rest}
      />
    );
  }
}

// Spacer to provide enough scrollable height for the exit step
// so the route transition to /ending can trigger
const ExitSpacer = styled.div`
  min-height: 100vh;
  width: 100%;
  pointer-events: none;
`;

// Custom wider section for resonance-frequency
const ResonanceSectionWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  padding-top: 20vh;
`;


export const INTRO_STEPS = [
  'title',
  'reading-waveform-graphs-intro',
  'x-axis-time',
  'y-axis-amplitude',
  'y-axis-amplitude-with-control',
  'frequency-introduction',
  'chladni-plates',

  'frequency-introduction-pt2',
  'frequency-with-control',
  'resonance-frequency',

  'additive-synthesis-intro',
  'additive-synthesis-draw-fourier',
  'additive-synthesis-basic-add',
  'additive-synthesis-intro-convergence',
  'additive-synthesis-intro-num-of-harmonics',
  'additive-synthesis-harmonics-tie-in',
  'additive-synthesis-phase',
  'additive-synthesis-noise-cancelling',
  'sound-decomposition-in-nature',
  'waves-beyond-sound',
  'light-decomposition',
  'light-decomposition-nature',
  'fourier-in-technology',
  'fourier-in-technology-exit',
];

const marginFunctions = {
  none: windowHeight => 0,
  xsmall: windowHeight => windowHeight * 0.15,
  small: windowHeight => windowHeight * 0.35,
  large: windowHeight => windowHeight * 0.45,
  xlarge: windowHeight => windowHeight * 0.7,
  huge: windowHeight => windowHeight * 1.0,
  massive: windowHeight => windowHeight * 2.0,
};

const defaults = {
  showWaveform: true,
  frequencyOverride: null,
  amplitudeOverride: null,
  audioVolumeOverride: null,
  isPlaying: false,
  waveformShape: DEFAULT_WAVEFORM_SHAPE,
  waveformColor: '#000000',
  secondaryWaveformColor: '#797979',
  waveformOpacity: 1,

  showXAxis: true,
  showYAxis: true,
  showXAxisLabels: false,
  showYAxisLabels: false,
  showYAxisIntercept: false,
  xAxisOpacity: 1,
  yAxisOpacity: 1,
  showAmplitudeSlider: false,
  showFrequencySlider: false,
  frequencySliderMin: 0.5,
  frequencySliderMax: 3,
  frequencySliderStep: 0.1,
  showCycleIndicator: false,
  showVolumeControls: true,

  useWaveformAddition: false,
  waveformAdditionType: 'harmonics',
  showNumOfHarmonicsSlider: false,
  showConvergenceSlider: false,
  showPhaseSlider: false,
  showVoicePatternToggle: false,

  getMargin: marginFunctions.large,
  scrollSnapMarginTop: '9vh',
  scrollSnapAlign: 'start',

  tldr: null,
  slideOutWaveform: false,
  centerWaveform: false,
  isEnding: false,
};

export const steps = {
  title: {
    ...defaults,
    frequencyOverride: 1,
    showYAxis: false,
    showVolumeControls: false,
    getMargin: marginFunctions.none,
    children: <Header />,
  },

  'reading-waveform-graphs-intro': {
    ...defaults,
    isPlaying: true,
    audioVolumeOverride: 0.7,
    tldr: "A waveform graph visualizes invisible sound vibrations as a line.",
    children: (
      <Fragment>
        <Heading>A Wave</Heading>
        <Paragraph>
          A physical disturbance that travels through space or matter, transporting energy from one place to another.
        </Paragraph>

        <Heading>A Signal</Heading>
        <Paragraph>
          A wave that has been modified or patterned to carry information.
        </Paragraph>

        <Heading>A Waveform</Heading>
        <Paragraph>
          The visual shape or graph of a signal when plotted over time. It is what you see if you pause a wave and look at its form.
        </Paragraph>

        <SectionTitle>Reading Waveforms</SectionTitle>
        <Paragraph>
          First, let's take a closer look at the waveform to the left.
        </Paragraph>

        <Paragraph>
          We're looking at a graph, a data visualization. The black line is the
          data we're graphing, and it represents a sound wave. Specifically,
          it's telling us about the wave's <strong>displacement</strong>, and
          how it changes over <strong>time</strong>.
        </Paragraph>
      </Fragment>
    ),
  },
  'x-axis-time': {
    ...defaults,
    waveformOpacity: 0.5,
    showXAxisLabels: true,
    getMargin: marginFunctions.xsmall,
    audioVolumeOverride: 0.7,
    tldr: "The X-axis represents time flowing from left to right.",
    children: (
      <Fragment>
        <Heading>Time</Heading>
        <Paragraph>
          The horizontal line, our X axis, represents <strong>time</strong>.
        </Paragraph>

        <Paragraph>
          In this case, our graph is showing a 1-second interval.
        </Paragraph>
      </Fragment>
    ),
  },
  'y-axis-amplitude': {
    ...defaults,
    waveformOpacity: 0.5,
    showYAxisLabels: true,
    showXAxis: false,
    getMargin: marginFunctions.xsmall,
    audioVolumeOverride: 0.7,
    tldr: "Amplitude equals volume. Taller wave peaks mean louder sound.",
    children: (
      <Fragment>
        <Heading>Amplitude</Heading>
        <Paragraph>
          Amplitude is the measurement of a wave's strength or intensity.
        </Paragraph>

        <Paragraph>
          <strong>The Scale:</strong> Instead of measuring tiny physical distances, we often use a simple scale from 0 (silence) to 1 (maximum volume).
        </Paragraph>

        <Paragraph>
          <strong>The General Rule:</strong> Higher amplitude = Louder sound.
        </Paragraph>
      </Fragment>
    ),
  },
  'y-axis-amplitude-with-control': {
    ...defaults,
    frequencyOverride: 1,
    audioVolumeOverride: 0.7,
    getMargin: marginFunctions.xsmall,
    showYAxisLabels: true,
    showXAxis: false,
    showAmplitudeSlider: true,
    tldr: "Drag the amplitude slider to flatten or stretch the wave height.",
    children: (
      <Fragment>
        <Paragraph>
          Use the amplitude slider below the waveform to see how changing
          the amplitude of the waveform affects the graph.
        </Paragraph>

        <Paragraph>
          Try setting it all the way to 0, and notice how the line flattens out.
          0 amplitude means that it's completely silent.
        </Paragraph>

        <br />
      </Fragment>
    ),
  },
  'frequency-introduction': {
    ...defaults,
    amplitudeOverride: 1,
    frequencyOverride: 2,
    waveformOpacity: 0.5,
    showXAxisLabels: true,
    shouldPlay: true,
    showCycleIndicator: true,
    audioVolumeOverride: 0.2,
    tldr: "Frequency equals pitch. Faster wave repetition creates higher notes.",
    children: (
      <Fragment>
        <Heading>Frequency</Heading>

        <Paragraph>
          The waveform has been updated so that it repeats twice in the
          available time (or, phrased another way, it's twice as fast).
        </Paragraph>

        <Paragraph>
          The waveform we're looking at is <strong>periodic</strong>; this means
          that the waveform can be repeated to produce a constant tone. When you
          unmute the sound, notice how the sound is totally consistent; it
          doesn't change from one second to the next.
        </Paragraph>

        <Paragraph>
          Frequency measures how many times a wave repeats in one second.
        </Paragraph>
      </Fragment>
    ),
  },
  'chladni-plates': {
    ...defaults,
    getMargin: marginFunctions.large,
    scrollSnapMarginTop: '-10vh',
    showAmplitudeSlider: false,
    showFrequencySlider: false,
    narrowWaveform: true,
    isPlaying: true,
    waveformOpacity: 0.3,
    audioVolumeOverride: 0,
    tldr: "Each frequency has its own distinctive shape.",
    children: ({ currentStep }) => (
      <ResonanceSectionWrapper>
        <Paragraph>
          Different frequencies create unique patterns - waves have structure.
          The sand settles in the quiet spots (nodes), revealing geometric
          patterns that become more intricate as the frequency gets higher.
          This shows us that sound—and all waves—don't just travel; they have structure.
        </Paragraph>
        <VideoWrapper>
          <ControlledVideo
            src={`${process.env.PUBLIC_URL || ''}/examples/Plates (1).mp4`}
            shouldPlay={currentStep === 'chladni-plates'}
          />
        </VideoWrapper>
        <Caption>
          Chladni plate experiment — sand reveals the hidden geometry of sound
          frequencies as vibration patterns on a metal plate.
        </Caption>
      </ResonanceSectionWrapper>
    ),
  },
  'frequency-introduction-pt2': {
    ...defaults,
    getMargin: marginFunctions.xsmall,
    waveformOpacity: 0.5,
    showXAxisLabels: true,
    frequencyOverride: 2,
    audioVolumeOverride: 0.2,
    tldr: "Hertz (Hz) measures cycles per second.",
    children: (
      <Fragment>
        <Paragraph>
          <strong>The Unit:</strong> It is measured in Hertz (Hz). 1Hz means the wave repeats once per second
        </Paragraph>

        <Paragraph>
          <strong>The Rule:</strong> Frequency determines pitch.
        </Paragraph>

        <Paragraph>
          Faster repetition (High Hz) = Higher pitch.<br />
          lower repetition (Low Hz) = Lower pitch.
        </Paragraph>
      </Fragment>
    ),
  },
  'frequency-with-control': {
    ...defaults,
    getMargin: marginFunctions.small,
    showAmplitudeSlider: true,
    showFrequencySlider: true,
    audioVolumeOverride: 0.2,
    tldr: "Try both sliders to see how amplitude and frequency interact together.",
    children: (
      <Fragment>
        <Paragraph>
          Try tweaking the frequency with the frequency slider.
        </Paragraph>
      </Fragment>
    ),
  },

  'resonance-frequency': {
    ...defaults,
    getMargin: marginFunctions.large,
    scrollSnapMarginTop: '-10vh',
    showAmplitudeSlider: false,
    showFrequencySlider: false,
    narrowWaveform: true,
    isPlaying: true,
    audioVolumeOverride: 0,
    tldr: "When two things have the same frequency weird things can happen.",
    children: ({ currentStep }) => (
      <ResonanceSectionWrapper>
        <Paragraph>
          Every object in the world has its own natural frequency—the rate at
          which it naturally vibrates when disturbed. When an external force
          matches this frequency, something remarkable happens: the vibrations
          build up dramatically in a phenomenon called <strong>resonance</strong>.
        </Paragraph>
        <VideoWrapper>
          <ControlledVideo
            src={`${process.env.PUBLIC_URL || ''}/examples/Tacoma Bridge Collapse_ The Wobbliest Bridge in the World_ (1940) _ British Pathé new.mp4`}
            shouldPlay={currentStep === 'resonance-frequency'}
          />
        </VideoWrapper>
        <Caption>
          The Tacoma Narrows Bridge collapse —wind matched the bridge's
          natural frequency, causing fatal resonance oscillations.
        </Caption>
      </ResonanceSectionWrapper>
    ),
  },
  'additive-synthesis-intro': {
    ...defaults,
    frequencyOverride: 1,
    isPlaying: false,
    audioVolumeOverride: 0.7,
    tldr: "Complex sounds are built from stacked simple sine waves.",
    children: (
      <Fragment>
        <SectionTitle>Additive Synthesis</SectionTitle>
        <Paragraph>
          The Fourier Theorem states that any periodic waveform, no matter how complex or sharp-edged (like a square wave), is actually just a sum of simple sine waves.
        </Paragraph>

        <Paragraph>
          <strong>The "Ingredients":</strong> You start with one main sine wave (the fundamental frequency).<br /><br />
          <strong>The Process:</strong> You layer on more sine waves at higher frequencies (harmonics) and lower amplitudes.<br /><br />
          <strong>The Result:</strong> As you stack these waves, their peaks and valleys interfere with each other—canceling out curves and building up straight lines.
        </Paragraph>

        <WaveformEquation />

        <Paragraph>
          <strong>Additive Synthesis:</strong> This is simply the practical application of the theorem. You are "synthesizing" complex sounds by manually adding these sine wave ingredients together, just as Fourier described mathematically.
        </Paragraph>
      </Fragment>
    ),
  },
  'additive-synthesis-draw-fourier': {
    ...defaults,
    showWaveform: false,
    frequencyOverride: 1,
    isPlaying: false,
    audioVolumeOverride: 0,
    tldr: "Any line can be broken down into a sum of sine waves.",
    children: (
      <Fragment>
        <Paragraph>
          Draw any shape in the canvas below. When you release the mouse,
          the same Fourier idea runs in reverse—your line is decomposed into basic sine waves.
          Each rotating circle is the 2D version of one sine "ingredient":
          the circles add up to trace your shape, just as sine waves add up to form a complex sound.
        </Paragraph>
        <FourierDrawingDemo />
      </Fragment>
    ),
  },
  'additive-synthesis-basic-add': {
    ...defaults,
    useWaveformAddition: true,
    isPlaying: false,
    harmonicsForShapeOverride: 'square',
    numOfHarmonicsOverride: 1,
    convergenceOverride: 0,
    getMargin: marginFunctions.small,
    audioVolumeOverride: 0.3,
    tldr: "Wave heights add together mathematically at each point when combined.",
    children: ({ currentStep }) => (
      <Fragment>
        <Paragraph>
          The waveform graph we've been looking at now shows two waves:
        </Paragraph>

        <UnorderedList>
          <li>
            <strong style={{ color: '#000000' }}>
              1Hz at 1 amplitude
            </strong>
          </li>
          <li>
            <strong style={{ color: defaults.secondaryWaveformColor }}>
              3Hz at 0.33 amplitude
            </strong>
          </li>
        </UnorderedList>


        <Paragraph>
          Waveform Addition (or Superposition) is the process of merging multiple waves into a single shape.
        </Paragraph>

        <Paragraph>
          <strong>The Mechanics:</strong> It works like a tug-of-war on the air molecules. At any specific moment, you simply add the values of the two waves together.<br /><br />
          <strong>The Math:</strong> If Wave A is pushing up (+1) and Wave B is pushing down (-0.5), the result is the sum (+0.5).<br /><br />
          <strong>The Connection:</strong> This arithmetic is exactly how the Fourier Theorem works in practice—adding simple sine waves point-by-point is what creates the final, complex waveform.
        </Paragraph>
      </Fragment>
    ),
  },
  'additive-synthesis-intro-convergence': {
    ...defaults,
    useWaveformAddition: true,
    harmonicsForShapeOverride: 'square',
    numOfHarmonicsOverride: 1,
    isPlaying: false,
    showConvergenceSlider: true,
    getMargin: marginFunctions.small,
    audioVolumeOverride: 0.3,
    tldr: "Watch two separate waves blend together into one combined shape.",
    children: ({ frequency, amplitude, currentStep }) => (
      <Fragment>
        <Paragraph>
          Use the new <strong>Convergence</strong> slider to watch as the two
          lines are added together.
        </Paragraph>

      </Fragment>
    ),
  },
  'additive-synthesis-intro-num-of-harmonics': {
    ...defaults,
    useWaveformAddition: true,
    harmonicsForShapeOverride: 'square',
    showConvergenceSlider: true,
    isPlaying: false,
    getMargin: marginFunctions.xsmall,
    audioVolumeOverride: 0.3,
    tldr: "Add more harmonic layers to gradually build complex sound shapes.",
    children: ({ frequency, amplitude, currentStep }) => (
      <Fragment>


      </Fragment>
    ),
  },
  'additive-synthesis-harmonics-tie-in': {
    ...defaults,
    useWaveformAddition: true,
    isPlaying: false,
    harmonicsForShapeOverride: 'square',
    numOfHarmonicsOverride: 1,
    showConvergenceSlider: true,
    showNumOfHarmonicsSlider: true,
    getMargin: marginFunctions.xsmall,
    audioVolumeOverride: 0.3,
    tldr: "More harmonics gradually turn smooth curves into sharp angular edges.",
    children: ({ frequency, amplitude, currentStep }) => (
      <Fragment>
        <Paragraph>
          Watch how the more harmonics we add, the more our waveform
          changes into the squarish shape. Use the new # of Harmonics slider to change the number, and
          see how it affects the converged line.
        </Paragraph>
      </Fragment>
    ),
  },
  'additive-synthesis-phase': {
    ...defaults,
    frequencyOverride: 2,
    amplitudeOverride: 0.75,
    useWaveformAddition: true,
    waveformAdditionType: 'phase',
    showPhaseSlider: true,
    isPlaying: false,
    convergenceOverride: 0,
    phaseOverride: 36,
    showConvergenceSlider: true,
    audioVolumeOverride: 0.3,
    tldr: "Phase equals timing offset.",
    children: ({ frequency, amplitude, currentStep }) => (
      <Fragment>
        <Heading>Phase</Heading>
        <Paragraph>
          Something counter-intuitive about waveform addition is that it doesn't
          always make the resulting sound louder.
        </Paragraph>
        <Paragraph>
          To demonstrate this more clearly, first we have to learn about another
          waveform property: <strong>phase</strong>.
        </Paragraph>

        <Paragraph>
          Simply put, phase is the amount of offset applied to a wave, measured
          in degrees. If a wave is 180 degrees out of phase, for example, that
          means it's delayed by 50% of its period.
        </Paragraph>

        <Paragraph>
          Our waveform graph on the right has been updated to show two identical
          waves in terms of amplitude and frequency.
        </Paragraph>
      </Fragment>
    ),
  },
  'additive-synthesis-noise-cancelling': {
    ...defaults,
    useWaveformAddition: true,
    waveformAdditionType: 'phase',
    showPhaseSlider: true,
    convergenceOverride: 0,
    isPlaying: false,
    showConvergenceSlider: true,
    getMargin: marginFunctions.xsmall,
    audioVolumeOverride: 0.3,
    tldr: "Precise delays can cancel waves entirely.",
    children: (
      <Fragment>
        <Paragraph>
          Try adjusting the convergence slider to see how
          the phase of a waveform affects how loud the resulting wave is.
        </Paragraph>
        <ImageWrapper>
          <StyledImage src={`${process.env.PUBLIC_URL || ''}/examples/Noise-Canceling Headphones.jpg`} alt="Noise-Canceling Headphones" />
          <BwImage src={`${process.env.PUBLIC_URL || ''}/examples/Headphones bw.png`} alt="Noise-Canceling Headphones BW" className="bw-image" />
        </ImageWrapper>
        <Caption>
          This is the principle of noise-canceling headphones. They listen to the noise around you then instantly create an exact "opposite" sound wave. When the outside noise meets this opposite wave, they cancel each other out.
        </Caption>
      </Fragment>
    ),
  },

  'sound-decomposition-in-nature': {
    ...defaults,
    isPlaying: true,
    audioVolumeOverride: 0,
    getMargin: marginFunctions.massive, // Extra space before theme transition
    tldr: "Nature breaks down complex sounds into frequencies using resonance and interference.",
    children: () => (
      <Fragment>
        <SectionTitle>Sound Decomposition in Nature</SectionTitle>

        <Paragraph>
          Long before humans invented technology to analyze sound, nature was already
          breaking down complex waves into their component frequencies through
          resonance and interference.
        </Paragraph>

        <Paragraph>
          These natural phenomena demonstrate how physical structures can act as
          frequency filters, amplifying certain frequencies while dampening others.
        </Paragraph>
      </Fragment>
    ),
  },

  'waves-beyond-sound': {
    ...defaults,
    isPlaying: true,
    audioVolumeOverride: 0,
    tldr: "Light, radio, and heat are all waves—just at different frequencies.",
    children: () => (
      <Fragment>
        <SectionTitle>Waves Beyond Sound</SectionTitle>

        <Paragraph>
          Everything we've learned about waves applies far beyond sound. Light,
          radio signals, heat radiation—they're all waves, just at different
          frequencies.
        </Paragraph>

        <Paragraph>
          Sound waves need a medium to travel through (air, water, solid
          materials). But electromagnetic waves—including light—can travel
          through empty space. What changes between radio waves, visible light,
          and X-rays is simply the frequency.
        </Paragraph>
      </Fragment>
    ),
  },

  'light-decomposition': {
    ...defaults,
    useWaveformAddition: true,
    waveformAdditionType: 'spectral',
    showConvergenceSlider: true,
    convergenceOverride: 1,
    frequencyOverride: 1,
    amplitudeOverride: 0.75,
    isPlaying: false,
    getMargin: marginFunctions.small,
    audioVolumeOverride: 0,
    tldr: "White light contains all colors combined. Separate them to see the spectrum.",
    children: (
      <Fragment>
        <SectionTitle>Light as Waves</SectionTitle>
        <Paragraph>
          Visible light is electromagnetic radiation that travels as waves,
          just like sound—but at much higher frequencies. What we perceive
          as "white" light is actually the sum of all visible colors combined.
        </Paragraph>

        <Paragraph>
          Use the <strong>Convergence</strong> slider to separate white light
          into its component colors.
        </Paragraph>

        <Paragraph>
          Notice how each color corresponds to a
          different frequency—red has the lowest frequency, while violet has
          the highest.
        </Paragraph>
      </Fragment>
    ),
  },
  'light-decomposition-nature': {
    ...defaults,
    useWaveformAddition: true,
    waveformAdditionType: 'spectral',
    showConvergenceSlider: true,
    frequencyOverride: 1,
    amplitudeOverride: 0.75,
    isPlaying: false,
    getMargin: marginFunctions.xsmall,
    audioVolumeOverride: 0,
    tldr: "Rainbows and prisms naturally split white light by frequency.",
    children: () => (
      <Fragment>
        <Heading>Light Decomposition in Nature</Heading>
        <Paragraph>
          This separation of light happens naturally all around us.
        </Paragraph>

        <Paragraph>
          Just as we learned that complex sound waves are built from simple
          frequencies, white light is built from a spectrum of colored light
          frequencies. Both sound and light follow the same fundamental wave
          principles—decomposition works the same way.
        </Paragraph>
      </Fragment>
    ),
  },
  'fourier-in-technology': {
    ...defaults,
    frequencyOverride: 1,
    amplitudeOverride: 0.75,
    showVolumeControls: false,
    isPlaying: true,
    audioVolumeOverride: 0,
    getMargin: marginFunctions.xsmall,
    tldr: "Every different sound has its own unique frequency fingerprint.",
    children: ({ frequency, amplitude, currentStep, voicePattern }) => (
      <Fragment>
        <SectionTitle>Spectral Decomposition in Technology</SectionTitle>
        <Paragraph>
          From the moment you speak to your phone to the medical scan that
          reveals hidden structures in your body, the <strong>Fourier Transform</strong> is
          working behind the scenes. This mathematical tool takes any complex
          signal and reveals its hidden frequency fingerprint, enabling machines
          to see patterns humans cannot.
        </Paragraph>

        <Paragraph>
          Any signal, no matter how complex, can be represented as a sum of sine
          waves at different frequencies. By analyzing which frequencies are
          present and at what amplitudes, technology can extract meaningful
          patterns, identify sounds, or compress data efficiently.
        </Paragraph>
      </Fragment>
    ),
  },
  'fourier-in-technology-exit': {
    ...defaults,
    frequencyOverride: 1.5,
    amplitudeOverride: 0.5,
    showWaveform: true,
    showXAxis: false,
    showYAxis: false,
    showVolumeControls: false,
    isPlaying: false,
    centerWaveform: true,
    getMargin: marginFunctions.small,
    scrollSnapAlign: 'start',
    children: (
      <ExitSpacer />
    ),
  },
};

export const stepsArray = Object.entries(steps).map(([key, value]) => ({
  id: key,
  ...value,
}));