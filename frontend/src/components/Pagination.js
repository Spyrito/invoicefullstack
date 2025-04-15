import React from "react";

const Pagination = ({ filter, setFilter, totalCount }) => {
    // Calculate the total number of pages, ensuring at least one page is available
    const totalPages = Math.max(1, Math.ceil(totalCount / filter.limit));

    // Function to change the current page while keeping it within valid bounds
    const changePage = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setFilter((prev) => ({ ...prev, page: newPage })); // Update the filter state with the new page
        }
    };

    return (
        <nav aria-label="Navigace stránek" className="mt-3">
            <ul className="pagination justify-content-center">
                {/* Previous Page Button - Disabled if on the first page */}
                <li className={`page-item ${filter.page === 0 ? "disabled" : ""}`}>
                    <button className="page-link custom-page-link fs-6" onClick={() => changePage(filter.page - 1)}>
                        <i className="bi bi-arrow-left fs-6"></i> Předchozí
                    </button>
                </li>

                {/* Display Current Page Information */}
                <li className="page-item active">
                    <span className="page-link custom-page-info fs-6">
                        Strana {filter.page + 1} z {totalPages}
                    </span>
                </li>

                {/* Next Page Button - Disabled if on the last page */}
                <li className={`page-item ${filter.page >= totalPages - 1 ? "disabled" : ""}`}>
                    <button className="page-link custom-page-link fs-6" onClick={() => changePage(filter.page + 1)}>
                        Další <i className="bi bi-arrow-right fs-6"></i>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
