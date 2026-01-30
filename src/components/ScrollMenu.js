// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

// Menu items configuration
const MENU_ITEMS = [
  { id: 'title', label: 'Intro' },
  { id: 'x-axis-time', label: 'Time' },
  { id: 'y-axis-amplitude', label: 'Amplitude' },
  { id: 'frequency-introduction', label: 'Frequency' },
  { id: 'additive-synthesis-intro', label: 'Additive Synthesis' },
  { id: 'additive-synthesis-phase', label: 'Phase' },
  { id: 'sound-decomposition-in-nature', label: 'Sound Decomposition' },
  { id: 'waves-beyond-sound', label: 'Waves Beyond Sound' },
  { id: 'light-decomposition', label: 'Light as Waves' },
  { id: 'light-decomposition-nature', label: 'Light Decomposition' },
  { id: 'fourier-in-technology', label: 'Decomposition in Tech' },
];

// Constants for wave pointer calculations
const ITEM_LINE_HEIGHT = 14;
const ITEM_GAP = 17;
const ITEM_HEIGHT = ITEM_LINE_HEIGHT + ITEM_GAP; // 31px
const WAVE_WIDTH = 16;

type Props = {
  variant: 'intro' | 'examples',
  scrollProgress?: number,
  onScrollTo?: (progress: number) => void,
  onScrollToStep?: (stepId: string) => void,
  maxScrollPosition?: number,
  currentStep?: string,
  isInverted?: boolean,
  items?: Array<{ id: string, label: string }>,
};

type State = {
  isOpen: boolean,
  isDragging: boolean,
  lockedStepId: ?string, // NEW: Locks the highlight during auto-scroll
};

// Animated SVG Wave Pointer Component
class WavePointerSVG extends Component<
  { currentIndex: number, totalItems: number, isIntro: boolean, isInverted?: boolean },
  { animatedY: number, velocity: number, waveAmplitude: number }
