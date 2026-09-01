import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function LoanApplication() {

    const [formData, setFormData] = useState({
        applicantName: "",
        loanAmount: "",
        monthlyIncome: "",
        creditScore: ""
    });

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ==============================
    // HANDLE FORM INPUT
    // ==============================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // ==============================
    // GET APPLICATION STATUS
    // ==============================

    const getApplicationStatus = async (applicationId) => {

        try {

            const response = await fetch(
                `${API_URL}/api/loans/${applicationId}`
            );

            if (!response.ok) {

                throw new Error(
                    "Unable to retrieve application status"
                );

            }

            const data = await response.json();

            console.log(
                "Application status:",
                data
            );

            setApplication((previous) => ({
                ...previous,
                ...data
            }));

            /*
             * Continue polling while the
             * Camunda process is running.
             */

            if (data.status === "PROCESSING") {

                setTimeout(() => {

                    getApplicationStatus(
                        applicationId
                    );

                }, 1000);

            }

        } catch (error) {

            console.error(
                "STATUS ERROR:",
                error
            );

            setError(
                "Unable to retrieve application status."
            );
        }
    };

    // ==============================
    // SUBMIT LOAN APPLICATION
    // ==============================

    const submitLoan = async (event) => {

        event.preventDefault();

        setLoading(true);
        setError("");
        setApplication(null);

        try {

            console.log(
                "Submitting loan application:",
                formData
            );

            const response = await fetch(
                `${API_URL}/api/loans`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        applicantName:
                        formData.applicantName,

                        loanAmount:
                            Number(formData.loanAmount),

                        monthlyIncome:
                            Number(formData.monthlyIncome),

                        creditScore:
                            Number(formData.creditScore)

                    })
                }
            );

            if (!response.ok) {

                throw new Error(
                    `Loan application failed: ${response.status}`
                );

            }

            const data = await response.json();

            console.log(
                "Loan application response:",
                data
            );

            /*
             * Display the initial application
             * immediately.
             */

            setApplication({

                ...data,

                applicantName:
                formData.applicantName,

                loanAmount:
                    Number(formData.loanAmount),

                monthlyIncome:
                    Number(formData.monthlyIncome),

                creditScore:
                    Number(formData.creditScore)

            });

            /*
             * Start polling Camunda workflow status.
             */

            getApplicationStatus(
                data.applicationId
            );

        } catch (error) {

            console.error(
                "SUBMIT ERROR:",
                error
            );

            setError(
                "Unable to submit your loan application."
            );

        } finally {

            setLoading(false);

        }
    };

    // ==============================
    // STATUS CSS CLASS
    // ==============================

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

    // ==============================
    // STATUS TITLE
    // ==============================

    const getStatusTitle = (status) => {

        switch (status) {

            case "APPROVED":
                return "Application Approved";

            case "REJECTED":
                return "Application Rejected";

            case "REVIEW":
                return "Manual Review Required";

            default:
                return "Processing Application";
        }
    };

    // ==============================
    // STATUS MESSAGE
    // ==============================

    const getStatusMessage = (status) => {

        switch (status) {

            case "APPROVED":

                return (
                    "Congratulations! Your loan application has " +
                    "successfully passed our approval process."
                );

            case "REJECTED":

                return (
                    "Unfortunately, your application does not " +
                    "currently meet our lending criteria."
                );

            case "REVIEW":

                return (
                    "Your application requires additional review " +
                    "by one of our loan specialists."
                );

            default:

                return (
                    "We're evaluating your application. This " +
                    "usually takes only a few moments."
                );
        }
    };

    // ==============================
    // CURRENCY FORMATTER
    // ==============================

    const formatCurrency = (amount) => {

        return Number(
            amount || 0
        ).toLocaleString("en-IN");

    };

    // ==============================
    // UI
    // ==============================

    return (
        <>

            {/* ==============================
                HERO
            ============================== */}

            <section className="hero">

                <div className="hero-inner">

                    <div className="hero-content">

                        <div className="eyebrow">
                            SMART DIGITAL LENDING
                        </div>

                        <h1>

                            Your financial goals.

                            <br />

                            <span>
                                Our intelligent decisioning.
                            </span>

                        </h1>

                        <p>
                            Apply for a personal loan through
                            our secure digital platform and
                            receive an automated eligibility
                            decision.
                        </p>

                        <div className="hero-features">

                            <div>

                                <span className="feature-icon">
                                    ✓
                                </span>

                                Fast processing

                            </div>

                            <div>

                                <span className="feature-icon">
                                    ✓
                                </span>

                                Secure & private

                            </div>

                            <div>

                                <span className="feature-icon">
                                    ✓
                                </span>

                                Smart decisioning

                            </div>

                        </div>

                    </div>

                    <div className="hero-decoration">

                        <div className="floating-card card-one">

                            <span>
                                Application
                            </span>

                            <strong>
                                Processing
                            </strong>

                        </div>

                        <div className="floating-card card-two">

                            <span>
                                Decision
                            </span>

                            <strong>
                                Automated
                            </strong>

                        </div>

                    </div>

                </div>

            </section>

            {/* ==============================
                APPLICATION
            ============================== */}

            <section
                id="loan-application"
                className="main-container"
            >

                <div className="section-heading">

                    <div>

                        <span className="section-label">
                            LOAN APPLICATION
                        </span>

                        <h2>
                            Let's get started
                        </h2>

                        <p>
                            Tell us a little about yourself
                            and your financial requirements.
                        </p>

                    </div>

                    <div className="step-indicator">

                        <span className="active">
                            1
                        </span>

                        <div></div>

                        <span>
                            2
                        </span>

                        <div></div>

                        <span>
                            3
                        </span>

                    </div>

                </div>

                <div className="application-layout">

                    {/* ==============================
                        APPLICATION FORM
                    ============================== */}

                    <div className="application-card">

                        <div className="card-top">

                            <div className="card-icon">
                                $
                            </div>

                            <div>

                                <h3>
                                    Loan details
                                </h3>

                                <p>
                                    Please provide accurate
                                    information for your application.
                                </p>

                            </div>

                        </div>

                        <form onSubmit={submitLoan}>

                            {/* NAME */}

                            <div className="form-row">

                                <div className="form-field full">

                                    <label htmlFor="applicantName">
                                        Full name
                                    </label>

                                    <input
                                        id="applicantName"
                                        type="text"
                                        name="applicantName"
                                        value={
                                            formData.applicantName
                                        }
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        required
                                    />

                                </div>

                            </div>

                            {/* LOAN + INCOME */}

                            <div className="form-row">

                                <div className="form-field">

                                    <label htmlFor="loanAmount">
                                        Loan amount
                                    </label>

                                    <div className="money-input">

                                        <span>
                                            ₹
                                        </span>

                                        <input
                                            id="loanAmount"
                                            type="number"
                                            name="loanAmount"
                                            value={
                                                formData.loanAmount
                                            }
                                            onChange={handleChange}
                                            placeholder="500000"
                                            min="1"
                                            required
                                        />

                                    </div>

                                </div>

                                <div className="form-field">

                                    <label htmlFor="monthlyIncome">
                                        Monthly income
                                    </label>

                                    <div className="money-input">

                                        <span>
                                            ₹
                                        </span>

                                        <input
                                            id="monthlyIncome"
                                            type="number"
                                            name="monthlyIncome"
                                            value={
                                                formData.monthlyIncome
                                            }
                                            onChange={handleChange}
                                            placeholder="80000"
                                            min="1"
                                            required
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* CREDIT SCORE */}

                            <div className="form-row">

                                <div className="form-field full">

                                    <label htmlFor="creditScore">
                                        Credit score
                                    </label>

                                    <input
                                        id="creditScore"
                                        type="number"
                                        name="creditScore"
                                        value={
                                            formData.creditScore
                                        }
                                        onChange={handleChange}
                                        placeholder="750"
                                        min="300"
                                        max="900"
                                        required
                                    />

                                    <div className="field-hint">
                                        Enter a value between
                                        300 and 900
                                    </div>

                                </div>

                            </div>

                            {/* SUBMIT */}

                            <button
                                className="apply-button"
                                type="submit"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>

                                        <span className="spinner"></span>

                                        Processing...

                                    </>

                                ) : (

                                    <>

                                        Submit application

                                        <span>
                                            →
                                        </span>

                                    </>

                                )}

                            </button>

                        </form>

                        <div className="privacy-note">

                            <span>
                                🔐
                            </span>

                            Your information is encrypted
                            and securely processed.

                        </div>

                    </div>

                    {/* ==============================
                        APPLICATION RESULT
                    ============================== */}

                    {application && (

                        <div
                            className={`result-card ${
                                getStatusClass(
                                    application.status
                                )
                            }`}
                        >

                            <div className="result-header">

                                <span className="result-label">
                                    APPLICATION STATUS
                                </span>

                                <span className="status-dot"></span>

                            </div>

                            <div className="result-icon">

                                {application.status ===
                                    "APPROVED" && "✓"}

                                {application.status ===
                                    "REJECTED" && "×"}

                                {application.status ===
                                    "REVIEW" && "!"}

                                {application.status ===
                                    "PROCESSING" && "..."}

                            </div>

                            <h3>

                                {getStatusTitle(
                                    application.status
                                )}

                            </h3>

                            <p className="result-message">

                                {getStatusMessage(
                                    application.status
                                )}

                            </p>

                            {/* APPLICATION NUMBER */}

                            <div className="application-number">

                                <span>
                                    APPLICATION NUMBER
                                </span>

                                <strong>
                                    {application.applicationId}
                                </strong>

                            </div>

                            {/* DETAILS */}

                            <div className="result-details">

                                <div>

                                    <span>
                                        Applicant
                                    </span>

                                    <strong>
                                        {
                                            application.applicantName
                                        }
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Loan amount
                                    </span>

                                    <strong>
                                        ₹
                                        {formatCurrency(
                                            application.loanAmount
                                        )}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Monthly income
                                    </span>

                                    <strong>
                                        ₹
                                        {formatCurrency(
                                            application.monthlyIncome
                                        )}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Credit score
                                    </span>

                                    <strong>
                                        {
                                            application.creditScore
                                        }
                                    </strong>

                                </div>

                            </div>

                            {/* WORKFLOW */}

                            <div className="workflow-status">

                                <div className="workflow-title">
                                    Decision workflow
                                </div>

                                <div className="workflow-line">

                                    <span className="completed">
                                        ✓
                                    </span>

                                    <div className="line completed-line"></div>

                                    <span
                                        className={
                                            application.status ===
                                            "PROCESSING"
                                                ? "current"
                                                : "completed"
                                        }
                                    >

                                        {application.status ===
                                        "PROCESSING"
                                            ? "2"
                                            : "✓"}

                                    </span>

                                    <div className="line"></div>

                                    <span>
                                        3
                                    </span>

                                </div>

                                <div className="workflow-labels">

                                    <span>
                                        Submitted
                                    </span>

                                    <span>
                                        Decision
                                    </span>

                                    <span>
                                        Complete
                                    </span>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

                {/* ERROR */}

                {error && (

                    <div className="error-message">
                        ⚠ {error}
                    </div>

                )}

            </section>

        </>
    );
}

export default LoanApplication;