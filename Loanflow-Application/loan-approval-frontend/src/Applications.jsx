
import { useEffect, useState } from "react";

function Applications() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);

    const loadApplications = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8081/api/loans"
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch applications"
                );
            }

            const data = await response.json();

            setApplications(data);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load applications."
            );

        } finally {

            setLoading(false);

        }
    };


    const viewApplication = async (applicationId) => {

        try {

            const response = await fetch(
                `http://localhost:8081/api/loans/${applicationId}`
    );

if (!response.ok) {
    throw new Error(
        "Unable to retrieve application"
    );
}

const data = await response.json();

setSelectedApplication(data);

} catch (error) {

    console.error(error);

    setError(
        "Unable to retrieve application details."
    );
}
};


useEffect(() => {

    const timer = setTimeout(() => {
        loadApplications();
    }, 0);

    return () => clearTimeout(timer);

}, []);


const total = applications.length;

const approved =
    applications.filter(
        app => app.status === "APPROVED"
    ).length;

const review =
    applications.filter(
        app => app.status === "REVIEW"
    ).length;

const rejected =
    applications.filter(
        app => app.status === "REJECTED"
    ).length;


const formatCurrency = (amount) => {

    return Number(amount || 0)
        .toLocaleString("en-IN");
};


const formatDate = (date) => {

    if (!date) {
        return "Not reviewed";
    }

    return new Date(date).toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
};


if (loading) {

    return (
        <div className="dashboard">

            <div className="dashboard-header">

                <div>

                    <h1>
                        Application Dashboard
                    </h1>

                    <p>
                        Loading applications...
                    </p>

                </div>

            </div>

        </div>
    );
}


if (error && applications.length === 0) {

    return (
        <div className="dashboard">

            <div className="dashboard-header">

                <div>

                    <h1>
                        Application Dashboard
                    </h1>

                    <p className="error-message">
                        {error}
                    </p>

                </div>

            </div>

        </div>
    );
}


return (

    <div className="dashboard">


        {/* HEADER */}

        <div className="dashboard-header">

            <div>

                    <span className="section-label">
                        LOAN OPERATIONS
                    </span>

                <h1>
                    Application Dashboard
                </h1>

                <p>
                    Monitor and review loan applications
                    processed through LoanFlow.
                </p>

            </div>


            <button
                className="refresh-button"
                onClick={loadApplications}
            >
                ↻ Refresh
            </button>

        </div>


        {/* STATISTICS */}

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


        {/* SELECTED APPLICATION */}

        {selectedApplication && (

            <div className="application-details">

                <div className="details-header">

                    <div>

                            <span>
                                APPLICATION DETAILS
                            </span>

                        <h2>
                            {selectedApplication.applicationId}
                        </h2>

                    </div>


                    <button
                        onClick={() =>
                            setSelectedApplication(null)
                        }
                    >
                        ×
                    </button>

                </div>


                <div className="details-grid">

                    <div>

                            <span>
                                Applicant
                            </span>

                        <strong>
                            {selectedApplication.applicantName}
                        </strong>

                    </div>


                    <div>

                            <span>
                                Loan Amount
                            </span>

                        <strong>
                            ₹
                            {formatCurrency(
                                selectedApplication.loanAmount
                            )}
                        </strong>

                    </div>


                    <div>

                            <span>
                                Monthly Income
                            </span>

                        <strong>
                            ₹
                            {formatCurrency(
                                selectedApplication.monthlyIncome
                            )}
                        </strong>

                    </div>


                    <div>

                            <span>
                                Credit Score
                            </span>

                        <strong>
                            {selectedApplication.creditScore}
                        </strong>

                    </div>


                    <div>

                            <span>
                                Status
                            </span>

                        <strong
                            className={`status ${
                                selectedApplication.status
                                    ?.toLowerCase()
                            }`}
                        >
                            {selectedApplication.status}
                        </strong>

                    </div>


                    <div>

                            <span>
                                Process Instance
                            </span>

                        <strong>
                            {selectedApplication.processInstanceKey}
                        </strong>

                    </div>

                </div>


                {/* REVIEW INFORMATION */}

                {selectedApplication.reviewedBy && (

                    <div className="review-details">

                        <div className="review-title">

                            Manual Review

                        </div>


                        <div className="review-grid">

                            <div>

                                    <span>
                                        Reviewed By
                                    </span>

                                <strong>
                                    {selectedApplication.reviewedBy}
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

                        </div>


                        <div className="review-comment">

                                <span>
                                    Review Comment
                                </span>

                            <p>
                                {selectedApplication.reviewComment ||
                                    "No comment provided."}
                            </p>

                        </div>

                    </div>

                )}

            </div>

        )}


        {/* APPLICATION TABLE */}

        <div className="applications-card">

            <div className="applications-header">

                <div>

                    <h2>
                        Recent Applications
                    </h2>

                    <p>
                        All loan applications submitted
                        through LoanFlow
                    </p>

                </div>


                <span>
                        {total} applications
                    </span>

            </div>


            {applications.length === 0 ? (

                <div className="empty-state">

                    No loan applications found.

                </div>

            ) : (

                <div className="table-container">

                    <table>

                        <thead>

                        <tr>

                            <th>
                                Application ID
                            </th>

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
                                Action
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {applications.map(
                            application => (

                                <tr
                                    key={
                                        application.applicationId
                                    }
                                >

                                    <td className="application-id">

                                        {
                                            application.applicationId
                                        }

                                    </td>


                                    <td>

                                        {
                                            application.applicantName
                                        }

                                    </td>


                                    <td>

                                        ₹
                                        {formatCurrency(
                                            application.loanAmount
                                        )}

                                    </td>


                                    <td>

                                        ₹
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
                                                className={`status ${
                                                    application.status
                                                        ?.toLowerCase()
                                                }`}
                                            >

                                                {
                                                    application.status
                                                }

                                            </span>

                                    </td>


                                    <td>

                                        <button
                                            className="view-button"
                                            onClick={() =>
                                                viewApplication(
                                                    application.applicationId
                                                )
                                            }
                                        >

                                            View Details →

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


        {/* FOOTER */}

        <div className="dashboard-footer">

            LoanFlow • Designed by
            <strong> Prasad Labhe</strong>

        </div>

    </div>
);
}

export default Applications;

