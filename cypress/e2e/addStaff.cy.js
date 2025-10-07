describe("Add Staff Page", () => {
  beforeEach(() => {
    cy.visit("/hospital_administrator/add-staff");
  });

  // ✅ Test Case 1: Check UI elements are visible
  it("should display all form elements correctly", () => {
    cy.contains("Add Nurse/Doctor to Hospital").should("be.visible");
    cy.get("select").first().should("be.visible"); // Role selector
    cy.get("select").eq(1).should("be.visible"); // Staff dropdown
    cy.get("button[type='submit']").should("be.visible");
  });

  // ✅ Test Case 2: Default role should be nurse
  it("should default role to nurse", () => {
    cy.get("select").first().should("have.value", "nurse");
    cy.get("select").eq(1).find("option:first").should("contain.text", "Select nurse");
  });

  // ✅ Test Case 3: Loading state while fetching staff
  it("should show loading text while fetching staff", () => {
    cy.intercept("GET", "**/nurse/", (req) => {
      req.reply((res) => {
        res.delay = 1000;
        res.send([{ user_id: 1, name: "Nurse A", email: "nurse@example.com" }]);
      });
    }).as("fetchNurse");

    cy.get("select").eq(1).should("contain.text", "Loading...");
  });

  // ✅ Test Case 4: Show staff options after fetch
  it("should display fetched staff in dropdown", () => {
    cy.intercept("GET", "**/nurse/", {
      statusCode: 200,
      body: [
        { user_id: 1, name: "Nurse A", email: "nurseA@example.com" },
        { user_id: 2, name: "Nurse B", email: "nurseB@example.com" },
      ],
    }).as("fetchNurse");

    cy.wait("@fetchNurse");
    cy.get("select").eq(1).should("contain.text", "Nurse A (nurseA@example.com)");
    cy.get("select").eq(1).should("contain.text", "Nurse B (nurseB@example.com)");
  });

  // ✅ Test Case 5: Switch role to doctor and fetch doctors
  it("should switch role to doctor and fetch doctors", () => {
    cy.intercept("GET", "**/doctor/", {
      statusCode: 200,
      body: [{ user_id: 3, name: "Doctor X", email: "doctor@example.com" }],
    }).as("fetchDoctor");

    cy.get("select").first().select("doctor");
    cy.wait("@fetchDoctor");
    cy.get("select").eq(1).should("contain.text", "Doctor X (doctor@example.com)");
  });

  // ✅ Test Case 6: Show error if no staff selected
  it("should show error when no staff selected and form submitted", () => {
    cy.get("button[type='submit']").click();
    cy.contains("⚠️ Please select a staff member.").should("be.visible");
  });

  // ✅ Test Case 7: Assign staff successfully
  it("should assign staff successfully and show success message", () => {
    cy.intercept("POST", "**/hospital/assign-nurse", {
      statusCode: 200,
      body: { message: "✅ Assigned successfully!" },
    }).as("assignNurse");

    cy.intercept("GET", "**/nurse/", {
      statusCode: 200,
      body: [{ user_id: 1, name: "Nurse A", email: "nurse@example.com" }],
    }).as("fetchNurse");

    cy.wait("@fetchNurse");
    cy.get("select").eq(1).select("1"); // select Nurse A
    cy.get("button[type='submit']").click();
    cy.wait("@assignNurse");
    cy.contains("✅ Assigned successfully!").should("be.visible");
  });

  // ✅ Test Case 8: Handle failed assignment
  it("should show error if assignment fails", () => {
    cy.intercept("POST", "**/hospital/assign-nurse", {
      statusCode: 400,
      body: { detail: "❌ Failed to assign." },
    }).as("assignFail");

    cy.intercept("GET", "**/nurse/", {
      statusCode: 200,
      body: [{ user_id: 1, name: "Nurse A", email: "nurse@example.com" }],
    }).as("fetchNurse");

    cy.wait("@fetchNurse");
    cy.get("select").eq(1).select("1"); // select Nurse A
    cy.get("button[type='submit']").click();
    cy.wait("@assignFail");
    cy.contains("❌ Failed to assign.").should("be.visible");
  });

  // ✅ Test Case 9: Loading state during assignment
  it("should show assigning text while assigning staff", () => {
    cy.intercept("POST", "**/hospital/assign-nurse", (req) => {
      req.reply((res) => {
        res.delay = 1000;
        res.send({ message: "✅ Assigned successfully!" });
      });
    }).as("slowAssign");

    cy.intercept("GET", "**/nurse/", {
      statusCode: 200,
      body: [{ user_id: 1, name: "Nurse A", email: "nurse@example.com" }],
    }).as("fetchNurse");

    cy.wait("@fetchNurse");
    cy.get("select").eq(1).select("1");
    cy.get("button[type='submit']").click();
    cy.contains("Assigning...").should("be.visible");
  });
});
