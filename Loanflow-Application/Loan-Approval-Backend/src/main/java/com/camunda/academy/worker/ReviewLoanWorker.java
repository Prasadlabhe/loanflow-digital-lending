package com.camunda.academy.worker;

import com.camunda.academy.service.LoanApplicationStore;
import io.camunda.client.annotation.JobWorker;
import io.camunda.client.annotation.Variable;
import org.springframework.stereotype.Component;

@Component
public class ReviewLoanWorker {

    private final LoanApplicationStore applicationStore;

    public ReviewLoanWorker(LoanApplicationStore applicationStore) {
        this.applicationStore = applicationStore;
    }

    @JobWorker(type = "review-loan")
    public void reviewLoan(
            @Variable String applicationId) {

        System.out.println(
                "Loan requires manual review!"
        );

        applicationStore.updateStatus(
                applicationId,
                "REVIEW"
        );
    }
}