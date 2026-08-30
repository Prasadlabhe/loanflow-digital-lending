package com.camunda.academy.service;

import com.camunda.academy.model.LoanApplicationRequest;
import com.camunda.academy.model.LoanApplicationResponse;
import io.camunda.client.CamundaClient;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class LoanService {

    private final CamundaClient camundaClient;
    private final LoanApplicationStore applicationStore;

    public LoanService(
            CamundaClient camundaClient,
            LoanApplicationStore applicationStore) {

        this.camundaClient = camundaClient;
        this.applicationStore = applicationStore;
    }

    public LoanApplicationResponse submitLoan(
            LoanApplicationRequest request) {

        // 1. Generate application ID
        String applicationId =
                "LN-" + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        // 2. Create Camunda variables
        Map<String, Object> variables = new HashMap<>();

        variables.put("applicationId", applicationId);
        variables.put("applicantName", request.getApplicantName());
        variables.put("loanAmount", request.getLoanAmount());
        variables.put("monthlyIncome", request.getMonthlyIncome());
        variables.put("creditScore", request.getCreditScore());

        // 3. Start Camunda process
        var result = camundaClient
                .newCreateInstanceCommand()
                .bpmnProcessId("Loan_Approval_Process")
                .latestVersion()
                .variables(variables)
                .send()
                .join();

        // 4. Store application information
        applicationStore.save(
                applicationId,
                result.getProcessInstanceKey(),
                request.getApplicantName(),
                request.getLoanAmount(),
                request.getMonthlyIncome(),
                request.getCreditScore(),
                "PROCESSING"
        );
        // 5. Return response to client
        return new LoanApplicationResponse(
                result.getProcessInstanceKey(),
                "PROCESSING",
                applicationId,
                request.getApplicantName(),
                request.getLoanAmount(),
                request.getMonthlyIncome(),
                request.getCreditScore()
        );
    }
}