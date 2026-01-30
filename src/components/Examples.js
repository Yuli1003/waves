// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import ScrollMenu from './ScrollMenu';

const LIST_ITEMS = [
  "Rainbows",
  "CDs/DVDs",
  "Soap Bubbles",
  "Oil Slicks on Water",
  "Ice Halos",
  "Opals",
  "The 'Ocean' in a Seashell",
  "Blowing Over a Bottle",
  "Ripples in a Pond"

];

const HUMAN_LIST_ITEMS = [
  "Shazam",
  "Thermal Imaging",
  "MRI Scanners",
  "Noise-Canceling Headphones",
  "Seismographs",
  "Active Sonar",
  "Radio & WiFi Tuners"

];

const HUMAN_EXAMPLES_DATA = {
  "Radio & WiFi Tuners": {
    image: "/examples/Radio & WiFi Tuners.webp", // path relative to public
    imageBw: "/examples/Radio & WiFi Tuners bw.png",
    title: "Resonance & Band-Pass Filtering",
    description: 'A radio tuner is an electronic gatekeeper that performs spectral decomposition to find order in chaos. The air around you is currently saturated with a thick "soup" of invisible electromagnetic waves—FM radio, TV signals, WiFi, and cellular data—all shouting at the same time. If your device tried to listen to everything at once, it would hear nothing but static. When you "tune" a radio, you are adjusting a resonant circuit to vibrate at exactly one specific frequency (like 100.3 MHz). This circuit acts like a narrow slit in a fence: it physically blocks the millions of other frequencies in the spectrum and allows only that one specific station’s wave to pass through to your speakers.',
    styles: {
      image: { top: "300px", left: "453px", width: "434px" },
      text: { top: "278px", left: "938px", width: "400px" },
      title: { top: "20px", left: "900px" }
    }
  },
  "Active Sonar": {
    image: "/examples/Active Sonar.webp", // path relative to public
    imageBw: "/examples/Sonar bw.png",
    title: "Doppler Frequency Shift",
    description: 'Active sonar allows submarines to "see" underwater by analyzing the spectral shift of sound echoes. The sub sends out a "ping"—a powerful pulse of sound at a specific frequency. When this sound hits an object, like another submarine or a whale, it bounces back. However, the sonar doesnt just measure the time it takes to return; it analyzes the frequency of the echo. If the object is moving toward the sub, the echo comes back at a higher pitch (squashed waves); if its moving away, it comes back lower (stretched waves). By decomposing the return signal, the sonar operator can calculate the targets speed and direction based entirely on how it altered the sounds spectrum.',
    styles: {
      image: { top: "500px", left: "685px", width: "411px" },
      text: { top: "478px", left: "1150px", width: "500px" },
      title: { top: "20px", left: "900px" }
    }
  },
  "Thermal Imaging": {
    image: "/examples/Thermal Imaging.jpg", // path relative to public
    imageBw: "/examples/Thermal Imaging bw.png",
    title: "Frequency Translation",
    description: 'Thermal imaging is a form of visual translation that shifts invisible frequencies into the visible spectrum so our eyes can "see" heat. Every object in the universe emits light, but objects at room temperature emit infrared waves—frequencies that are too low and slow for the human eye to detect. A thermal camera acts as a spectral frequency shifter. Its sensor detects these low-energy infrared waves and assigns them a "fake" color from our visible rainbow—usually assigning blue to lower (cooler) frequencies and red or white to higher (hotter) frequencies. It essentially captures a "ghost" spectrum of heat and paints it with colors we can understand, allowing us to see a person standing in pitch darkness by the heat radiating from their body.',
    styles: {
      image: { top: "100px", left: "150px", width: "400px" },
      text: { top: "78px", left: "595px", width: "1100px" },
      title: { top: "20px", left: "900px" }
    }
  },
  "MRI Scanners": {
    image: "/examples/MRI Scanners.webp", // path relative to public
    imageBw: "/examples/MRI bw.png",
    title: "Spatial Encoding via Frequency",
    description: 'An MRI scanner uses spectral decomposition to map the inside of your body by making your water molecules "sing" different notes. The machine uses a massive magnet to align the protons in your body, but the clever part is that it applies a "gradient" field—meaning the magnetic strength is slightly different at your head than at your feet. Because protons spin at a frequency determined by magnetic strength, this gradient forces protons in your head to spin at a high pitch and protons in your feet to spin at a low pitch. When the machine listens to the radio waves coming back from your body, it hears a chaotic chorus. By performing a Fourier Transform, it unweaves this chorus, calculates how much signal is coming from each specific "pitch," and knows exactly where in your body that signal originated.',
    styles: {
      image: { top: "500px", left: "1250px", width: "600px" },
      text: { top: "240px", left: "1060px", width: "800px", textAlign: "right" },
      title: { top: "20px", left: "900px" }
    }
  },
  "Shazam": {
    image: "/examples/shazam.webp", // path relative to public
    imageBw: "/examples/shazam bw.png",
    title: "Time-Frequency Analysis",
    description: 'Shazam works by turning a song into a star map of sound frequencies, effectively creating an "acoustic fingerprint." When you hold up your phone, the app doesn’t listen to the lyrics or the melody in the way a human does. Instead, it converts the audio into a spectrogram—a 3D graph showing which frequencies are the loudest at every specific moment in time. It ignores the complex mix of instruments and focuses only on the "peaks" (the most intense energy points). It then matches this unique constellation of spectral peaks against a massive database. If the pattern of frequency spikes matches, it identifies the song. It is essentially stripping away the "music" and looking only at the bare mathematical skeleton of the sound waves.',
    styles: {
      image: { top: "100px", left: "850px", width: "200px" },
      text: { top: "76px", left: "405px", width: "400px", textAlign: "right" },
      title: { top: "20px", left: "900px" }
    }
  },
  "Noise-Canceling Headphones": {
    image: "/examples/Noise-Canceling Headphones.jpg", // path relative to public
    imageBw: "/examples/Headphones bw.png",
    title: "Destructive Interference",
    description: 'Active noise cancellation is a process of "spectral subtraction." These headphones have tiny microphones on the outside that constantly listen to the ambient noise of the room—the hum of an airplane engine or the chatter of a crowd. The internal chip analyzes the frequency profile of this incoming noise wave and instantly generates a clone of it. However, this clone is created in "anti-phase," meaning the peaks of the new wave align perfectly with the valleys of the noise wave. When these two spectral signals collide inside the ear cup, they physically cancel each other out (destructive interference). The headphones don’t just block sound; they manufacture a mathematical "anti-sound" to erase the noise spectrum from the air.',
    styles: {
      image: { top: "505px", left: "420px", width: "230px" },
      text: { top: "85px", left: "405px", width: "450px" },
      title: { top: "20px", left: "900px" }
    }
  },
  "Seismographs": {
    image: "/examples/Seismographs.jpg", // path relative to public
    imageBw: "/examples/Seismograph bw.png",
    title: "Time-Frequency Analysis",
    description: 'Seismographs use spectral decomposition to decode the story hidden inside earthquake waves. When an earthquake hits, it doesn’t just send one "shake"; it sends a complex package of different wave types (P-waves and S-waves) that travel at different speeds and frequencies. As these waves travel through the Earth, the planet acts like a giant filter—soft soil amplifies low frequencies (making the ground roll like a ship), while hard rock transmits high-frequency jitters. By analyzing the spectral content of the recorded tremors, geologists can determine not just how big the quake was, but what kind of rock the waves passed through and how deep the rupture occurred, simply by seeing which frequencies survived the journey to the surface.',
    styles: {
      image: { top: "260px", left: "650px", width: "600px" },
      text: { top: "235px", left: "1300px", width: "400px" },
      title: { top: "20px", left: "900px" }
    }
  }
}


