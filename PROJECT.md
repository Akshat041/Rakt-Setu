# PROJECT.md — LifeLink (Blood Donor Finder)

## 1. Project Overview

**Project Name:** LifeLink — Blood Donor Finder  
**Project Type:** College Mini-Project / Web Application  
**Purpose:** To help people searching for potential blood donors discover registered voluntary donors based on blood group and location.

LifeLink is a web-based application that connects people looking for potential blood donors with people who are willing to register as donors.

The platform allows donors to register their information and allows searchers to filter registered donors based on blood group, city, and locality.

This project is a prototype for educational and demonstration purposes. It is not a real emergency service or a blood bank.

---

## 2. Problem Statement

Finding a potential blood donor during an urgent situation can be difficult. People often depend on personal contacts, messaging groups, social media posts, or multiple sources to find donors.

There is no guarantee that they will quickly find someone with the required blood group in a nearby location.

LifeLink aims to provide a simple centralized directory where:

- Willing donors can register their details.
- People can search for potential donors.
- Search results can be filtered by blood group and location.
- Users can find contact information for registered donors who have consented to being listed.

---

## 3. Project Objectives

1. Create an easy-to-use donor registration system.
2. Store donor information in a database.
3. Allow searching by blood group.
4. Allow searching by city and locality.
5. Allow multiple search filters simultaneously.
6. Display matching donors in an understandable format.
7. Provide a contact option for potential donors.
8. Create a responsive interface for desktop and mobile.
9. Demonstrate a complete working frontend, backend, and database application.

---

## 4. Target Users

### A. Blood Seeker

A person searching for potential blood donors. This may be a patient, relative, friend, or someone helping another person.

They should be able to:

- Search for a required blood group.
- Enter a city or locality.
- View matching donor profiles.
- View donor availability status.
- Contact a potential donor.

### B. Voluntary Donor

A person willing to donate blood and register their details.

They should be able to:

- Register as a donor.
- Enter their blood group.
- Provide their city and locality.
- Provide contact information.
- Indicate whether they are currently open to being contacted for donation requests.

### C. Administrator (Optional / Future Scope)

An administrator may manage donor records, remove incorrect entries, and monitor registrations.

Admin authentication and a complete admin dashboard are NOT required for the MVP.

---

## 5. MVP Scope — Required Features

### 5.1 Donor Registration

Create a form that allows a donor to register with:

- Full name
- Blood group
- City
- Locality / Area
- Phone number
- Availability status
- Consent to display their information in the donor directory

Requirements:

- All required fields must be validated.
- Phone number should have basic validation.
- Blood group must be selected from predefined options.
- Donor registration should submit data to the backend API.
- Successfully registered donors must be saved in the database.
- The user should receive success or error feedback.
- Avoid duplicate submissions when the user clicks submit multiple times.

Blood group options:

- A+
- A-
- B+
- B-
- AB+
- AB-
- O+
- O-

### 5.2 Donor Search

Users should be able to search for donors using:

- Blood group
- City
- Locality / Area

Search requirements:

- Blood group filter
- City filter
- Locality filter
- Blood group + city together
- Blood group + city + locality together
- Filters should work independently or in combination.
- Search should not be case-sensitive for text-based location filters.
- Location search should support partial matching where appropriate.
- Results should update when the user submits a search.
- Provide a clear/reset filters option.

### 5.3 Donor Results

Display donors in responsive cards.

Each donor card should contain:

- Donor name
- Blood group badge
- City
- Locality
- Availability status
- Contact action

Availability labels:

- Available for contact
- Not currently available

Do not imply that "Available for contact" means medically eligible to donate or that the donor has confirmed a specific request.

### 5.4 Contact Donor

For the demo:

- Provide a contact button on the donor card.
- Use a `tel:` link for fictional sample numbers.
- Do not use real people's personal contact information in sample data.
- Contact action should be clearly visible.

### 5.5 Empty States

Handle the following cases:

- No donors registered yet.
- No matching donors found.
- Search filters have been cleared.
- Registration completed successfully.
- Registration failed.
- Backend is unavailable.

Show helpful messages instead of blank screens.

---

## 6. Features Outside the MVP

Do NOT implement the following unless the core project is complete and there is sufficient time:

- User authentication
- Login / Signup
- OTP verification
- GPS tracking
- Google Maps
- Live location
- Blood bank inventory
- Blood bank search
- Blood donation camp management
- Online donation booking
- Payment
- AI matching
- Notifications
- SMS integration
- Email integration
- Chat system
- Real-time updates
- Advanced admin dashboard
- Medical eligibility prediction
- Automatic blood compatibility decisions

Keep the project focused on donor registration and donor discovery.

---

## 7. User Workflows

### Workflow A — Search for a Donor

