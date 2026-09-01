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
                    <button
                        type="button"
                        className="brand"
                        onClick={() => setActivePage("apply")}
                        aria-label="Go to LoanFlow home"
                    >
                        <span className="brand-mark">
                            <span>L</span>
                        </span>

                        <span className="brand-copy">
                            <span className="brand-name">LoanFlow</span>
                            <span className="brand-subtitle">
                                Intelligent Lending
                            </span>
                        </span>
                    </button>

                    <div className="nav-right">
                        <button
                            type="button"
                            className={`nav-link ${
                                activePage === "apply" ? "active" : ""
                            }`}
                            onClick={() => setActivePage("apply")}
                        >
                            Apply
                        </button>

                        <button
                            type="button"
                            className={`nav-link ${
                                activePage === "applications" ? "active" : ""
                            }`}
                            onClick={() => setActivePage("applications")}
                        >
                            Applications
                        </button>

                        <span className="secure-badge">
                            <span className="secure-dot" />
                            Secure Demo
                        </span>
                    </div>
                </div>
            </nav>

            <main>
                {activePage === "apply" && (
                    <LoanApplication
                        onViewApplications={() =>
                            setActivePage("applications")
                        }
                    />
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
                    Intelligent Digital Lending Platform
                </div>

                <div className="designer">
                    Designed by <strong>Prasad Labhe</strong>
                </div>
            </footer>
        </div>
    );
}

export default App;