const EXAMPLES_DATA = {
  "Soap Bubbles": {
    image: "/examples/Soap Bubbles.jpg", // path relative to public
    imageBw: "/examples/Bubbles bw.png",
    title: "Thin-Film Interference",
    description: `In a soap bubble, spectral decomposition is the physical act of "unweaving" the complex white light signal into its constituent frequencies through spatial filtering. White light is a chaotic "soup" of all visible wavelengths, but the bubble's liquid acts as a physical gatekeeper that determines which of these waves are allowed to survive. When light hits the membrane, it splits into two reflections that meet again after one has traveled an extra distance through the water layer. Because this thickness of the bubble varies, it performs a localized decomposition: it destroys some wavelengths while amplifying others. In any specific spot, you are seeing a isolated spectral component that has been successfully separated from the whole by the bubble’s microscopic geometry.`,
    styles: {
      image: { top: "300px", left: "453px", width: "434px" },
      text: { top: "278px", left: "938px", width: "400px" },
      title: { top: "20px", left: "900px" }
    }
  },
  "Oil Slicks on Water": {
    image: "/examples/Oil Slicks on Water.jpg",
    imageBw: "/examples/Oil Slicks on Water bw.png",
    title: "Thin-Film Interference",
    description: `An oil slick acts like a "thickness-based" filter for light. It is a super-thin layer of oil floating on top of water. When light hits this layer, it splits: some reflects off the top of the oil, and some travels through it to reflect off the water underneath. These two reflections then meet back up and "compete." Because the oil layer is a different thickness in every spot, it creates a unique filter for every point on the surface. In one area, the thickness might be perfect to "delete" the green and blue parts of the light, leaving only the red frequency visible. It effectively decomposes the white light into a colorful map where each hue tells you exactly how many nanometers thick the oil is in that specific spot.`,
    styles: {
      image: { top: "500px", left: "680px", width: "562px" },
      text: { top: "478px", left: "1300px", width: "550px" },
      title: { top: "20px", left: "900px" }
    }
  },
  "Rainbows": {
    image: "/examples/Rainbows.jpg",
    imageBw: "/examples/rainbows bw.png",
    title: "Refraction & Dispersion",
    description: `A rainbow is a grand-scale example of spectral decomposition where millions of raindrops act as individual tiny prisms to unweave the sun’s light. Sunlight arrives at the earth as a "white" mixture of all visible colors. When this light hits a spherical raindrop, it doesn't just pass through; it enters the drop, bounces off the back wall, and exits again. During this journey, the water acts as a strict sorter of wavelengths. Because water is denser than air, it forces the light to slow down and bend, but it bends blue light more sharply than red light. This difference in angle physically splits the beam inside the drop. By the time the light exits, the colors have been fanned out, creating a perfect arc where every raindrop at a specific angle sends only one specific color to your eye.`,
    styles: {
      image: { top: "100px", left: "150px", width: "400px" },
      text: { top: "78px", left: "595px", width: "1100px" },
      title: { top: "20px", left: "900px" }
    }
  },
  "CDs/DVDs": {
    image: "/examples/CDs.jpg",
    imageBw: "/examples/disc bw.png",
    title: "Diffraction",
    description: `A CD is like a mechanical sorter for light. Its surface is covered in millions of tiny, microscopic tracks that are perfectly and evenly spaced. When "messy" white light hits these tracks, the light doesn't just bounce back; it gets forced to scatter. Because of the specific spacing of these tracks, only certain colors are allowed to "line up" and stay strong at certain angles. Blue waves might line up at one angle, while red waves line up at another. As you tilt the disc, you are essentially watching the CD "unmix" the white light, showing you one isolated ingredient of the spectrum at a time based on the angle of your eye.`,
    styles: {
      image: { top: "500px", left: "1250px", width: "600px" },
      text: { top: "270px", left: "1060px", width: "800px", textAlign: "right" },
      title: { top: "20px", left: "900px" }
    }
  },
  "Ice Halos": {
    image: "/examples/Ice Halos.webp",
    imageBw: "/examples/ice halo bw.jpg",
    title: "Refraction & Dispersion",
    description: `An ice halo acts as a massive, atmospheric prism that decomposes sunlight high in the sky. Cirrus clouds are often filled not with water droplets, but with millions of tiny, hexagonal ice crystals. As chaotic white sunlight passes through these crystals, the ice acts as a strict geometric filter. Because the crystals are shaped like hexagons, they bend (refract) the light at a very specific 22-degree angle. However, just like in a glass prism, blue light bends slightly more than red light. This physical deviation separates the colors, organizing the "soup" of sunlight into a perfect, luminous ring around the sun or moon, with red on the inside and blue on the outside.`,
    styles: {
      image: { top: "100px", left: "850px", width: "520px" },
      text: { top: "78px", left: "500px", width: "300px", textAlign: "right" },
      title: { top: "20px", left: "900px" }
    }
  },
  "Opals": {
    image: "/examples/Opals.jpeg",
    imageBw: "/examples/opals bw.jpg",
    title: "Diffraction",
    description: `An opal is a stone that acts as a solid-state diffraction grating, breaking light apart using its internal architecture. Unlike most gems that get their color from chemical dyes or impurities, an opal is composed of millions of microscopic silica spheres stacked in a grid, like a crate of oranges. The tiny spaces between these spheres are roughly the same size as light waves. When white light tries to navigate this grid, the waves bounce off the spheres and interfere with one another. Depending on the size of the spheres and the angle of view, the stone "selects" only specific colors to reflect back to your eye while trapping the others, creating the shifting spectral flashes known as "play of color."`,
    styles: {
      image: { top: "300px", left: "550px", width: "480px" },
      text: { top: "275px", left: "1085px", width: "600px" },
      title: { top: "20px", left: "900px" }
    }
  },
  "The 'Ocean' in a Seashell": {
    image: "/examples/Seashell.webp",
    imageBw: "/examples/Seashell bw.png",
    title: "Acoustic & Mechanical Resonance",
    description: `The sound of the ocean in a seashell is actually a form of acoustic filtration called resonance. The air in the room around you is filled with "white noise"—a chaotic mixture of all audible frequencies at low volumes. The hard, empty cavity of the shell acts as a physical gatekeeper for this noise. Just as a soda bottle has a specific pitch when you blow across it, the shell’s internal shape prefers certain frequencies. It traps and amplifies only the sound waves that fit its dimensions (resonance) while letting others fade away. The "ocean" you hear is simply the ambient noise of your room, but spectrally decomposed so that only a specific band of "roaring" frequencies remains.`,
    styles: {
      image: { top: "100px", left: "1400px", width: "400px" },
      text: { top: "355px", left: "1195px", width: "620px", textAlign: "right" },
      title: { top: "20px", left: "900px" }
    }
  },
  "Blowing Over a Bottle": {
    image: "/examples/blown bottle.jpg",
    imageBw: "/examples/bottle bw.png",
    title: "Acoustic & Mechanical Resonance",
    description: `Blowing over a bottle creates a phenomenon known as Helmholtz resonance, which acts as a filter to extract a single pure tone from the chaotic "hiss" of your breath. When you blow air across the lip, you are introducing a messy, broadband turbulence. However, the air inside the bottle acts like a spring with a specific stiffness determined by the volume of the bottle. This "air spring" refuses to vibrate at just any speed; it fights back against the turbulence and locks onto one specific frequency that matches its natural resonance. The bottle effectively subtracts all the other noise in your breath and amplifies that one isolated frequency, turning a rush of air into a clear musical note.`,
    styles: {
      image: { top: "590px", left: "420px", width: "380px" },
      text: { top: "160px", left: "405px", width: "410px" },
      title: { top: "20px", left: "900px" }
    }
  },
  "Ripples in a Pond": {
    image: "/examples/ripples-in-a-pond.jpeg",
    imageBw: "/examples/pond bw.png",
    title: "Wave Dispersion",
    description: `Ripples in a pond demonstrate spectral decomposition through a process called dispersion. When you throw a rock into calm water, you create a "pulse" containing many different wavelengths of energy all at once. But in deep water, physics dictates a race: longer waves (low frequency) travel faster than shorter waves (high frequency). As the waves move outward from the splash, the pack begins to separate. The longer, rolling waves surge to the front, while the tiny, jittery ripples lag behind. The water physically unweaves the single impact of the rock, stretching it out over distance until the complex "splash" is sorted into a neat train of waves ordered by size.`,
    styles: {
      image: { top: "260px", left: "650px", width: "600px" },
      text: { top: "236px", left: "1300px", width: "400px" },
      title: { top: "20px", left: "900px" }
    }
  }
};

