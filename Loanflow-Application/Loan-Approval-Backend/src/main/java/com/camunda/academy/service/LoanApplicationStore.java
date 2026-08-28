package com.camunda.academy.service;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoanApplicationStore {

    private final Map<String, LoanApplicationStatus> applications =
            new ConcurrentHashMap<>();

    public void save(
            String applicationId,
            long processInstanceKey,
            String applicantName,
            double loanAmount,
            double monthlyIncome,
            int creditScore,
            String status) {

        applications.put(
                applicationId,
                new LoanApplicationStatus(
                        applicationId,
                        processInstanceKey,
                        applicantName,
                        loanAmount,
                        monthlyIncome,
                        creditScore,
                        status
                )
        );

        System.out.println(
                "STORE SAVE: "
                        + applicationId
                        + " -> "
                        + status
        );
    }

    public LoanApplicationStatus get(String applicationId) {

        LoanApplicationStatus application =
                applications.get(applicationId);

        System.out.println(
                "STORE GET: "
                        + applicationId
                        + " -> "
                        + (application != null
                        ? application.getStatus()
                        : "NOT FOUND")
        );

        return application;
    }

    public Collection<LoanApplicationStatus> getAll() {

        System.out.println(
                "STORE GET ALL: "
                        + applications.size()
                        + " applications"
        );

        return applications.values();
    }

    public void updateStatus(
            String applicationId,
            String status) {

        LoanApplicationStatus application =
                applications.get(applicationId);

        if (application != null) {

            application.setStatus(status);

            System.out.println(
                    "STORE UPDATE: "
                            + applicationId
                            + " -> "
                            + status
            );

        } else {

            System.out.println(
                    "STORE UPDATE FAILED: Application not found: "
                            + applicationId
            );
        }
    }

    public void updateReviewDetails(
            String applicationId,
            String reviewedBy,
            String reviewComment) {

        LoanApplicationStatus application =
                applications.get(applicationId);

        if (application != null) {

            application.setReviewedBy(reviewedBy);
            application.setReviewComment(reviewComment);
            application.setReviewedAt(LocalDateTime.now());

            System.out.println(
                    "STORE REVIEW UPDATE: "
                            + applicationId
                            + " -> Reviewed by: "
                            + reviewedBy
            );

        } else {

            System.out.println(
                    "STORE REVIEW UPDATE FAILED: "
                            + applicationId
            );
        }
    }

    public static class LoanApplicationStatus {

        private final String applicationId;
        private final long processInstanceKey;

        private final String applicantName;
        private final double loanAmount;
        private final double monthlyIncome;
        private final int creditScore;

        private String status;

        private String reviewedBy;
        private String reviewComment;
        private LocalDateTime reviewedAt;

        public LoanApplicationStatus(
                String applicationId,
                long processInstanceKey,
                String applicantName,
                double loanAmount,
                double monthlyIncome,
                int creditScore,
                String status) {

            this.applicationId = applicationId;
            this.processInstanceKey = processInstanceKey;
            this.applicantName = applicantName;
            this.loanAmount = loanAmount;
            this.monthlyIncome = monthlyIncome;
            this.creditScore = creditScore;
            this.status = status;
        }

        public String getApplicationId() {
            return applicationId;
        }

        public long getProcessInstanceKey() {
            return processInstanceKey;
        }

        public String getApplicantName() {
            return applicantName;
        }

        public double getLoanAmount() {
            return loanAmount;
        }

        public double getMonthlyIncome() {
            return monthlyIncome;
        }

        public int getCreditScore() {
            return creditScore;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getReviewedBy() {
            return reviewedBy;
        }

        public void setReviewedBy(String reviewedBy) {
            this.reviewedBy = reviewedBy;
        }

        public String getReviewComment() {
            return reviewComment;
        }

        public void setReviewComment(String reviewComment) {
            this.reviewComment = reviewComment;
        }

        public LocalDateTime getReviewedAt() {
            return reviewedAt;
        }

        public void setReviewedAt(LocalDateTime reviewedAt) {
            this.reviewedAt = reviewedAt;
        }
    }
}