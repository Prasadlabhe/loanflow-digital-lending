import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

const initialForm = {
    applicantName: "",
    loanAmount: "",
    monthlyIncome: "",
    creditScore: "",
};

function LoanApplication({ onViewApplications }) {
    const [form, setForm] = useState(initialForm);
    const [status, setStatus] = useState("IDLE");
    const [application, setApplication] = useState(null);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const mountedRef = useRef(true);
    const pollTimeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            mountedRef.current = false;

            if (pollTimeoutRef.current) {
                window.clearTimeout(pollTimeoutRef.current);
            }
        };
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const getApplicationStatus = async (applicationId) => {
        try {
            const response = await fetch(
                `${API_URL}/api/loans/${applicationId}`
            );

            if (!response.ok) {
                throw new Error("Unable to retrieve application status.");
            }

            const data = await response.json();

            if (!mountedRef.current) {
                return;
            }

            setApplication(data);
            setStatus(data.status);

            if (data.status === "PROCESSING") {
                pollTimeoutRef.current = window.setTimeout(() => {
                    getApplicationStatus(applicationId);
                }, 1000);
            }
        } catch (requestError) {
            if (mountedRef.current) {
                setError(
                    requestError.message ||
                    "Something went wrong while checking your application."
                );
                setStatus("ERROR");
            }
        }
    };

    const submitLoan = async (event) => {
        event.preventDefault();

        setSubmitting(true);
        setError("");
        setApplication(null);
        setStatus("PROCESSING");

        try {
            const payload = {
                applicantName: form.applicantName.trim(),
                loanAmount: Number(form.loanAmount),
                monthlyIncome: Number(form.monthlyIncome),
                creditScore: Number(form.creditScore),
            };

            const response = await fetch(`${API_URL}/api/loans`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Unable to submit the loan application.");
            }

            const data = await response.json();

            if (!mountedRef.current) {
                return;
            }

            setApplication(data);
            setStatus(data.status || "PROCESSING");
            setSubmitting(false);

            if (data.applicationId) {
                getApplicationStatus(data.applicationId);
            }
        } catch (requestError) {
            if (mountedRef.current) {
                setError(
                    requestError.message ||
                    "Unable to submit your application."
                );
                setStatus("ERROR");
                setSubmitting(false);
            }
        }
    };

    const resetForm = () => {
        if (pollTimeoutRef.current) {
            window.clearTimeout(pollTimeoutRef.current);
        }

        setForm(initialForm);
        setStatus("IDLE");
        setApplication(null);
        setError("");
        setSubmitting(false);
    };

    const statusConfig = {
        APPROVED: {
            label: "Application approved",
            icon: "✓",
            className: "approved",
            description:
                "The automated lending workflow has approved this application.",
        },
        REJECTED: {
            label: "Application declined",
            icon: "×",
            className: "rejected",
            description:
                "The decision engine determined that the application does not meet the current lending criteria.",
        },
        REVIEW: {
            label: "Manual review required",
            icon: "◎",
            className: "review",
            description:
                "The workflow has routed this application to a human reviewer.",
        },
        PROCESSING: {
            label: "Processing application",
            icon: "◌",
            className: "processing",
            description:
                "Your application is moving through the automated lending workflow.",
        },
    };

    const currentStatus = statusConfig[status];

    return (
        <section className="loan-application-section" id="loan-application">
            <div className="section-shell">
                <div className="application-intro">
                    <div>
                        <span className="section-kicker">
                            DIGITAL LOAN APPLICATION
                        </span>

                        <h2>
                            Your application.
                            <br />
                            <span>One intelligent workflow.</span>
                        </h2>
                    </div>

                    <div className="application-intro-meta">
                        <span>
                            <i />
                            Secure workflow
                        </span>
                        <span>~2 min</span>
                    </div>
                </div>

                <div className="application-layout">
                    <div className="application-card">
                        <div className="card-header">
                            <div>
                                <span className="card-step">STEP 01 / 01</span>
                                <h3>Tell us about yourself</h3>
                            </div>

                            <div className="card-lock">⌁</div>
                        </div>

                        <form onSubmit={submitLoan}>
                            <div className="form-grid">
                                <label className="form-field full-width">
                                    <span>Applicant name</span>
                                    <div className="input-wrap">
                                        <span className="input-icon">◎</span>
                                        <input
                                            type="text"
                                            name="applicantName"
                                            value={form.applicantName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                </label>

                                <label className="form-field">
                                    <span>Loan amount</span>
                                    <div className="input-wrap">
                                        <span className="input-prefix">₹</span>
                                        <input
                                            type="number"
                                            name="loanAmount"
                                            value={form.loanAmount}
                                            onChange={handleChange}
                                            placeholder="500000"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </label>

                                <label className="form-field">
                                    <span>Monthly income</span>
                                    <div className="input-wrap">
                                        <span className="input-prefix">₹</span>
                                        <input
                                            type="number"
                                            name="monthlyIncome"
                                            value={form.monthlyIncome}
                                            onChange={handleChange}
                                            placeholder="80000"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </label>

                                <label className="form-field full-width">
                                    <span>Credit score</span>
                                    <div className="input-wrap">
                                        <span className="input-icon">◈</span>
                                        <input
                                            type="number"
                                            name="creditScore"
                                            value={form.creditScore}
                                            onChange={handleChange}
                                            placeholder="750"
                                            min="300"
                                            max="900"
                                            required
                                        />
                                        <span className="input-helper">
                                            300–900
                                        </span>
                                    </div>
                                </label>
                            </div>

                            <div className="form-info">
                                <div className="info-icon">i</div>
                                <p>
                                    This portfolio demo uses an in-memory
                                    application store. No loan or personal data
                                    is permanently saved.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="submit-button"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="button-spinner" />
                                        Starting workflow...
                                    </>
                                ) : (
                                    <>
                                        Submit application
                                        <span>↗</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="workflow-preview">
                        <div className="workflow-preview-top">
                            <span className="card-step">LIVE WORKFLOW</span>
                            <span className="workflow-online">
                                <i />
                                ONLINE
                            </span>
                        </div>

                        <h3>Watch your application move.</h3>

                        <div className="workflow-map">
                            <div className="workflow-node active">
                                <span>01</span>
                                <div>
                                    <strong>Application</strong>
                                    <small>Submitted</small>
                                </div>
                            </div>

                            <div className="workflow-connector active" />

                            <div className="workflow-node">
                                <span>02</span>
                                <div>
                                    <strong>Risk analysis</strong>
                                    <small>Automated</small>
                                </div>
                            </div>

                            <div className="workflow-connector" />

                            <div className="workflow-node">
                                <span>03</span>
                                <div>
                                    <strong>Decision</strong>
                                    <small>Camunda 8</small>
                                </div>
                            </div>

                            <div className="workflow-connector" />

                            <div className="workflow-node">
                                <span>04</span>
                                <div>
                                    <strong>Outcome</strong>
                                    <small>Approved / Review / Reject</small>
                                </div>
                            </div>
                        </div>

                        <div className="workflow-engine">
                            <span className="engine-pulse" />
                            <div>
                                <strong>Camunda Process Engine</strong>
                                <small>
                                    Orchestrating business process execution
                                </small>
                            </div>
                            <span className="engine-arrow">→</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="error-banner">
                        <span>!</span>
                        <div>
                            <strong>Something went wrong</strong>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {currentStatus && application && (
                    <div
                        className={`result-card ${currentStatus.className}`}
                    >
                        <div className="result-icon">
                            {status === "PROCESSING" ? (
                                <span className="result-spinner" />
                            ) : (
                                currentStatus.icon
                            )}
                        </div>

                        <div className="result-content">
                            <span className="card-step">APPLICATION RESULT</span>
                            <h3>{currentStatus.label}</h3>
                            <p>{currentStatus.description}</p>

                            <div className="result-details">
                                {application.applicationId && (
                                    <div>
                                        <span>Application ID</span>
                                        <strong>
                                            {application.applicationId}
                                        </strong>
                                    </div>
                                )}

                                <div>
                                    <span>Applicant</span>
                                    <strong>
                                        {application.applicantName ||
                                            form.applicantName}
                                    </strong>
                                </div>

                                {application.reviewedBy && (
                                    <div>
                                        <span>Reviewed by</span>
                                        <strong>
                                            {application.reviewedBy}
                                        </strong>
                                    </div>
                                )}
                            </div>

                            {application.reviewComment && (
                                <div className="review-comment">
                                    <span>Reviewer comment</span>
                                    <p>{application.reviewComment}</p>
                                </div>
                            )}

                            <div className="result-actions">
                                {onViewApplications && (
                                    <button
                                        type="button"
                                        className="secondary-button dark"
                                        onClick={onViewApplications}
                                    >
                                        View applications
                                        <span>→</span>
                                    </button>
                                )}

                                {status !== "PROCESSING" && (
                                    <button
                                        type="button"
                                        className="text-button"
                                        onClick={resetForm}
                                    >
                                        Submit another application
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default LoanApplication;