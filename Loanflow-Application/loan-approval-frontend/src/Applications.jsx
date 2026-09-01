/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [filter, setFilter] = useState("ALL");

    const loadApplications = useCallback(async (showLoader = false) => {
        if (showLoader) {
            setRefreshing(true);
        }

        try {
            const response = await fetch(`${API_URL}/api/loans`);

            if (!response.ok) {
                throw new Error("Unable to load applications.");
            }

            const data = await response.json();

            setApplications(Array.isArray(data) ? data : []);
            setError("");
        } catch (requestError) {
            setError(
                requestError.message ||
                "Unable to load the application dashboard."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadApplications(true);
    }, [loadApplications]);

    const stats = useMemo(() => {
        const total = applications.length;
        const processing = applications.filter(
            (application) => application.status === "PROCESSING"
        ).length;
        const approved = applications.filter(
            (application) => application.status === "APPROVED"
        ).length;
        const review = applications.filter(
            (application) => application.status === "REVIEW"
        ).length;
        const rejected = applications.filter(
            (application) => application.status === "REJECTED"
        ).length;

        return {
            total,
            processing,
            approved,
            review,
            rejected,
        };
    }, [applications]);

    const filteredApplications = useMemo(() => {
        if (filter === "ALL") {
            return applications;
        }

        return applications.filter(
            (application) => application.status === filter
        );
    }, [applications, filter]);

    const getStatusLabel = (status) => {
        switch (status) {
            case "APPROVED":
                return "Approved";
            case "REJECTED":
                return "Rejected";
            case "REVIEW":
                return "Manual review";
            case "PROCESSING":
                return "Processing";
            default:
                return status || "Unknown";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "APPROVED":
                return "✓";
            case "REJECTED":
                return "×";
            case "REVIEW":
                return "◎";
            case "PROCESSING":
                return "◌";
            default:
                return "•";
        }
    };

    const formatAmount = (amount) => {
        if (amount === undefined || amount === null || amount === "") {
            return "—";
        }

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(Number(amount));
    };

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "Recently";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Recently";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <main className="dashboard-page">
            <div className="dashboard-shell">
                <div className="dashboard-header">
                    <div>
                        <span className="section-kicker">
                            LOANFLOW OPERATIONS
                        </span>
                        <h1>Application intelligence.</h1>
                        <p>
                            Monitor every loan application moving through the
                            Camunda workflow.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="refresh-button"
                        onClick={() => loadApplications(true)}
                        disabled={refreshing}
                    >
                        <span className={refreshing ? "spin" : ""}>↻</span>
                        Refresh
                    </button>
                </div>

                <div className="dashboard-live-bar">
                    <div>
                        <span className="live-indicator">
                            <i />
                            WORKFLOW ENGINE
                        </span>
                        <strong>Camunda 8 connected</strong>
                    </div>

                    <div className="live-bar-right">
                        <span>In-memory demo environment</span>
                        <span className="live-dot" />
                    </div>
                </div>

                <section className="statistics">
                    <button
                        type="button"
                        className={`stat-card ${
                            filter === "ALL" ? "selected" : ""
                        }`}
                        onClick={() => setFilter("ALL")}
                    >
                        <div className="stat-card-top">
                            <span>Total applications</span>
                            <span className="stat-icon">Σ</span>
                        </div>
                        <strong>{stats.total}</strong>
                        <small>All applications</small>
                    </button>

                    <button
                        type="button"
                        className={`stat-card ${
                            filter === "PROCESSING" ? "selected" : ""
                        }`}
                        onClick={() => setFilter("PROCESSING")}
                    >
                        <div className="stat-card-top">
                            <span>Processing</span>
                            <span className="stat-icon processing-icon">
                                ◌
                            </span>
                        </div>
                        <strong>{stats.processing}</strong>
                        <small>Workflow active</small>
                    </button>

                    <button
                        type="button"
                        className={`stat-card ${
                            filter === "APPROVED" ? "selected" : ""
                        }`}
                        onClick={() => setFilter("APPROVED")}
                    >
                        <div className="stat-card-top">
                            <span>Approved</span>
                            <span className="stat-icon approved-icon">✓</span>
                        </div>
                        <strong>{stats.approved}</strong>
                        <small>Positive outcome</small>
                    </button>

                    <button
                        type="button"
                        className={`stat-card ${
                            filter === "REVIEW" ? "selected" : ""
                        }`}
                        onClick={() => setFilter("REVIEW")}
                    >
                        <div className="stat-card-top">
                            <span>Manual review</span>
                            <span className="stat-icon review-icon">◎</span>
                        </div>
                        <strong>{stats.review}</strong>
                        <small>Human decision</small>
                    </button>

                    <button
                        type="button"
                        className={`stat-card ${
                            filter === "REJECTED" ? "selected" : ""
                        }`}
                        onClick={() => setFilter("REJECTED")}
                    >
                        <div className="stat-card-top">
                            <span>Rejected</span>
                            <span className="stat-icon rejected-icon">×</span>
                        </div>
                        <strong>{stats.rejected}</strong>
                        <small>Negative outcome</small>
                    </button>
                </section>

                <section className="dashboard-main-card">
                    <div className="applications-toolbar">
                        <div>
                            <span className="card-step">
                                LIVE APPLICATION STREAM
                            </span>
                            <h2>
                                Recent applications
                                <span>{filteredApplications.length}</span>
                            </h2>
                        </div>

                        <div className="filter-pills">
                            {[
                                ["ALL", "All"],
                                ["PROCESSING", "Processing"],
                                ["APPROVED", "Approved"],
                                ["REVIEW", "Review"],
                                ["REJECTED", "Rejected"],
                            ].map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={filter === value ? "active" : ""}
                                    onClick={() => setFilter(value)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="dashboard-error">
                            <span>!</span>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="dashboard-loading">
                            <span className="loading-orbit" />
                            <strong>Loading applications...</strong>
                            <small>
                                Connecting to the LoanFlow API
                            </small>
                        </div>
                    ) : filteredApplications.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">◌</div>
                            <h3>No applications yet</h3>
                            <p>
                                Submit a loan application and its workflow
                                status will appear here.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="applications-table-wrap">
                                <table className="applications-table">
                                    <thead>
                                    <tr>
                                        <th>Application</th>
                                        <th>Applicant</th>
                                        <th>Loan amount</th>
                                        <th>Credit score</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {filteredApplications.map(
                                        (application) => (
                                            <tr
                                                key={
                                                    application.applicationId ||
                                                    application.processInstanceKey
                                                }
                                            >
                                                <td>
                                                    <div className="application-id">
                                                            <span>
                                                                {getStatusIcon(
                                                                    application.status
                                                                )}
                                                            </span>
                                                        <div>
                                                            <strong>
                                                                {application.applicationId ||
                                                                    "—"}
                                                            </strong>
                                                            <small>
                                                                {formatDate(
                                                                    application.reviewedAt
                                                                )}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {application.applicantName ||
                                                            "Unknown"}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {formatAmount(
                                                            application.loanAmount
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <div className="credit-score">
                                                        <strong>
                                                            {application.creditScore ||
                                                                "—"}
                                                        </strong>
                                                        <span>
                                                                {application.creditScore >=
                                                                750
                                                                    ? "Strong"
                                                                    : application.creditScore >=
                                                                    650
                                                                        ? "Fair"
                                                                        : "Low"}
                                                            </span>
                                                    </div>
                                                </td>

                                                <td>
                                                        <span
                                                            className={`status-pill ${String(
                                                                application.status ||
                                                                ""
                                                            ).toLowerCase()}`}
                                                        >
                                                            <i>
                                                                {getStatusIcon(
                                                                    application.status
                                                                )}
                                                            </i>
                                                            {getStatusLabel(
                                                                application.status
                                                            )}
                                                        </span>
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className="view-button"
                                                        onClick={() =>
                                                            setSelectedApplication(
                                                                application
                                                            )
                                                        }
                                                    >
                                                        View
                                                        <span>→</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mobile-application-list">
                                {filteredApplications.map((application) => (
                                    <button
                                        type="button"
                                        className="mobile-application-card"
                                        key={
                                            application.applicationId ||
                                            application.processInstanceKey
                                        }
                                        onClick={() =>
                                            setSelectedApplication(application)
                                        }
                                    >
                                        <div className="mobile-card-top">
                                            <strong>
                                                {application.applicantName ||
                                                    "Unknown"}
                                            </strong>

                                            <span
                                                className={`status-pill ${String(
                                                    application.status || ""
                                                ).toLowerCase()}`}
                                            >
                                                {getStatusLabel(
                                                    application.status
                                                )}
                                            </span>
                                        </div>

                                        <div className="mobile-card-details">
                                            <div>
                                                <span>Application</span>
                                                <strong>
                                                    {application.applicationId ||
                                                        "—"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Amount</span>
                                                <strong>
                                                    {formatAmount(
                                                        application.loanAmount
                                                    )}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Score</span>
                                                <strong>
                                                    {application.creditScore ||
                                                        "—"}
                                                </strong>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </section>

                <div className="dashboard-note">
                    <span>i</span>
                    <p>
                        <strong>Portfolio demonstration:</strong> Application
                        data is stored only in memory and is not permanently
                        persisted.
                    </p>
                </div>
            </div>

            {selectedApplication && (
                <div
                    className="application-modal-backdrop"
                    role="presentation"
                    onClick={() => setSelectedApplication(null)}
                >
                    <div
                        className="application-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="application-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="modal-header">
                            <div>
                                <span className="card-step">
                                    APPLICATION DETAILS
                                </span>
                                <h2 id="application-modal-title">
                                    {selectedApplication.applicationId ||
                                        "Application"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={() => setSelectedApplication(null)}
                                aria-label="Close application details"
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-status">
                            <span
                                className={`status-pill ${String(
                                    selectedApplication.status || ""
                                ).toLowerCase()}`}
                            >
                                {getStatusIcon(selectedApplication.status)}
                                {getStatusLabel(selectedApplication.status)}
                            </span>
                        </div>

                        <div className="modal-grid">
                            <div>
                                <span>Applicant</span>
                                <strong>
                                    {selectedApplication.applicantName ||
                                        "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Loan amount</span>
                                <strong>
                                    {formatAmount(
                                        selectedApplication.loanAmount
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Monthly income</span>
                                <strong>
                                    {formatAmount(
                                        selectedApplication.monthlyIncome
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Credit score</span>
                                <strong>
                                    {selectedApplication.creditScore || "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Process instance</span>
                                <strong>
                                    {selectedApplication.processInstanceKey ||
                                        "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Reviewed by</span>
                                <strong>
                                    {selectedApplication.reviewedBy || "—"}
                                </strong>
                            </div>
                        </div>

                        {selectedApplication.reviewComment && (
                            <div className="modal-comment">
                                <span>Review comment</span>
                                <p>{selectedApplication.reviewComment}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}

export default Applications;