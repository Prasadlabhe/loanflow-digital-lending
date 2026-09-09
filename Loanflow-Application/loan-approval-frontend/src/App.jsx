import { useEffect, useMemo, useState } from "react";
import LoanApplication from "./LoanApplication";
import Applications from "./Applications";
import "./App.css";

const heroSlides = [
    {
        eyebrow: "DIGITAL LENDING",
        title: "Credit decisions,",
        accent: "orchestrated intelligently.",
        description:
            "LoanFlow combines a modern banking experience with Camunda 8 process orchestration to demonstrate how a digital lending journey can move from application to decision automatically.",
        image:
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=85",
        stat: "92%",
        statLabel: "automated decision path",
    },
    {
        eyebrow: "AI-READY WORKFLOWS",
        title: "One application.",
        accent: "One intelligent journey.",
        description:
            "Credit assessment, business rules and manual review are connected through an orchestrated process instead of disconnected screens.",
        image:
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=85",
        stat: "24/7",
        statLabel: "workflow orchestration",
    },
    {
        eyebrow: "CAMUNDA 8",
        title: "Business rules",
        accent: "meet process automation.",
        description:
            "Camunda 8 coordinates the lending workflow while React and Spring Boot provide the customer-facing experience and application APIs.",
        image:
            "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1600&q=85",
        stat: "8",
        statLabel: "orchestration layer",
    },
];

const journeySteps = [
    {
        number: "01",
        title: "Application",
        description: "Customer submits a digital loan application.",
        icon: "↗",
    },
    {
        number: "02",
        title: "Validation",
        description: "Application data is validated automatically.",
        icon: "✓",
    },
    {
        number: "03",
        title: "Risk Analysis",
        description: "Credit and financial signals are evaluated.",
        icon: "⌁",
    },
    {
        number: "04",
        title: "Decision",
        description: "Business rules determine the next path.",
        icon: "◆",
    },
    {
        number: "05",
        title: "Review",
        description: "Exceptions can move to manual assessment.",
        icon: "◎",
    },
    {
        number: "06",
        title: "Outcome",
        description: "The applicant receives the final decision.",
        icon: "→",
    },
];

const architecture = [
    {
        title: "React + Vite",
        label: "EXPERIENCE",
        description: "Responsive customer-facing digital lending interface.",
        icon: "R",
    },
    {
        title: "Spring Boot",
        label: "APPLICATION API",
        description: "REST APIs handling applications and workflow initiation.",
        icon: "S",
    },
    {
        title: "Camunda 8",
        label: "ORCHESTRATION",
        description: "BPMN process orchestration and workflow execution.",
        icon: "C",
    },
    {
        title: "Business Rules",
        label: "DECISIONING",
        description: "Decision logic can be modelled independently from application code.",
        icon: "D",
    },
];

function Modal({ title, eyebrow, children, onClose }) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div
            className="modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="modal-header">
                    <div>
                        {eyebrow && <span className="modal-eyebrow">{eyebrow}</span>}
                        <h2 id="modal-title">{title}</h2>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}

function PrivacyContent() {
    return (
        <div className="legal-content">
            <div className="legal-callout">
                <strong>Portfolio demonstration.</strong>
                LoanFlow is a technical demonstration project and is not a
                real lending institution.
            </div>

            <h3>1. Information submitted through the demo</h3>
            <p>
                The loan application demonstration accepts sample information
                such as applicant name, loan amount, monthly income and credit
                score to demonstrate workflow orchestration.
            </p>

            <h3>2. Data storage</h3>
            <p>
                This portfolio implementation uses an in-memory application
                store for demonstration purposes. Submitted information is not
                intended to be permanently stored as part of this demo.
            </p>

            <h3>3. EMI calculator</h3>
            <p>
                The EMI calculator operates entirely within the browser. The
                values entered into the calculator are used only to calculate
                the displayed estimate.
            </p>

            <h3>4. Future production implementation</h3>
            <p>
                A production lending platform would require appropriate
                consent management, data retention policies, encryption,
                authentication, access controls, audit logging and applicable
                regulatory compliance.
            </p>

            <h3>5. Contact</h3>
            <p>
                For questions about this portfolio project, use the Contact
                section available in the footer.
            </p>
        </div>
    );
}

