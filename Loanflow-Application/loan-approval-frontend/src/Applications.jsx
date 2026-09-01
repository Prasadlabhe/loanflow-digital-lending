import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);

    // ==============================
    // LOAD APPLICATIONS
    // ==============================

    const loadApplications = useCallback(async () => {
        try {
            setError("");

            const response = await fetch(
                `${API_URL}/api/loans`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch applications"
                );
            }

            const data = await response.json();

            setApplications(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            console.error(
                "LOAD APPLICATIONS ERROR:",
                error
            );

            setError(
                "Unable to load applications."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // ==============================
    // INITIAL LOAD
    // ==============================

    useEffect(() => {
        const timer = setTimeout(() => {
            loadApplications();
        }, 0);

        return () => clearTimeout(timer);
    }, [loadApplications]);

    // ==============================
    // VIEW APPLICATION
    // ==============================

    const viewApplication = async (applicationId) => {
        try {
            setError("");

            const response = await fetch(
                `${API_URL}/api/loans/${applicationId}`
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to retrieve application"
                );
            }

            const data = await response.json();

            setSelectedApplication(data);
        } catch (error) {
            console.error(
                "VIEW APPLICATION ERROR:",
                error
            );

            setError(
                "Unable to retrieve application details."
            );
        }
    };

    // ==============================
    // STATISTICS
    // ==============================

    const total = applications.length;

    const approved = applications.filter(
        (app) => app.status === "APPROVED"
    ).length;

    const review = applications.filter(
        (app) => app.status === "REVIEW"
    ).length;

    const rejected = applications.filter(
        (app) => app.status === "REJECTED"
    ).length;

    // ==============================
    // HELPERS
    // ==============================

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) {
            return "₹0";
        }

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "APPROVED":
                return "status approved";

            case "REJECTED":
                return "status rejected";

            case "REVIEW":
                return "status review";

            case "PROCESSING":
                return "status processing";

            default:
                return "status";
        }
    };

    // ==============================
    // LOADING
    // ==============================

    if (loading) {
        return (
            <section className="dashboard">
                <div className="dashboard-header">
                    <div>
                        <p className="eyebrow">
                            LOANFLOW
                        </p>

                        <h1>
                            Applications
                        </h1>

                        <p>
                            Loading loan applications...
                        </p>
                    </div>
                </div>

                <div className="loading-card">
                    Loading applications...
                </div>
            </section>
        );
    }

    // ==============================
    // MAIN UI
    // ==============================

    return (
        <section className="dashboard">

            {/* ============================== */}
            {/* HEADER */}
            {/* ============================== */}

            <div className="dashboard-header">

                <div>
                    <p className="eyebrow">
                        LOANFLOW
                    </p>

                    <h1>
                        Applications
                    </h1>

                    <p>
                        Monitor and review loan
                        applications processed by
                        the Camunda workflow.
                    </p>
                </div>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={loadApplications}
                >
                    ↻ Refresh
                </button>

            </div>

            {/* ============================== */}
            {/* ERROR */}
            {/* ============================== */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* ============================== */}
            {/* STATISTICS */}
            {/* ============================== */}

            <div className="statistics">

                <div className="stat-card">
                    <span>
                        Total Applications
                    </span>

                    <strong>
                        {total}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>
                        Approved
                    </span>

                    <strong>
                        {approved}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>
                        Manual Review
                    </span>

                    <strong>
                        {review}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>
                        Rejected
                    </span>

                    <strong>
                        {rejected}
                    </strong>
                </div>

            </div>

            {/* ============================== */}
            {/* APPLICATION DETAILS */}
            {/* ============================== */}

            {selectedApplication && (
                <div className="application-card">

                    <div className="application-card-header">

                        <div>
                            <p className="eyebrow">
                                APPLICATION DETAILS
                            </p>

                            <h2>
                                {selectedApplication.applicantName}
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="close-button"
                            onClick={() =>
                                setSelectedApplication(null)
                            }
                        >
                            ✕
                        </button>

                    </div>

                    <div className="application-details">

                        <div className="detail-item">
                            <span>
                                Application ID
                            </span>

                            <strong>
                                {
                                    selectedApplication.applicationId
                                }
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>
                                Loan Amount
                            </span>

                            <strong>
                                {formatCurrency(
                                    selectedApplication.loanAmount
                                )}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>
                                Monthly Income
                            </span>

                            <strong>
                                {formatCurrency(
                                    selectedApplication.monthlyIncome
                                )}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>
                                Credit Score
                            </span>

                            <strong>
                                {
                                    selectedApplication.creditScore
                                }
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>
                                Status
                            </span>

                            <strong
                                className={getStatusClass(
                                    selectedApplication.status
                                )}
                            >
                                {
                                    selectedApplication.status
                                }
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>
                                Submitted
                            </span>

                            <strong>
                                {formatDate(
                                    selectedApplication.createdAt
                                )}
                            </strong>
                        </div>

                    </div>

                    {/* ============================== */}
                    {/* REVIEW INFORMATION */}
                    {/* ============================== */}

                    {selectedApplication.status ===
                        "REVIEW" && (
                            <div className="review-section">

                                <h3>
                                    Manual Review
                                </h3>

                                <div className="review-details">

                                    <div>
                                    <span>
                                        Reviewed By
                                    </span>

                                        <strong>
                                            {
                                                selectedApplication.reviewedBy ||
                                                "Pending"
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                    <span>
                                        Reviewed At
                                    </span>

                                        <strong>
                                            {formatDate(
                                                selectedApplication.reviewedAt
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                    <span>
                                        Review Comment
                                    </span>

                                        <strong>
                                            {
                                                selectedApplication.reviewComment ||
                                                "No comment available"
                                            }
                                        </strong>
                                    </div>

                                </div>

                            </div>
                        )}

                </div>
            )}

            {/* ============================== */}
            {/* APPLICATION TABLE */}
            {/* ============================== */}

            <div className="applications-table-card">

                <div className="table-header">

                    <div>
                        <h2>
                            Loan Applications
                        </h2>

                        <p>
                            {total} application
                            {total !== 1 ? "s" : ""}
                        </p>
                    </div>

                </div>

                {applications.length === 0 ? (
                    <div className="empty-state">
                        <h3>
                            No applications yet
                        </h3>

                        <p>
                            Submitted loan applications
                            will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="table-wrapper">

                        <table>

                            <thead>
                            <tr>
                                <th>
                                    Applicant
                                </th>

                                <th>
                                    Loan Amount
                                </th>

                                <th>
                                    Income
                                </th>

                                <th>
                                    Credit Score
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Submitted
                                </th>

                                <th>
                                    Action
                                </th>
                            </tr>
                            </thead>

                            <tbody>

                            {applications.map(
                                (application) => (
                                    <tr
                                        key={
                                            application.applicationId
                                        }
                                    >

                                        <td>
                                            <strong>
                                                {
                                                    application.applicantName
                                                }
                                            </strong>

                                            <small>
                                                {
                                                    application.applicationId
                                                }
                                            </small>
                                        </td>

                                        <td>
                                            {formatCurrency(
                                                application.loanAmount
                                            )}
                                        </td>

                                        <td>
                                            {formatCurrency(
                                                application.monthlyIncome
                                            )}
                                        </td>

                                        <td>
                                            {
                                                application.creditScore
                                            }
                                        </td>

                                        <td>
                                                <span
                                                    className={getStatusClass(
                                                        application.status
                                                    )}
                                                >
                                                    {
                                                        application.status
                                                    }
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
                                )
                            )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </section>
    );
}

export default Applications;