import { type ReactElement } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  font-family: system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const Card = styled.div`
  max-width: 600px;
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  color: #1f2937;
`;

const Icon = styled.div`
  font-size: 64px;
  margin-bottom: 1rem;
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #111827;
`;

const Description = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const InstructionsBox = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
`;

const InstructionsTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
`;

const InstructionsList = styled.ol`
  margin: 0;
  padding-left: 1.5rem;
  font-size: 14px;
  color: #4b5563;
  line-height: 2;
  
  li {
    margin-bottom: 0.5rem;
    
    strong {
      color: #111827;
      font-weight: 600;
    }
  }
`;

const Tip = styled.p`
  font-size: 13px;
  color: #9ca3af;
  font-style: italic;
  margin-top: 1.5rem;
  
  span {
    font-style: normal;
  }
`;

const ScreenshotPlaceholder = styled.div`
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 3rem 2rem;
  margin-bottom: 1.5rem;
  color: #9ca3af;
  font-size: 14px;
  
  span {
    font-size: 32px;
    display: block;
    margin-bottom: 0.5rem;
  }
`;

export function ActivationInstructions(): ReactElement {
  return (
    <Container>
      <Card>
        <Icon>🎮</Icon>
        
        <Title>Activate Phaser Data Inspector</Title>
        
        <Description>
          To start inspecting your Phaser game state, you need to activate the extension first.
        </Description>

        <InstructionsBox>
          <InstructionsTitle>📋 Follow these steps:</InstructionsTitle>
          
          <InstructionsList>
            <li>
              Click on the <strong>Phaser Data Inspector extension icon</strong> in your browser toolbar (top-right corner, next to the address bar)
            </li>
            <li>
              In the popup that appears, click the <strong>"Activate inspect"</strong> button
            </li>
            <li>
              Wait a moment and this panel will automatically update
            </li>
          </InstructionsList>
        </InstructionsBox>

        <ScreenshotPlaceholder>
          <span>🖱️</span>
          Look for the extension icon in your toolbar
          <img src="./how-to-activate.png" alt="How to activate" />

        </ScreenshotPlaceholder>

        <Tip>
          <span>💡</span> Tip: You only need to do this once per page. If you refresh the page, just click the extension icon again.
        </Tip>
      </Card>
    </Container>
  );
}
