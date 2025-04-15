import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../utils/api";
import InputField from "../components/InputField";
import InputSelect from "../components/InputSelect";
import FlashMessage from "../components/FlashMessage";

const InvoiceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get invoice ID from URL params if editing an invoice

    // State variables for form data and API responses
    const [sellerList, setSellerList] = useState([]);
    const [buyerList, setBuyerList] = useState([]);
    const [invoice, setInvoice] = useState({
        invoiceNumber: "",
        seller: { _id: "" },
        buyer: { _id: "" },
        issued: new Date().toISOString().split("T")[0], // Default to today's date
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Default to 14 days later
        product: "",
        price: "",
        vat: "21",
        note: "",
    });
    const [sent, setSent] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Fetch existing invoice data if editing and load seller & buyer lists
    useEffect(() => {
        if (id) {
            apiGet("/api/invoices/" + id).then((data) => setInvoice(data));
        }
        apiGet("/api/persons").then(setSellerList);
        apiGet("/api/persons").then(setBuyerList);
    }, [id]);

    // Handle changes in text input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInvoice((prev) => ({ ...prev, [name]: value }));
    };

    // Handle changes in dropdown selection fields
    const handleSelectChange = (name, value) => {
        setInvoice((prev) => ({ ...prev, [name]: { _id: value } }));
    };

    // Handle form submission (creating or updating an invoice)
    const handleSubmit = (e) => {
        e.preventDefault();
        const apiCall = id ? apiPut("/api/invoices/" + id, invoice) : apiPost("/api/invoices", invoice);
        apiCall
            .then(() => {
                setSent(true);
                setSuccess(true);
                setTimeout(() => navigate("/invoices"), 2000); // Redirect after successful save
            })
            .catch((error) => {
                setError(error.message);
                setSent(true);
                setSuccess(false);
            });
    };

    return (
        <div>
            <h1>{id ? "Upravit" : "Vytvořit"} fakturu</h1>
            <hr />
            {error && <div className="alert alert-danger">{error}</div>}
            {sent && <FlashMessage theme={success ? "success" : ""} text={success ? "Uložení faktury proběhlo úspěšně." : ""} />}
            <form onSubmit={handleSubmit}>

                <InputField 
                    required type="text" 
                    name="invoiceNumber" 
                    label="Číslo faktury" 
                    value={invoice.invoiceNumber} 
                    handleChange={handleChange} 
                />
                
                <InputSelect 
                    name="seller"
                    items={sellerList} label="Dodavatel"
                    prompt="Vyberte dodavatele"
                    value={invoice.seller._id} 
                    handleChange={(e) => handleSelectChange("seller", e.target.value)} 
                />
                <InputSelect 
                    name="buyer" 
                    items={buyerList} 
                    prompt="Vyberte odběratele"
                    label="Odběratel" 
                    value={invoice.buyer._id} 
                    handleChange={(e) => handleSelectChange("buyer", e.target.value)} 
                />
                
                <InputField 
                    required 
                    type="date"
                    name="issued" 
                    label="Datum vydání faktury" 
                    value={invoice.issued} 
                    handleChange={handleChange} 
                />

                <InputField 
                    required
                    type="date" 
                    name="dueDate" 
                    label="Datum splatnosti faktury" 
                    value={invoice.dueDate} 
                    handleChange={handleChange} 
                />
                <InputField 
                    required 
                    type="text" 
                    name="product" 
                    label="Název produktu" 
                    value={invoice.product} 
                    handleChange={handleChange} 
                />
                <InputField 
                    required 
                    type="text" 
                    name="note" 
                    label="Popis" 
                    value={invoice.note} 
                    handleChange={handleChange} 
                />
                <InputField 
                    required 
                    type="text" 
                    name="vat" 
                    label="Daň" 
                    value={invoice.vat} 
                    handleChange={handleChange} 
                />
                <InputField 
                    required 
                    type="text" 
                    name="price" 
                    label="Cena" 
                    value={invoice.price} 
                    handleChange={handleChange} 
                />
                
                <input type="submit" className="btn btn-primary" value="Uložit" />
            </form>
        </div>
    );
};

export default InvoiceForm;
