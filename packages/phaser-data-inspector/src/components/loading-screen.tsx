import { type ReactElement } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const Content = styled.div`
  text-align: center;
`;

const Spinner = styled.div`
  font-size: 48px;
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Text = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
`;

export const LoadingScreen = (): ReactElement => {
  return (
    <Container>
      <Content>
        <Spinner><i className="fa-solid fa-gear"></i></Spinner>
        <Text>Checking extension status...</Text>
      </Content>
    </Container>
  );
}
