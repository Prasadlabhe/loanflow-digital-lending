package com.camunda.academy.controller;

import com.camunda.academy.model.LoanApplicationRequest;
import com.camunda.academy.model.LoanApplicationResponse;
import com.camunda.academy.service.LoanApplicationStore;
import com.camunda.academy.service.LoanService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class LoanController {

    private final LoanService loanService;
    private final LoanApplicationStore applicationStore;

    public LoanController(
            LoanService loanService,
            LoanApplicationStore applicationStore) {

        this.loanService = loanService;
        this.applicationStore = applicationStore;
    }

    @PostMapping("/loans")
    public LoanApplicationResponse submitLoan(
            @RequestBody LoanApplicationRequest request) {

        return loanService.submitLoan(request);
    }

    @GetMapping("/loans/{applicationId}")
    public LoanApplicationStore.LoanApplicationStatus getLoanStatus(
            @PathVariable String applicationId) {

        LoanApplicationStore.LoanApplicationStatus application =
                applicationStore.get(applicationId);

        if (application == null) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Application not found: "
                            + applicationId
            );
        }

        return application;
    }

    @GetMapping("/loans")
    public Collection<LoanApplicationStore.LoanApplicationStatus>
    getAllApplications() {

        return applicationStore.getAll();
    }
}