import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const initialForm = {
    applicantName: "",
    loanAmount: "",
    monthlyIncome: "",
    creditScore: "",
};

function LoanApplication({ onViewApplications }) {
    const [formData, setFormData] = useState(initialForm);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const pollingTimeoutRef = useRef(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        return () => {
            mountedRef.current = false;

            if (pollingTimeoutRef.current) {
                clearTimeout(pollingTimeoutRef.current);
            }
        };
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const getApplicationStatus = async (applicationId) => {
        if (!applicationId || !mountedRef.current) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/loans/${applicationId}`
            );

            if (!response.ok) {
                if (mountedRef.current) {
                    setError("Unable to retrieve application status.");
                }
                return;
            }

            const data = await response.json();

            if (!mountedRef.current) {
                return;
            }

            setResult(data);

            if (data.status === "PROCESSING") {
                pollingTimeoutRef.current = setTimeout(() => {
                    getApplicationStatus(applicationId);
                }, 1000);
            } else {
                setLoading(false);
            }
        } catch (requestError) {
            console.error("STATUS ERROR:", requestError);

            if (mountedRef.current) {
                setError(
                    "Unable to connect to the lending service. Please try again."
                );
                setLoading(false);
            }
        }
    };

    const submitLoan = async (event) => {
        event.preventDefault();

        setError("");
        setResult(null);
        setLoading(true);

        const payload = {
            applicantName: formData.applicantName.trim(),
            loanAmount: Number(formData.loanAmount),
            monthlyIncome: Number(formData.monthlyIncome),
            creditScore: Number(formData.creditScore),
        };

        try {
            const response = await fetch(`${API_URL}/api/loans`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                setError(
                    "We could not submit your application. Please try again."
                );
                setLoading(false);
                return;
            }

            const data = await response.json();

            if (!mountedRef.current) {
                return;
            }

            setResult(data);

            if (data.applicationId && data.status === "PROCESSING") {
                getApplicationStatus(data.applicationId);
            } else {
                setLoading(false);
            }
        } catch (requestError) {
            console.error("SUBMIT LOAN ERROR:", requestError);

            if (mountedRef.current) {
                setError(
                    "Unable to connect to the lending service. Please check that the backend is running."
                );
                setLoading(false);
            }
        }
    };

    const resetApplication = () => {
        if (pollingTimeoutRef.current) {
            clearTimeout(pollingTimeoutRef.current);
        }

        setFormData(initialForm);
        setResult(null);
        setError("");
        setLoading(false);
    };

    const formatCurrency = (value) => {
        if (value === undefined || value === null || value === "") {
            return "—";
        }

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(Number(value));
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "APPROVED":
                return "approved";
            case "REJECTED":
                return "rejected";
            case "REVIEW":
                return "review";
            default:
                return "processing";
        }
    };

    const getStatusTitle = (status) => {
        switch (status) {
            case "APPROVED":
                return "Loan Approved";
            case "REJECTED":
                return "Application Declined";
            case "REVIEW":
                return "Manual Review Required";
            default:
                return "Application Processing";
        }
    };

    const getStatusDescription = (status) => {
        switch (status) {
            case "APPROVED":
                return "Your application has successfully passed the automated lending assessment.";
            case "REJECTED":
                return "Based on the configured lending rules, this application does not currently meet the approval criteria.";
            case "REVIEW":
                return "Your application has been routed for additional review before a final decision is made.";
            default:
                return "Our lending workflow is currently evaluating your application.";
        }
    };

    return (
        <>
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-content">
                        <div className="eyebrow">
                            <span className="eyebrow-dot" />
                            DIGITAL LENDING
                        </div>

                        <h1>
                            A smarter way to
                            <span> borrow.</span>
                        </h1>

                        <p className="hero-description">
                            Apply for a loan through a fast, intelligent
                            digital lending experience powered by automated
                            decisioning and workflow orchestration.
                        </p>

                        <div className="hero-features">
                            <div>
                                <span className="feature-icon">✓</span>
                                Fast digital application
                            </div>

                            <div>
                                <span className="feature-icon">✓</span>
                                Automated assessment
                            </div>

                            <div>
                                <span className="feature-icon">✓</span>
                                Secure workflow
                            </div>
                        </div>

                        <button
                            type="button"
                            className="hero-link"
                            onClick={() =>
                                document
                                    .getElementById("loan-application")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                        >
                            Start your application
                            <span>→</span>
                        </button>
                    </div>

                    <div className="hero-art">
                        <div className="hero-image">
                            <img
                                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1100&q=85"
                                alt="Digital banking and payment"
                            />
                        </div>

                        <div className="hero-orb orb-one" />
                        <div className="hero-orb orb-two" />

                        <div className="hero-card hero-card-main">
                            <div className="hero-card-top">
                                <span>LOANFLOW</span>
                                <span>•••• 4821</span>
                            </div>

                            <div className="hero-card-amount">
                                ₹5,00,000
                            </div>

                            <div className="hero-card-bottom">
                                <span>Digital Loan</span>
                                <span className="card-status">
                                    ● ACTIVE
                                </span>
                            </div>
                        </div>

                        <div className="hero-card-small">
                            <span className="small-card-icon">✓</span>
                            <div>
                                <strong>Fast decisioning</strong>
                                <span>Powered by workflow automation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="main-container"
                id="loan-application"
            >
                <div className="section-heading">
                    <div>
                        <span className="section-label">
                            LOAN APPLICATION
                        </span>

                        <h2>Tell us about yourself</h2>

                        <p>
                            Enter a few details and we'll evaluate your
                            application through the LoanFlow lending workflow.
                        </p>
                    </div>

                    <div className="section-security">
                        <span>🔒</span>
                        <div>
                            <strong>Your information is secure</strong>
                            <small>Demo environment</small>
                        </div>
                    </div>
                </div>

                <div className="application-layout">
                    <div className="application-card">
                        <div className="card-top">
                            <div className="card-icon">01</div>

                            <div>
                                <h3>Application details</h3>
                                <p>Complete all fields to continue.</p>
                            </div>
                        </div>

                        <form onSubmit={submitLoan}>
                            <div className="form-field">
                                <label htmlFor="applicantName">
                                    Full name
                                </label>

                                <input
                                    id="applicantName"
                                    name="applicantName"
                                    type="text"
                                    value={formData.applicantName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label htmlFor="loanAmount">
                                        Loan amount
                                    </label>

                                    <div className="money-input">
                                        <span>₹</span>

                                        <input
                                            id="loanAmount"
                                            name="loanAmount"
                                            type="number"
                                            min="1"
                                            value={formData.loanAmount}
                                            onChange={handleChange}
                                            placeholder="500000"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="monthlyIncome">
                                        Monthly income
                                    </label>

                                    <div className="money-input">
                                        <span>₹</span>

                                        <input
                                            id="monthlyIncome"
                                            name="monthlyIncome"
                                            type="number"
                                            min="1"
                                            value={formData.monthlyIncome}
                                            onChange={handleChange}
                                            placeholder="80000"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-field">
                                <label htmlFor="creditScore">
                                    Credit score
                                </label>

                                <input
                                    id="creditScore"
                                    name="creditScore"
                                    type="number"
                                    min="300"
                                    max="900"
                                    value={formData.creditScore}
                                    onChange={handleChange}
                                    placeholder="750"
                                    required
                                />

                                <span className="field-hint">
                                    Enter a score between 300 and 900.
                                </span>
                            </div>

                            {error && (
                                <div className="error-message">
                                    <span>!</span>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="apply-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner" />
                                        Processing application...
                                    </>
                                ) : (
                                    <>
                                        Submit application
                                        <span>→</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="demo-note">
                            <span>ⓘ</span>
                            This is a portfolio demonstration. Application
                            data is stored only in memory and is not
                            permanently persisted.
                        </div>
                    </div>

                    {!result ? (
                        <div className="application-side">
                            <div className="side-image">
                                <img
                                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85"
                                    alt="Modern financial consultation"
                                />
                            </div>

                            <div className="side-content">
                                <span className="section-label">
                                    HOW IT WORKS
                                </span>

                                <h3>
                                    Lending decisions, orchestrated
                                    automatically.
                                </h3>

                                <div className="workflow-mini">
                                    <div>
                                        <span>01</span>
                                        <p>Application submitted</p>
                                    </div>

                                    <div>
                                        <span>02</span>
                                        <p>Credit & fraud assessment</p>
                                    </div>

                                    <div>
                                        <span>03</span>
                                        <p>Automated decision</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`result-card ${getStatusClass(
                                result.status
                            )}`}
                        >
                            <div className="result-icon">
                                {result.status === "APPROVED" && "✓"}
                                {result.status === "REJECTED" && "×"}
                                {result.status === "REVIEW" && "!"}
                                {result.status === "PROCESSING" && (
                                    <span className="spinner dark" />
                                )}
                            </div>

                            <span className="result-label">
                                APPLICATION STATUS
                            </span>

                            <h3>{getStatusTitle(result.status)}</h3>

                            <p>{getStatusDescription(result.status)}</p>

                            {result.applicationId && (
                                <div className="application-number">
                                    <span>Application ID</span>
                                    <strong>{result.applicationId}</strong>
                                </div>
                            )}

                            <div className="result-details">
                                <div>
                                    <span>Applicant</span>
                                    <strong>
                                        {result.applicantName ||
                                            formData.applicantName}
                                    </strong>
                                </div>

                                <div>
                                    <span>Loan amount</span>
                                    <strong>
                                        {formatCurrency(
                                            result.loanAmount ||
                                            formData.loanAmount
                                        )}
                                    </strong>
                                </div>
                            </div>

                            {result.reviewedBy && (
                                <div className="review-details">
                                    <span>Reviewed by</span>
                                    <strong>{result.reviewedBy}</strong>

                                    {result.reviewComment && (
                                        <p>{result.reviewComment}</p>
                                    )}
                                </div>
                            )}

                            <div className="workflow-status">
                                <div className="workflow-line">
                                    <span className="completed" />
                                    <span
                                        className={
                                            result.status !== "PROCESSING"
                                                ? "completed"
                                                : "current"
                                        }
                                    />
                                    <span
                                        className={
                                            result.status !== "PROCESSING"
                                                ? "completed"
                                                : ""
                                        }
                                    />
                                </div>

                                <div className="workflow-labels">
                                    <span>Submitted</span>
                                    <span>Evaluated</span>
                                    <span>Decision</span>
                                </div>
                            </div>

                            <div className="result-actions">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={resetApplication}
                                >
                                    New application
                                </button>

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={onViewApplications}
                                >
                                    View applications →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="trust-section">
                <div className="trust-inner">
                    <div className="trust-copy">
                        <span className="section-label">
                            BUILT FOR DIGITAL BANKING
                        </span>

                        <h2>
                            Designed around modern lending operations.
                        </h2>

                        <p>
                            LoanFlow demonstrates how business process
                            orchestration can connect applications,
                            decisioning and automated workflow execution into
                            one seamless lending journey.
                        </p>
                    </div>

                    <div className="trust-cards">
                        <div className="trust-card">
                            <strong>01</strong>
                            <h3>Automated decisions</h3>
                            <p>
                                Business rules evaluate applications
                                consistently.
                            </p>
                        </div>

                        <div className="trust-card">
                            <strong>02</strong>
                            <h3>Workflow orchestration</h3>
                            <p>
                                Processes are coordinated through Camunda 8.
                            </p>
                        </div>

                        <div className="trust-card">
                            <strong>03</strong>
                            <h3>Human review</h3>
                            <p>
                                Exceptions can be routed for manual
                                assessment.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default LoanApplication;