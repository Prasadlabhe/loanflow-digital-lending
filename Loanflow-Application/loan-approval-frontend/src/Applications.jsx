import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const loadApplications = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const response = await fetch(`${API_URL}/api/loans`);

            if (!response.ok) {
                throw new Error("Unable to load applications.");
            }

            const data = await response.json();

            setApplications(Array.isArray(data) ? data : []);
        } catch (requestError) {
            setError(
                requestError.message ||
                "Unable to load applications right now."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        const fetchInitialApplications = async () => {
            try {
                const response = await fetch(`${API_URL}/api/loans`);

                if (!response.ok) {
                    throw new Error("Unable to load applications.");
                }

                const data = await response.json();

                if (!cancelled) {
                    setApplications(Array.isArray(data) ? data : []);
                    setError("");
                }
            } catch (requestError) {
                if (!cancelled) {
                    setError(
                        requestError.message ||
                        "Unable to load applications right now."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchInitialApplications();

        return () => {
            cancelled = true;
        };
    }, []);

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(Number(value || 0));

    const formatDate = (value) => {
        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "APPROVED":
                return "approved";
            case "REJECTED":
                return "rejected";
            case "REVIEW":
                return "review";
            case "PROCESSING":
                return "processing";
            default:
                return "";
        }
    };

    const stats = {
        total: applications.length,
        processing: applications.filter(
            (item) => item.status === "PROCESSING"
        ).length,
        approved: applications.filter(
            (item) => item.status === "APPROVED"
        ).length,
        review: applications.filter(
            (item) => item.status === "REVIEW"
        ).length,
        rejected: applications.filter(
            (item) => item.status === "REJECTED"
        ).length,
    };

    return (
        <section className="applications-console">
            <div className="statistics">
                <div className="stat-card">
                    <span>Total</span>
                    <strong>{stats.total}</strong>
                    <small>Applications</small>
                </div>

                <div className="stat-card processing-stat">
                    <span>Processing</span>
                    <strong>{stats.processing}</strong>
                    <small>In workflow</small>
                </div>

                <div className="stat-card approved-stat">
                    <span>Approved</span>
                    <strong>{stats.approved}</strong>
                    <small>Positive outcome</small>
                </div>

                <div className="stat-card review-stat">
                    <span>Manual review</span>
                    <strong>{stats.review}</strong>
                    <small>Human assessment</small>
                </div>

                <div className="stat-card rejected-stat">
                    <span>Rejected</span>
                    <strong>{stats.rejected}</strong>
                    <small>Negative outcome</small>
                </div>
            </div>

            <div className="applications-card">
                <div className="applications-card-header">
                    <div>
                        <span className="section-eyebrow">
                            WORKFLOW MONITOR
                        </span>
                        <h2>Application activity</h2>
                    </div>

                    <button
                        type="button"
                        className="refresh-button"
                        onClick={() => loadApplications(true)}
                        disabled={refreshing}
                    >
                        <span className={refreshing ? "spin" : ""}>↻</span>
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {loading ? (
                    <div className="table-state">
                        <span className="large-spinner" />
                        <strong>Loading applications...</strong>
                        <p>Connecting to the LoanFlow API.</p>
                    </div>
                ) : error ? (
                    <div className="table-state error-state">
                        <span className="state-icon">!</span>
                        <strong>Unable to load applications</strong>
                        <p>{error}</p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => loadApplications(true)}
                        >
                            Try again
                        </button>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="table-state empty-state">
                        <span className="state-icon">◎</span>
                        <strong>No applications yet</strong>
                        <p>
                            Submitted applications will appear here once the
                            workflow has been started.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="desktop-table">
                            <table>
                                <thead>
                                <tr>
                                    <th>Application</th>
                                    <th>Applicant</th>
                                    <th>Loan amount</th>
                                    <th>Credit score</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                </tr>
                                </thead>

                                <tbody>
                                {applications.map((application) => (
                                    <tr
                                        key={
                                            application.applicationId ||
                                            application.processInstanceKey
                                        }
                                    >
                                        <td>
                                            <strong className="application-id">
                                                {application.applicationId ||
                                                    application.processInstanceKey ||
                                                    "—"}
                                            </strong>
                                        </td>

                                        <td>
                                            <div className="applicant-cell">
                                                    <span>
                                                        {(
                                                            application.applicantName ||
                                                            "?"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                <strong>
                                                    {application.applicantName ||
                                                        "Unknown"}
                                                </strong>
                                            </div>
                                        </td>

                                        <td>
                                            {formatCurrency(
                                                application.loanAmount
                                            )}
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
                                                    className={`status-pill ${getStatusClass(
                                                        application.status
                                                    )}`}
                                                >
                                                    <i />
                                                    {application.status ||
                                                        "UNKNOWN"}
                                                </span>
                                        </td>

                                        <td>
                                            {formatDate(
                                                application.createdAt
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mobile-application-list">
                            {applications.map((application) => (
                                <article
                                    className="mobile-application-card"
                                    key={
                                        application.applicationId ||
                                        application.processInstanceKey
                                    }
                                >
                                    <div className="mobile-card-top">
                                        <div className="applicant-cell">
                                            <span>
                                                {(
                                                    application.applicantName ||
                                                    "?"
                                                )
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>

                                            <div>
                                                <strong>
                                                    {application.applicantName ||
                                                        "Unknown"}
                                                </strong>
                                                <small>
                                                    {application.applicationId ||
                                                        application.processInstanceKey ||
                                                        "No ID"}
                                                </small>
                                            </div>
                                        </div>

                                        <span
                                            className={`status-pill ${getStatusClass(
                                                application.status
                                            )}`}
                                        >
                                            <i />
                                            {application.status}
                                        </span>
                                    </div>

                                    <div className="mobile-card-grid">
                                        <div>
                                            <span>Loan amount</span>
                                            <strong>
                                                {formatCurrency(
                                                    application.loanAmount
                                                )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Credit score</span>
                                            <strong>
                                                {application.creditScore || "—"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Created</span>
                                            <strong>
                                                {formatDate(
                                                    application.createdAt
                                                )}
                                            </strong>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="applications-disclaimer">
                <span>i</span>
                <p>
                    This console displays demonstration workflow data. It is
                    not a production banking operations dashboard and does not
                    represent real customer lending decisions.
                </p>
            </div>
        </section>
    );
}

export default Applications;