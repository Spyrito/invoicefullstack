import React from "react";
import InputSelect from "../components/InputSelect";
import InputField from "../components/InputField";

const InvoiceFilter = ({ filter, buyerList, sellerList, handleChange, handleSubmit}) => {
    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col">
                <InputSelect
                    name="buyerID"
                    items={buyerList}
                    handleChange={handleChange}
                    label="Odběratel"
                    prompt="nevybrán"
                    value={filter.buyerID || "nevybrán"} // If no value is selected, default to "nevybrán"
                />
                </div>
                <div className="col">
                <InputSelect
                    name="sellerID"
                    items={sellerList}
                    handleChange={handleChange}
                    label="Dodavatel"
                    prompt="nevybrán"
                    value={filter.sellerID || "nevybrán"} // If no value is selected, default to "nevybrán"
                />
                </div>
            </div>
            
            <div className="row">
                <div className="col">
                    <InputField
                        type="text"
                        name="product"
                        handleChange={handleChange}
                        label="Produkt"
                        prompt="Název produktu"
                        value={filter.product || ""} // Default empty string if not set
                    />
                </div>
            </div>
            
            <div className="row">
                <div className="col">
                    <InputField
                        type="number"
                        min="0"
                        name="minPrice"
                        handleChange={handleChange}
                        label="Minimální cena"
                        prompt="-"
                        value={filter.minPrice || ""} // Default empty string if not set
                    />
                </div>
                <div className="col">
                    <InputField
                        type="number"
                        min="0"
                        name="maxPrice"
                        handleChange={handleChange}
                        label="Maximální cena"
                        prompt="-"
                        value={filter.maxPrice || ""} // Default empty string if not set
                    />
                </div>
                <div className="col">
                    <InputField
                        type="number"
                        min="1"
                        name="limit"
                        handleChange={handleChange}
                        label="Počet faktur na stránku"
                        value={filter.limit || "10"} // Default to 10 invoices per page
                    />
                </div>
            </div>
        </form>
    );
};

export default InvoiceFilter;
