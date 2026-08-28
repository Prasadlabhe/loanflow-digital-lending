package com.camunda.academy.worker;

import com.camunda.academy.service.LoanApplicationStore;
import io.camunda.client.annotation.JobWorker;
import io.camunda.client.api.response.ActivatedJob;
import org.springframework.stereotype.Component;

@Component
public class ApproveLoanWorker {

    private final LoanApplicationStore applicationStore;

    public ApproveLoanWorker(
            LoanApplicationStore applicationStore) {

        this.applicationStore = applicationStore;
    }

    @JobWorker(type = "approve-loan")
    public void approveLoan(ActivatedJob job) {

        var variables = job.getVariablesAsMap();

        String applicationId =
                (String) variables.get("applicationId");

        System.out.println(
                "APPROVE WORKER applicationId = "
                        + applicationId
        );

        applicationStore.updateStatus(
                applicationId,
                "APPROVED"
        );

        System.out.println("Loan approved!");
    }
}