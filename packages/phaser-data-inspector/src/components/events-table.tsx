import { useMemo, type ReactElement } from 'react';
import styled from 'styled-components';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  flexRender,
} from '@tanstack/react-table';
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
  const columns = useMemo<ColumnDef<PhaserDataInspectorMessage>[]>(
    () => [
      {
        accessorKey: 'datetime',
        header: 'Datetime',
        cell: (info): string => {
          const value = info.getValue<string>() ?? '';
          const timePart = value.split('T')[1];
          return timePart ?? '';
        },
      },
      {
        accessorKey: 'sceneKey',
        header: 'Scene Key',
      },
      {
        accessorKey: 'key',
        header: 'Key',
        cell: (info): ReactElement => {
          const value = info.getValue<string>() ?? '';
          const displayValue = value.replace(/^phaser-hooks:(global|local):/, '');
          return <span title={value}>{displayValue}</span>;
        },
      },
      {
        accessorKey: 'registry',
        header: 'Registry',
      },
      {
        accessorKey: 'scope',
        header: 'Scope',
      },
    ],
    [],
  );

  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContainer className="overflow-auto" $hasPreview={hasPreview}>
      <table role="grid" className="table-row striped">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => onSelectEvent(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </TableRow>
          ))}
        </tbody>
      </table>
    </TableContainer>
  );
};
