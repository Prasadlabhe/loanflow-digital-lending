/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);

    const loadApplications = useCallback(async (isInitialLoad = false) => {
        try {
            if (isInitialLoad) {
                setInitialLoading(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await fetch(`${API_URL}/api/loans`);

            if (!response.ok) {
                setError("Unable to load applications.");
                return;
            }

            const data = await response.json();

            setApplications(Array.isArray(data) ? data : []);
        } catch (requestError) {
            console.error("LOAD APPLICATIONS ERROR:", requestError);

            setError(
                "Unable to connect to the lending service. Please try again."
            );
        } finally {
            if (isInitialLoad) {
                setInitialLoading(false);
            } else {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        loadApplications(true);
    }, [loadApplications]);

    const viewApplication = async (applicationId) => {
        try {
            setError("");

            const response = await fetch(
                `${API_URL}/api/loans/${applicationId}`
            );

            if (!response.ok) {
                setError("Unable to retrieve application details.");
                return;
            }

            const data = await response.json();

            setSelectedApplication(data);
        } catch (requestError) {
            console.error("VIEW APPLICATION ERROR:", requestError);

            setError("Unable to retrieve application details.");
        }
    };

    const closeApplication = () => {
        setSelectedApplication(null);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "APPROVED":
                return "status-approved";

            case "REJECTED":
                return "status-rejected";

            case "REVIEW":
                return "status-review";

            case "PROCESSING":
                return "status-processing";

            default:
                return "status-processing";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "APPROVED":
                return "Approved";

            case "REJECTED":
                return "Rejected";

            case "REVIEW":
                return "Manual Review";

            case "PROCESSING":
                return "Processing";

            default:
                return status || "Unknown";
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

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "—";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const totalApplications = applications.length;

    const approvedApplications = applications.filter(
        (application) => application.status === "APPROVED"
    ).length;

    const rejectedApplications = applications.filter(
        (application) => application.status === "REJECTED"
    ).length;

    const reviewApplications = applications.filter(
        (application) => application.status === "REVIEW"
    ).length;

    const processingApplications = applications.filter(
        (application) => application.status === "PROCESSING"
    ).length;

    return (
        <div className="dashboard-page">
            <section className="dashboard-hero">
                <div>
                    <div className="ai-pill dashboard-pill">
                        <span className="ai-spark">✦</span>
                        Lending intelligence
                    </div>

                    <h1>
                        Application
                        <span> center.</span>
                    </h1>

                    <p>
                        Monitor applications, decisions and workflow activity
                        from one place.
                    </p>
                </div>

                <button
                    type="button"
                    className="refresh-button"
                    onClick={() => loadApplications(false)}
                    disabled={loading}
                >
                    <span className={loading ? "refresh-spin" : ""}>↻</span>
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </section>

            {error && (
                <div className="error-banner" role="alert">
                    <div>
                        <span className="error-symbol">!</span>
                        <span>{error}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => loadApplications(false)}
                    >
                        Try again
                    </button>
                </div>
            )}

            {initialLoading ? (
                <section className="loading-card">
                    <div className="loading-spinner" />

                    <h3>Loading applications</h3>

                    <p>
                        Connecting to the LoanFlow lending service...
                    </p>
                </section>
            ) : (
                <>
                    {/* STATS */}
                    <section className="statistics">
                        <div className="stat-card stat-total">
                            <div className="stat-top">
                                <span className="stat-label">
                                    Total applications
                                </span>

                                <span className="stat-icon">◌</span>
                            </div>

                            <strong>{totalApplications}</strong>

                            <span className="stat-description">
                                All submitted applications
                            </span>
                        </div>

                        <div className="stat-card stat-processing">
                            <div className="stat-top">
                                <span className="stat-label">
                                    Processing
                                </span>

                                <span className="stat-icon">◔</span>
                            </div>

                            <strong>{processingApplications}</strong>

                            <span className="stat-description">
                                Currently in workflow
                            </span>
                        </div>

                        <div className="stat-card stat-approved">
                            <div className="stat-top">
                                <span className="stat-label">
                                    Approved
                                </span>

                                <span className="stat-icon">✓</span>
                            </div>

                            <strong>{approvedApplications}</strong>

                            <span className="stat-description">
                                Successfully approved
                            </span>
                        </div>

                        <div className="stat-card stat-review">
                            <div className="stat-top">
                                <span className="stat-label">
                                    Manual review
                                </span>

                                <span className="stat-icon">!</span>
                            </div>

                            <strong>{reviewApplications}</strong>

                            <span className="stat-description">
                                Require human attention
                            </span>
                        </div>

                        <div className="stat-card stat-rejected">
                            <div className="stat-top">
                                <span className="stat-label">
                                    Rejected
                                </span>

                                <span className="stat-icon">×</span>
                            </div>

                            <strong>{rejectedApplications}</strong>

                            <span className="stat-description">
                                Applications declined
                            </span>
                        </div>
                    </section>

                    {/* TABLE */}
                    <section className="applications-card">
                        <div className="applications-card-header">
                            <div>
                                <span className="eyebrow">
                                    Lending operations
                                </span>

                                <h2>Recent applications</h2>

                                <p>
                                    Track every application flowing through
                                    the lending process.
                                </p>
                            </div>

                            <div className="applications-card-meta">
                                <span className="online-indicator">
                                    <span />
                                    Workflow online
                                </span>

                                <span className="application-count">
                                    {totalApplications}{" "}
                                    {totalApplications === 1
                                        ? "application"
                                        : "applications"}
                                </span>
                            </div>
                        </div>

                        {applications.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">L</div>

                                <h3>No applications yet</h3>

                                <p>
                                    Submitted loan applications will appear
                                    here.
                                </p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="applications-table">
                                    <thead>
                                    <tr>
                                        <th>Application</th>
                                        <th>Applicant</th>
                                        <th>Loan amount</th>
                                        <th>Credit score</th>
                                        <th>Status</th>
                                        <th>Submitted</th>
                                        <th />
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {applications.map((application) => (
                                        <tr
                                            key={
                                                application.applicationId
                                            }
                                        >
                                            <td>
                                                    <span className="application-id">
                                                        #
                                                        {
                                                            application.applicationId
                                                        }
                                                    </span>
                                            </td>

                                            <td>
                                                <div className="applicant-cell">
                                                        <span className="applicant-avatar">
                                                            {(
                                                                application.applicantName ||
                                                                "A"
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>

                                                    <div>
                                                        <strong>
                                                            {
                                                                application.applicantName
                                                            }
                                                        </strong>

                                                        <span>
                                                                Loan applicant
                                                            </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <strong className="amount-cell">
                                                    {formatCurrency(
                                                        application.loanAmount
                                                    )}
                                                </strong>
                                            </td>

                                            <td>
                                                    <span className="credit-score">
                                                        {
                                                            application.creditScore
                                                        }
                                                    </span>
                                            </td>

                                            <td>
                                                    <span
                                                        className={`status-badge ${getStatusClass(
                                                            application.status
                                                        )}`}
                                                    >
                                                        <span className="status-dot" />

                                                        {getStatusLabel(
                                                            application.status
                                                        )}
                                                    </span>
                                            </td>

                                            <td>
                                                    <span className="date-cell">
                                                        {formatDate(
                                                            application.createdAt
                                                        )}
                                                    </span>
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="view-button"
                                                    onClick={() =>
                                                        viewApplication(
                                                            application.applicationId
                                                        )
                                                    }
                                                >
                                                    View
                                                    <span>→</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* WORKFLOW PANEL */}
                    <section className="workflow-panel">
                        <div className="workflow-copy">
                            <span className="eyebrow">
                                Behind the experience
                            </span>

                            <h2>
                                One application.
                                <br />
                                <span>One intelligent workflow.</span>
                            </h2>

                            <p>
                                LoanFlow uses Camunda 8 to orchestrate the
                                lending process from submission through final
                                decision.
                            </p>
                        </div>

                        <div className="workflow-steps">
                            <div className="workflow-step">
                                <span>01</span>

                                <div>
                                    <strong>Application</strong>
                                    <small>Data captured</small>
                                </div>
                            </div>

                            <div className="workflow-connector" />

                            <div className="workflow-step">
                                <span>02</span>

                                <div>
                                    <strong>Rules</strong>
                                    <small>Eligibility evaluated</small>
                                </div>
                            </div>

                            <div className="workflow-connector" />

                            <div className="workflow-step">
                                <span>03</span>

                                <div>
                                    <strong>Decision</strong>
                                    <small>Outcome determined</small>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* MODAL */}
            {selectedApplication && (
                <div
                    className="modal-backdrop"
                    onClick={closeApplication}
                    role="presentation"
                >
                    <div
                        className="application-modal"
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="application-modal-title"
                    >
                        <div className="modal-header">
                            <div>
                                <span className="eyebrow">
                                    Application details
                                </span>

                                <h2 id="application-modal-title">
                                    #
                                    {
                                        selectedApplication.applicationId
                                    }
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeApplication}
                                aria-label="Close application details"
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-status">
                            <span
                                className={`status-badge ${getStatusClass(
                                    selectedApplication.status
                                )}`}
                            >
                                <span className="status-dot" />

                                {getStatusLabel(
                                    selectedApplication.status
                                )}
                            </span>
                        </div>

                        <div className="details-grid">
                            <div className="detail-item">
                                <span>Applicant</span>

                                <strong>
                                    {selectedApplication.applicantName}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Loan amount</span>

                                <strong>
                                    {formatCurrency(
                                        selectedApplication.loanAmount
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Monthly income</span>

                                <strong>
                                    {formatCurrency(
                                        selectedApplication.monthlyIncome
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Credit score</span>

                                <strong>
                                    {selectedApplication.creditScore}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Process instance</span>

                                <strong>
                                    {selectedApplication.processInstanceKey ||
                                        "—"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Reviewed at</span>

                                <strong>
                                    {formatDate(
                                        selectedApplication.reviewedAt
                                    )}
                                </strong>
                            </div>
                        </div>

                        {selectedApplication.reviewedBy && (
                            <div className="review-details">
                                <span>Manual review</span>

                                <strong>
                                    {selectedApplication.reviewedBy}
                                </strong>

                                {selectedApplication.reviewComment && (
                                    <p>
                                        {
                                            selectedApplication.reviewComment
                                        }
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={closeApplication}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Applications;