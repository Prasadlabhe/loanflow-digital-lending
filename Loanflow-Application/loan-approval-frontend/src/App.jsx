import { useState } from "react";
import LoanApplication from "./LoanApplication";
import Applications from "./Applications";
import "./App.css";

function App() {
    const [activePage, setActivePage] = useState("apply");

    return (
        <div className="bank-app">

            <nav className="navbar">
                <div className="navbar-inner">

                    <div
                        className="logo-section"
                        onClick={() => setActivePage("apply")}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="logo-mark">
                            L
                        </div>

                        <div>
                            <div className="logo-name">
                                LoanFlow
                            </div>

                            <div className="logo-subtitle">
                                Digital Lending
                            </div>
                        </div>
                    </div>

                    <div className="nav-right">

                        <button
                            type="button"
                            className={`nav-link ${
                                activePage === "apply"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => setActivePage("apply")}
                        >
                            Apply for a Loan
                        </button>

                        <button
                            type="button"
                            className={`nav-link ${
                                activePage === "applications"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setActivePage("applications")
                            }
                        >
                            Applications
                        </button>

                        <span className="secure-badge">
                            🔒 Secure
                        </span>

                    </div>

                </div>
            </nav>

            <main>

                {activePage === "apply" && (
                    <LoanApplication />
                )}

                {activePage === "applications" && (
                    <Applications />
                )}

            </main>

            <footer className="footer">

                <div>
                    © {new Date().getFullYear()} LoanFlow
                </div>

                <div className="footer-center">
                    Digital Lending Platform
                </div>

                <div className="designer">
                    Designed by
                    <strong> Prasad Labhe</strong>
                </div>

            </footer>

        </div>
    );
}

export default App;