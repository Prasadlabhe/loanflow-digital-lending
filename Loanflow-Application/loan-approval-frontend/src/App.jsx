import { useEffect, useState } from "react";
import LoanApplication from "./LoanApplication";
import Applications from "./Applications";
import "./App.css";

const heroSlides = [
    {
        eyebrow: "DIGITAL LENDING • CAMUNDA 8",
        title: "Loan decisions,",
        highlight: "orchestrated intelligently.",
        description:
            "A modern lending experience where every application moves through a real-time, automated decision workflow.",
        image:
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=90",
        metric: "97.8%",
        metricLabel: "Workflow automation",
    },
    {
        eyebrow: "AI-READY • EVENT-DRIVEN",
        title: "From application",
        highlight: "to decision in seconds.",
        description:
            "Credit assessment, decisioning and human review are orchestrated through a resilient business process.",
        image:
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=90",
        metric: "< 2s",
        metricLabel: "Decision workflow",
    },
    {
        eyebrow: "BUILT FOR REAL-WORLD FINANCE",
        title: "Complex lending logic,",
        highlight: "made simple.",
        description:
            "Camunda 8 coordinates the journey while the application gives customers a clean and transparent experience.",
        image:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=90",
        metric: "24/7",
        metricLabel: "Process availability",
    },
];

const journeySteps = [
    {
        number: "01",
        title: "Application",
        text: "Customer submits a digital loan application.",
        icon: "↗",
    },
    {
        number: "02",
        title: "Verification",
        text: "Income, credit score and application data are evaluated.",
        icon: "✓",
    },
    {
        number: "03",
        title: "Risk Analysis",
        text: "Decision rules determine the application's risk profile.",
        icon: "◈",
    },
    {
        number: "04",
        title: "AI Decision",
        text: "The workflow automatically routes the application.",
        icon: "✦",
    },
    {
        number: "05",
        title: "Human Review",
        text: "Borderline cases can be routed for manual assessment.",
        icon: "◎",
    },
    {
        number: "06",
        title: "Outcome",
        text: "Approved, rejected or reviewed — with a clear status.",
        icon: "→",
    },
];

function App() {
    const [activePage, setActivePage] = useState("apply");
    const [activeSlide, setActiveSlide] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (activePage !== "apply") {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % heroSlides.length);
        }, 6000);

        return () => window.clearInterval(timer);
    }, [activePage]);

    const currentSlide = heroSlides[activeSlide];

    const navigate = (page) => {
        setActivePage(page);
        setMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const scrollToApplication = () => {
        setActivePage("apply");
        setMobileMenuOpen(false);

        window.setTimeout(() => {
            document
                .getElementById("loan-application")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

    return (
        <div className="bank-app">
            <nav className="navbar">
                <div className="navbar-inner">
                    <button
                        type="button"
                        className="brand"
                        onClick={() => navigate("apply")}
                        aria-label="Go to LoanFlow home"
                    >
                        <span className="brand-mark">
                            <span>L</span>
                        </span>

                        <span className="brand-copy">
                            <span className="brand-name">LoanFlow</span>
                            <span className="brand-subtitle">Digital Lending</span>
                        </span>
                    </button>

                    <div className={`nav-right ${mobileMenuOpen ? "open" : ""}`}>
                        <button
                            type="button"
                            className={`nav-link ${
                                activePage === "apply" ? "active" : ""
                            }`}
                            onClick={() => navigate("apply")}
                        >
                            <span>01</span>
                            Apply for a Loan
                        </button>

                        <button
                            type="button"
                            className={`nav-link ${
                                activePage === "applications" ? "active" : ""
                            }`}
                            onClick={() => navigate("applications")}
                        >
                            <span>02</span>
                            Applications
                        </button>

                        <div className="secure-badge">
                            <span className="secure-dot" />
                            Workflow Online
                        </div>
                    </div>

                    <button
                        type="button"
                        className={`mobile-menu-button ${
                            mobileMenuOpen ? "active" : ""
                        }`}
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        aria-label="Toggle navigation"
                        aria-expanded={mobileMenuOpen}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </nav>

            {activePage === "apply" ? (
                <>
                    <section className="hero">
                        <div className="hero-noise" />

                        <div className="hero-inner">
                            <div className="hero-content">
                                <div className="eyebrow">
                                    <span className="eyebrow-pulse" />
                                    {currentSlide.eyebrow}
                                </div>

                                <h1>
                                    {currentSlide.title}
                                    <br />
                                    <span>{currentSlide.highlight}</span>
                                </h1>

                                <p>{currentSlide.description}</p>

                                <div className="hero-actions">
                                    <button
                                        type="button"
                                        className="primary-button"
                                        onClick={scrollToApplication}
                                    >
                                        Start an application
                                        <span>↗</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() =>
                                            document
                                                .getElementById("journey")
                                                ?.scrollIntoView({
                                                    behavior: "smooth",
                                                })
                                        }
                                    >
                                        Explore the workflow
                                    </button>
                                </div>

                                <div className="hero-trust">
                                    <div className="trust-avatars">
                                        <span>PL</span>
                                        <span>C8</span>
                                        <span>AI</span>
                                    </div>

                                    <div>
                                        <strong>Built as a production-style demo</strong>
                                        <small>
                                            React · Spring Boot · Camunda 8
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div className="hero-art">
                                <div className="hero-image-wrap">
                                    <img
                                        key={currentSlide.image}
                                        className="hero-image"
                                        src={currentSlide.image}
                                        alt="Modern digital banking experience"
                                    />

                                    <div className="hero-image-overlay" />

                                    <div className="hero-floating-card hero-status-card">
                                        <div className="floating-card-top">
                                            <span>LOAN DECISION</span>
                                            <span className="live-pill">
                                                <i />
                                                LIVE
                                            </span>
                                        </div>

                                        <div className="decision-title">
                                            Application
                                            <strong>LF-2026-0084</strong>
                                        </div>

                                        <div className="decision-progress">
                                            <span className="complete" />
                                            <span className="complete" />
                                            <span className="active" />
                                            <span />
                                        </div>

                                        <div className="decision-labels">
                                            <span>Verify</span>
                                            <span>Risk</span>
                                            <span>Decision</span>
                                        </div>
                                    </div>

                                    <div className="hero-floating-card hero-metric-card">
                                        <div className="metric-orbit">
                                            <span>✦</span>
                                        </div>

                                        <div>
                                            <strong>{currentSlide.metric}</strong>
                                            <small>{currentSlide.metricLabel}</small>
                                        </div>
                                    </div>

                                    <div className="hero-card-glow" />
                                </div>

                                <div className="hero-slide-controls">
                                    <div className="slide-counter">
                                        <strong>
                                            0{activeSlide + 1}
                                        </strong>
                                        <span>/ 0{heroSlides.length}</span>
                                    </div>

                                    <div className="slide-dots">
                                        {heroSlides.map((slide, index) => (
                                            <button
                                                key={slide.title}
                                                type="button"
                                                className={
                                                    index === activeSlide
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    setActiveSlide(index)
                                                }
                                                aria-label={`Show slide ${
                                                    index + 1
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        className="slide-next"
                                        onClick={() =>
                                            setActiveSlide(
                                                (activeSlide + 1) %
                                                heroSlides.length
                                            )
                                        }
                                        aria-label="Next slide"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="platform-strip">
                        <div className="platform-strip-inner">
                            <span>ORCHESTRATED WITH</span>
                            <strong>CAMUNDA 8</strong>
                            <i />
                            <span>POWERED BY</span>
                            <strong>SPRING BOOT</strong>
                            <i />
                            <span>INTERFACE</span>
                            <strong>REACT + VITE</strong>
                        </div>
                    </section>

                    <section className="ai-section">
                        <div className="section-shell">
                            <div className="section-intro">
                                <div>
                                    <span className="section-kicker">
                                        INTELLIGENT DECISIONING
                                    </span>
                                    <h2>
                                        The workflow thinks in
                                        <span> decisions.</span>
                                    </h2>
                                </div>

                                <p>
                                    LoanFlow turns complex lending rules into
                                    a transparent, observable process — from
                                    application to final outcome.
                                </p>
                            </div>

                            <div className="ai-grid">
                                <div className="ai-engine-card">
                                    <div className="engine-header">
                                        <div>
                                            <span className="status-label">
                                                <i />
                                                DECISION ENGINE ACTIVE
                                            </span>
                                            <h3>AI Decision Layer</h3>
                                        </div>

                                        <span className="engine-icon">✦</span>
                                    </div>

                                    <div className="engine-visual">
                                        <div className="engine-ring ring-one" />
                                        <div className="engine-ring ring-two" />
                                        <div className="engine-ring ring-three" />

                                        <div className="engine-core">
                                            <span>AI</span>
                                            <strong>94</strong>
                                            <small>Risk score</small>
                                        </div>

                                        <div className="engine-node node-one">
                                            Credit
                                        </div>
                                        <div className="engine-node node-two">
                                            Income
                                        </div>
                                        <div className="engine-node node-three">
                                            Fraud
                                        </div>
                                        <div className="engine-node node-four">
                                            Rules
                                        </div>
                                    </div>

                                    <div className="engine-footer">
                                        <div>
                                            <span>Decision confidence</span>
                                            <strong>94.6%</strong>
                                        </div>

                                        <div className="confidence-bar">
                                            <span />
                                        </div>
                                    </div>
                                </div>

                                <div className="ai-insights">
                                    <div className="insight-card">
                                        <span className="insight-number">
                                            01
                                        </span>
                                        <div>
                                            <strong>Rules evaluate</strong>
                                            <p>
                                                Credit score, income and loan
                                                amount are evaluated against
                                                configurable business rules.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="insight-card">
                                        <span className="insight-number">
                                            02
                                        </span>
                                        <div>
                                            <strong>Camunda orchestrates</strong>
                                            <p>
                                                Each business step becomes an
                                                observable workflow state.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="insight-card">
                                        <span className="insight-number">
                                            03
                                        </span>
                                        <div>
                                            <strong>Humans stay in control</strong>
                                            <p>
                                                Review cases can be routed to
                                                people instead of forcing an
                                                automated decision.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="journey-section" id="journey">
                        <div className="section-shell">
                            <div className="journey-heading">
                                <div>
                                    <span className="section-kicker">
                                        ONE APPLICATION
                                    </span>
                                    <h2>
                                        An intelligent
                                        <span> lending journey.</span>
                                    </h2>
                                </div>

                                <p>
                                    Swipe through the lifecycle of a modern
                                    digital loan application.
                                </p>
                            </div>

                            <div className="journey-track">
                                {journeySteps.map((step, index) => (
                                    <div
                                        className="journey-card"
                                        key={step.number}
                                    >
                                        <div className="journey-top">
                                            <span>{step.number}</span>
                                            <strong>{step.icon}</strong>
                                        </div>

                                        <div className="journey-line">
                                            <span
                                                style={{
                                                    width: `${
                                                        ((index + 1) /
                                                            journeySteps.length) *
                                                        100
                                                    }%`,
                                                }}
                                            />
                                        </div>

                                        <h3>{step.title}</h3>
                                        <p>{step.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="application-section">
                        <LoanApplication
                            onViewApplications={() =>
                                navigate("applications")
                            }
                        />
                    </section>

                    <section className="architecture-section">
                        <div className="section-shell">
                            <div className="architecture-heading">
                                <span className="section-kicker">
                                    UNDER THE HOOD
                                </span>
                                <h2>
                                    Built around a
                                    <span> process engine.</span>
                                </h2>
                                <p>
                                    A portfolio project demonstrating how
                                    modern applications can separate business
                                    logic from process orchestration.
                                </p>
                            </div>

                            <div className="architecture">
                                <div className="architecture-node frontend-node">
                                    <span className="arch-number">01</span>
                                    <small>EXPERIENCE</small>
                                    <strong>React + Vite</strong>
                                    <p>
                                        Responsive customer-facing loan
                                        application.
                                    </p>
                                </div>

                                <div className="architecture-connector">
                                    <span>REST</span>
                                    <i />
                                </div>

                                <div className="architecture-node backend-node">
                                    <span className="arch-number">02</span>
                                    <small>API LAYER</small>
                                    <strong>Spring Boot</strong>
                                    <p>
                                        REST APIs, application state and
                                        integration layer.
                                    </p>
                                </div>

                                <div className="architecture-connector">
                                    <span>PROCESS</span>
                                    <i />
                                </div>

                                <div className="architecture-node camunda-node">
                                    <span className="arch-number">03</span>
                                    <small>ORCHESTRATION</small>
                                    <strong>Camunda 8</strong>
                                    <p>
                                        BPMN workflow, decisioning and process
                                        execution.
                                    </p>
                                </div>
                            </div>

                            <div className="architecture-badges">
                                <span>REST APIs</span>
                                <span>BPMN 2.0</span>
                                <span>DMN</span>
                                <span>Job Workers</span>
                                <span>Event-Driven</span>
                                <span>Human Review</span>
                            </div>
                        </div>
                    </section>

                    <section className="final-cta">
                        <div className="cta-glow" />

                        <div className="section-shell cta-content">
                            <span className="section-kicker">
                                READY TO SEE IT IN ACTION?
                            </span>

                            <h2>
                                Start your journey
                                <br />
                                <span>with LoanFlow.</span>
                            </h2>

                            <p>
                                Experience a realistic digital lending
                                workflow powered by Camunda 8.
                            </p>

                            <button
                                type="button"
                                className="primary-button large"
                                onClick={scrollToApplication}
                            >
                                Apply for a loan
                                <span>↗</span>
                            </button>
                        </div>
                    </section>
                </>
            ) : (
                <Applications />
            )}

            <footer className="footer">
                <div>
                    <strong>LoanFlow</strong>
                    <span>Digital Lending Platform</span>
                </div>

                <div className="footer-tech">
                    React · Spring Boot · Camunda 8
                </div>

                <div className="designer">
                    Designed by <strong>Prasad Labhe</strong>
                </div>
            </footer>
        </div>
    );
}

export default App;