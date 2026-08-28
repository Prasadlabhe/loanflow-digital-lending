package com.camunda.academy.worker;

import com.camunda.academy.service.LoanApplicationStore;
import io.camunda.client.annotation.JobWorker;
import io.camunda.client.api.response.ActivatedJob;
import org.springframework.stereotype.Component;

@Component
public class RejectLoanWorker {

    private final LoanApplicationStore applicationStore;

    public RejectLoanWorker(LoanApplicationStore applicationStore) {
        this.applicationStore = applicationStore;
    }

    @JobWorker(type = "reject-loan")
    public void rejectLoan(ActivatedJob job) {

        var variables = job.getVariablesAsMap();

        String applicationId =
                (String) variables.get("applicationId");

        System.out.println(
                "REJECT WORKER applicationId = " + applicationId
        );

        applicationStore.updateStatus(
                applicationId,
                "REJECTED"
        );

        System.out.println(
                "Loan rejected! Application ID = " + applicationId
        );
    }
}