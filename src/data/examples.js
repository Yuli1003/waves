// @flow
// Example details for light decomposition tutorial section

export type ExampleData = {
  id: string,
  label: string,
  imagePath: string,
  imageBwPath?: string,
  description: string,
};

export const EXAMPLES: { [id: string]: ExampleData } = {
  rainbows: {
    id: 'rainbows',
    label: 'Rainbows',
    imagePath: '/examples/Rainbows.jpg',
    imageBwPath: '/examples/rainbows bw.png',
    description: `Rainbows are a grand-scale example of spectral decomposition. Millions of raindrops act as tiny prisms, unweaving sunlight. As light enters and exits a raindrop, it bends (refracts). Blue light bends more sharply than red, splitting the white light into its component colors. This fanning out of colors creates the arc we see.`,
  },
  'cds-dvds': {
    id: 'cds-dvds',
    label: 'CDs/DVDs',
    imagePath: '/examples/CDs.jpg',
    imageBwPath: '/examples/disc bw.png',
    description: `A CD acts as a mechanical light sorter. Its surface is covered in microscopic, evenly spaced tracks. When white light hits these tracks, it scatters (diffracts). The spacing causes specific colors to interfere constructively at different angles. As you tilt the disc, you see the white light "unmixed" into its spectral ingredients.`,
  },
  'soap-bubbles': {
    id: 'soap-bubbles',
    label: 'Soap Bubbles',
    imagePath: '/examples/Soap Bubbles.jpg',
    imageBwPath: '/examples/Bubbles bw.png',
    description: `Soap bubbles decompose light through thin-film interference. Light reflects off both the inner and outer surfaces of the bubble film. These reflections interfere with each other, canceling out some colors and amplifying others depending on the film's thickness. As the thickness varies, different colors are isolated and reflected back to your eye.`,
  },
  'oil-slicks': {
    id: 'oil-slicks',
    label: 'Oil Slicks on Water',
    imagePath: '/examples/Oil Slicks on Water.jpg',
    imageBwPath: '/examples/Oil Slicks on Water bw.png',
    description: `Oil slicks act as thickness-based light filters. Light reflects off the top of the oil and the water underneath. These reflections interfere, canceling some colors while strengthening others based on the oil's thickness at that spot. The resulting colors effectively map the microscopic thickness of the oil layer.`,
  },
  'ice-halos': {
    id: 'ice-halos',
    label: 'Ice Halos',
    imagePath: '/examples/Ice Halos.webp',
    imageBwPath: '/examples/ice halo bw.jpg',
    description: `Ice halos are formed by millions of hexagonal ice crystals in cirrus clouds acting as atmospheric prisms. As sunlight passes through these crystals, it refracts (bends) at a specific 22-degree angle. Blue light bends more than red, separating the colors into a luminous ring around the sun or moon.`,
  },
  opals: {
    id: 'opals',
    label: 'Opals',
    imagePath: '/examples/Opals.jpeg',
    imageBwPath: '/examples/opals bw.jpg',
    description: `Opals act as solid-state diffraction gratings. They are composed of microscopic silica spheres stacked in a grid. The spaces between spheres are similar in size to light waves, causing interference. Depending on the viewing angle and sphere size, specific colors are reflected while others are trapped, creating the stone's shifting "play of color."`,
  },
  'ocean-in-a-seashell': {
    id: 'ocean-in-a-seashell',
    label: "The 'Ocean' in a Seashell",
    imagePath: '/examples/Seashell.jpg',
    imageBwPath: '/examples/Seashell bw.png',
    description: `The "ocean" sound in a seashell is acoustic resonance. The shell's cavity acts as a filter for ambient room noise. Its shape amplifies specific frequencies that match its dimensions while dampening others. The result is a spectral decomposition of white noise, leaving only a specific band of "roaring" frequencies.`,
  },
  'blowing-over-a-bottle': {
    id: 'blowing-over-a-bottle',
    label: 'Blowing Over a Bottle',
    imagePath: '/examples/blown bottle.jpg',
    imageBwPath: '/examples/bottle bw.png',
    description: `Blowing over a bottle creates Helmholtz resonance. The air inside acts as a spring with a specific stiffness based on the bottle's volume. This "air spring" filters the broadband turbulence of your breath, amplifying only the frequency that matches its natural resonance to produce a clear musical note.`,
  },
  'ripples-in-a-pond': {
    id: 'ripples-in-a-pond',
    label: 'Ripples in a Pond',
    imagePath: '/examples/ripples-in-a-pond.jpeg',
    imageBwPath: '/examples/pond bw.png',
    description: `Ripples in a pond demonstrate dispersion. A splash creates a pulse with many wavelengths. In deep water, longer waves (low frequency) travel faster than shorter ones. As they move outward, the waves separate by speed, unweaving the complex splash into a train of waves ordered by size.`,
  },
  'radio-wifi-tuners': {
    id: 'radio-wifi-tuners',
    label: 'Radio & WiFi Tuners',
    imagePath: '/examples/Radio & WiFi Tuners.webp',
    imageBwPath: '/examples/Radio & WiFi Tuners bw.png',
    description: 'A radio tuner uses spectral decomposition to filter electromagnetic chaos. The air is filled with radio, TV, and WiFi signals. Tuning a radio adjusts a resonant circuit to vibrate at one specific frequency. This circuit blocks all other frequencies, allowing only the selected station\'s signal to pass through to your speakers.',
  },
  'active-sonar': {
    id: 'active-sonar',
    label: 'Active Sonar',
    imagePath: '/examples/Active Sonar.webp',
    imageBwPath: '/examples/Sonar bw.png',
    description: 'Active sonar uses the Doppler effect to "see" underwater. A sub sends a sound pulse ("ping") and analyzes the returning echo. If an object is moving closer, the echo returns at a higher pitch; if moving away, a lower pitch. By decomposing this spectral shift, operators calculate the target\'s speed and direction.',
  },
  'thermal-imaging': {
    id: 'thermal-imaging',
    label: 'Thermal Imaging',
    imagePath: '/examples/Thermal Imaging.jpg',
    imageBwPath: '/examples/Thermal Imaging bw.png',
    description: 'Thermal imaging translates invisible infrared frequencies into visible light. Objects emit heat as infrared waves, which human eyes cannot see. A thermal camera detects these waves and assigns them false colors—blue for cool, red/white for hot. This spectral shifting allows us to "see" heat patterns even in total darkness.',
  },
  'mri-scanners': {
    id: 'mri-scanners',
    label: 'MRI Scanners',
    imagePath: '/examples/MRI Scanners.webp',
    imageBwPath: '/examples/MRI bw.png',
    description: 'MRI scanners map the body by making water molecules emit different frequencies. A magnetic gradient causes protons to spin at different speeds depending on their location—high pitch at the head, low at the feet. The machine detects the resulting chorus of radio waves and uses a Fourier Transform to unweave the signals, pinpointing exactly where each originated.',
  },
  shazam: {
    id: 'shazam',
    label: 'Shazam',
    imagePath: '/examples/shazam.webp',
    imageBwPath: '/examples/shazam bw.png',
    description: 'Shazam identifies songs by creating an "acoustic fingerprint." It converts audio into a spectrogram to find the loudest frequencies at any moment. Ignoring lyrics and melody, it focuses on these peak energy points. This unique constellation of spectral peaks is matched against a database to identify the song.',
  },
  'noise-canceling-headphones': {
    id: 'noise-canceling-headphones',
    label: 'Noise-Canceling Headphones',
    imagePath: '/examples/Noise-Canceling Headphones.jpg',
    imageBwPath: '/examples/Headphones bw.png',
    description: 'Active noise cancellation uses "spectral subtraction." Microphones analyze ambient noise frequencies and generate an identical wave in "anti-phase" (peaks aligned with valleys). When the noise and anti-noise collide, they cancel each other out through destructive interference, effectively erasing the noise spectrum.',
  },
  seismographs: {
    id: 'seismographs',
    label: 'Seismographs',
    imagePath: '/examples/Seismographs.jpg',
    imageBwPath: '/examples/Seismographs bw.png',
    description: 'Seismographs use spectral decomposition to analyze earthquake waves. Earthquakes send out complex packages of waves (P-waves and S-waves) at different frequencies. As they travel, the Earth acts as a filter—soft soil amplifies low frequencies, hard rock transmits high ones. By analyzing which frequencies survive, geologists can determine the quake\'s size, depth, and the rock types it passed through.',
  },
  'mp3-jpeg-compression': {
    id: 'mp3-jpeg-compression',
    label: 'MP3 & JPEG Compression',
    imagePath: '/examples/MP3 & JPEG.png',
    description: 'Compression formats like MP3 and JPEG use spectral decomposition to discard imperceptible data. Algorithms like the Discrete Cosine Transform (DCT) break files into component frequencies. They then delete "high-frequency" data—like microscopic textures or ultra-high harmonics—that humans can\'t perceive. This dramatically shrinks file size while keeping the media looking or sounding "good enough."',
  },
};

export const EXAMPLE_IDS: Array<string> = Object.keys(EXAMPLES);
