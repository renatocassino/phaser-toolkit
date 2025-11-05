import styled from 'styled-components';
import type { ReactElement } from 'react';

const PaginationContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const PaginationButton = styled.button`
  padding: 4px 12px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover:not(:disabled) {
    background: #f0f0f0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ItemsPerPageSelect = styled.select`
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
`;

const PaginationInfo = styled.span`
  font-size: 14px;
  color: #666;
`;

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: PaginationControlsProps): ReactElement => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return (
      <PaginationContainer>
        <PaginationInfo>
          Showing {startItem}-{endItem} of {totalItems}
        </PaginationInfo>
        <ItemsPerPageSelect
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
          <option value={1000}>1000 per page</option>
        </ItemsPerPageSelect>
      </PaginationContainer>
    );
  }

  return (
    <PaginationContainer>
      <PaginationInfo>
        Showing {startItem}-{endItem} of {totalItems}
      </PaginationInfo>
      <PaginationButtons>
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </PaginationButton>
        <PaginationInfo>
          Page {currentPage} of {totalPages}
        </PaginationInfo>
        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </PaginationButton>
        <ItemsPerPageSelect
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
          <option value={1000}>1000 per page</option>
        </ItemsPerPageSelect>
      </PaginationButtons>
    </PaginationContainer>
  );
};