> {
  state = {
    animatedY: 0,
    velocity: 0,
    waveAmplitude: 1,
  };

  animationFrame: ?AnimationFrameID = null;
  lastTime: number = 0;

  componentDidMount() {
    const targetY = this.props.currentIndex * ITEM_HEIGHT + ITEM_HEIGHT / 2;
    this.setState({ animatedY: targetY });
  }

  componentDidUpdate(prevProps: { currentIndex: number, totalItems: number, isIntro: boolean }) {
    if (prevProps.currentIndex !== this.props.currentIndex) {
      // FIX 1: Detect large jumps (more than 2 items)
      const diff = Math.abs(prevProps.currentIndex - this.props.currentIndex);

      if (diff > 2) {
        // If jumping far, don't use spring physics (prevents "smooshed" wave)
        // Instead, instantly snap near the target and let it settle gently
        const targetY = this.props.currentIndex * ITEM_HEIGHT + ITEM_HEIGHT / 2;
        this.setState({
          animatedY: targetY, // Snap to position
          velocity: 0,        // Kill velocity
          waveAmplitude: 1    // Reset shape
        });
      } else {
        // Short distance? Animate smoothly as normal
        this.startAnimation();
      }
    }
  }

  componentWillUnmount() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  startAnimation = () => {
    this.lastTime = performance.now();
    this.animate();
  };

  animate = () => {
    const now = performance.now();
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    const targetY = this.props.currentIndex * ITEM_HEIGHT + ITEM_HEIGHT / 2;
    const { animatedY, velocity, waveAmplitude } = this.state;

    // Spring physics
    const stiffness = 180;
    const damping = 18; // Increased damping slightly for stability
    const mass = 1;

    const displacement = targetY - animatedY;
    const springForce = stiffness * displacement;
    const dampingForce = damping * velocity;
    const acceleration = (springForce - dampingForce) / mass;

    const newVelocity = velocity + acceleration * deltaTime;
    const newY = animatedY + newVelocity * deltaTime;

    // FIX 2: Smooshed Wave Fix
    // We limit how much the wave can shrink. It will never go below 0.5 amplitude.
    const maxVelocity = 600;
    const velocityFactor = Math.min(Math.abs(newVelocity) / maxVelocity, 1);
    const targetAmplitude = 1 - (velocityFactor * 0.5); // Changed from 0.7 to 0.5 (less shrinking)

    const amplitudeSpeed = 8;
    const newAmplitude = waveAmplitude + (targetAmplitude - waveAmplitude) * amplitudeSpeed * deltaTime;

    const isSettled = Math.abs(displacement) < 0.5 && Math.abs(newVelocity) < 5;

    if (isSettled) {
      this.setState({ animatedY: targetY, velocity: 0, waveAmplitude: 1 });
    } else {
      this.setState({ animatedY: newY, velocity: newVelocity, waveAmplitude: newAmplitude });
      this.animationFrame = requestAnimationFrame(this.animate);
    }
  };

  buildPath = (activeY: number, totalHeight: number, amplitude: number) => {
    const x = 5;
    const baseWaveHeight = 55;
    const waveHeight = baseWaveHeight * amplitude;
    const waveStart = Math.max(0, activeY - waveHeight / 2);
    const waveEnd = Math.min(totalHeight, activeY + waveHeight / 2);

    const curveDepthLeft = 0.5;
    const curveDepthRight = 15 * amplitude;

    let path = `M ${x} 0`;

    if (waveStart > 0) {
      path += ` L ${x} ${waveStart}`;
    }

    const curve1End = waveStart + waveHeight * 0.25;
    const curve2End = waveStart + waveHeight * 0.5;
    const curve3End = waveStart + waveHeight * 0.75;

    path += ` C ${x} ${waveStart + 5 * amplitude}, ${curveDepthLeft} ${waveStart + 8 * amplitude}, ${curveDepthLeft} ${Math.min(curve1End, totalHeight)}`;

    if (curve1End < totalHeight) {
      path += ` C ${curveDepthLeft} ${curve1End + 5 * amplitude}, ${curveDepthRight} ${curve2End - 8 * amplitude}, ${curveDepthRight} ${Math.min(curve2End, totalHeight)}`;

      if (curve2End < totalHeight) {
        path += ` C ${curveDepthRight} ${curve2End + 5 * amplitude}, ${curveDepthLeft} ${curve3End - 5 * amplitude}, ${curveDepthLeft} ${Math.min(curve3End, totalHeight)}`;

        if (curve3End < totalHeight) {
          path += ` C ${curveDepthLeft} ${curve3End + 5 * amplitude}, ${x} ${waveEnd - 5 * amplitude}, ${x} ${Math.min(waveEnd, totalHeight)}`;
        }
      }
    }

    if (waveEnd < totalHeight) {
      path += ` L ${x} ${totalHeight}`;
    }

    return path;
  };

  render() {
    const { totalItems, isIntro, isInverted } = this.props;
    const { animatedY, waveAmplitude } = this.state;
    const totalHeight = totalItems * ITEM_HEIGHT;
    const strokeColor = isInverted ? '#000000' : (isIntro ? '#FFFFFF' : '#000000');

    return (
      <svg
        width={WAVE_WIDTH}
        height={totalHeight}
        style={{ overflow: 'visible' }}
      >
        <path
          d={this.buildPath(animatedY, totalHeight, waveAmplitude)}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
        />
      </svg>
    );
  }
}

class ScrollMenu extends Component<Props, State> {
  state = {
    isOpen: false,
    isDragging: false,
    lockedStepId: null, // Initial state
  };

  // Timer to clear the lock
  lockTimer: ?TimeoutID = null;

  containerRef: ?HTMLDivElement = null;
  menuPanelRef: ?HTMLDivElement = null;

  getCurrentMenuIndex = (): number => {
    // FIX 3: PRIORITIZE LOCK
    // If user clicked a step, return THAT step index immediately.
    // This ignores the rapid updates from the scroll event while the page moves.
    const stepToCheck = this.state.lockedStepId || this.props.currentStep;

    if (!stepToCheck) return 0;

    const index = MENU_ITEMS.findIndex(item => item.id === stepToCheck);
    if (index === -1) {
      // Map step IDs to menu indices
      const stepToMenuMap = {
        // Intro section (index 0)
        'title': 0,
        'reading-waveform-graphs-intro': 0,
        // Time section (index 1)
        'x-axis-time': 1,
        // Amplitude section (index 2)
        'y-axis-amplitude': 2,
        'y-axis-amplitude-with-control': 2,
        // Frequency section (index 3)
        'frequency-introduction': 3,
        'frequency-introduction-pt2': 3,
        'frequency-with-control': 3,
        'resonance-frequency': 3,
        // Additive Synthesis section (index 4)
        'additive-synthesis-intro': 4,
        'additive-synthesis-draw-fourier': 4,
        'additive-synthesis-basic-add': 4,
        'additive-synthesis-intro-convergence': 4,
        'additive-synthesis-intro-num-of-harmonics': 4,
        'additive-synthesis-harmonics-tie-in': 4,
        // Phase section (index 5)
        'additive-synthesis-phase': 5,
        'additive-synthesis-noise-cancelling': 5,
        // Sound Decomposition in Nature (index 6)
        'sound-decomposition-in-nature': 6,
        // Waves Beyond Sound (index 7)
        'waves-beyond-sound': 7,
        // Light as Waves (index 8)
        'light-decomposition': 8,
        // Light Decomposition in Nature (index 9)
        'light-decomposition-nature': 9,
        // Spectral Decomposition in Technology (index 10)
        'fourier-in-technology': 10,
        'fourier-in-technology-exit': 10,
      };
      const mappedIndex = stepToMenuMap[stepToCheck];
      return mappedIndex !== undefined ? mappedIndex : 0;
    }
    return index;
  };

