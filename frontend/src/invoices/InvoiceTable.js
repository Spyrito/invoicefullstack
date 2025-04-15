import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../contexts/session";

// Converting date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ'); // format: DD.MM.YYYY
};

const InvoiceTable = forwardRef(({ items, deleteInvoice, filter }, ref) => {
    const { session } = useSession();
    const isAdmin = session.data?.isAdmin === true;

    return (
        <div ref={ref} className="table-responsive">
            <hr />
            <table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Číslo faktury</th>
                        <th>Produkt</th>
                        <th className="d-none d-lg-table-cell">Popis</th>
                        <th>Cena</th>
                        <th className="d-none d-md-table-cell">Odběratel</th>
                        <th className="d-none d-md-table-cell">Dodavatel</th>
                        <th className="d-none d-xl-table-cell">Datum vydání</th>
                        <th className="d-none d-xl-table-cell">Datum splatnosti</th>
                        <th>Akce</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index + 1}>
                            <td>{(filter.page * filter.limit) + index + 1}</td>
                            <td>{item.invoiceNumber}</td>
                            <td>{item.product}</td>
                            <td className="d-none d-lg-table-cell">{item.note}</td>
                            <td>{item.price} Kč</td>
                            <td className="d-none d-md-table-cell">
                                <Link to={`/persons/show/${item.buyer._id}`} className="company-link">
                                    {item.buyer.name}
                                </Link>
                            </td>
                            <td className="d-none d-md-table-cell">
                                <Link to={`/persons/show/${item.seller._id}`} className="company-link">
                                    {item.seller.name}
                                </Link>
                            </td>
                            <td className="d-none d-xl-table-cell">{formatDate(item.issued)}</td>
                            <td className="d-none d-xl-table-cell">{formatDate(item.dueDate)}</td>
                            <td>
                                <div className="d-flex flex-column flex-lg-row gap-2">
                                    <Link to={"/invoices/show/" + item._id} className="btn btn-sm btn-info">
                                        Zobrazit
                                    </Link>
                                    {isAdmin ? (
                                        <Link to={"/invoices/edit/" + item._id} className="btn btn-sm btn-warning">
                                            Upravit
                                        </Link>
                                    ) : null}

                                    {isAdmin ? (
                                        <button onClick={() => deleteInvoice(item._id)} className="btn btn-sm btn-danger">
                                            Odstranit
                                        </button>
                                    ) : null}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

export default InvoiceTable;
