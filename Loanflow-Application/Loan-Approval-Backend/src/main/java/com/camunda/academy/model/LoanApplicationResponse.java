package com.camunda.academy.model;

public class LoanApplicationResponse {

    private long processInstanceKey;
    private String status;
    private String applicationId;
    private String applicantName;
    private double loanAmount;
    private double monthlyIncome;
    private int creditScore;

    public LoanApplicationResponse(
            long processInstanceKey,
            String status,
            String applicationId,
            String applicantName,
            double loanAmount,
            double monthlyIncome,
            int creditScore) {

        this.processInstanceKey = processInstanceKey;
        this.status = status;
        this.applicationId = applicationId;
        this.applicantName = applicantName;
        this.loanAmount = loanAmount;
        this.monthlyIncome = monthlyIncome;
        this.creditScore = creditScore;
    }

    public long getProcessInstanceKey() {
        return processInstanceKey;
    }

    public void setProcessInstanceKey(long processInstanceKey) {
        this.processInstanceKey = processInstanceKey;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public double getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(double loanAmount) {
        this.loanAmount = loanAmount;
    }

    public double getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public int getCreditScore() {
        return creditScore;
    }

    public void setCreditScore(int creditScore) {
        this.creditScore = creditScore;
    }
}