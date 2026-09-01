import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

const initialForm = {
    applicantName: "",
    loanAmount: "",
    monthlyIncome: "",
    creditScore: "",
};

function LoanApplication({ onViewApplications }) {
    const [formData, setFormData] = useState(initialForm);
    const [status, setStatus] = useState("IDLE");
    const [application, setApplication] = useState(null);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const mountedRef = useRef(true);
    const pollingTimeoutRef = useRef(null);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            if (pollingTimeoutRef.current) {
                window.clearTimeout(pollingTimeoutRef.current);
            }
        };
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
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
                pollingTimeoutRef.current = window.setTimeout(() => {
                    getApplicationStatus(applicationId);
                }, 1000);
            } else {
                setSubmitting(false);
            }
        } catch (requestError) {
            if (!mountedRef.current) {
                return;
            }

            setSubmitting(false);
            setError(
                requestError.message ||
                "Something went wrong while checking your application."
            );
        }
    };

    const submitLoan = async (event) => {
        event.preventDefault();

        setError("");
        setApplication(null);

        const payload = {
            applicantName: formData.applicantName.trim(),
            loanAmount: Number(formData.loanAmount),
            monthlyIncome: Number(formData.monthlyIncome),
            creditScore: Number(formData.creditScore),
        };

        if (
            !payload.applicantName ||
            !payload.loanAmount ||
            !payload.monthlyIncome ||
            !payload.creditScore
        ) {
            setError("Please complete all application fields.");
            return;
        }

        if (payload.loanAmount <= 0) {
            setError("Loan amount must be greater than zero.");
            return;
        }

        if (payload.monthlyIncome <= 0) {
            setError("Monthly income must be greater than zero.");
            return;
        }

        if (payload.creditScore < 300 || payload.creditScore > 900) {
            setError("Credit score must be between 300 and 900.");
            return;
        }

        setSubmitting(true);
        setStatus("PROCESSING");

        try {
            const response = await fetch(`${API_URL}/api/loans`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(
                    "Unable to submit the loan application. Please try again."
                );
            }

            const data = await response.json();

            if (!mountedRef.current) {
                return;
            }

            setApplication(data);

            if (data.applicationId) {
                await getApplicationStatus(data.applicationId);
            } else {
                setStatus(data.status || "PROCESSING");
                setSubmitting(false);
            }
        } catch (requestError) {
            if (!mountedRef.current) {
                return;
            }

            setSubmitting(false);
            setStatus("ERROR");
            setError(
                requestError.message ||
                "Unable to submit your application."
            );
        }
    };

    const resetApplication = () => {
        if (pollingTimeoutRef.current) {
            window.clearTimeout(pollingTimeoutRef.current);
        }

        setFormData(initialForm);
        setApplication(null);
        setStatus("IDLE");
        setError("");
        setSubmitting(false);
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

    const statusConfig = {
        APPROVED: {
            label: "Approved",
            description:
                "The demonstration workflow has approved this application.",
            className: "approved",
            icon: "✓",
        },
        REJECTED: {
            label: "Rejected",
            description:
                "The demonstration workflow has rejected this application.",
            className: "rejected",
            icon: "×",
        },
        REVIEW: {
            label: "Manual review",
            description:
                "This application has been routed for manual assessment.",
            className: "review",
            icon: "!",
        },
        PROCESSING: {
            label: "Processing",
            description:
                "Camunda is currently processing the application workflow.",
            className: "processing",
            icon: "…",
        },
    };

    const currentStatus = statusConfig[status];

    return (
        <div className="loan-application-component">
            <div className="application-layout">
                <div className="application-card">
                    <div className="application-card-top">
                        <div>
                            <span className="section-eyebrow">
                                APPLICATION
                            </span>
                            <h3>Tell us about your loan.</h3>
                            <p>
                                Use sample information to experience the
                                LoanFlow decision workflow.
                            </p>
                        </div>

                        <span className="form-step">01 / 01</span>
                    </div>

                    <form onSubmit={submitLoan}>
                        <div className="form-section-label">
                            Applicant information
                        </div>

                        <label className="field">
                            <span>Applicant name</span>
                            <input
                                type="text"
                                name="applicantName"
                                value={formData.applicantName}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                                disabled={submitting}
                                autoComplete="name"
                            />
                        </label>

                        <div className="field-grid">
                            <label className="field">
                                <span>Loan amount</span>
                                <div className="input-prefix">
                                    <span>₹</span>
                                    <input
                                        type="number"
                                        name="loanAmount"
                                        value={formData.loanAmount}
                                        onChange={handleChange}
                                        placeholder="500000"
                                        min="1"
                                        disabled={submitting}
                                    />
                                </div>
                            </label>

                            <label className="field">
                                <span>Monthly income</span>
                                <div className="input-prefix">
                                    <span>₹</span>
                                    <input
                                        type="number"
                                        name="monthlyIncome"
                                        value={formData.monthlyIncome}
                                        onChange={handleChange}
                                        placeholder="80000"
                                        min="1"
                                        disabled={submitting}
                                    />
                                </div>
                            </label>
                        </div>

                        <label className="field">
                            <span>
                                Credit score
                                <small>300–900</small>
                            </span>

                            <input
                                type="number"
                                name="creditScore"
                                value={formData.creditScore}
                                onChange={handleChange}
                                placeholder="750"
                                min="300"
                                max="900"
                                disabled={submitting}
                            />
                        </label>

                        {error && (
                            <div className="form-error" role="alert">
                                <span>!</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={submitting}
                        >
                            {submitting ? (
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
                            Demo only. Do not enter real financial credentials
                            or sensitive identity information.
                        </p>
                    </form>
                </div>

                <div className="application-side">
                    <div className="workflow-card">
                        <div className="workflow-header">
                            <div>
                                <span>CAMUNDA 8</span>
                                <strong>Workflow status</strong>
                            </div>

                            <span className="workflow-live">
                                <i />
                                LIVE
                            </span>
                        </div>

                        <div className="workflow-visual">
                            <div className="workflow-item active">
                                <span>1</span>
                                <div>
                                    <strong>Loan submitted</strong>
                                    <small>Application received</small>
                                </div>
                            </div>

                            <div className="workflow-line active" />

                            <div
                                className={`workflow-item ${
                                    status === "PROCESSING" ||
                                    status === "APPROVED" ||
                                    status === "REJECTED" ||
                                    status === "REVIEW"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <span>2</span>
                                <div>
                                    <strong>Decision engine</strong>
                                    <small>Business rules evaluated</small>
                                </div>
                            </div>

                            <div className="workflow-line active" />

                            <div
                                className={`workflow-item ${
                                    status !== "IDLE" ? "active" : ""
                                }`}
                            >
                                <span>3</span>
                                <div>
                                    <strong>Final outcome</strong>
                                    <small>Application decision</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="demo-panel">
                        <span className="demo-panel-icon">i</span>
                        <div>
                            <strong>Portfolio demonstration</strong>
                            <p>
                                No permanent customer database is used in this
                                implementation. The backend uses an in-memory
                                store to demonstrate workflow behavior.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {application && currentStatus && (
                <div
                    className={`application-result ${currentStatus.className}`}
                    aria-live="polite"
                >
                    <div className="result-header">
                        <div
                            className={`result-icon ${currentStatus.className}`}
                        >
                            {currentStatus.icon}
                        </div>

                        <div>
                            <span className="result-label">
                                APPLICATION OUTCOME
                            </span>
                            <h3>{currentStatus.label}</h3>
                            <p>{currentStatus.description}</p>
                        </div>
                    </div>

                    <div className="result-grid">
                        <div>
                            <span>Application ID</span>
                            <strong>
                                {application.applicationId || "Pending"}
                            </strong>
                        </div>

                        <div>
                            <span>Applicant</span>
                            <strong>
                                {application.applicantName ||
                                    formData.applicantName}
                            </strong>
                        </div>

                        <div>
                            <span>Loan amount</span>
                            <strong>
                                {formatCurrency(
                                    application.loanAmount ??
                                    formData.loanAmount
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>Status</span>
                            <strong>{currentStatus.label}</strong>
                        </div>
                    </div>

                    {application.reviewedBy && (
                        <div className="review-details">
                            <div>
                                <span>Reviewed by</span>
                                <strong>{application.reviewedBy}</strong>
                            </div>

                            {application.reviewComment && (
                                <div>
                                    <span>Review comment</span>
                                    <strong>
                                        {application.reviewComment}
                                    </strong>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="result-actions">
                        <button
                            type="button"
                            className="secondary-button dark"
                            onClick={resetApplication}
                        >
                            New application
                        </button>

                        {onViewApplications && (
                            <button
                                type="button"
                                className="primary-button"
                                onClick={onViewApplications}
                            >
                                View applications
                                <span>→</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoanApplication;