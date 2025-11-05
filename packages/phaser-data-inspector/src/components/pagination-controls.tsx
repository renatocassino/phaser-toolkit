import styled from 'styled-components';
import type { ReactElement } from 'react';

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px 0;
`;

const PaginationRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const PaginationLeft = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex: 0 0 auto;
`;

const PaginationRight = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex: 0 0 auto;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const PaginationButton = styled.button`
  padding: 4px 12px;
  border: 1px solid #333;
  background: #fff;
  color: #000;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 500;
  
  &:hover:not(:disabled) {
    background: #e0e0e0;
    border-color: #000;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f5f5f5;
    color: #666;
  }
`;

const ItemsPerPageSelect = styled.select`
  padding: 3px 6px;
  border: 1px solid #333;
  border-radius: 4px;
  background: #fff;
  color: #000;
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  width: auto;
  flex: 0 0 auto;
  
  &:hover {
    border-color: #000;
    background: #f5f5f5;
  }
  
  option {
    background: #fff;
    color: #000;
  }
`;

const PaginationInfo = styled.span`
  font-size: 14px;
  color: var(--pico-color);
  font-weight: 500;
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
        <PaginationRow>
          <PaginationInfo>
            Showing {startItem}-{endItem} of {totalItems}
          </PaginationInfo>
        </PaginationRow>
        <PaginationRow style={{ justifyContent: 'flex-start' }}>
          <ItemsPerPageSelect
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            <option value={10}>10 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
            <option value={1000}>1000 per page</option>
          </ItemsPerPageSelect>
        </PaginationRow>
      </PaginationContainer>
    );
  }

  return (
    <PaginationContainer>
      <PaginationRow>
        <PaginationLeft>
          <PaginationInfo>
            Showing {startItem}-{endItem} of {totalItems}
          </PaginationInfo>
        </PaginationLeft>
        <PaginationRight>
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
          </PaginationButtons>
        </PaginationRight>
      </PaginationRow>
      <PaginationRow style={{ justifyContent: 'flex-start' }}>
        <ItemsPerPageSelect
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
          <option value={1000}>1000 per page</option>
        </ItemsPerPageSelect>
      </PaginationRow>
    </PaginationContainer>
  );
};

