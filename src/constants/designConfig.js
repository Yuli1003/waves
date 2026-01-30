// @flow
// =============================================================================
// DESIGN CONFIGURATION
// =============================================================================
// This file controls all visual parameters across the application.
// Edit values here to change the look and feel without touching component files.
// =============================================================================

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const FONTS = {
  // Font families
  families: {
    serif: "'DM Serif Display', serif",
    serifText: "'DM Serif Text', serif",
    sans: "'Space Grotesk', sans-serif",
    mono: "'Panchang', monospace",
  },

  // TLDR display (top banner)
  tldr: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '45px',
    fontWeight: 400,
    lineHeight: 'normal',
    letterSpacing: '0.02em',
  },

  // Section titles (e.g., "Reading Waveforms", "Harmonics")
  sectionTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '42px',
    fontWeight: 400,
    lineHeight: 1.2,
  },

  // Headings (e.g., "Amplitude", "Frequency")
  heading: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '42px',
    fontWeight: 400,
    lineHeight: 1.2,
  },

  // Paragraphs (main body text)
  paragraph: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '22px',
    fontWeight: 400,
    lineHeight: 1.6,
  },

  // Slider labels
  sliderLabel: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '14px',
    fontWeight: 400,
    letterSpacing: '0.05em',
  },

  // Volume labels
  volumeLabel: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '14px',
    fontWeight: 400,
    letterSpacing: '0.05em',
  },

  // Voice pattern toggle
  voiceToggle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '14px',
    fontWeight: 500,
  },

  // Example descriptions (right column)
  exampleDescription: {
    fontFamily: "'DM Serif Text', serif",
    fontSize: '22px',
    lineHeight: 1.6,
  },

  // Axis labels
  axisLabel: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '12px',
    fontWeight: 400,
  },
};

// =============================================================================
// WAVEFORM
// =============================================================================

export const WAVEFORM = {
  // Line thickness
  lineThickness: {
    primary: 2,        // Main waveform line
    secondary: 2,      // Secondary/harmonic lines
    converged: 2,      // Converged waveform line
  },

  // Axis settings
  axis: {
    lineThickness: 1,
    tickLength: 8,
    labelOffset: 20,
  },

  // Colors (can override per-theme)
  colors: {
    light: {
      primary: '#000000',
      secondary: '#797979',
      axis: '#000000',
      grid: '#e0e0e0',
    },
    dark: {
      primary: '#ffffff',
      secondary: '#999999',
      axis: '#ffffff',
      grid: '#333333',
    },
  },

  // Animation
  animation: {
    speedMultiplier: 0.7,
  },
};

// =============================================================================
// CONTROLS (Sliders, Volume, Toggles)
// =============================================================================

export const CONTROLS = {
  // Sliders
  slider: {
    // Position (from bottom of viewport)
    position: {
      bottom: '14%',
      left: '90px',
      rightNormal: '90px',
      // rightNarrowed: 'calc(65%)',
    },
    // Size
    height: '4px',
    thumbSize: '18px',
    // Spacing
    gap: '10px',
  },

  // Volume control
  volume: {
    // Position (from bottom of viewport)
    position: {
      bottom: '4%',
      left: '90px',
    },
    // Button size
    buttonSize: '20px',
    // Bar dimensions
    barWidth: '14px',
    barHeight: '4px',

    barGap: '2px',
    barCount: 10,
  },

  // Voice pattern toggle
  voiceToggle: {
    // Button dimensions
    buttonPadding: '8px 16px',
    buttonBorderRadius: '4px',
    gap: '8px',
  },
};

// =============================================================================
// LAYOUT
// =============================================================================

export const LAYOUT = {
  // Page margins
  pagePadding: {
    horizontal: '90px',
    horizontalMobile: '2rem',
  },

  // Gutter between columns
  columnGutter: 110,
  columnGutterExtraNarrowed: 30, // Smaller gutter when waveform is extra narrowed

  // Waveform column (left)
  waveformColumn: {
    // Normal mode
    normal: {
      flex: 2.3,
      maxWidth: '2000px',
    },
    // Narrowed mode (when examples visible)
    narrowed: {
      flex: 0.8,
      maxWidth: '50%',
    },
    // Extra narrowed mode (when narrowWaveform: true, gives more space to tutorial)
    extraNarrowed: {
      flex: 0.8,
      maxWidth: '50%',
    },
    platesNarrow: {
      flex: 0.6,
      maxWidth: '20%',
    }
  },

  // Waveform wrapper (the actual waveform display area)
  waveformWrapper: {
    bottom: '28%',
    left: '90px',
    rightNormal: 'calc(50% + 60px)',
    rightNarrowed: 'calc(62%)',
    // Slide out position (off-screen to the left)
    leftSlideOut: '-100%',
  },

  // Tutorial/paragraph column (right)
  tutorialColumn: {
    // Normal mode
    normal: {
      flex: 1,
      maxWidth: '600px',
      marginLeft: '60px',
      position: {
        top: '19vh',
      }, // half of columnGutter
    },
    // Narrowed mode (when examples visible)
    narrowed: {
      width: '350px',
      maxWidth: '350px',
      marginLeft: '15px',
    },
  },

  // Example column (middle, only visible when inverted)
  exampleColumn: {
    position: {
      top: '19vh',
      left: '51.5%',
      right: '23.5%',
    },
    maxHeight: '75vh',
    padding: '0 20px',
    gap: '60px', // Gap between example items
  },

  // TLDR container
  tldrContainer: {
    top: '5%',
  },

  // Fade overlay height
  fadeOverlayHeight: '21vh',
};

// =============================================================================
// TRANSITIONS
// =============================================================================

export const TRANSITIONS = {
  // Theme transition (light/dark)
  theme: '800ms ease-in-out',

  // Layout transitions
  layout: '400ms ease-in-out',

  // Slow slide-out transition for conclusion
  slideOut: '1200ms ease-in-out',

  // Spring settings for react-motion
  spring: {
    stiffness: 170,
    damping: 26,
    precision: 0.1,
  },
};

// =============================================================================
// Z-INDEX LAYERS
// =============================================================================

export const Z_INDEX = {
  waveform: 1,
  sliders: 5,
  volume: 10,
  tldr: 100,
  exampleColumn: 100,
  fadeOverlay: 150,
  scrollMenu: 200,
  endSequence: 2000,
};
