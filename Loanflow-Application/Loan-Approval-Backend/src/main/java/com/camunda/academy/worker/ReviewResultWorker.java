package com.camunda.academy.worker;

import com.camunda.academy.service.LoanApplicationStore;

import io.camunda.client.annotation.JobWorker;
import io.camunda.client.api.response.ActivatedJob;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ReviewResultWorker {

    private final LoanApplicationStore applicationStore;

    public ReviewResultWorker(
            LoanApplicationStore applicationStore) {

        this.applicationStore = applicationStore;
    }

    @JobWorker(
            type = "process-review-result",
            autoComplete = true
    )
    public void processReviewResult(ActivatedJob job) {

        System.out.println(
                "Processing manual review result..."
        );

        Map<String, Object> variables =
                job.getVariablesAsMap();

        String applicationId =
                (String) variables.get("applicationId");

        String reviewedBy =
                (String) variables.get("reviewedBy");

        String reviewComment =
                (String) variables.get("reviewComment");

        String reviewDecision =
                (String) variables.get("reviewDecision");

        System.out.println(
                "Application ID: "
                        + applicationId
        );

        System.out.println(
                "Reviewed By: "
                        + reviewedBy
        );

        System.out.println(
                "Review Comment: "
                        + reviewComment
        );

        System.out.println(
                "Review Decision: "
                        + reviewDecision
        );

        applicationStore.updateReviewDetails(
                applicationId,
                reviewedBy,
                reviewComment
        );

        applicationStore.updateStatus(
                applicationId,
                reviewDecision
        );

        System.out.println(
                "Review result processed successfully."
        );
    }
}