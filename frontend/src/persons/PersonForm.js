import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { apiGet, apiPost, apiPut } from "../utils/api";

import InputField from "../components/InputField";
import InputCheck from "../components/InputCheck";
import FlashMessage from "../components/FlashMessage";

import Country from "./Country";

const PersonForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [person, setPerson] = useState({
        name: "",
        identificationNumber: "",
        taxNumber: "",
        accountNumber: "",
        bankCode: "",
        iban: "",
        telephone: "",
        mail: "",
        street: "",
        zip: "",
        city: "",
        country: Country.CZECHIA,
        note: ""
    });
    const [sentState, setSent] = useState(false);
    const [successState, setSuccess] = useState(false);
    const [errorState, setError] = useState(null);

    // Načtení dat při editaci
    useEffect(() => {
        if (id) {
            apiGet("/api/persons/" + id)
                .then((data) => {
                    console.log("Načtená osoba:", data);
                    setPerson(data);
                })
                .catch((error) => console.error("Chyba při načítání osoby:", error));
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Klonování objektu bez _id, vždy se odstraní
        const { _id, ...personData } = person;

        (id ? apiPut("/api/persons/" + id, personData) : apiPost("/api/persons", personData))
            .then((data) => {
                setSent(true);
                setSuccess(true);
                setTimeout(() => navigate("/persons"), 2000);
            })
            .catch((error) => {
                console.log(error.message);
                setError(error.message);
                setSent(true);
                setSuccess(false);
            });
    };
    
    
    

    return (
        <div>
            <h1>{id ? "Upravit" : "Vytvořit"} osobnost</h1>
            <hr />
            {errorState && <div className="alert alert-danger">{errorState}</div>}
            {sentState && (
                <FlashMessage theme={successState ? "success" : ""} text={successState ? "Uložení proběhlo úspěšně." : ""} />
            )}
            <form onSubmit={handleSubmit}>
                <InputField required type="text" name="personName" min="3" label="Jméno" prompt="Zadejte celé jméno" value={person.name} handleChange={(e) => setPerson({ ...person, name: e.target.value })} />                <InputField required type="text" name="taxNumber" min="3" label="DIČ" prompt="Zadejte DIČ" value={person.taxNumber} handleChange={(e) => setPerson({ ...person, taxNumber: e.target.value })} />
                <InputField required type="text" name="accountNumber" min="3" label="Číslo bankovního účtu" prompt="Zadejte číslo bankovního účtu" value={person.accountNumber} handleChange={(e) => setPerson({ ...person, accountNumber: e.target.value })} />
                <InputField required type="text" name="bankCode" min="3" label="Kód banky" prompt="Zadejte kód banky" value={person.bankCode} handleChange={(e) => setPerson({ ...person, bankCode: e.target.value })} />
                <InputField required type="text" name="IBAN" min="3" label="IBAN" prompt="Zadejte IBAN" value={person.iban} handleChange={(e) => setPerson({ ...person, iban: e.target.value })} />
                <InputField required type="text" name="telephone" min="3" label="Telefon" prompt="Zadejte Telefon" value={person.telephone} handleChange={(e) => setPerson({ ...person, telephone: e.target.value })} />
                <InputField required type="text" name="mail" min="3" label="Mail" prompt="Zadejte mail" value={person.mail} handleChange={(e) => setPerson({ ...person, mail: e.target.value })} />
                <InputField required type="text" name="street" min="3" label="Ulice" prompt="Zadejte ulici" value={person.street} handleChange={(e) => setPerson({ ...person, street: e.target.value })} />
                <InputField required type="text" name="ZIP" min="3" label="PSČ" prompt="Zadejte PSČ" value={person.zip} handleChange={(e) => setPerson({ ...person, zip: e.target.value })} />
                <InputField required type="text" name="city" min="3" label="Město" prompt="Zadejte město" value={person.city} handleChange={(e) => setPerson({ ...person, city: e.target.value })} />
                <InputField required type="text" name="note" label="Poznámka" value={person.note} handleChange={(e) => setPerson({ ...person, note: e.target.value })} />

                <h6>Země:</h6>
                <InputCheck type="radio" name="country" label="Česká republika" value={Country.CZECHIA} handleChange={(e) => setPerson({ ...person, country: e.target.value })} checked={Country.CZECHIA === person.country} />
                <InputCheck type="radio" name="country" label="Slovensko" value={Country.SLOVAKIA} handleChange={(e) => setPerson({ ...person, country: e.target.value })} checked={Country.SLOVAKIA === person.country} />

                <input type="submit" className="btn btn-primary" value="Uložit" />
            </form>
        </div>
    );
};

export default PersonForm;
