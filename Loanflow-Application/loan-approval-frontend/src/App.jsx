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
            "Credora combines a modern banking experience with Camunda 8 process orchestration to demonstrate how a digital lending journey can move from application to decision automatically.",
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
                Credora is a technical demonstration project and is not a
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
                These terms describe use of the Credora portfolio
                demonstration and should not be interpreted as terms for an
                actual financial product.
            </div>

            <h3>1. Demonstration purpose</h3>
            <p>
                Credora exists to demonstrate digital lending workflow
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
                        Credora is intentionally designed as a portfolio
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
                    Credora is currently a portfolio project. This section
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
                Credora.
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
                    Credora is a portfolio project demonstrating modern
                    workflow orchestration for digital lending.
                </p>
            </div>

            <div className="contact-grid">
                <a
                    href="mailto:hello@credora.demo"
                    className="contact-card"
                >
                    <span>✉</span>
                    <strong>Email</strong>
                    <small>hello@credora.demo</small>
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


function DecisionPlayground() {
    const [score, setScore] = useState(750);
    const [income, setIncome] = useState(80000);
    const [amount, setAmount] = useState(500000);
    const [running, setRunning] = useState(false);
    const [step, setStep] = useState(-1);

    const steps = [
        "Application received",
        "Financial profile validated",
        "Credit signal evaluated",
        "Decision rules evaluated",
        "Outcome generated",
    ];

    const run = () => {
        setRunning(true);
        setStep(0);
        let current = 0;
        const timer = window.setInterval(() => {
            current += 1;
            if (current >= steps.length) {
                window.clearInterval(timer);
                setStep(steps.length - 1);
                setRunning(false);
                return;
            }
            setStep(current);
        }, 650);
    };

    const outcome =
        score >= 700 && income >= 50000 && amount <= income * 8
            ? "APPROVED"
            : score < 600
                ? "REJECTED"
                : "MANUAL REVIEW";

    return (
        <div className="decision-playground">
            <div className="playground-form">
                <div className="playground-heading">
                    <span className="section-eyebrow">INTERACTIVE DEMO</span>
                    <h3>Run a lending scenario.</h3>
                    <p>Change the inputs and watch the simulated workflow move through its decision stages.</p>
                </div>

                <label>
                    <span>Credit score <strong>{score}</strong></span>
                    <input type="range" min="300" max="900" value={score} onChange={(e) => setScore(Number(e.target.value))} />
                </label>

                <label>
                    <span>Monthly income <strong>₹{Number(income).toLocaleString("en-IN")}</strong></span>
                    <input type="range" min="20000" max="250000" step="5000" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
                </label>

                <label>
                    <span>Loan amount <strong>₹{Number(amount).toLocaleString("en-IN")}</strong></span>
                    <input type="range" min="50000" max="3000000" step="25000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                </label>

                <button type="button" className="primary-button playground-run" onClick={run} disabled={running}>
                    {running ? "Running workflow…" : "Run decision"}
                    <span>{running ? "…" : "↗"}</span>
                </button>
            </div>

            <div className="playground-runtime">
                <div className="runtime-header">
                    <div>
                        <span>CAMUNDA 8 · DEMO RUNTIME</span>
                        <strong>Decision pipeline</strong>
                    </div>
                    <span className={`runtime-status ${running ? "is-running" : ""}`}>
                        <i /> {running ? "PROCESSING" : "READY"}
                    </span>
                </div>

                <div className="runtime-steps">
                    {steps.map((item, index) => (
                        <div className={`runtime-step ${index <= step ? "done" : ""} ${index === step && running ? "current" : ""}`} key={item}>
                            <span className="runtime-dot">{index <= step ? "✓" : String(index + 1).padStart(2, "0")}</span>
                            <div>
                                <small>0{index + 1}</small>
                                <strong>{item}</strong>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`playground-outcome ${step === steps.length - 1 ? "visible" : ""}`}>
                    <span>DEMO OUTCOME</span>
                    <strong>{outcome}</strong>
                    <small>Illustrative rules only — not a real credit decision.</small>
                </div>
            </div>
        </div>
    );
}

function App() {
    const [activePage, setActivePage] = useState("home");
    const [activeSlide, setActiveSlide] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [modal, setModal] = useState(null);
    const [activeExplore, setActiveExplore] = useState("Lending");
    const [activeArchitecture, setActiveArchitecture] = useState(2);

    const currentSlide = heroSlides[activeSlide];

    useEffect(() => {
        if (activePage !== "home") return undefined;
        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % heroSlides.length);
        }, 6500);
        return () => window.clearInterval(timer);
    }, [activePage]);

    const goToSection = (id) => {
        setMobileMenuOpen(false);
        if (activePage !== "home") {
            setActivePage("home");
            window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
            return;
        }
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const openModal = (type) => {
        setMobileMenuOpen(false);
        setModal(type);
    };

    const renderModal = () => {
        const modalMap = {
            privacy: ["Privacy Policy", "PRIVACY", <PrivacyContent />],
            terms: ["Terms & Conditions", "LEGAL", <TermsContent />],
            security: ["Security", "TRUST & SECURITY", <SecurityContent />],
            careers: ["Careers", "JOIN THE TEAM", <CareersContent />],
            contact: ["Contact", "GET IN TOUCH", <ContactContent />],
            emi: ["EMI Calculator", "CALCULATE", <EmiCalculator />],
        };
        if (!modal || !modalMap[modal]) return null;
        const [title, eyebrow, content] = modalMap[modal];
        return <Modal title={title} eyebrow={eyebrow} onClose={() => setModal(null)}>{content}</Modal>;
    };

    const explore = {
        Lending: {
            kicker: "DIGITAL LENDING",
            title: "A simpler front door to a complex process.",
            text: "Guide an applicant from first input to final outcome while the workflow handles the process behind the scenes.",
            tags: ["Application", "Validation", "Decision", "Outcome"],
        },
        "AI Decisioning": {
            kicker: "AI-READY DECISIONING",
            title: "Make decisions explainable, not mysterious.",
            text: "Use structured signals and configurable business rules as a foundation for intelligent decision experiences.",
            tags: ["Credit score", "Income", "Risk signals", "Rules"],
        },
        "Workflow Automation": {
            kicker: "PROCESS AUTOMATION",
            title: "Move work forward automatically.",
            text: "Camunda 8 coordinates the sequence, transitions and exception paths so individual services do not have to own the entire process.",
            tags: ["BPMN", "Job workers", "Retries", "Exceptions"],
        },
        BPMN: {
            kicker: "BPMN ORCHESTRATION",
            title: "See the process as a living system.",
            text: "Model the business journey visually and make each state, decision and exception explicit.",
            tags: ["Start", "Tasks", "Gateways", "Events"],
        },
        DMN: {
            kicker: "DECISION MANAGEMENT",
            title: "Separate decision logic from application code.",
            text: "Demonstrate how decision tables can express lending rules independently from the user interface.",
            tags: ["Rules", "Hit policy", "Inputs", "Outputs"],
        },
    };

    const activeExploreData = explore[activeExplore];

    const architectureDetails = [
        "Responsive customer-facing experience built with React and Vite.",
        "REST APIs receive applications and initiate the workflow.",
        "Camunda 8 coordinates the BPMN process and workflow execution.",
        "Decision logic can be modelled independently using business rules.",
    ];

    return (
        <div className="bank-app">
            <header className="navbar">
                <div className="navbar-inner">
                    <button type="button" className="brand" onClick={() => { setActivePage("home"); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="Credora home">
                        <span className="brand-mark">C</span>
                        <span className="brand-copy">
                            <span className="brand-name">Credora</span>
                            <span className="brand-subtitle">Intelligent Lending</span>
                        </span>
                    </button>

                    <button type="button" className="mobile-menu-button" onClick={() => setMobileMenuOpen((current) => !current)} aria-label="Toggle navigation" aria-expanded={mobileMenuOpen}>
                        <span /><span /><span />
                    </button>

                    <div className={`nav-right ${mobileMenuOpen ? "mobile-open" : ""}`}>
                        <button type="button" className="nav-link" onClick={() => goToSection("top")}>Home</button>
                        <button type="button" className="nav-link" onClick={() => goToSection("experience")}>Platform</button>
                        <button type="button" className="nav-link" onClick={() => goToSection("playground")}>Interactive Demo</button>
                        <button type="button" className="nav-link" onClick={() => goToSection("technology")}>Technology</button>
                        <button type="button" className={`nav-link ${activePage === "applications" ? "active" : ""}`} onClick={() => { setActivePage("applications"); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Applications</button>
                        <button type="button" className="nav-apply" onClick={() => goToSection("loan-application")}>Apply <span>↗</span></button>
                        <span className="secure-badge"><span className="secure-dot" /> Demo Environment</span>
                    </div>
                </div>
            </header>

            {activePage === "home" ? (
                <main id="top">
                    <section className="hero hero-vimeo-inspired">
                        <div className="hero-image-layer">
                            {heroSlides.map((slide, index) => (
                                <img key={slide.title} src={slide.image} alt="" className={`hero-image ${index === activeSlide ? "visible" : ""}`} />
                            ))}
                        </div>
                        <div className="hero-overlay" />
                        <div className="hero-inner">
                            <div className="hero-content">
                                <span className="hero-eyebrow">{currentSlide.eyebrow}<span />CAMUNDA 8</span>
                                <h1>{currentSlide.title}<em>{currentSlide.accent}</em></h1>
                                <p>{currentSlide.description}</p>
                                <div className="hero-actions">
                                    <button type="button" className="primary-button" onClick={() => goToSection("loan-application")}>Start application <span>↗</span></button>
                                    <button type="button" className="secondary-button" onClick={() => goToSection("playground")}>Run interactive demo</button>
                                </div>
                                <div className="hero-trust">
                                    <div><strong>01</strong><span>Apply</span></div>
                                    <div><strong>02</strong><span>Assess</span></div>
                                    <div><strong>03</strong><span>Decide</span></div>
                                </div>
                            </div>

                            <div className="hero-art">
                                <div className="hero-stat-card">
                                    <span className="mini-label">CURRENT JOURNEY</span>
                                    <strong>01</strong>
                                    <span>Application intake</span>
                                </div>
                                <div className="hero-flow-card">
                                    <div className="flow-card-header"><span>LIVE PROCESS MAP</span><i /></div>
                                    <div className="flow-line">
                                        <div className="flow-node complete"><span>✓</span></div>
                                        <div className="flow-connector active" />
                                        <div className="flow-node complete"><span>✓</span></div>
                                        <div className="flow-connector active" />
                                        <div className="flow-node pulse"><span>◆</span></div>
                                        <div className="flow-connector" />
                                        <div className="flow-node"><span>→</span></div>
                                    </div>
                                    <div className="flow-labels"><span>APPLY</span><span>VALIDATE</span><span>DECIDE</span><span>OUTCOME</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="hero-controls">
                            <span className="slide-count">0{activeSlide + 1} / 0{heroSlides.length}</span>
                            <div className="slide-dots">{heroSlides.map((slide, index) => <button key={slide.title} type="button" className={index === activeSlide ? "active" : ""} onClick={() => setActiveSlide(index)} aria-label={`Show slide ${index + 1}`} />)}</div>
                            <div className="slide-arrows">
                                <button type="button" onClick={() => setActiveSlide((activeSlide - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous slide">←</button>
                                <button type="button" onClick={() => setActiveSlide((activeSlide + 1) % heroSlides.length)} aria-label="Next slide">→</button>
                            </div>
                        </div>
                    </section>

                    <section className="marquee-section">
                        <div className="marquee-track">
                            <span>Digital Lending</span><i>✦</i><span>Process Orchestration</span><i>✦</i><span>Decision Automation</span><i>✦</i><span>Camunda 8</span><i>✦</i><span>Digital Lending</span><i>✦</i><span>Process Orchestration</span>
                        </div>
                    </section>

                    <section className="explore-section" id="experience">
                        <div className="section-shell">
                            <div className="section-heading split">
                                <div><span className="section-eyebrow">EXPLORE THE PLATFORM</span><h2>Complex underneath.<br /><span>Simple up front.</span></h2></div>
                                <p>Explore how the Credora experience connects customer input, business rules and workflow orchestration into one visible journey.</p>
                            </div>

                            <div className="explore-tabs" role="tablist">
                                {Object.keys(explore).map((item) => (
                                    <button type="button" role="tab" aria-selected={activeExplore === item} className={activeExplore === item ? "active" : ""} key={item} onClick={() => setActiveExplore(item)}>
                                        {item}<span>↗</span>
                                    </button>
                                ))}
                            </div>

                            <div className="explore-feature">
                                <div className="explore-feature-copy">
                                    <span className="feature-kicker">{activeExploreData.kicker}</span>
                                    <h3>{activeExploreData.title}</h3>
                                    <p>{activeExploreData.text}</p>
                                    <div className="feature-tags">{activeExploreData.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                                </div>
                                <div className="explore-visual">
                                    <div className="visual-grid" />
                                    <div className="visual-window">
                                        <div className="window-top"><span>credora / process</span><i /><i /><i /></div>
                                        <div className="visual-process">
                                            <div className="process-box done">Application</div><span>→</span>
                                            <div className="process-box done">Validation</div><span>→</span>
                                            <div className="process-box current">Decision</div>
                                            <div className="process-branches"><div>✓ Approved</div><div>◎ Review</div><div>× Rejected</div></div>
                                        </div>
                                    </div>
                                    <div className="floating-code"><span>DMN</span><strong>Decision rules</strong><small>Evaluating inputs…</small></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="journey-section">
                        <div className="section-shell">
                            <div className="journey-intro"><span className="section-eyebrow">FOLLOW THE JOURNEY</span><h2>One application.<br /><span>Six visible stages.</span></h2><p>A realistic lending experience should feel simple to the customer even when the underlying process is complex.</p></div>
                            <div className="journey-scroll">
                                {journeySteps.map((step, index) => (
                                    <article className={`journey-card ${index === 3 ? "featured" : ""}`} key={step.number}>
                                        <div className="journey-top"><span>{step.number}</span><strong>{step.icon}</strong></div>
                                        <div className="journey-line"><span /></div>
                                        <h3>{step.title}</h3><p>{step.description}</p>
                                        <small>{index < 3 ? "AUTOMATED" : index === 4 ? "HUMAN-IN-THE-LOOP" : "WORKFLOW OUTCOME"}</small>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="playground-section" id="playground">
                        <div className="section-shell">
                            <div className="section-heading centered"><span className="section-eyebrow">PLAY WITH THE PROCESS</span><h2>Don't just read about it.<br /><span>Run it.</span></h2><p>Change the scenario, trigger the simulated decision pipeline and see how a workflow experience can communicate its state.</p></div>
                            <DecisionPlayground />
                        </div>
                    </section>

                    <section className="decision-section">
                        <div className="section-shell">
                            <div className="decision-layout">
                                <div className="decision-copy"><span className="section-eyebrow">DECISION MANAGEMENT</span><h2>Rules that can live <span>outside the code.</span></h2><p>Credora demonstrates a rules-driven decision experience where credit score, income and loan amount become inputs to an illustrative decision path.</p>
                                    <div className="decision-points"><div><span>01</span><strong>Credit score</strong><small>Risk signal</small></div><div><span>02</span><strong>Income</strong><small>Affordability</small></div><div><span>03</span><strong>Loan amount</strong><small>Exposure</small></div></div>
                                </div>
                                <div className="decision-dashboard"><div className="dashboard-top"><div><span>DECISION ENGINE</span><strong>Illustrative assessment</strong></div><div className="live-pill"><i /> DEMO</div></div><div className="risk-score"><div className="score-ring"><span>82</span><small>LOW RISK</small></div><div className="score-details"><div><span>Credit score</span><strong>750</strong></div><div><span>Monthly income</span><strong>₹80K</strong></div><div><span>Loan amount</span><strong>₹5L</strong></div></div></div><div className="decision-result"><span>RECOMMENDED PATH</span><strong><i /> Automated approval</strong><small>Based on demonstration business rules</small></div></div>
                            </div>
                        </div>
                    </section>

                    <section className="architecture-section" id="technology">
                        <div className="section-shell">
                            <div className="section-heading centered"><span className="section-eyebrow">UNDER THE HOOD</span><h2>Built around <span>orchestration.</span></h2><p>Click each layer to see how the pieces fit together.</p></div>
                            <div className="architecture-interactive">
                                <div className="architecture-nav">{architecture.map((item, index) => <button type="button" key={item.title} className={activeArchitecture === index ? "active" : ""} onClick={() => setActiveArchitecture(index)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><em>↗</em></button>)}</div>
                                <div className="architecture-detail"><span className="detail-number">0{activeArchitecture + 1}</span><span className="feature-kicker">{architecture[activeArchitecture].label}</span><h3>{architecture[activeArchitecture].title}</h3><p>{architecture[activeArchitecture].description}</p><div className="detail-message">{architectureDetails[activeArchitecture]}</div><div className="architecture-mini-flow"><span>REQUEST</span><i>→</i><span>PROCESS</span><i>→</i><span>DECISION</span><i>→</i><span>OUTCOME</span></div></div>
                            </div>
                            <div className="architecture-note"><div><span className="note-icon">C8</span><div><strong>Camunda 8 orchestration</strong><p>BPMN coordinates the process while application services execute individual tasks.</p></div></div><span className="note-status"><i /> PROCESS READY</span></div>
                        </div>
                    </section>

                    <section className="application-section" id="loan-application">
                        <div className="section-shell">
                            <div className="section-heading split"><div><span className="section-eyebrow">DIGITAL APPLICATION</span><h2>Put the workflow<br /><span>into motion.</span></h2></div><p>Enter demonstration values and watch the Camunda-powered lending workflow process the application.</p></div>
                            <LoanApplication onViewApplications={() => { setActivePage("applications"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
                        </div>
                    </section>

                    <section className="pre-footer">
                        <div className="section-shell"><div className="pre-footer-card"><div><span className="section-eyebrow">CREDORA</span><h2>Finance workflows,<br /><span>made visible.</span></h2></div><button type="button" className="primary-button" onClick={() => goToSection("loan-application")}>Try the demo <span>↗</span></button></div></div>
                    </section>
                </main>
            ) : (
                <main className="applications-page">
                    <div className="page-header"><div><span className="section-eyebrow">CREDORA CONSOLE</span><h1>Applications</h1><p>Monitor loan applications processed by the demonstration workflow.</p></div><button type="button" className="primary-button" onClick={() => { setActivePage("home"); window.setTimeout(() => document.getElementById("loan-application")?.scrollIntoView({ behavior: "smooth" }), 80); }}>New application <span>↗</span></button></div>
                    <Applications />
                </main>
            )}

            <footer className="footer">
                <div className="footer-main">
                    <div className="section-shell footer-grid">
                        <div className="footer-company">
                            <button type="button" className="footer-brand" onClick={() => { setActivePage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}><span className="brand-mark">C</span><span><strong>Credora</strong><small>Intelligent Lending</small></span></button>
                            <p>Credora is a portfolio demonstration showing how a modern lending experience can connect customer journeys with workflow orchestration and decision management.</p>
                            <p>This is not a bank, NBFC, lender or financial institution. No real loan applications are processed.</p>
                            <div className="footer-status"><span><i /> Demo environment</span></div>
                        </div>
                        <div className="footer-column"><h4>Product</h4><button type="button" onClick={() => goToSection("loan-application")}>Apply for a Loan</button><button type="button" onClick={() => setActivePage("applications")}>Applications</button><button type="button" onClick={() => openModal("emi")}>EMI Calculator</button><button type="button" onClick={() => goToSection("technology")}>Technology</button></div>
                        <div className="footer-column"><h4>Explore</h4><button type="button" onClick={() => goToSection("experience")}>Platform</button><button type="button" onClick={() => goToSection("playground")}>Interactive Demo</button><button type="button" onClick={() => goToSection("technology")}>Architecture</button><button type="button" onClick={() => openModal("security")}>Security</button></div>
                        <div className="footer-column"><h4>Company</h4><button type="button" onClick={() => openModal("careers")}>Careers</button><button type="button" onClick={() => openModal("contact")}>Contact</button><button type="button" onClick={() => openModal("privacy")}>Privacy</button><button type="button" onClick={() => openModal("terms")}>Terms & Conditions</button></div>
                    </div>
                </div>
                <div className="footer-bottom"><div className="section-shell footer-bottom-inner"><span>© {new Date().getFullYear()} Credora. Portfolio demonstration.</span><span>React · Spring Boot · Java · Camunda 8</span><span>Designed by <strong>Prasad Labhe</strong></span></div></div>
            </footer>
            {renderModal()}
        </div>
    );
}

export default App;
