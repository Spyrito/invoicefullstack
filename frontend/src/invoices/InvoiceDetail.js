import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";
import {apiGet} from "../utils/api";

const InvoiceDetail = () => {
    const {id} = useParams();
    const [invoice, setInvoice] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
            apiGet("/api/invoices/" + id).then((data) => setInvoice(data)).catch((error) => console.error(error));
    }, []);

    return (
        <>
            <div>
                <h1>Detail faktury</h1>
                <hr/>
                <h3>Faktura číslo: {invoice.invoiceNumber}</h3>
                <p>
                    <strong>Prodávající:</strong>
                    <br/>
                    <Link to={`/persons/show/${invoice.seller?._id}`} className="company-link">
                    {invoice.seller?.name}
                    </Link>
                    
                </p>
                <p>
                    <strong>Kupující:</strong>
                    <br/>
                    <Link to={`/persons/show/${invoice.buyer?._id}`} className="company-link">
                    {invoice.buyer?.name}
                    </Link>
                </p>
                <p>
                    <strong>Datum vydání faktury:</strong>
                    <br/>
                    {invoice.issued}
                </p>
                <p>
                    <strong>Datum splatnosti faktury:</strong>
                    <br/>
                    {invoice.dueDate}
                </p>
                <p>
                    <strong>Název produktu:</strong>
                    <br/>
                    {invoice.product}
                </p>
                <p>
                    <strong>Popis:</strong>
                    <br/>
                    {invoice.note}
                </p>
                <p>
                    <strong>Daň:</strong>
                    <br/>
                    {invoice.vat}
                </p>
                <p>
                    <strong>Cena:</strong>
                    <br/>
                    {invoice.price}
                </p>
                <button onClick={() => navigate(-1)} className="btn btn-primary">
                Zpět
            </button>
            </div>
        </>
    );
};

export default InvoiceDetail;
