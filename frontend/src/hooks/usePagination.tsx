import React, { useState } from 'react';
import { PaginationItem, PaginationLink, Pagination } from 'reactstrap';

const usePagination = (numRecords: number, pageSize: number) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pagesCount = Math.ceil(numRecords / pageSize);

  const goPrevPage = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setCurrentPage(currentPage - 1);
  };

  const goNextPage = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setCurrentPage(currentPage + 1);
  };

  const startRowCount = () => currentPage * pageSize;

  const endRowCount = () => (currentPage + 1) * pageSize;

  const onPageClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, page: number) => {
    e.preventDefault();
    setCurrentPage(page);
  };

  const PaginationComponent = () => (
    <Pagination style={{ margin: '1rem 0' }}>
      <PaginationItem disabled={currentPage <= 0}>
        <PaginationLink onClick={goPrevPage} previous href='#' />
      </PaginationItem>

      {[...Array(pagesCount)].map((_, idx) => (
        <PaginationItem key={idx}>
          <PaginationLink onClick={(e) => onPageClick(e, idx)} href='#'>
            {idx + 1}
          </PaginationLink>
        </PaginationItem>
      ))}

      <PaginationItem disabled={currentPage >= pagesCount - 1}>
        <PaginationLink onClick={goNextPage} next href='#' />
      </PaginationItem>
    </Pagination>
  );

  return { currentPage, pagesCount, startRowCount, endRowCount, PaginationComponent };
};

export default usePagination;
