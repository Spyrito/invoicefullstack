import React, { useEffect, useState, useRef } from "react";
import { apiDelete, apiGet } from "../utils/api";
import InvoiceTable from "./InvoiceTable";
import InvoiceFilter from "./InvoiceFilter";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";

// Main invoices page component
const InvoiceIndex = () => {
    const [invoices, setInvoices] = useState([]);
    const [filter, setFilter] = useState({ limit: 10, page: 0 });
    const [buyerList, setBuyerList] = useState([]);
    const [sellerList, setSellerList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const tableRef = useRef(null); // Reference to the invoice table

    const fetchInvoices = async () => {
        const query = new URLSearchParams(filter).toString();
        const data = await apiGet(`/api/invoices?${query}`);
        setInvoices(data);
    };

    const fetchInvoiceCount = async () => {
        const query = new URLSearchParams(filter).toString();
        const data = await apiGet(`/api/invoices/count?${query}`);
        setTotalCount(data.count);
    };

    useEffect(() => {
        fetchInvoices();
        fetchInvoiceCount();
        apiGet("/api/persons").then(setSellerList);
        apiGet("/api/persons").then(setBuyerList);

        // Scroll to the table after data is fetched
        if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [filter]);

    const deleteInvoice = async (id) => {
        try {
            await apiDelete(`/api/invoices/${id}`);
            setInvoices(invoices.filter((item) => item._id !== id));
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prev) => {
            const newFilter = { ...prev, [name]: value };
            if (value === "false") {
                delete newFilter[name];
            }
            return newFilter;
        });
    };

    return (
        <div>
            <h1>Seznam faktur</h1>
            <InvoiceFilter
                filter={filter}
                handleChange={handleFilterChange}
                confirm="Filtrovat"
                buyerList={buyerList}
                sellerList={sellerList}
            />
            <InvoiceTable ref={tableRef} deleteInvoice={deleteInvoice} items={invoices} filter={filter} />
            <Pagination filter={filter} setFilter={setFilter} totalCount={totalCount} />
            <Link to={"/invoices/create"} className="btn btn-success invoice-button">
                Nová faktura
            </Link>
        </div>
    );
};

export default InvoiceIndex;
