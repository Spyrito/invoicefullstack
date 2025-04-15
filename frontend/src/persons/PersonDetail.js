/*  _____ _______         _                      _
 * |_   _|__   __|       | |                    | |
 *   | |    | |_ __   ___| |___      _____  _ __| | __  ___ ____
 *   | |    | | '_ \ / _ \ __\ \ /\ / / _ \| '__| |/ / / __|_  /
 *  _| |_   | | | | |  __/ |_ \ V  V / (_) | |  |   < | (__ / /
 * |_____|  |_|_| |_|\___|\__| \_/\_/ \___/|_|  |_|\_(_)___/___|
 *                                _
 *              ___ ___ ___ _____|_|_ _ _____
 *             | . |  _| -_|     | | | |     |  LICENCE
 *             |  _|_| |___|_|_|_|_|___|_|_|_|
 *             |_|
 *
 *   PROGRAMOVÁNÍ  <>  DESIGN  <>  PRÁCE/PODNIKÁNÍ  <>  HW A SW
 *
 * Tento zdrojový kód je součástí výukových seriálů na
 * IT sociální síti WWW.ITNETWORK.CZ
 *
 * Kód spadá pod licenci prémiového obsahu a vznikl díky podpoře
 * našich členů. Je určen pouze pro osobní užití a nesmí být šířen.
 * Více informací na http://www.itnetwork.cz/licence
 */

import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";

import {apiGet} from "../utils/api";
import Country from "./Country";
import InvoiceTable from "../invoices/InvoiceTable"; 

const PersonDetail = () => {
    const {id} = useParams();
    const [person, setPerson] = useState({});
    const [sales, setSales] = useState({});
    const [purchases, setPurchases] = useState({});
    const [filter, setFilter] = useState({ limit: 1000, page: 0 });
    const navigate = useNavigate();

    // Načtení detailu osoby
    useEffect(() => {
        apiGet("/api/persons/" + id)
            .then((data) => setPerson(data))
            .catch((error) => console.error(error));
    }, [id]);


    useEffect(() => {
        if (person.identificationNumber) {
            apiGet("/api/identification/" + person.identificationNumber + "/sales")
                .then((data) => setSales(data))
                .catch((error) => console.error(error));
        }
    }, [person.identificationNumber]);

    useEffect(() => {
        if (person.identificationNumber) {
            apiGet("/api/identification/" + person.identificationNumber + "/purchases")
                .then((data) => setPurchases(data))
                .catch((error) => console.error(error));
        }
    }, [person.identificationNumber]);

    const country = Country.CZECHIA === person.country ? "Česká republika" : "Slovensko";

    return (
        <>
            <div>
                <h1>Detail osoby</h1>
                <hr/>
                <h3>{person.name} ({person.identificationNumber})</h3>
                <p>
                    <strong>DIČ:</strong>
                    <br/>
                    {person.taxNumber}
                </p>
                <p>
                    <strong>Bankovní účet:</strong>
                    <br/>
                    {person.accountNumber}/{person.bankCode} ({person.iban})
                </p>
                <p>
                    <strong>Tel.:</strong>
                    <br/>
                    {person.telephone}
                </p>
                <p>
                    <strong>Mail:</strong>
                    <br/>
                    {person.mail}
                </p>
                <p>
                    <strong>Sídlo:</strong>
                    <br/>
                    {person.street}, {person.city},
                    {person.zip}, {country}
                </p>
                <p>
                    <strong>Poznámka:</strong>
                    <br/>
                    {person.note}
                </p>
                <h3 class="listOfSales">Vydané faktury</h3>
                {sales.length > 0 ? (
                    <InvoiceTable label="Faktury" deleteInvoice={null} items={sales} filter={filter} />
                    
                ) : (
                    <p>Žádné vydané faktury nenalezeny.</p>
                )}

                <h3 class="listOfPurchases">Přijaté faktury</h3>
                {purchases.length > 0 ? (
                    <InvoiceTable label="Faktury" deleteInvoice={null} items={purchases} filter={filter} />
                    
                ) : (
                    <p>Žádné přijaté faktury nenalezeny.</p>
                )}
                <hr/>
                <button onClick={() => navigate(-1)} className="btn btn-primary">
                Zpět
            </button>
            </div>
        </>
    );
};

export default PersonDetail;