1. User opens the home page.
2. User selects a blood group.
3. User enters a city and/or locality.
4. User clicks the Search Donors button.
5. Frontend sends a request to the backend.
6. Backend applies the search filters.
7. Backend returns matching donor records.
8. Frontend displays the matching donor cards.
9. User may contact a potential donor.
10. Donor independently confirms willingness and availability.

### Workflow B — Register as a Donor

1. User opens the donor registration form.
2. User fills in the required details.
3. Frontend validates the form.
4. User submits registration.
5. Frontend sends the data to the backend API.
6. Backend validates the submitted information.
7. Backend saves the donor to the database.
8. Frontend displays a success message.
9. The newly registered donor becomes searchable.

---

## 8. Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- React Router (only if multiple routes are needed)

### Backend

- Node.js
- Express.js
- REST API

### Database

- SQLite

### Tools

- Git
- GitHub
- VS Code
- Browser developer tools
- AI coding assistant

Do not change the technology stack without discussing the reason first.

---

## 9. Architecture

The project follows a simple client-server architecture.

### Frontend

Responsible for:

- Rendering UI
- Search form
- Donor registration form
- Donor cards
- Form validation
- Displaying loading, success, and error states
- Sending requests to backend APIs

### Backend

Responsible for:

- API endpoints
- Server-side validation
- Search and filter logic
- Database operations
- Handling errors
- Returning JSON responses

### Database

Responsible for:

- Storing donor records
- Retrieving donors
- Persisting registration data
- Updating donor availability
- Deleting donor records if required

Frontend must not access the database directly.

---

## 10. Proposed Database Structure

### Donors Table

| Field       | Type              | Description                    |
| ----------- | ----------------- | ------------------------------ |
| id          | Integer           | Unique donor ID                |
| name        | Text              | Donor full name                |
| blood_group | Text              | Donor blood group              |
| city        | Text              | Donor city                     |
| locality    | Text              | Area / locality                |
| phone       | Text              | Contact number                 |
| available   | Boolean / Integer | Availability status            |
| consent     | Boolean / Integer | Consent to appear in directory |
| created_at  | DateTime          | Registration date              |

Database implementation details can be adjusted if necessary, but the fields above should remain conceptually available.

---

## 11. Proposed API Endpoints

### GET /api/health

Check whether the backend server is running.

### GET /api/donors

Retrieve donors.

Optional query parameters:

- `bloodGroup`
- `city`
- `locality`
- `available`

Examples:

`GET /api/donors?bloodGroup=O%2B`

`GET /api/donors?bloodGroup=B%2B&city=Kanpur`

`GET /api/donors?city=Kanpur&locality=Kalyanpur`

### GET /api/donors/:id

Retrieve a donor by ID if needed.

### POST /api/donors

Register a new donor.

### PATCH /api/donors/:id/availability

Update donor availability if implemented.

### DELETE /api/donors/:id

Delete a donor record if needed for testing or administration.

Do not implement unnecessary endpoints just because they are listed. Prioritize the MVP endpoints.

---

## 12. UI / UX Direction

### Design Style

Create a modern, clean, trustworthy, minimal, responsive blood-donation-themed website.

The design should feel like a real small product, not a generic college project template.

### Color Direction

Suggested palette:

- Primary red: `#C62828`
- Dark red: `#991B1B`
- Light background: `#FFF8F7`
- White: `#FFFFFF`
- Primary text: `#1F2937`
- Secondary text: `#6B7280`
- Success: `#15803D`

The AI may adjust shades to achieve better contrast and a cohesive design.

### Design Requirements

- Clear visual hierarchy
- Good typography
- Consistent spacing
- Responsive layouts
- Attractive donor cards
- Clear blood group badges
- Accessible form labels
- Visible buttons and focus states
- Loading states
- Empty search results
- Error feedback
- Success feedback
- Mobile-friendly navigation
- Avoid excessive animations
- Avoid unnecessary gradients and visual clutter
- Avoid generic dashboard UI unless it serves the actual application

### Main Sections

1. Navigation bar
2. Hero section
3. Donor search section
4. Search results
5. Donor registration section / page
6. How it works
7. About / safety disclaimer
8. Footer

The search functionality should be prominent and easy to use.

---

## 13. Sample Data

Use fictional donor data for development and demonstration.

Create approximately 15–25 sample donors distributed across multiple blood groups and localities.

Suggested sample locations:

- Kanpur
- Lucknow
- Delhi

Example localities:

- Kalyanpur
- Kakadeo
- Swaroop Nagar
- Kidwai Nagar
- Civil Lines

Sample data must not contain real people's personal contact information.

Use clearly fictional demo numbers.

---

## 14. Testing Requirements

Test the following:

### Registration

- Register a valid donor.
- Submit an empty form.
- Submit an invalid phone number.
- Verify that the donor is saved.
- Verify that the newly registered donor appears in search.