  toggleMenu = () => {
    this.setState(prev => ({ isOpen: !prev.isOpen }));
  };

  handleNavigation = (route: string) => {
    const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
    if (route === 'start') {
      window.location.href = `${base}/`;
    } else if (route === 'wave') {
      window.location.href = `${base}/waveforms-intro`;
    } else if (route === 'examples') {
      window.location.href = `${base}/examples`;
    }
  };

  handleMouseDown = (e: MouseEvent) => {
    if (this.props.variant !== 'intro') return;
    this.setState({ isDragging: true });
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    e.preventDefault();
  };

  handleMouseMove = (e: MouseEvent) => {
    if (!this.state.isDragging || !this.props.onScrollTo) return;

    const windowHeight = window.innerHeight;
    const handleHeight = 60;
    const visualTopStart = 25; // (80 - 55)

    // נקודת הסיום הויזואלית היא תחתית המסך פחות גובה הידית
    const visualTopEnd = windowHeight - handleHeight;
    const maxTravel = visualTopEnd - visualTopStart;

    // חישוב המיקום הויזואלי הנוכחי של העכבר (מרכז הידית)
    const visualTop = e.clientY - (handleHeight / 2);

    // הגבלה (Clamp) בין ההתחלה לסוף
    const clampedVisualTop = Math.max(visualTopStart, Math.min(visualTop, visualTopEnd));

    // חישוב התקדמות ה-Scroll מ-0 ל-1
    const newProgress = (clampedVisualTop - visualTopStart) / maxTravel;

    this.props.onScrollTo(newProgress);
  };

  handleMouseUp = () => {
    this.setState({ isDragging: false });
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  };

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    if (this.lockTimer) clearTimeout(this.lockTimer);
  }

  getIndicatorTop() {
    const { scrollProgress = 0, variant } = this.props;
    if (variant !== 'intro') return 80;

    const windowHeight = window.innerHeight;
    const handleHeight = 60;
    const visualTopStart = 25;

    const maxTravel = windowHeight - handleHeight - visualTopStart;

    const effectiveProgress = scrollProgress;

    if (effectiveProgress >= 1) {
      return visualTopStart + maxTravel + 55;
    }

    return visualTopStart + (effectiveProgress * maxTravel) + 55;
  }

  getMenuTop(indicatorTop: number) {
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const menuHeight = 400;
    const maxTopPosition = 60;

    let menuTop = indicatorTop;
    return Math.max(maxTopPosition, Math.min(menuTop, windowHeight - menuHeight));
  }

  handleStepClick = (stepId: string) => {
    // FIX 4: SET LOCK
    // Lock the menu to this step ID so it doesn't dance around while scrolling
    this.setState({ lockedStepId: stepId });

    if (this.props.onScrollToStep) {
      this.props.onScrollToStep(stepId);
    }

    // Clear any existing timer
    if (this.lockTimer) clearTimeout(this.lockTimer);

    // Unlock after 1.2 seconds (approx time for smooth scroll to finish)
    this.lockTimer = setTimeout(() => {
      this.setState({ lockedStepId: null });
    }, 1200);
  };

  render() {
    const { variant, isInverted, items } = this.props;
    const { isOpen, isDragging, lockedStepId } = this.state;
    const menuItems = items || MENU_ITEMS;

    const isIntro = variant === 'intro';
    const useInvertedColors = isInverted && isIntro;
    const indicatorTop = this.getIndicatorTop();
    const menuTop = this.getMenuTop(indicatorTop);
    const currentMenuIndex = this.getCurrentMenuIndex();

    return (
      <Container>
        <ScrollHandle
          isIntro={isIntro}
          isInverted={useInvertedColors}
          isOpen={isOpen}
          top={indicatorTop - 55}
          isDragging={isDragging}
          onClick={this.toggleMenu}
          onMouseDown={isIntro ? this.handleMouseDown : undefined}
          style={{ cursor: isIntro ? (isDragging ? 'grabbing' : 'grab') : 'pointer' }}
        />

        <MenuPanel isOpen={isOpen} isIntro={isIntro} isInverted={useInvertedColors} top={menuTop}>
          <MenuContent isIntro={isIntro}>
            <MenuItem
              isIntro={isIntro}
              isInverted={useInvertedColors}
              onClick={() => this.handleNavigation('start')}
            >
              back to the start
            </MenuItem>

            {isIntro && this.props.onScrollToStep && (
              <React.Fragment>
                <MenuDivider isIntro={isIntro} isInverted={useInvertedColors} />

                <MenuItemsContainer>
                  <WavePointerContainer>
                    <WavePointerSVG
                      currentIndex={currentMenuIndex}
                      totalItems={menuItems.length}
                      isIntro={isIntro}
                      isInverted={useInvertedColors}
                    />
                  </WavePointerContainer>

                  <MenuItemsList>
                    {menuItems.map((item, index) => {
                      // FIX 5: Use lockedStepId for highlighting logic too
                      const isActive = lockedStepId
                        ? item.id === lockedStepId
                        : index === currentMenuIndex;

                      return (
                        <StepMenuItem
                          key={item.id}
                          isIntro={isIntro}
                          isInverted={useInvertedColors}
                          isActive={isActive}
                          onClick={() => this.handleStepClick(item.id)}
                        >
                          {item.label}
                        </StepMenuItem>
                      );
                    })}
                  </MenuItemsList>
                </MenuItemsContainer>
              </React.Fragment>
            )}
          </MenuContent>
        </MenuPanel>
      </Container>
    );
  }
}

