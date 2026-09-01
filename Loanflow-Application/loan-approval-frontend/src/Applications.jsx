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

    /*
     * Load applications when the Applications page opens.
     *
     * The request itself is asynchronous. The state updates happen
     * after the API response is received.
     */
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
            {/* Dashboard Header */}
            <section className="dashboard-hero">
                <div>
                    <span className="eyebrow">LoanFlow Dashboard</span>

                    <h1>Applications</h1>

                    <p>
                        Monitor loan applications and view their current
                        decision status.
                    </p>
                </div>

                <button
                    type="button"
                    className="refresh-button"
                    onClick={() => loadApplications(false)}
                    disabled={loading}
                >
                    {loading ? "Refreshing..." : "Refresh Applications"}
                </button>
            </section>

            {/* Error */}
            {error && (
                <div className="error-banner" role="alert">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() => loadApplications(false)}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Initial Loading */}
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
                    {/* Statistics */}
                    <section className="statistics">
                        <div className="stat-card">
                            <span className="stat-label">Total</span>

                            <strong>{totalApplications}</strong>

                            <span className="stat-description">
                                Applications
                            </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">Processing</span>

                            <strong>{processingApplications}</strong>

                            <span className="stat-description">
                                In progress
                            </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">Approved</span>

                            <strong>{approvedApplications}</strong>

                            <span className="stat-description">
                                Successfully approved
                            </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">
                                Manual Review
                            </span>

                            <strong>{reviewApplications}</strong>

                            <span className="stat-description">
                                Requires review
                            </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">Rejected</span>

                            <strong>{rejectedApplications}</strong>

                            <span className="stat-description">
                                Applications declined
                            </span>
                        </div>
                    </section>

                    {/* Applications Table */}
                    <section className="applications-card">
                        <div className="applications-card-header">
                            <div>
                                <span className="eyebrow">
                                    Lending Operations
                                </span>

                                <h2>Recent Applications</h2>
                            </div>

                            <span className="application-count">
                                {totalApplications}{" "}
                                {totalApplications === 1
                                    ? "application"
                                    : "applications"}
                            </span>
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
                                        <th>Loan Amount</th>
                                        <th>Credit Score</th>
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
                                                <strong>
                                                    {
                                                        application.applicantName
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    application.loanAmount
                                                )}
                                            </td>

                                            <td>
                                                {
                                                    application.creditScore
                                                }
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
                                                {formatDate(
                                                    application.createdAt
                                                )}
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
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </>
            )}

            {/* Application Details Modal */}
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
                                    Application Details
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
                                <span>Loan Amount</span>

                                <strong>
                                    {formatCurrency(
                                        selectedApplication.loanAmount
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Monthly Income</span>

                                <strong>
                                    {formatCurrency(
                                        selectedApplication.monthlyIncome
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Credit Score</span>

                                <strong>
                                    {selectedApplication.creditScore}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Process Instance</span>

                                <strong>
                                    {selectedApplication.processInstanceKey ||
                                        "—"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Reviewed At</span>

                                <strong>
                                    {formatDate(
                                        selectedApplication.reviewedAt
                                    )}
                                </strong>
                            </div>
                        </div>

                        {selectedApplication.reviewedBy && (
                            <div className="review-details">
                                <span>Reviewed By</span>

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