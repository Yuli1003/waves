export type Linecap = 'square' | 'round' | 'butt';

export type WaveformShape = 'sine' | 'triangle' | 'square' | 'sawtooth';
export type WaveformPoint = { x: number, y: number };

export type HarmonicsForShape = WaveformShape | 'cancellable';

export type WaveformAdditionType = 'harmonics' | 'phase' | 'chord' | 'spectral' | 'voice';

export type VoicePattern = 'ah' | 'ee';

export type AvailableIcon = 'volumeOff' | 'volumeOn';