function TermsContent() {
    return (
        <div className="legal-content">
            <div className="legal-callout">
                These terms describe use of the LoanFlow portfolio
                demonstration and should not be interpreted as terms for an
                actual financial product.
            </div>

            <h3>1. Demonstration purpose</h3>
            <p>
                LoanFlow exists to demonstrate digital lending workflow
                orchestration using React, Spring Boot, Java and Camunda 8.
            </p>

            <h3>2. No lending commitment</h3>
            <p>
                Submitting an application does not create a loan agreement,
                credit commitment, financial relationship or offer of credit.
            </p>

            <h3>3. Decision outcomes</h3>
            <p>
                Approved, rejected and manual-review outcomes are generated by
                demonstration workflow logic and must not be considered real
                credit decisions.
            </p>

            <h3>4. EMI calculator</h3>
            <p>
                EMI results are indicative mathematical estimates. Actual loan
                repayments can vary based on interest calculation method,
                fees, taxes, insurance, repayment schedule and lender terms.
            </p>

            <h3>5. Acceptable use</h3>
            <p>
                Users should not submit highly sensitive personal information,
                financial credentials, passwords, identity documents or
                confidential banking information to this demonstration.
            </p>
        </div>
    );
}

function SecurityContent() {
    return (
        <div className="legal-content">
            <div className="security-panel">
                <span className="security-icon">✓</span>
                <div>
                    <strong>Demo environment</strong>
                    <p>
                        LoanFlow is intentionally designed as a portfolio
                        project rather than a production banking platform.
                    </p>
                </div>
            </div>

            <h3>Current demonstration controls</h3>

            <div className="security-list">
                <div>
                    <span>01</span>
                    <p>REST-based backend integration.</p>
                </div>
                <div>
                    <span>02</span>
                    <p>Workflow execution handled through Camunda 8.</p>
                </div>
                <div>
                    <span>03</span>
                    <p>Client-side EMI calculations.</p>
                </div>
                <div>
                    <span>04</span>
                    <p>No production payment processing.</p>
                </div>
            </div>

            <h3>Production roadmap</h3>
            <p>
                A real lending platform would add authentication,
                authorization, encryption, secrets management, secure
                infrastructure, fraud controls, KYC/AML capabilities,
                monitoring, audit trails and regulatory controls.
            </p>
        </div>
    );
}

function CareersContent() {
    return (
        <div className="careers-content">
            <div className="careers-hero">
                <span className="modal-eyebrow">CAREERS</span>
                <h3>Build the future of process-driven finance.</h3>
                <p>
                    LoanFlow is currently a portfolio project. This section
                    represents how a production fintech careers experience
                    could be structured.
                </p>
            </div>

            <div className="career-card">
                <div>
                    <span className="career-tag">ENGINEERING</span>
                    <h4>Backend / Workflow Engineer</h4>
                    <p>
                        Java, Spring Boot, distributed systems, BPMN and
                        Camunda.
                    </p>
                </div>
                <span className="career-arrow">→</span>
            </div>

            <div className="career-card">
                <div>
                    <span className="career-tag">FRONTEND</span>
                    <h4>Frontend Engineer</h4>
                    <p>
                        React, modern UI systems, accessibility and responsive
                        financial experiences.
                    </p>
                </div>
                <span className="career-arrow">→</span>
            </div>

            <div className="career-card">
                <div>
                    <span className="career-tag">PRODUCT</span>
                    <h4>Fintech Product Engineer</h4>
                    <p>
                        Turn complex lending processes into simple digital
                        experiences.
                    </p>
                </div>
                <span className="career-arrow">→</span>
            </div>

            <div className="demo-note">
                Careers are illustrative in this portfolio implementation.
                There are currently no live positions associated with
                LoanFlow.
            </div>
        </div>
    );
}

