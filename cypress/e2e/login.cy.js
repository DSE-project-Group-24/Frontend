describe("Login Page - Healthcare Portal", () => {
  beforeEach(() => {
    cy.visit("/"); // visits http://localhost:5173 (from baseUrl)
  });

  // ✅ Test Case 1: Check initial UI elements
  it("should display all login page elements correctly", () => {
    cy.contains("Welcome Back").should("be.visible");
    cy.get("input#email").should("be.visible").and("have.attr", "placeholder", "Enter your email");
    cy.get("input#password").should("be.visible").and("have.attr", "placeholder", "Enter your password");
    cy.contains("Sign In").should("be.visible");
    cy.contains("Don't have an account? Register here").should("be.visible");
  });

  // ✅ Test Case 2: Try to login with empty fields
  it("should disable Sign In button if fields are empty", () => {
    cy.get("button").contains("Sign In").should("be.disabled");
  });

  // ✅ Test Case 3: Show error on invalid credentials (mocked API)
  it("should show error message for invalid credentials", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 401,
      body: { detail: "Invalid email or password. Please try again." },
    }).as("invalidLogin");

    cy.get("#email").type("wrong@example.com");
    cy.get("#password").type("wrongpassword");
    cy.contains("Sign In").click();

    cy.wait("@invalidLogin");
    cy.contains("Invalid email or password").should("be.visible");
  });

  // ✅ Test Case 4: Successful login redirects based on role
  it("should login successfully and redirect to correct dashboard", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        access_token: "fakeAccessToken123",
        refresh_token: "fakeRefreshToken123",
        role: "admin",
      },
    }).as("loginRequest");

    cy.get("#email").type("admin@demo.com");
    cy.get("#password").type("c1234");
    cy.contains("Sign In").click();

    cy.wait("@loginRequest");

    // Verify tokens stored in localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem("access_token")).to.eq("fakeAccessToken123");
      expect(win.localStorage.getItem("role")).to.eq("admin");
    });

    // Verify redirect
    cy.url().should("include", "/admin/dashboard");
  });

  // ✅ Test Case 5: Press Enter key should trigger login
  it("should trigger login when pressing Enter key", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        access_token: "token",
        refresh_token: "refresh",
        role: "doctor",
      },
    }).as("enterLogin");

    cy.get("#email").type("doctor@demo.com");
    cy.get("#password").type("pass123{enter}");

    cy.wait("@enterLogin");
    cy.url().should("include", "/doctor/dashboard");
  });

  // ✅ Test Case 6: Background and UI should load properly
  it("should display background and title styling correctly", () => {
    cy.get("body").should("have.css", "background-image");
    cy.get("h2").contains("Welcome Back").should("have.class", "text-3xl");
  });
});
