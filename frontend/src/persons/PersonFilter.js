import React from "react";
import InputField from "../components/InputField";

const PersonFilter = ({ handleChange, filter }) => {
    return (
        <div className="mb-4">
            <div className="row">
                <div className="col-9">
                    <InputField
                        type="text"
                        name="identificationNumber"
                        handleChange={handleChange}
                        label="Identifikační číslo"
                        prompt="-"
                        value={filter.identificationNumber || ""}
                    />
                </div>
                <div className="col-3">
                    <InputField
                        type="number"
                        min="1"
                        name="limit"
                        handleChange={handleChange}
                        label="Počet osob na stránku"
                        value={filter.limit || 10}
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonFilter;