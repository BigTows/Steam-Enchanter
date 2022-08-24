import React, { ReactNode } from "react";

interface PaginationProperties {
  items: number,
  itemsPerPage: number,
  currentPage: number;
  callback: (newPage: number) => void;
}

/**
 * (1) 2 3 4 5 6 7
 * 1 2 3 (4) 5 6 ... 8
 * (1) 2 3 ... 8
 * 1 ... 3 4 (5) 6 7 ... 44
 * 1 2 3 (4) 5 6 ... 44
 * 1 ... 39 40 (41) 42 43 44
 *
 * Like steam :)
 * @param props
 * @constructor
 */
export default function Pagination(props: PaginationProperties) {

  const maxPages = Math.ceil(props.items / props.itemsPerPage);
  const pages: number[] = [];

  if (maxPages <= 7) {
    pages.push(...Array.from({ length: maxPages }, (_, i) => i + 1));
  } else {
    for (let closePage = props.currentPage - 2; closePage <= props.currentPage + 2; closePage++) {
      if (closePage < 1 || closePage > maxPages) {
        continue;
      }
      pages.push(closePage);
    }
    if (pages[0] !== 1) {
      pages.unshift(1);
    }

    if (pages[pages.length - 1] !== maxPages) {
      pages.push(maxPages);
    }
  }

  const onPagination = (targetPage: number) => {
    if (targetPage > 0 && targetPage <= maxPages) {
      props.callback(targetPage);
    }
  };


  const pagesElements: ReactNode[] = pages.map((page, i) => {

    if (page === props.currentPage) {
      return (
        <span key={`page-${i}`}>
          {page}
          <span className="pagination_space">&nbsp;&nbsp;</span>
        </span>
      );
    } else if (i + 1 < pages.length && page + 1 !== pages[i + 1]) {
      return (
        <span key={`page-${i}`}>
          <a className="pagelink" onClick={() => onPagination(page)}>{page}</a>&nbsp;...&nbsp;
        </span>
      );
    } else {
      return (
        <span key={`page-${i}`}>
          <a className="pagelink" onClick={() => onPagination(page)}>{page}</a>
          <span className="pagination_space">&nbsp;&nbsp;</span>
        </span>
      );
    }
  });


  return (
    <div className="profile_paging">
      <div className="pageLinks">

        <a className={"pagebtn " + (props.currentPage === 1 ? "disabled" : "")}
           onClick={() => onPagination(props.currentPage - 1)}>&lt;</a>&nbsp;
        {pagesElements}
        <a className={"pagebtn " + (props.currentPage === maxPages ? "disabled" : "")}
           onClick={() => onPagination(props.currentPage + 1)}>&gt;</a>
      </div>
      Showing {((props.currentPage - 1) * props.itemsPerPage + 1).toLocaleString()}-{(Math.min(props.currentPage * props.itemsPerPage, props.items)).toLocaleString()} of {props.items.toLocaleString()} uncompleted badges
    </div>
  );
}