function ContactContent() {
    return (
        <div className="contact-content">
            <div className="contact-intro">
                <span className="modal-eyebrow">CONTACT</span>
                <h3>Let's talk technology.</h3>
                <p>
                    LoanFlow is a portfolio project demonstrating modern
                    workflow orchestration for digital lending.
                </p>
            </div>

            <div className="contact-grid">
                <a
                    href="mailto:hello@loanflow.demo"
                    className="contact-card"
                >
                    <span>✉</span>
                    <strong>Email</strong>
                    <small>hello@loanflow.demo</small>
                </a>

                <div className="contact-card">
                    <span>◉</span>
                    <strong>Project</strong>
                    <small>Digital Lending Workflow</small>
                </div>

                <div className="contact-card">
                    <span>⌘</span>
                    <strong>Technology</strong>
                    <small>Camunda 8 + Spring Boot + React</small>
                </div>

                <div className="contact-card">
                    <span>◎</span>
                    <strong>Purpose</strong>
                    <small>Engineering portfolio demonstration</small>
                </div>
            </div>
        </div>
    );
}

function EmiCalculator() {
    const [amount, setAmount] = useState(500000);
    const [rate, setRate] = useState(10.5);
    const [tenure, setTenure] = useState(60);

    const result = useMemo(() => {
        const principal = Number(amount) || 0;
        const annualRate = Number(rate) || 0;
        const months = Number(tenure) || 0;

        if (!principal || !months) {
            return {
                emi: 0,
                interest: 0,
                total: 0,
            };
        }

        const monthlyRate = annualRate / 12 / 100;

        let emi;

        if (monthlyRate === 0) {
            emi = principal / months;
        } else {
            emi =
                (principal *
                    monthlyRate *
                    Math.pow(1 + monthlyRate, months)) /
                (Math.pow(1 + monthlyRate, months) - 1);
        }

        const total = emi * months;

        return {
            emi,
            interest: Math.max(total - principal, 0),
            total,
        };
    }, [amount, rate, tenure]);

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value);

    return (
        <div className="emi-content">
            <div className="emi-intro">
                <span className="modal-eyebrow">FINANCIAL TOOL</span>
                <h3>Estimate your monthly EMI.</h3>
                <p>
                    Adjust the loan amount, interest rate and tenure to see an
                    indicative repayment estimate.
                </p>
            </div>

            <div className="emi-layout">
                <div className="emi-form">
                    <label>
                        Loan amount
                        <div className="input-with-prefix">
                            <span>₹</span>
                            <input
                                type="number"
                                min="10000"
                                step="10000"
                                value={amount}
                                onChange={(event) =>
                                    setAmount(event.target.value)
                                }
                            />
                        </div>
                    </label>

                    <label>
                        Interest rate
                        <div className="input-with-suffix">
                            <input
                                type="number"
                                min="0"
                                max="40"
                                step="0.1"
                                value={rate}
                                onChange={(event) =>
                                    setRate(event.target.value)
                                }
                            />
                            <span>% p.a.</span>
                        </div>
                    </label>

                    <label>
                        Tenure
                        <div className="input-with-suffix">
                            <input
                                type="number"
                                min="1"
                                max="360"
                                value={tenure}
                                onChange={(event) =>
                                    setTenure(event.target.value)
                                }
                            />
                            <span>months</span>
                        </div>
                    </label>
                </div>

                <div className="emi-result">
                    <span className="result-label">ESTIMATED MONTHLY EMI</span>
                    <strong>{formatCurrency(result.emi)}</strong>

                    <div className="emi-breakdown">
                        <div>
                            <span>Total interest</span>
                            <b>{formatCurrency(result.interest)}</b>
                        </div>
                        <div>
                            <span>Total repayment</span>
                            <b>{formatCurrency(result.total)}</b>
                        </div>
                    </div>
                </div>
            </div>

            <p className="calculator-disclaimer">
                Indicative calculation only. Actual repayment may vary based on
                lender terms, fees, taxes, rate type and repayment schedule.
            </p>
        </div>
    );
}