// ... (KEEP ALL YOUR EXISTING STYLED COMPONENTS BELOW EXACTLY AS THEY WERE) ...
const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
`;

const ScrollHandle = styled.div`
  position: fixed;
  right: ${props => props.isOpen ? `${props.isIntro ? '250px' : '200px'}` : '10px'};
  top: ${props => props.top}px;
  width: 20px;
  height: 60px;
  background-color: ${props => props.isInverted ? '#FFFFFF' : (props.isIntro ? '#000000' : '#FFFFFF')};
  cursor: pointer !important;
  pointer-events: auto;
  
  transition: ${props => (props.isDragging || props.top >= (window.innerHeight - 65))
    ? 'none'
    : 'top 0.05s linear, right 0.3s ease-in-out, background-color 0.3s ease'};

  &:hover {
    opacity: 0.8;
  }
`;

const MenuPanel = styled.div`
  position: fixed;
  top: ${props => props.top - 55}px;
  right: ${props => props.isOpen ? '0' : `${props.isIntro ? '-240px' : '-190px'}`};
  width: ${props => props.isIntro ? '240px' : '190px'};
  height: auto;
  max-height: 90vh;
  background-color: ${props => props.isInverted ? '#FFFFFF' : (props.isIntro ? '#000000' : '#FFFFFF')};
  border-right: none;
  transition: right 0.3s ease-in-out, top 0.1s ease-out, background-color 0.3s ease;
  pointer-events: auto;
  padding: 20px;
  box-sizing: border-box;
  cursor: default !important;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MenuItem = styled.div`
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  color: ${props => props.isInverted ? '#000000' : (props.isIntro ? '#FFFFFF' : '#000000')};
  cursor: pointer !important;
  transition: opacity 0.2s ease, color 0.3s ease;

  &:hover {
    opacity: 0.6;
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background-color: ${props => props.isInverted ? 'rgba(0, 0, 0, 0.1)' : (props.isIntro ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)')};
  width: 100%;
  transition: background-color 0.3s ease;
`;

const MenuItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const WavePointerContainer = styled.div`
  position: relative;
  width: ${WAVE_WIDTH}px;
  min-width: ${WAVE_WIDTH}px;
  display: flex;
  align-items: flex-start;
`;

const MenuItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${ITEM_GAP}px;
  flex: 1;
`;

const StepMenuItem = styled.div`
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  font-weight: ${props => props.isActive ? '600' : '400'};
  color: ${props => {
    if (props.isInverted) {
      return props.isActive ? '#000000' : 'rgba(0, 0, 0, 0.5)';
    }
    if (props.isActive) {
      return props.isIntro ? '#FFFFFF' : '#000000';
    }
    return props.isIntro ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
  }};
  cursor: pointer !important;
  transition: color 0.3s ease, font-weight 0.3s ease;
  line-height: ${ITEM_LINE_HEIGHT}px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: ${props => props.isInverted ? '#000000' : (props.isIntro ? '#FFFFFF' : '#000000')};
  }
`;

export default ScrollMenu;