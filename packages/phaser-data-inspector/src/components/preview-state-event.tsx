import { useState, type ReactElement } from 'react';
import styled from 'styled-components';
import { diffWords } from 'diff';
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

const TabsContainer = styled.div`
  display: flex;
  gap: 5px;
  border-bottom: 1px solid #ccc;
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 4px 12px;
  border: none;
  background: ${(props): string => props.$active ? '#e0e0e0' : 'transparent'};
  border-bottom: ${(props): string => props.$active ? '2px solid #007bff' : '2px solid transparent'};
  cursor: pointer;
  font-weight: ${(props): string => props.$active ? 'bold' : 'normal'};
  color: ${(props): string => props.$active ? '#000' : '#666'};
  font-size: 14px;
  
  &:hover {
    background: ${(props): string => props.$active ? '#e0e0e0' : '#e8e8e8'};
    color: ${(props): string => props.$active ? '#000' : '#333'};
  }
`;

const TabContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 10px 0;
`;

const JsonPre = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const DiffContainer = styled.div`
  font-family: monospace;
  font-size: 12px;
`;

const DiffLine = styled.div<{ $added?: boolean; $removed?: boolean }>`
  padding: 2px 4px;
  background: ${(props): string => 
    props.$added ? '#d4edda' : 
    props.$removed ? '#f8d7da' : 
    'transparent'
  };
  color: ${(props): string => 
    props.$added ? '#155724' : 
    props.$removed ? '#721c24' : 
    'inherit'
  };
`;

type TabType = 'new' | 'old' | 'diff';

export const PreviewStateEvent = ({ event, onClose }: { event: PhaserDataInspectorMessage, onClose: () => void }): ReactElement => {
    const [activeTab, setActiveTab] = useState<TabType>('new');

    const newValueStr = JSON.stringify(event.newValue, null, 2);
    const oldValueStr = event.oldValue ? JSON.stringify(event.oldValue, null, 2) : '';

    const renderDiff = (): ReactElement => {
        if (!event.oldValue) {
            return <div>No old value to compare</div>;
        }

        const differences = diffWords(oldValueStr, newValueStr);
        
        return (
            <DiffContainer>
                {differences.flatMap((part, index) => {
                    const lines = part.value.split('\n');
                    return lines.map((line, lineIndex) => (
                        <DiffLine
                            key={`${index}-${lineIndex}`}
                            $added={part.added}
                            $removed={part.removed}
                        >
                            {line || ' '}
                        </DiffLine>
                    ));
                })}
            </DiffContainer>
        );
    };

    return (
        <PreviewContainer>
            <CloseButton onClick={() => onClose()}>X</CloseButton>
            
            <TabsContainer>
                <Tab $active={activeTab === 'new'} onClick={() => setActiveTab('new')}>
                    New Value
                </Tab>
                <Tab $active={activeTab === 'old'} onClick={() => setActiveTab('old')}>
                    Old Value
                </Tab>
                <Tab $active={activeTab === 'diff'} onClick={() => setActiveTab('diff')}>
                    Diff
                </Tab>
            </TabsContainer>

            <TabContent>
                {activeTab === 'new' && (
                    <JsonPre>{newValueStr}</JsonPre>
                )}
                {activeTab === 'old' && (
                    <JsonPre>{oldValueStr || 'No old value'}</JsonPre>
                )}
                {activeTab === 'diff' && renderDiff()}
            </TabContent>
        </PreviewContainer>
    );
};