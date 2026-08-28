package com.camunda.academy;

/**
 * Hello world!
 *
 */
import io.camunda.client.annotation.Deployment;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;



@SpringBootApplication
@Deployment(
        resources = {
                "classpath:bpmn/LoanApprovalProcess.bpmn",
                "classpath:dmn/Loan-decision.dmn",
                "classpath:form/manual-review.form"
        }
)
public class LoanApprovalApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                LoanApprovalApplication.class,
                args
        );
    }
}