class Examples extends Component {
  state = {
    hoveredItem: null,
    activeCategory: 'natural', // 'natural' or 'manmade'
  };

  handleMouseEnter = (item) => {
    this.setState({ hoveredItem: item });
  };

  handleMouseLeave = () => {
    this.setState({ hoveredItem: null });
  };

  handleCategoryChange = (category) => {
    this.setState({ activeCategory: category, hoveredItem: null });
  };

  renderContent() {
    const { hoveredItem, activeCategory } = this.state;
    // Default to Thin-Film if hovered matches or just testing (User showed Thin-Film as example)
    // For now, only show content if hover matches data, or default if needed.
    // The user prompt implies: "when hovered on - a image... shows up". 

    // Using the correct data source based on category
    const dataSource = activeCategory === 'natural' ? EXAMPLES_DATA : HUMAN_EXAMPLES_DATA;
    const data = dataSource[hoveredItem];

    if (!data) return null;

    // Default styles if missing in data
    const styles = data.styles || {};
    const imgStyles = styles.image || { top: "300px", left: "450px", width: "600px" };
    const textStyles = styles.text || { top: "293px", left: "1110px", width: "600px" };
    const titleStyles = styles.title || { top: "589px", left: "1100px" };

    return (
      <React.Fragment>
        {/* Wrapper handles grouping Image and Frame relatively using dynamic styles */}
        <ImageWrapper top={imgStyles.top} left={imgStyles.left}>
          <Frame />
          <StyledImage src={data.image} alt={data.title} width={imgStyles.width} />
          {data.imageBw && (
            <BwImage src={data.imageBw} alt={data.title} width={imgStyles.width} className="bw-image" />
          )}
        </ImageWrapper>

        {/* Title */}
        <Title top={titleStyles.top} left={titleStyles.left}>
          {data.title}
        </Title>

        {/* Description */}
        <Description
          top={textStyles.top}
          left={textStyles.left}
          width={textStyles.width}
          textAlign={textStyles.textAlign}
        >
          {data.description}
        </Description>
      </React.Fragment>
    );
  }

