import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function LoanApplication({ onViewApplications }) {
    const [formData, setFormData] = useState({
        applicantName: "",
        loanAmount: "",
        monthlyIncome: "",
        creditScore: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    const mountedRef = useRef(true);
    const pollingTimeoutRef = useRef(null);

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
        try {
            const response = await fetch(
                `${API_URL}/api/loans/${applicationId}`
            );

            if (!response.ok) {
                if (mountedRef.current) {
                    setError("Unable to retrieve application status.");
                    setLoading(false);
                }

                return;
            }

            const data = await response.json();

            if (!mountedRef.current) {
                return;
            }

            if (data.status === "PROCESSING") {
                pollingTimeoutRef.current = setTimeout(() => {
                    getApplicationStatus(applicationId);
                }, 1000);

                return;
            }

            setResult(data);
            setLoading(false);
        } catch (requestError) {
            console.error("APPLICATION STATUS ERROR:", requestError);

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

        try {
            const payload = {
                applicantName: formData.applicantName.trim(),
                loanAmount: Number(formData.loanAmount),
                monthlyIncome: Number(formData.monthlyIncome),
                creditScore: Number(formData.creditScore),
            };

            const response = await fetch(`${API_URL}/api/loans`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                setError(
                    "We couldn't submit your application. Please try again."
                );
                setLoading(false);
                return;
            }

            const data = await response.json();

            if (data.applicationId) {
                await getApplicationStatus(data.applicationId);
            } else {
                setResult(data);
                setLoading(false);
            }
        } catch (requestError) {
            console.error("SUBMIT LOAN ERROR:", requestError);

            setError(
                "Unable to connect to the lending service. Please check that the backend is running."
            );

            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) {
            return "—";
        }

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getResultClass = () => {
        if (!result) {
            return "";
        }

        if (result.status === "APPROVED") {
            return "result-approved";
        }

        if (result.status === "REJECTED") {
            return "result-rejected";
        }

        if (result.status === "REVIEW") {
            return "result-review";
        }

        return "result-processing";
    };

    const getResultTitle = () => {
        if (!result) {
            return "";
        }

        if (result.status === "APPROVED") {
            return "Application approved";
        }

        if (result.status === "REJECTED") {
            return "Application declined";
        }

        if (result.status === "REVIEW") {
            return "Manual review required";
        }

        return "Application processing";
    };

    const getResultDescription = () => {
        if (!result) {
            return "";
        }

        if (result.status === "APPROVED") {
            return "Your application successfully passed the automated lending decision workflow.";
        }

        if (result.status === "REJECTED") {
            return "The lending decision workflow has completed and the application did not meet the configured approval criteria.";
        }

        if (result.status === "REVIEW") {
            return "Your application has been routed for additional human review.";
        }

        return "Your application is currently being evaluated.";
    };

    return (
        <div className="loan-page">
            {/* HERO */}
            <section className="hero">
                <div className="hero-glow hero-glow-one" />
                <div className="hero-glow hero-glow-two" />

                <div className="hero-inner">
                    <div className="hero-content">
                        <div className="ai-pill">
                            <span className="ai-spark">✦</span>
                            Intelligent lending orchestration
                        </div>

                        <h1>
                            Lending decisions,
                            <span> reimagined.</span>
                        </h1>

                        <p className="hero-description">
                            A modern digital lending experience powered by
                            intelligent business rules and automated process
                            orchestration.
                        </p>

                        <div className="hero-actions">
                            <button
                                type="button"
                                className="primary-button hero-button"
                                onClick={() =>
                                    document
                                        .getElementById("loan-application")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                }
                            >
                                Start an application
                                <span>→</span>
                            </button>

                            <button
                                type="button"
                                className="text-button"
                                onClick={onViewApplications}
                            >
                                View applications
                            </button>
                        </div>

                        <div className="hero-trust">
                            <div className="trust-item">
                                <span className="trust-icon">✓</span>
                                Automated decisions
                            </div>

                            <div className="trust-item">
                                <span className="trust-icon">✓</span>
                                Rule-driven workflow
                            </div>

                            <div className="trust-item">
                                <span className="trust-icon">✓</span>
                                Human review when needed
                            </div>
                        </div>
                    </div>

                    <div className="hero-art">
                        <div className="hero-image-wrapper">
                            <img
                                className="hero-image"
                                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85"
                                alt="Modern digital banking experience"
                            />

                            <div className="hero-image-overlay" />
                        </div>

                        <div className="ai-decision-card">
                            <div className="decision-header">
                                <div className="decision-icon">✦</div>

                                <div>
                                    <span>Decision engine</span>
                                    <strong>Active</strong>
                                </div>

                                <span className="live-dot" />
                            </div>

                            <div className="decision-line">
                                <span>Application analysis</span>
                                <strong>Complete</strong>
                            </div>

                            <div className="decision-progress">
                                <span />
                            </div>

                            <div className="decision-footer">
                                <span>Powered by workflow orchestration</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SMARTER LENDING */}
            <section className="smart-section">
                <div className="section-heading centered">
                    <span className="eyebrow">Smart lending</span>

                    <h2>
                        Smarter lending.
                        <br />
                        <span>Simplified.</span>
                    </h2>

                    <p>
                        A streamlined lending experience backed by intelligent
                        process automation.
                    </p>
                </div>

                <div className="smart-grid">
                    <div className="smart-card">
                        <div className="smart-number">01</div>

                        <div className="smart-icon">◎</div>

                        <h3>Automated validation</h3>

                        <p>
                            Application information is validated before
                            entering the decision workflow.
                        </p>

                        <div className="smart-line" />
                    </div>

                    <div className="smart-card featured">
                        <div className="smart-number">02</div>

                        <div className="smart-icon">✦</div>

                        <h3>Rule-driven decisions</h3>

                        <p>
                            Business rules evaluate applicant information and
                            determine the appropriate lending path.
                        </p>

                        <div className="smart-line" />
                    </div>

                    <div className="smart-card">
                        <div className="smart-number">03</div>

                        <div className="smart-icon">↗</div>

                        <h3>Human when needed</h3>

                        <p>
                            Exceptions can be routed to manual review instead
                            of stopping the entire process.
                        </p>

                        <div className="smart-line" />
                    </div>
                </div>

                <div className="technology-strip">
                    <span>Powered by</span>

                    <strong>Camunda 8</strong>

                    <i />

                    <strong>Spring Boot</strong>

                    <i />

                    <strong>React</strong>
                </div>
            </section>

            {/* APPLICATION */}
            <section
                className="application-section"
                id="loan-application"
            >
                <div className="application-layout">
                    <div className="application-intro">
                        <span className="eyebrow">
                            Digital loan application
                        </span>

                        <h2>
                            Make your next
                            <span> move.</span>
                        </h2>

                        <p>
                            Enter a few details and let the lending workflow
                            take care of the rest.
                        </p>

                        <div className="application-benefits">
                            <div>
                                <span>01</span>
                                <div>
                                    <strong>Simple application</strong>
                                    <p>Only the essentials.</p>
                                </div>
                            </div>

                            <div>
                                <span>02</span>
                                <div>
                                    <strong>Automated assessment</strong>
                                    <p>Rules evaluate your application.</p>
                                </div>
                            </div>

                            <div>
                                <span>03</span>
                                <div>
                                    <strong>Fast decision path</strong>
                                    <p>Approved, declined or reviewed.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="application-card">
                        <div className="form-header">
                            <div>
                                <span className="form-eyebrow">
                                    LoanFlow
                                </span>

                                <h3>Start your application</h3>
                            </div>

                            <div className="form-lock">
                                <span>●</span>
                                Secure
                            </div>
                        </div>

                        <form onSubmit={submitLoan}>
                            <div className="form-group">
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
                                <div className="form-group">
                                    <label htmlFor="loanAmount">
                                        Loan amount
                                    </label>

                                    <div className="input-prefix">
                                        <span>₹</span>

                                        <input
                                            id="loanAmount"
                                            name="loanAmount"
                                            type="number"
                                            value={formData.loanAmount}
                                            onChange={handleChange}
                                            placeholder="500000"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="monthlyIncome">
                                        Monthly income
                                    </label>

                                    <div className="input-prefix">
                                        <span>₹</span>

                                        <input
                                            id="monthlyIncome"
                                            name="monthlyIncome"
                                            type="number"
                                            value={formData.monthlyIncome}
                                            onChange={handleChange}
                                            placeholder="80000"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="creditScore">
                                    Credit score
                                </label>

                                <input
                                    id="creditScore"
                                    name="creditScore"
                                    type="number"
                                    value={formData.creditScore}
                                    onChange={handleChange}
                                    placeholder="750"
                                    min="300"
                                    max="900"
                                    required
                                />

                                <span className="field-hint">
                                    Enter a score between 300 and 900.
                                </span>
                            </div>

                            {error && (
                                <div className="form-error" role="alert">
                                    <span>!</span>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="primary-button submit-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="button-spinner" />
                                        Processing application...
                                    </>
                                ) : (
                                    <>
                                        Submit application
                                        <span>→</span>
                                    </>
                                )}
                            </button>

                            <p className="form-disclaimer">
                                This is a portfolio demonstration. No
                                application data is permanently stored.
                            </p>
                        </form>
                    </div>
                </div>
            </section>

            {/* RESULT */}
            {result && (
                <section className="result-section">
                    <div className={`result-card ${getResultClass()}`}>
                        <div className="result-top">
                            <div className="result-icon">
                                {result.status === "APPROVED"
                                    ? "✓"
                                    : result.status === "REJECTED"
                                        ? "×"
                                        : "!"}
                            </div>

                            <div>
                                <span className="eyebrow">
                                    Lending decision
                                </span>

                                <h2>{getResultTitle()}</h2>
                            </div>
                        </div>

                        <p className="result-description">
                            {getResultDescription()}
                        </p>

                        <div className="result-details">
                            <div>
                                <span>Application ID</span>
                                <strong>
                                    #{result.applicationId}
                                </strong>
                            </div>

                            <div>
                                <span>Applicant</span>
                                <strong>
                                    {result.applicantName}
                                </strong>
                            </div>

                            <div>
                                <span>Loan amount</span>
                                <strong>
                                    {formatCurrency(result.loanAmount)}
                                </strong>
                            </div>

                            <div>
                                <span>Status</span>
                                <strong>{result.status}</strong>
                            </div>
                        </div>

                        {result.reviewedBy && (
                            <div className="review-note">
                                <span>Manual review</span>

                                <strong>
                                    Reviewed by {result.reviewedBy}
                                </strong>

                                {result.reviewComment && (
                                    <p>{result.reviewComment}</p>
                                )}
                            </div>
                        )}

                        <div className="result-actions">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={onViewApplications}
                            >
                                View all applications
                            </button>

                            <button
                                type="button"
                                className="text-button"
                                onClick={() => {
                                    setResult(null);

                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    });
                                }}
                            >
                                Start another application
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* FOOTER TRUST */}
            <section className="trust-section">
                <div className="trust-content">
                    <div>
                        <span className="eyebrow">
                            Built for modern lending
                        </span>

                        <h2>
                            Processes that move at
                            <span> digital speed.</span>
                        </h2>
                    </div>

                    <p>
                        LoanFlow demonstrates how modern applications can
                        combine responsive interfaces, backend services,
                        business rules and workflow orchestration into a
                        single lending experience.
                    </p>
                </div>
            </section>
        </div>
    );
}

export default LoanApplication;