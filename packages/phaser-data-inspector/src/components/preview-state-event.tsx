import styled from 'styled-components';
import type { ReactElement } from 'react';
import type { PhaserDataInspectorMessage } from '../store/types';

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 0 0 calc(50% - 5px);
  box-sizing: border-box;
  border-left: 1px solid #ccc;
  padding: 1rem;
`;

const CloseButton = styled.button`
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
`;

export const PreviewStateEvent = ({ event, onClose }: { event: PhaserDataInspectorMessage, onClose: () => void }): ReactElement => {
    return (
        <PreviewContainer>
            <CloseButton onClick={() => onClose()}>X</CloseButton>
            <pre>{JSON.stringify(event.newValue, null, 2)}</pre>
        </PreviewContainer>
    );
};