  render() {
    const { hoveredItem, activeCategory } = this.state;
    // User asked for "black background" - Body style set globally or wrapper?
    // SpectralDecomposition has white body. This needs black.
    // We can use a full screen wrapper.

    const currentList = activeCategory === 'natural' ? LIST_ITEMS : HUMAN_LIST_ITEMS;

    return (
      <Wrapper>
        <ScrollMenu variant="examples" />

        {/* Category Toggle */}
        <ToggleContainer>
          <ToggleButton
            isActive={activeCategory === 'manmade'}
            onClick={() => this.handleCategoryChange('manmade')}
          >
            Man made
          </ToggleButton>
          <ToggleButton
            isActive={activeCategory === 'natural'}
            onClick={() => this.handleCategoryChange('natural')}
          >
            Natural
          </ToggleButton>
        </ToggleContainer>

        <ListContainer>
          {currentList.map((item, i) => (
            <ListItem
              key={i}
              isHovered={hoveredItem === item}
              isDimmed={hoveredItem && hoveredItem !== item}
              onMouseEnter={() => this.handleMouseEnter(item)}
              onMouseLeave={this.handleMouseLeave}
            >
              <ListItemNumber>{i + 1}.</ListItemNumber> {item}
            </ListItem>
          ))}
        </ListContainer>

        {/* Content Area - Fixed positioning context */}
        <ContentArea>
          {this.renderContent()}
        </ContentArea>
      </Wrapper>
    );
  }
}

