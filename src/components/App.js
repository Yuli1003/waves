import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { injectGlobal } from 'styled-components';

import { COLORS } from '../constants';

import IntroRoute from './IntroRoute';
import SpectralDecomposition from './SpectralDecomposition';
import EndingRoute from './EndingRoute';
import Examples from './Examples';
import Footer from './Footer';
import FontDebugger from './FontDebugger';

// NOTE: Many of the variable-free global CSS lives in public/index.html.
// I think it's better to leave stuff there to avoid a flash once the JS is
// parsed.
// For certain things that require variables, though, better to do it here.
injectGlobal`
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
  
  * {
    cursor: none !important;
  }

  /* Hide scrollbar globally */
  html, body {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  body::-webkit-scrollbar,
  html::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    background: transparent;
  }

  /* Scroll-snap behavior for IntroRoute sections */
  /* Starts as mandatory; IntroRoute dynamically switches to proximity near the ending */
  @media (orientation: landscape) {
    html {
      scroll-snap-type: y mandatory;
      scroll-behavior: smooth;
      scroll-padding-top: 9vh;
    }
  }

  body {
    background-color: #ffffff;
    color: ${COLORS.gray[800]};
    font-family: 'Space Mono', monospace;
  }
  
`;


class App extends React.Component {
  state = {
    showFontDebugger: false,
  };

  componentDidMount() {
    this.mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.animationFrameId = null;

    this.handleMouseMove = (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
    };

    this.handleKeyDown = (e) => {
      // Toggle font debugger with Ctrl+D
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        this.setState(prevState => ({
          showFontDebugger: !prevState.showFontDebugger
        }));
      }
    };

    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('keydown', this.handleKeyDown);

    // Create crosshair cursor canvas
    this.createRippleCursor();
  }

  createRippleCursor() {
    this.cursorCanvas = document.createElement('canvas');
    this.cursorCanvas.width = window.innerWidth;
    this.cursorCanvas.height = window.innerHeight;
    this.cursorCanvas.style.position = 'fixed';
    this.cursorCanvas.style.top = '0';
    this.cursorCanvas.style.left = '0';
    this.cursorCanvas.style.width = '100%';
    this.cursorCanvas.style.height = '100%';
    this.cursorCanvas.style.zIndex = '9999';
    this.cursorCanvas.style.pointerEvents = 'none';

    document.body.appendChild(this.cursorCanvas);
    this.ctx = this.cursorCanvas.getContext('2d');
    this.time = 0;

    // Start animation
    this.animate();
  }

  animate = () => {
    const ctx = this.ctx;
    const { width, height } = this.cursorCanvas;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Crosshair cursor that cuts around interactive elements
    const isInverted = document.body.classList.contains('inverted');
    const lineColor = isInverted ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
    const lineWidth = 1;

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(this.mousePos.x, 0);
    ctx.lineTo(this.mousePos.x, height);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, this.mousePos.y);
    ctx.lineTo(width, this.mousePos.y);
    ctx.stroke();

    // Continue animation
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('keydown', this.handleKeyDown);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.cursorCanvas && this.cursorCanvas.parentNode) {
      this.cursorCanvas.parentNode.removeChild(this.cursorCanvas);
    }
  }

  toggleFontDebugger = () => {
    this.setState(prevState => ({
      showFontDebugger: !prevState.showFontDebugger
    }));
  };

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Fragment>
          <Switch>
            <Route exact path="/" component={SpectralDecomposition} />
            <Route path="/examples" component={Examples} />
            <Route path="/waveforms-intro" component={IntroRoute} />
            <Route path="/ending" component={EndingRoute} />
          </Switch>
          <Footer />
          {this.state.showFontDebugger && (
            <FontDebugger onClose={this.toggleFontDebugger} />
          )}
        </Fragment>
      </Router>
    );
  }
}

export default App;
