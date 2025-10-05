describe("Register Government Page", () => {
  beforeEach(() => {
    cy.visit("/register/government");
  });

  // ✅ Test Case 1: Check UI elements are visible
  it("should display all registration fields correctly", () => {
    cy.contains("Register as Government Official").should("be.visible");
    cy.get("input#name").should("be.visible").and("have.attr", "placeholder", "Enter your full name");
    cy.get("input#email").should("be.visible").and("have.attr", "placeholder", "Enter your email");
    cy.get("input#nic").should("be.visible").and("have.attr", "placeholder", "Enter your NIC");
    cy.get("input#password").should("be.visible").and("have.attr", "placeholder", "Enter your password");
    cy.contains("Register").should("be.visible");
    cy.contains("Back to Login").should("be.visible");
  });

  // ✅ Test Case 2: Validate required fields
//   it("should show validation errors if form submitted empty", () => {
//     cy.get("form").submit();
//     cy.get("input:invalid").should("have.length.at.least", 1);
//   });

  // ✅ Test Case 3: Handle failed registration (mocked backend)
  it("should show error when registration fails", () => {
    cy.intercept("POST", "**/auth/register/government", {
      statusCode: 400,
      body: { detail: "Registration failed" },
    }).as("registerFail");

    cy.get("#name").type("Mr. Alex Silva");
    cy.get("#email").type("alex@gov.lk");
    cy.get("#nic").type("198756789V");
    cy.get("#password").type("password123");

    cy.get("button[type='submit']").click();
    cy.wait("@registerFail");

    cy.contains("Registration failed").should("be.visible");
  });

  // ✅ Test Case 4: Successful registration redirects to login
  it("should register successfully and redirect to login", () => {
    cy.intercept("POST", "**/auth/register/government", {
      statusCode: 201,
      body: { id: 1, name: "Mr. Alex Silva", email: "alex@gov.lk" },
    }).as("registerSuccess");

    cy.get("#name").type("Mr. Alex Silva");
    cy.get("#email").type("alex@gov.lk");
    cy.get("#nic").type("198756789V");
    cy.get("#password").type("password123");

    cy.get("button[type='submit']").click();

    cy.wait("@registerSuccess");
    cy.url().should("eq", `${Cypress.config().baseUrl}/`); // redirected to login
  });

  // ✅ Test Case 5: Navigate back to login manually
  it("should navigate to login page when clicking Back to Login", () => {
    cy.contains("Back to Login").click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });

  // ✅ Test Case 6: Loading state on submit
  it("should show loading text while registering", () => {
    cy.intercept("POST", "**/auth/register/government", (req) => {
      req.reply((res) => {
        res.delay = 1000;
        res.send({ id: 1, name: "Mr. Alex Silva" });
      });
    }).as("slowRegister");

    cy.get("#name").type("Mr. Alex Silva");
    cy.get("#email").type("alex@gov.lk");
    cy.get("#nic").type("198756789V");
    cy.get("#password").type("password123");

    cy.get("button[type='submit']").click();
    cy.contains("Registering...").should("be.visible");
  });

  // ✅ Test Case 7: Invalid email validation
//   it("should show browser validation for invalid email format", () => {
//     cy.get("#name").type("Invalid Email User");
//     cy.get("#email").type("invalid-email");
//     cy.get("#nic").type("999999999V");
//     cy.get("#password").type("pass1234");

//     cy.get("form").submit();
//     cy.get("#email:invalid").should("exist");
//   });
});
