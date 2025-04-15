import { apiPost, HttpRequestError } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import InputField from "../components/InputField";
import FlashMessage from "../components/FlashMessage";
import { useSession } from "../contexts/session";

const LoginPage = () => {
    const nav = useNavigate();
    const { session, setSession } = useSession();
    const [messageState, setMessageState] = useState({ type: null, text: null });
    const [valuesState, setValuesState] = useState({ email: "", password: "" });

    useEffect(() => {
        if (session.data && !messageState.text) {
            nav("/");
        }
    }, [session, nav, messageState.text]);

    const handleSubmit = (e) => {
        e.preventDefault();
        apiPost("/api/auth", valuesState)
            .then(data => {
                setSession({ data, status: "authenticated" });
                setMessageState({ type: "success", text: "Přihlášení úspěšné! Přesměrování..." });
                setTimeout(() => nav("/"), 2500);
            })
            .catch(e => {
                if (e instanceof HttpRequestError) {
                    e.response.text().then(message => setMessageState({ type: "danger", text: message }));
                    return;
                }
                setMessageState({ type: "danger", text: "Při komunikaci se serverem nastala chyba." });
            });
    };

    const handleChange = (e) => {
        const fieldName = e.target.name;
        setValuesState({ ...valuesState, [fieldName]: e.target.value });
    };

    return (
        <div className="container" style={{ minHeight: "calc(100vh - 56px)", paddingTop: "50px" }}>
            <div className="card mx-auto p-4 shadow-lg" style={{ maxWidth: "400px", backgroundColor: "#343a40", color: "#f8f9fa" }}>
                <h2 className="text-center mb-4">Přihlášení</h2>
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

                    <button type="submit" className="btn btn-primary w-100 mt-3">Přihlásit se</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