// --- STYLES ---

const Wrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #000000;
  color: #FFFFFF;
  position: relative;
  display: flex;
  overflow-x: hidden;
  font-family: 'JetBrains Mono', monospace;
  cursor: default !important;

  * {
    cursor: default !important;
  }
`;

const ToggleContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 40px;
  display: flex;
  gap: 0;
`;

const ToggleButton = styled.button`
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.07em;
  color: #FFFFFF;
  background: transparent;
  border: 1px solid #FFFFFF;
  padding: 8px 16px;
  cursor: pointer !important;
  transition: all 0.2s ease;
  position: relative;
  opacity: ${props => props.isActive ? 1 : 0.3};
  
  &:hover {
    opacity: 0.8;
  }
  

`;

const ListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  bottom: 25px;
  left: 40px;
  width: auto;
  height: auto;
  min-height: min-content;
  
  /* Scrollbar hiding or styling if needed */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const ListItemNumber = styled.span`
  margin-right: 8px;
`;

const ListItem = styled.li`
  font-family: 'JetBrains Mono', monospace;
  font-weight: 200;
  font-size: 11px;
  line-height: 312%; /* 31.2px */
  letter-spacing: 0.07em; /* 7% */
  color: #FFFFFF;
  opacity: ${props => props.isDimmed ? 0.32 : 1};
  transition: opacity 0.3s ease;
  cursor: pointer !important; /* Override global cursor: none if necessary, or keep it */
  
  &:hover {
    opacity: 1;
  }
`;