### Search

- Search by blood group only.
- Search by city only.
- Search by locality only.
- Search by blood group and city.
- Search with all filters.
- Search with no matching records.
- Clear filters.
- Test partial location matches.
- Test case-insensitive location matching.

### Application

- Backend running normally.
- Backend unavailable.
- Frontend refresh.
- Empty database.
- Responsive layout on mobile.
- No console errors.
- No duplicate form submissions.

---

## 15. Acceptance Criteria

The MVP is considered complete when:

- [ ] Application starts successfully.
- [ ] Frontend and backend communicate.
- [ ] Donor registration works.
- [ ] Donor records persist in SQLite.
- [ ] Search by blood group works.
- [ ] Search by city works.
- [ ] Search by locality works.
- [ ] Combined filters work.
- [ ] Search results show correct donor details.
- [ ] Availability status is displayed.
- [ ] Contact action works with sample data.
- [ ] Empty states are handled.
- [ ] Error states are handled.
- [ ] Application works on desktop and mobile.
- [ ] Sample data is available for demonstration.
- [ ] GitHub repository is prepared.
- [ ] Project README is written.
- [ ] Report and PPT are prepared.
- [ ] Project owner can explain the main architecture and workflow.

---

## 16. Development Plan

### Milestone 1 — Frontend UI

- Project setup
- Page layout
- Navigation
- Search form
- Donor cards
- Registration form
- Responsive styling
- Use mock data initially

### Milestone 2 — Backend API

- Express setup
- Health endpoint
- Donor endpoints
- Validation
- Search logic

### Milestone 3 — Database

- SQLite setup
- Donor schema
- Database connection
- Sample data seeding
- Persistent registration

### Milestone 4 — Integration

- Connect React to APIs
- Donor registration
- Search
- Filters
- Error and loading states

### Milestone 5 — Testing and Submission

- Bug fixes
- Responsive testing
- README
- Screenshots
- Report
- PPT
- Viva preparation

Priority order:

1. Working core functionality
2. Correct data and search
3. UI quality
4. Testing
5. Documentation
6. Optional features

---

## 17. AI Coding Agent Instructions

You are acting as a practical senior developer helping build a college mini-project with a tight deadline.

### Working Rules

1. Read this `PROJECT.md` before making changes.
2. Stay within the defined MVP scope.
3. Do not add features without approval.
4. Do not over-engineer the project.
5. Prefer simple, readable code over complex abstractions.
6. Keep components and modules organized.
7. Use JavaScript; do not introduce TypeScript unless requested.
8. Do not replace the selected stack.
9. Do not create unnecessary dependencies.
10. Do not generate the entire application in one massive change.
11. Work milestone by milestone.
12. After each milestone, explain what was built.
13. Tell the user how to run and test the changes.
14. Fix existing bugs before adding new features.
15. Never claim a feature works without testing it or explaining how to verify it.
16. Use fictional sample donor data.
17. Do not expose real personal data.
18. Validate data on both frontend and backend.
19. Keep secrets out of source code.
20. Update documentation when the project structure or important functionality changes.

### Before Starting Each Task

- Check the existing project structure.
- Identify what already works.
- Avoid overwriting working code unnecessarily.
- State the files you plan to create or modify.
- Implement only the current task.

### After Completing Each Task

Report:

- What was implemented
- Files created or changed
- Commands needed to run it
- How to test the feature
- Any known issues
- The recommended next task

If a requirement is ambiguous, ask a concise question instead of making a major assumption.

---

## 18. Project Limitations and Safety

LifeLink is an educational prototype.

- Donor registration does not verify medical eligibility.
- Availability status is self-reported.
- Search results are not medically verified.
- A matching blood group does not guarantee compatibility.
- Contacting a donor does not guarantee a response.
- Medical compatibility and donation eligibility must be confirmed by qualified medical professionals.
- The system does not replace blood banks, hospitals, or emergency services.
- Sample donor data is fictional.
- Real donor data must only be collected with informed consent and handled responsibly.

---

## 19. Future Scope

If time and resources are available, future improvements may include:

- Authentication
- Donor profile management
- Admin dashboard
- Donor verification
- Availability updates
- Privacy controls
- Location-based distance sorting
- Maps integration
- Donation camps
- Blood-bank directory
- Notifications
- Better mobile experience
- Deployment

These are future possibilities, not MVP requirements.

---

## 20. Definition of Success

The project is successful if a user can register as a donor, the details are stored persistently, another user can search for that donor using blood group and location, and the application displays the correct results in a responsive and understandable interface.

The project must be functional, reasonably polished, tested, documented, and understandable to the student presenting it.

**The priority is a completed, working, explainable application—not an unnecessarily large feature set.**