function App() {
    const [activePage, setActivePage] = useState("home");
    const [activeSlide, setActiveSlide] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [modal, setModal] = useState(null);

    const currentSlide = heroSlides[activeSlide];

    useEffect(() => {
        if (activePage !== "home") {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % heroSlides.length);
        }, 6500);

        return () => window.clearInterval(timer);
    }, [activePage]);

    const goToSection = (id) => {
        setMobileMenuOpen(false);

        if (activePage !== "home") {
            setActivePage("home");

            window.setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 80);

            return;
        }

        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const openModal = (type) => {
        setMobileMenuOpen(false);
        setModal(type);
    };

    const renderModal = () => {
        if (modal === "privacy") {
            return (
                <Modal
                    title="Privacy Policy"
                    eyebrow="PRIVACY"
                    onClose={() => setModal(null)}
                >
                    <PrivacyContent />
                </Modal>
            );
        }

        if (modal === "terms") {
            return (
                <Modal
                    title="Terms & Conditions"
                    eyebrow="LEGAL"
                    onClose={() => setModal(null)}
                >
                    <TermsContent />
                </Modal>
            );
        }

        if (modal === "security") {
            return (
                <Modal
                    title="Security"
                    eyebrow="TRUST & SECURITY"
                    onClose={() => setModal(null)}
                >
                    <SecurityContent />
                </Modal>
            );
        }

        if (modal === "careers") {
            return (
                <Modal
                    title="Careers"
                    eyebrow="JOIN THE TEAM"
                    onClose={() => setModal(null)}
                >
                    <CareersContent />
                </Modal>
            );
        }

        if (modal === "contact") {
            return (
                <Modal
                    title="Contact"
                    eyebrow="GET IN TOUCH"
                    onClose={() => setModal(null)}
                >
                    <ContactContent />
                </Modal>
            );
        }

        if (modal === "emi") {
            return (
                <Modal
                    title="EMI Calculator"
                    eyebrow="CALCULATE"
                    onClose={() => setModal(null)}
                >
                    <EmiCalculator />
                </Modal>
            );
        }

        return null;
    };

    return (
        <div className="bank-app">
            <header className="navbar">
                <div className="navbar-inner">
                    <button
                        type="button"
                        className="brand"
                        onClick={() => {
                            setActivePage("home");
                            setMobileMenuOpen(false);
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                        }}
                        aria-label="LoanFlow home"
                    >
                        <span className="brand-mark">L</span>

                        <span className="brand-copy">
                            <span className="brand-name">LoanFlow</span>
                            <span className="brand-subtitle">
                                Digital Lending
                            </span>
                        </span>
                    </button>

                    <button
                        type="button"
                        className="mobile-menu-button"
                        onClick={() =>
                            setMobileMenuOpen((current) => !current)
                        }
                        aria-label="Toggle navigation"
                        aria-expanded={mobileMenuOpen}
                    >
                        <span />
                        <span />
                        <span />
                    </button>

                    <div
                        className={`nav-right ${
                            mobileMenuOpen ? "mobile-open" : ""
                        }`}
                    >
                        <button
                            type="button"
                            className={`nav-link ${
                                activePage === "home" ? "active" : ""
                            }`}
                            onClick={() => {
                                setActivePage("home");
                                goToSection("top");
                            }}
                        >
                            Home
                        </button>

                        <button
                            type="button"
                            className="nav-link"
                            onClick={() => goToSection("experience")}
                        >
                            Experience
                        </button>

                        <button
                            type="button"
                            className="nav-link"
                            onClick={() => goToSection("technology")}
                        >
                            Technology
                        </button>

                        <button
                            type="button"
                            className={`nav-link ${
                                activePage === "applications" ? "active" : ""
                            }`}
                            onClick={() => {
                                setActivePage("applications");
                                setMobileMenuOpen(false);
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                });
                            }}
                        >
                            Applications
                        </button>

                        <button
                            type="button"
                            className="nav-apply"
                            onClick={() => goToSection("loan-application")}
                        >
                            Apply for a Loan
                            <span>↗</span>
                        </button>

                        <span className="secure-badge">
                            <span className="secure-dot" />
                            Demo Environment
                        </span>
                    </div>
                </div>
            </header>

            {activePage === "home" ? (
                <main id="top">
                    <section className="hero">
                        <div className="hero-image-layer">
                            {heroSlides.map((slide, index) => (
                                <img
                                    key={slide.title}
                                    src={slide.image}
                                    alt=""
                                    className={`hero-image ${
                                        index === activeSlide ? "visible" : ""
                                    }`}
                                />
                            ))}
                        </div>

                        <div className="hero-overlay" />

                        <div className="hero-inner">
                            <div className="hero-content">
                                <span className="hero-eyebrow">
                                    {currentSlide.eyebrow}
                                    <span />
                                    CAMUNDA 8
                                </span>

                                <h1>
                                    {currentSlide.title}
                                    <em>{currentSlide.accent}</em>
                                </h1>

                                <p>{currentSlide.description}</p>

                                <div className="hero-actions">
                                    <button
                                        type="button"
                                        className="primary-button"
                                        onClick={() =>
                                            goToSection("loan-application")
                                        }
                                    >
                                        Start application
                                        <span>↗</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() =>
                                            goToSection("experience")
                                        }
                                    >
                                        Explore LoanFlow
                                    </button>
                                </div>

                                <div className="hero-trust">
                                    <div>
                                        <strong>React</strong>
                                        <span>Frontend</span>
                                    </div>
                                    <div>
                                        <strong>Spring Boot</strong>
                                        <span>API</span>
                                    </div>
                                    <div>
                                        <strong>Camunda 8</strong>
                                        <span>Workflow</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hero-art">
                                <div className="hero-stat-card">
                                    <span className="mini-label">
                                        WORKFLOW SIGNAL
                                    </span>
                                    <strong>{currentSlide.stat}</strong>
                                    <span>{currentSlide.statLabel}</span>
                                </div>

                                <div className="hero-flow-card">
                                    <div className="flow-card-header">
                                        <span>LIVE PROCESS</span>
                                        <i />
                                    </div>

                                    <div className="flow-line">
                                        <div className="flow-node complete">
                                            <span>✓</span>
                                        </div>
                                        <div className="flow-connector active" />
                                        <div className="flow-node complete">
                                            <span>✓</span>
                                        </div>
                                        <div className="flow-connector active" />
                                        <div className="flow-node current">
                                            <span>AI</span>
                                        </div>
                                        <div className="flow-connector" />
                                        <div className="flow-node">
                                            <span>R</span>
                                        </div>
                                    </div>

                                    <div className="flow-labels">
                                        <span>Application</span>
                                        <span>Validation</span>
                                        <span>Decision</span>
                                        <span>Review</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hero-controls">
                            <div className="slide-count">
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
                                        onClick={() => setActiveSlide(index)}
                                        aria-label={`Show slide ${
                                            index + 1
                                        }`}
                                    />
                                ))}
                            </div>

                            <div className="slide-arrows">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveSlide(
                                            (activeSlide -
                                                1 +
                                                heroSlides.length) %
                                            heroSlides.length
                                        )
                                    }
                                    aria-label="Previous slide"
                                >
                                    ←
                                </button>

                                <button
                                    type="button"
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
                    </section>

                    <section className="experience-section" id="experience">
                        <div className="section-shell">
                            <div className="section-heading split">
                                <div>
                                    <span className="section-eyebrow">
                                        THE JOURNEY
                                    </span>
                                    <h2>
                                        One application.
                                        <br />
                                        <span>An intelligent journey.</span>
                                    </h2>
                                </div>

                                <p>
                                    A realistic lending experience should feel
                                    simple to the customer even when the
                                    underlying process is complex.
                                </p>
                            </div>

                            <div className="journey-grid">
                                {journeySteps.map((step) => (
                                    <article
                                        className="journey-card"
                                        key={step.number}
                                    >
                                        <div className="journey-top">
                                            <span>{step.number}</span>
                                            <strong>{step.icon}</strong>
                                        </div>

                                        <h3>{step.title}</h3>
                                        <p>{step.description}</p>

                                        <div className="journey-progress">
                                            <span />
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="decision-section">
                        <div className="section-shell">
                            <div className="decision-layout">
                                <div className="decision-copy">
                                    <span className="section-eyebrow">
                                        INTELLIGENT DECISIONING
                                    </span>

                                    <h2>
                                        Turn business rules into an
                                        <span> executable process.</span>
                                    </h2>

                                    <p>
                                        LoanFlow demonstrates how decision
                                        logic can sit inside an orchestrated
                                        process. Instead of hard-coding every
                                        path into application logic, the
                                        workflow can route applications based
                                        on business conditions.
                                    </p>

                                    <div className="decision-points">
                                        <div>
                                            <span>01</span>
                                            <strong>Credit score</strong>
                                            <small>Risk signal</small>
                                        </div>
                                        <div>
                                            <span>02</span>
                                            <strong>Income</strong>
                                            <small>Affordability signal</small>
                                        </div>
                                        <div>
                                            <span>03</span>
                                            <strong>Loan amount</strong>
                                            <small>Exposure signal</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="decision-dashboard">
                                    <div className="dashboard-top">
                                        <div>
                                            <span>DECISION ENGINE</span>
                                            <strong>Loan assessment</strong>
                                        </div>
                                        <div className="live-pill">
                                            <i />
                                            LIVE DEMO
                                        </div>
                                    </div>

                                    <div className="risk-score">
                                        <div className="score-ring">
                                            <span>82</span>
                                            <small>LOW RISK</small>
                                        </div>

                                        <div className="score-details">
                                            <div>
                                                <span>Credit score</span>
                                                <strong>750</strong>
                                            </div>
                                            <div>
                                                <span>Monthly income</span>
                                                <strong>₹80K</strong>
                                            </div>
                                            <div>
                                                <span>Loan amount</span>
                                                <strong>₹5L</strong>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="decision-result">
                                        <span>RECOMMENDED PATH</span>
                                        <strong>
                                            <i />
                                            Automated approval
                                        </strong>
                                        <small>
                                            Based on demonstration business
                                            rules
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="architecture-section" id="technology">
                        <div className="section-shell">
                            <div className="section-heading centered">
                                <span className="section-eyebrow">
                                    UNDER THE HOOD
                                </span>
                                <h2>
                                    Built around
                                    <span> orchestration.</span>
                                </h2>
                                <p>
                                    A technology stack designed to separate
                                    customer experience, APIs, process
                                    orchestration and decision logic.
                                </p>
                            </div>

                            <div className="architecture-flow">
                                {architecture.map((item, index) => (
                                    <div
                                        className="architecture-item"
                                        key={item.title}
                                    >
                                        <div className="architecture-card">
                                            <div className="architecture-icon">
                                                {item.icon}
                                            </div>
                                            <span>{item.label}</span>
                                            <h3>{item.title}</h3>
                                            <p>{item.description}</p>
                                        </div>

                                        {index < architecture.length - 1 && (
                                            <div className="architecture-arrow">
                                                →
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="architecture-note">
                                <div>
                                    <span className="note-icon">C8</span>
                                    <div>
                                        <strong>Camunda 8 orchestration</strong>
                                        <p>
                                            BPMN coordinates the process while
                                            application services execute the
                                            individual tasks.
                                        </p>
                                    </div>
                                </div>

                                <span className="note-status">
                                    <i />
                                    PROCESS READY
                                </span>
                            </div>
                        </div>
                    </section>

                    <section
                        className="application-section"
                        id="loan-application"
                    >
                        <div className="section-shell">
                            <div className="section-heading split">
                                <div>
                                    <span className="section-eyebrow">
                                        DIGITAL APPLICATION
                                    </span>
                                    <h2>
                                        Put the workflow
                                        <br />
                                        <span>into motion.</span>
                                    </h2>
                                </div>

                                <p>
                                    Enter demonstration values and watch the
                                    Camunda-powered lending workflow process
                                    the application.
                                </p>
                            </div>

                            <LoanApplication
                                onViewApplications={() => {
                                    setActivePage("applications");
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    });
                                }}
                            />
                        </div>
                    </section>

                    <section className="pre-footer">
                        <div className="section-shell">
                            <div className="pre-footer-card">
                                <div>
                                    <span className="section-eyebrow">
                                        LOANFLOW
                                    </span>
                                    <h2>
                                        Finance workflows,
                                        <br />
                                        <span>made visible.</span>
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={() =>
                                        goToSection("loan-application")
                                    }
                                >
                                    Try the demo
                                    <span>↗</span>
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            ) : (
                <main className="applications-page">
                    <div className="page-header">
                        <div>
                            <span className="section-eyebrow">
                                LOANFLOW CONSOLE
                            </span>
                            <h1>Applications</h1>
                            <p>
                                Monitor loan applications processed by the
                                demonstration workflow.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => {
                                setActivePage("home");
                                window.setTimeout(() => {
                                    document
                                        .getElementById("loan-application")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                }, 80);
                            }}
                        >
                            New application
                            <span>↗</span>
                        </button>
                    </div>

                    <Applications />
                </main>
            )}

            <footer className="footer">
                <div className="footer-main">
                    <div className="section-shell footer-grid">
                        <div className="footer-company">
                            <button
                                type="button"
                                className="footer-brand"
                                onClick={() => {
                                    setActivePage("home");
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    });
                                }}
                            >
                                <span className="brand-mark">L</span>
                                <span>
                                    <strong>LoanFlow</strong>
                                    <small>Digital Lending</small>
                                </span>
                            </button>

                            <p>
                                LoanFlow is a portfolio demonstration showing
                                how modern digital lending experiences can be
                                connected to process orchestration using
                                Camunda 8.
                            </p>

                            <p>
                                The project is designed for engineering
                                demonstration and does not represent a bank,
                                NBFC, lender or financial institution.
                            </p>

                            <div className="footer-status">
                                <span>
                                    <i />
                                    Demo systems operational
                                </span>
                            </div>
                        </div>

                        <div className="footer-column">
                            <h4>Product</h4>

                            <button
                                type="button"
                                onClick={() =>
                                    goToSection("loan-application")
                                }
                            >
                                Apply for a Loan
                            </button>

                            <button
                                type="button"
                                onClick={() => setActivePage("applications")}
                            >
                                Applications
                            </button>

                            <button
                                type="button"
                                onClick={() => openModal("emi")}
                            >
                                EMI Calculator
                            </button>

                            <button
                                type="button"
                                onClick={() => goToSection("technology")}
                            >
                                Technology
                            </button>
                        </div>

                        <div className="footer-column">
                            <h4>Company</h4>

                            <button
                                type="button"
                                onClick={() => openModal("careers")}
                            >
                                Careers
                            </button>

                            <button
                                type="button"
                                onClick={() => openModal("contact")}
                            >
                                Contact
                            </button>

                            <button
                                type="button"
                                onClick={() => openModal("security")}
                            >
                                Security
                            </button>

                            <button
                                type="button"
                                onClick={() => openModal("privacy")}
                            >
                                Privacy
                            </button>
                        </div>

                        <div className="footer-column">
                            <h4>Legal</h4>

                            <button
                                type="button"
                                onClick={() => openModal("terms")}
                            >
                                Terms & Conditions
                            </button>

                            <button
                                type="button"
                                onClick={() => openModal("privacy")}
                            >
                                Privacy Policy
                            </button>

                            <button
                                type="button"
                                onClick={() => openModal("security")}
                            >
                                Data & Security
                            </button>

                            <span className="footer-legal-note">
                                Last updated: September 2026
                            </span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="section-shell footer-bottom-inner">
                        <span>
                            © {new Date().getFullYear()} LoanFlow. Portfolio
                            demonstration.
                        </span>

                        <span>
                            Built with React · Spring Boot · Java · Camunda 8
                        </span>

                        <span>
                            Designed by <strong>Prasad Labhe</strong>
                        </span>
                    </div>
                </div>
            </footer>

            {renderModal()}
        </div>
    );
}

export default App;