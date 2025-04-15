import { apiPost, HttpRequestError } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import InputField from "../components/InputField";
import FlashMessage from "../components/FlashMessage";

const RegistrationPage = () => {
    const nav = useNavigate();
    const [messageState, setMessageState] = useState({ type: null, text: null });
    const [valuesState, setValuesState] = useState({ password: "", confirmPassword: "", email: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (valuesState.password !== valuesState.confirmPassword) {
            setMessageState({ type: "danger", text: "Hesla se neshodují" });
            return;
        }
        const { confirmPassword, ...registrationData } = valuesState;
        apiPost("/api/user", registrationData)
            .then(() => {
                setMessageState({ type: "success", text: "Registrace úspěšná! Přesměrování..." });
                setTimeout(() => nav("/login"), 2500);
            })
            .catch(e => {
                if (e.message.includes("Network response was not ok: 400")) {
                    // Pokud je vrácen kód 400, nahradíme chybovou hlášku za vlastní
                    setMessageState({ type: "danger", text: "Tento e-mail již je zaregistrován." });
                } else {
                    setMessageState({ type: "danger", text: e.message || "Při komunikaci se serverem nastala chyba." });
                }
            });
            
            
    };
    

    const handleChange = (e) => {
        const fieldName = e.target.name;
        setValuesState({ ...valuesState, [fieldName]: e.target.value });
    };

    return (
        <div className="container" style={{ minHeight: "calc(100vh - 56px)", paddingTop: "50px" }}>
            <div className="card mx-auto p-4 shadow-lg" style={{ maxWidth: "400px", backgroundColor: "#343a40", color: "#f8f9fa" }}>
                <h2 className="text-center mb-4">Registrace</h2>
                <form onSubmit={handleSubmit}>
                    {messageState.text && <FlashMessage theme={messageState.type} text={messageState.text} />}
                    
                    <InputField
                        required type="email"
                        name="email"
                        label="E-mail"
                        prompt="Zadejte Váš e-mail"
                        value={valuesState.email}
                        handleChange={handleChange}
                    />
                    
                    <InputField
                        required type="password"
                        name="password"
                        label="Heslo"
                        prompt="Zadejte Vaše heslo"
                        value={valuesState.password}
                        handleChange={handleChange}
                    />
                    
                    <InputField
                        required type="password"
                        name="confirmPassword"
                        label="Heslo znovu"
                        prompt="Zadejte Vaše heslo znovu"
                        value={valuesState.confirmPassword}
                        handleChange={handleChange}
                    />
                    
                    <button type="submit" className="btn btn-primary w-100 mt-3">Registrovat se</button>
                </form>
            </div>
        </div>
    );
}

export default RegistrationPage;
