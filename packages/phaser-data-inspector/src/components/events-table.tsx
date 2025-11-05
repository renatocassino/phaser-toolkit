import styled from 'styled-components';
import type { ReactElement } from 'react';
import type { PhaserDataInspectorMessage } from '../store/types';

const TableContainer = styled.div<{ $hasPreview?: boolean }>`
  flex: ${(props): string => props.$hasPreview ? '0 0 calc(50% - 5px)' : '1 1 100%'};
  overflow: auto;
  box-sizing: border-box;
`;

const TableRow = styled.tr`
  cursor: pointer;
`;

interface EventsTableProps {
  events: PhaserDataInspectorMessage[];
  onSelectEvent: (event: PhaserDataInspectorMessage) => void;
  hasPreview: boolean;
}

export const EventsTable = ({ events, onSelectEvent, hasPreview }: EventsTableProps): ReactElement => {
  return (
    <TableContainer className="overflow-auto" $hasPreview={hasPreview}>
      <table role="grid" className="table-row striped">
        <thead>
          <tr>
            <th>Datetime</th>
            <th>Scene Key</th>
            <th>Registry</th>
            <th>Scope</th>
            <th>Key</th>
          </tr>
        </thead>
        <tbody>
          {events.map((message) => (
            <TableRow 
              onClick={() => onSelectEvent(message)} 
              key={`${message.datetime}-${message.sceneKey}-${message.registry}-${message.scope}-${message.key}`}
            >
              <td>{message.datetime.split('T')[1]}</td>
              <td>{message.sceneKey}</td>
              <td>{message.registry}</td>
              <td>{message.scope}</td>
              <td>{message.key.replace(/^phaser-hooks:(global|local):/, '')}</td>
            </TableRow>
          ))}
        </tbody>
      </table>
    </TableContainer>
  );
};

