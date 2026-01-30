// SpectralStaticHeader.js
import React from 'react';
import styled from 'styled-components';

const SpectralStaticHeader = () => {
  // Same blocks data
  const blocks = [
    { left: 1, width: 9 }, { left: 15, width: 9 }, { left: 30, width: 9 }, { left: 48, width: 9 },
    { left: 62, width: 9 }, { left: 77, width: 9 }, { left: 98, width: 9 }, { left: 115, width: 9 },
    { left: 130, width: 9 }, { left: 145, width: 12 }, { left: 162, width: 12 }, { left: 184, width: 12 },
    { left: 209, width: 18 }, { left: 232, width: 18 }, { left: 263, width: 29 }, { left: 317, width: 26 },
    { left: 351, width: 53 }, { left: 412, width: 36 }, { left: 529, width: 54 }, { left: 605, width: 79 },
    { left: 693, width: 405 },
    { left: 1119, width: 122 }, { left: 1254, width: 18 }, { left: 1300, width: 18 }, { left: 1325, width: 14 },
    { left: 1345, width: 10 }, { left: 1365, width: 10 }, { left: 1380, width: 10 }, { left: 1395, width: 13 },
    { left: 1420, width: 10 }
  ];

  const designWidth = 1440;
  const scaleToViewport = (px) => (px / designWidth) * 100;

  return (
    <HeaderWrapper>
      {/* FORCE WHITE BACKGROUND HERE */}
      <BackgroundFix />

      <Title>
        SPECTRAL<br />DECOMPOSITION
      </Title>

      <BarcodeRow>
        {blocks.map((block, index) => (
          <Block
            key={index}
            style={{
              left: `${scaleToViewport(block.left)}%`,
              width: `${scaleToViewport(block.width)}%`
            }}
          />
        ))}
      </BarcodeRow>
    </HeaderWrapper>
  );
};

// --- STYLES ---

const HeaderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 250px; /* Covers the top area */
  z-index: 0;
`;

/* New component to force the background white behind the header */
const BackgroundFix = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  z-index: -1; 
`;

const Title = styled.h1`
  font-family: 'Waves', monospace; 
  line-height: 1.08; 
  color: #000; 
  margin: 0; 
  text-align: left;
  position: absolute;
  left: 3rem; 
  bottom: 20px; 
  font-size: 92px; 
  transform-origin: bottom left;
`;

const BarcodeRow = styled.div`
  position: absolute; 
  left: 0; 
  width: 100%; 
  top: 80px; 
  height: 15px; 
`;

const Block = styled.div`
  position: absolute;
  background: #020202;
  height: 100%;
`;

export default SpectralStaticHeader;