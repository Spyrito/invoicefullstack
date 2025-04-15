import React, { useEffect, useState, useRef } from "react";
import { apiDelete, apiGet } from "../utils/api.js";
import PersonTable from "./PersonTable.js";
import PersonFilter from "./PersonFilter.js";
import Pagination from "../components/Pagination.js";
import { Link } from "react-router-dom";

const PersonIndex = () => {
    // Zajistíme, že filter má vždy hodnoty `page` a `limit`
    const [filter, setFilter] = useState({ limit: 10, page: 0 });
    const [persons, setPersons] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const tableRef = useRef(null); // Reference to the invoice table
    

    const fetchPersons = async () => {
        const query = new URLSearchParams(filter).toString();
        const data = await apiGet(`/api/persons?${query}`);
        setPersons(data);
    };

    const fetchPersonCount = async () => {
        const query = new URLSearchParams(filter).toString();
        const data = await apiGet(`/api/persons/count?${query}`);
        setTotalCount(data.count);
    };

    useEffect(() => {
        fetchPersons();
        fetchPersonCount();

        // Scroll to the table after data is fetched
        if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [filter]);

    const deletePerson = async (id) => {
        try {
            await apiDelete(`/api/persons/${id}`);
            // Okamžité odstranění z UI, aniž bychom čekali na nový fetch
            setPersons((prevPersons) => prevPersons.filter((item) => item._id !== id));
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };
    
    

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prev) => {
            const newFilter = { 
                ...prev, 
                [name]: value,
                page: 0
            };
            return newFilter;
        });
    };

    return (
        <div>
            <h1>Seznam osob</h1>
            <PersonFilter 
                handleChange={handleFilterChange} 
                filter={filter}
            />            <PersonTable 
                ref={tableRef}
                deletePerson={deletePerson} 
                items={persons} 
                label="" 
                filter={filter}
            />
           <Pagination filter={filter} setFilter={setFilter} totalCount={totalCount} />
            <Link to="/persons/create" className="btn btn-success mt-3">
                Nová osoba
            </Link>
        </div>
    );
};

export default PersonIndex;
