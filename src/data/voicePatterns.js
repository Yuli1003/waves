// @flow
// Voice pattern definitions for educational visualization
// Formant frequencies based on actual speech acoustics

export const VOICE_PATTERNS = {
  ah: {
    label: 'Ah',
    description: 'As in "father" - lower, clustered formants',
    formants: [
      {
        name: 'F1',
        frequency: 700, // Hz
        amplitude: 0.8,
        relativeFreq: 7, // Relative to 100Hz base
        color: '#ffffff', // White
      },
      {
        name: 'F2',
        frequency: 1220,
        amplitude: 0.5,
        relativeFreq: 12.2,
        color: '#999999', // Light grey
      },
      {
        name: 'F3',
        frequency: 2600,
        amplitude: 0.25,
        relativeFreq: 26,
        color: '#444444', // Dark grey
      },
    ],
  },
  ee: {
    label: 'Ee',
    description: 'As in "see" - spread formants with high F2',
    formants: [
      {
        name: 'F1',
        frequency: 270,
        amplitude: 0.6,
        relativeFreq: 2.7,
        color: '#ffffff', // White
      },
      {
        name: 'F2',
        frequency: 2290,
        amplitude: 0.7,
        relativeFreq: 22.9,
        color: '#999999', // Light grey
      },
      {
        name: 'F3',
        frequency: 3010,
        amplitude: 0.3,
        relativeFreq: 30.1,
        color: '#444444', // Dark grey
      },
    ],
  },
};