const ContentArea = styled.div`
  /* Absolute container for the fixed pixel values */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Let clicks pass through to list? Content doesn't seem interactive */
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  display: inline-block;

  &:hover .bw-image {
    opacity: 0;
  }
`;

const StyledImage = styled.img`
  display: block;
  width: ${props => props.width};
  height: auto;
  object-fit: cover;
`;

const BwImage = styled(StyledImage)`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 1;
  transition: opacity 0.5s ease;
  pointer-events: none;
`;

const Frame = styled.div`
  position: absolute;
  top: -15px;
  left: -15px;
  right: -15px;
  bottom: -15px;
  border: 0.3px solid #FFFFFF;
  opacity: 0.5;
  pointer-events: none;
`;

const Title = styled.h2`
  position: absolute;
  width: auto;
  height: auto;
  top: ${props => props.top || "589px"};
  left: ${props => props.left || "1100px"};
  transform: translateX(-50%);
  font-family: 'JetBrains Mono', monospace;
  font-weight: 400;
  font-size: 11px;
  line-height: 312%;
  letter-spacing: 0.07em;
  color: #FFFFFF;
  margin: 0;
  white-space: nowrap; 
`;

const Description = styled.p`
  position: absolute;
  width: ${props => props.width || "600px"};
  height: auto; /* Allow height to adapt to content */
  top: ${props => props.top || "293px"};
  left: ${props => props.left || "1110px"};
  text-align: ${props => props.textAlign || "left"};
  font-family: 'JetBrains Mono', monospace;
  font-weight: 100;
  font-size: 11px;
  line-height: 300%;
  letter-spacing: 7%;
  color: #FFFFFF;
  margin: 0;
  white-space: pre-wrap; // Preserve structure if needed
`;

export default Examples;
