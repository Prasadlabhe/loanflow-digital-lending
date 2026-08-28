package com.camunda.academy.worker;

import io.camunda.client.annotation.JobWorker;
import io.camunda.client.api.response.ActivatedJob;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ValidateLoanWorker {

    @JobWorker(type = "validate-loan")
    public void validateLoan(ActivatedJob job) {

        Map<String, Object> variables =
                job.getVariablesAsMap();

        System.out.println(
                "Validating loan application..."
        );

        System.out.println(
                "Variables: " + variables
        );

        System.out.println(
                "Applicant: " +
                        variables.get("applicantName")
        );

        System.out.println(
                "Loan Amount: " +
                        variables.get("loanAmount")
        );

        System.out.println(
                "Monthly Income: " +
                        variables.get("monthlyIncome")
        );

        System.out.println(
                "Credit Score: " +
                        variables.get("creditScore")
        );
    }
}