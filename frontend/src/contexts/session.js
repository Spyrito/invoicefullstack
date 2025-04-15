import { createContext, useContext, useEffect, useState } from "react";
import { apiGet, HttpRequestError } from "../utils/api";

// Create a context to manage session state, with a default value for session data and status.
const SessionContext = createContext({
    session: { data: null, status: "loading" }, // Default session state is 'loading'
    setSession: (data) => {} // Default empty function to update session data
});

// Custom hook to access session context. It provides the session state and setSession function.
export function useSession() {
    return useContext(SessionContext);
}

export const SessionProvider = ({ children }) => {
    const [sessionState, setSessionState] = useState({ data: null, status: "loading" });

    // Effect hook to perform the session check when the component mounts
    useEffect(() => {
        apiGet("/api/auth")
            .then(data => {
                // If the API call succeeds, set session state as 'authenticated'
                setSessionState({ data, status: "authenticated" });
            })
            .catch(e => {
                
                if (e instanceof HttpRequestError && e.response.status === 401) {
                    // If the error is a 401 Unauthorized response, set session state as 'unauthenticated'
                    setSessionState({ data: null, status: "unauthenticated" });
                } else {
                    // If the error is not an HTTP request error or not a 401, rethrow it
                    throw e;
                }
            });
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    return (
        <SessionContext.Provider value={{ session: sessionState, setSession: setSessionState }}>
            {children}
        </SessionContext.Provider>
    );
};
