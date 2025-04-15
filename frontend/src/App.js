import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/App.css";
import { BrowserRouter as Router, Link, Route, Routes, Navigate } from "react-router-dom";
import { useSession } from "./contexts/session";
import { apiDelete } from "./utils/api";
import FlashMessage from "./components/FlashMessage";

import PersonIndex from "./persons/PersonIndex";
import PersonDetail from "./persons/PersonDetail";
import PersonForm from "./persons/PersonForm";
import InvoiceIndex from "./invoices/InvoiceIndex";
import InvoiceForm from "./invoices/InvoiceForm";
import InvoiceDetail from "./invoices/InvoiceDetail";
import StatisticsIndex from "./statistics/StatisticsIndex";
import RegistrationPage from "./registration/RegistrationPage";
import LoginPage from "./login/LoginPage";

export function App() {
  const { session, setSession } = useSession();
  const [flashMessage, setFlashMessage] = useState(null);

  /**
   * Funkce pro odhlášení uživatele.
   * Zavolá API pro odhlášení, aktualizuje session a zobrazí flash zprávu.
   * Flash zpráva zmizí automaticky po 3 sekundách.
   */
  const handleLogoutClick = () => {
    apiDelete("/api/auth")
      .finally(() => {
        setSession({ data: null, status: "unauthorized" });
        setFlashMessage({ theme: "success", text: "Odhlášení proběhlo úspěšně." });
        setTimeout(() => setFlashMessage(null), 3000);
      });
  };

  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
          <div className="container">
            <Link className="navbar-brand fw-bold fs-4" to="/">
              <i className="bi bi-receipt fs-3"></i> Aplikace správy faktur
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto d-flex align-items-center">
                <li className="nav-item">
                  <Link className="nav-link text-white fw-semibold hover-effect fs-5" to="/persons">
                    <i className="bi bi-people fs-5"></i> Osoby
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white fw-semibold hover-effect fs-5" to="/invoices">
                    <i className="bi bi-file-earmark-text fs-5"></i> Faktury
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white fw-semibold hover-effect fs-5" to="/statistics">
                    <i className="bi bi-bar-chart fs-5"></i> Statistiky
                  </Link>
                </li>
                {session.data ? (
                  <>
                    <div className="vr text-white mx-3 d-none d-lg-block"></div>
                    <li className="nav-item text-white fs-6">{session.data.email}</li>
                    <div className="vr text-white mx-3 d-none d-lg-block"></div>
                    <li className="nav-item">
                      <button className="btn btn-outline-light me-2 fs-6" onClick={handleLogoutClick}>
                        Odhlásit <i className="bi bi-box-arrow-right fs-6"></i>
                      </button>
                    </li>
                  </>
                ) : session.status === "loading" ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="vr text-white mx-3 d-none d-lg-block"></div>
                    <li className="nav-item">
                      <Link className="btn btn-outline-light me-2" to="/login">
                        <i className="bi bi-box-arrow-in-right"></i> Přihlásit se
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="btn btn-outline-light" to="/register">
                        <i className="bi bi-person-plus"></i> Registrace
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>

        {/* Zobrazení flash zprávy, pokud existuje */}
        {flashMessage && <FlashMessage theme={flashMessage.theme} text={flashMessage.text} />}

        <Routes>
          <Route index element={<Navigate to={"/persons"} />} />
          <Route path="/persons">
            <Route index element={<PersonIndex />} />
            <Route path="show/:id" element={<PersonDetail />} />
            <Route path="create" element={<PersonForm />} />
            <Route path="edit/:id" element={<PersonForm />} />
          </Route>
          <Route path="/invoices">
            <Route index element={<InvoiceIndex />} />
            <Route path="show/:id" element={<InvoiceDetail />} />
            <Route path="create" element={<InvoiceForm />} />
            <Route path="edit/:id" element={<InvoiceForm />} />
          </Route>
          <Route path="/statistics">
            <Route index element={<StatisticsIndex />} />
          </Route>
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
