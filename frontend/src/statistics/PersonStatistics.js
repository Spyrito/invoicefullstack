import { useEffect, useState } from "react";
import { apiGet } from "../utils/api";
import Pagination from "../components/Pagination";

const PersonStatistics = () => {
    const [personStats, setPersonStats] = useState([]);
    const [filter, setFilter] = useState({ limit: 10, page: 0 });
    const [totalCount, setTotalCount] = useState(0);

    const fetchPersonStatistics = async (filter) => {
        const query = new URLSearchParams(filter).toString();
        const data = await apiGet(`/api/persons/statistics?${query}`);
        setPersonStats(data);
    };

    const fetchPersonCount = async () => {
        const data = await apiGet("/api/persons/count");
        setTotalCount(data.count);
    };

    useEffect(() => {
        fetchPersonStatistics(filter);
        fetchPersonCount();
    }, [filter]); 
    

    if (!personStats.length) return <div className="spinner-border spinner-border-sm" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>;

    return (
        <div className="p-4 border rounded shadow bg-dark text-light">
            <h2 className="text-xl font-semibold mb-2">Statistiky osob</h2>
            <table className="table table-hover w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Jméno</th>
                        <th>Příjem</th>
                    </tr>
                </thead>
                <tbody>
                
                    {personStats.map((person, index) => (
                        <tr key={person.personId}>
                            <td>{(filter.page * filter.limit) + index + 1}</td>
                            <td>
                                <a href={`persons/show/${person.personId}`} className="company-link">
                                    {person.personName}
                                </a>
                            </td>
                            <td>{person.revenue} Kč</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination filter={filter} setFilter={setFilter} totalCount={totalCount} />
            
        </div>
    );
};

export default PersonStatistics;
