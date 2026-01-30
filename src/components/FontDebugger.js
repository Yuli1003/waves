// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

const Panel = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border: 2px solid #005c48ff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  min-width: 280px;
  font-family: system-ui, sans-serif;
  cursor: auto !important;
  
  * {
    cursor: auto !important;
  }
`;

const Title = styled.h3`
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #005c48ff;
  font-weight: bold;
`;

const Section = styled.div`
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #333;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #005c48ff;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #005c48ff;
  }
`;

const Button = styled.button`
  padding: 6px 12px;
  background: #005c48ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background: #004a38;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  line-height: 1;
  
  &:hover {
    color: #333;
  }
`;

const Hint = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  font-size: 11px;
  color: #666;
`;

type Props = {
  onClose: () => void,
};

type State = {
  font: string,
  fontSize: number,
};

const FONTS = [
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Space Mono", monospace', label: 'Space Mono' },
  { value: '"JetBrains Mono", monospace', label: 'JetBrains Mono' },
  { value: '"Space Grotesk", sans-serif', label: 'Space Grotesk' },
  { value: '"Syne", sans-serif', label: 'Syne' },
];

class FontDebugger extends Component<Props, State> {
  state = {
    font: 'Georgia, serif',
    fontSize: 14,
  };

  componentDidMount() {
    this.applyStyles();
    this.loadGoogleFonts();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevState.font !== this.state.font ||
      prevState.fontSize !== this.state.fontSize
    ) {
      this.applyStyles();
    }
  }

  loadGoogleFonts() {
    const fonts = [
      'Space+Mono:wght@400;700',
      'JetBrains+Mono:wght@400;700',
      'Space+Grotesk:wght@400;700',
      'Syne:wght@400;700',
    ];

    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?${fonts.map(f => `family=${f}`).join('&')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  applyStyles() {
    const { font, fontSize } = this.state;

    // Update the global styles
    const styleId = 'font-debugger-styles';
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      *:not(#font-debugger-panel):not(#font-debugger-panel *) {
        font-family: ${font} !important;
      }
      
      body {
        font-size: ${fontSize}px !important;
      }
    `;
  }

  handleFontChange = (e: SyntheticEvent<HTMLSelectElement>) => {
    this.setState({ font: e.currentTarget.value });
  };

  handleFontSizeChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const value = parseInt(e.currentTarget.value, 10);
    if (!isNaN(value)) {
      this.setState({ fontSize: value });
    }
  };

  incrementSize = (delta: number) => {
    this.setState(prevState => ({
      fontSize: Math.max(8, Math.min(32, prevState.fontSize + delta))
    }));
  };

  render() {
    const { onClose } = this.props;
    const { font, fontSize } = this.state;

    return (
      <Panel id="font-debugger-panel">
        <CloseButton onClick={onClose}>×</CloseButton>

        <Title>Font Debugger</Title>

        <Section>
          <Label>Font Family</Label>
          <Select value={font} onChange={this.handleFontChange}>
            {FONTS.map(f => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </Select>
        </Section>

        <Section>
          <Label>Base Font Size (px)</Label>
          <InputGroup>
            <Button onClick={() => this.incrementSize(-1)}>−</Button>
            <Input
              type="number"
              value={fontSize}
              onChange={this.handleFontSizeChange}
              min="8"
              max="32"
            />
            <Button onClick={() => this.incrementSize(1)}>+</Button>
          </InputGroup>
        </Section>

        <Hint>
          Press <strong>Ctrl+D</strong> to toggle this panel
        </Hint>
      </Panel>
    );
  }
}

export default FontDebugger;
