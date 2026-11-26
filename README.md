# RaktSetu - Blood Donor Finder

RaktSetu is a responsive blood donor discovery web application that helps users search for voluntary donors by blood group and location. It includes a React frontend, an Express REST API, and a persistent SQLite database.

This project is an educational prototype and is not a real emergency service or blood bank. A blood-group match does not confirm medical eligibility or compatibility.

## Features

- Search for donors by blood group, city, locality, or availability.
- Combine multiple search filters.
- View responsive donor cards with contact and availability details.
- Register a donor with client-side and server-side validation.
- Persist registrations in SQLite.
- Call a listed demo number using a `tel:` link.
- Reset search filters and receive loading, empty, success, and error feedback.
- Automatically seed the database with fictional demo donor records.

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Node.js
- Express
- SQLite using the built-in `node:sqlite` module

## Prerequisites

- Node.js 22 or newer
- npm
- Git (optional)

The built-in `node:sqlite` module requires a recent Node.js release.

## Installation

From a terminal in the project directory:

```powershell
npm install
```

Optionally, create a local environment file:

```powershell
Copy-Item .env.example .env
```

The default API URL is `http://127.0.0.1:5000`. Set `VITE_API_BASE_URL` in `.env` if the backend runs at a different address.

## Running the Application

The frontend and backend run as separate processes.

Start the Express API:

```powershell
npm run server
```

The API starts at `http://127.0.0.1:5000`.

In a second terminal, start the Vite frontend:

```powershell
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

To verify that the backend is running, open:

```text
http://127.0.0.1:5000/api/health
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the React development server |
| `npm run build` | Create a production frontend build |
| `npm run preview` | Preview the production build locally |
| `npm run server` | Start the Express API |

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check backend status |
| `GET` | `/api/donors` | List and filter donors |
| `POST` | `/api/donors` | Register a donor |

Supported `GET /api/donors` query parameters:

- `bloodGroup`: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, or `O-`
- `city`: Partial, case-insensitive city match
- `locality`: Partial, case-insensitive locality match
- `available`: `true` or `false`

Example:

```text
GET http://127.0.0.1:5000/api/donors?bloodGroup=O%2B&city=Kanpur
```

## Database

The SQLite database is stored at:

```text
server/data/raktsetu.sqlite
```

The server creates the `donors` table automatically. If the table is empty, it seeds it with fictional demo records. Registrations remain in the database across server restarts.

## Project Structure

```text
blood-donor-finder/
|-- src/
|   |-- App.jsx          React interface and application state
|   |-- api.js           Frontend API client
|   |-- main.jsx         React entry point
|   |-- styles.css       Responsive application styles
|   `-- data/
|       `-- donors.js    Sample blood groups and donor data
|-- server/
|   |-- app.js           Express routes and validation
|   |-- index.js         Server entry point
|   |-- database.js      SQLite setup and data mapping
|   `-- data/
|       `-- raktsetu.sqlite
|-- .env.example
|-- PROJECT.md
|-- package.json
`-- README.md
```

## Basic Testing

1. Start both the frontend and backend.
2. Open the frontend in a browser.
3. Search with one or more of the blood-group, city, locality, and availability filters.
4. Clear the filters and confirm that the full demo directory is restored.
5. Submit a valid registration using a fictional 10-digit Indian phone number.
6. Search for the newly registered donor to confirm persistence.
7. Try an empty or invalid registration and confirm that validation feedback appears.
8. Stop the server and refresh the frontend to verify the API-unavailable state.

## Production Build

Create and preview the frontend build:

```powershell
npm run build
npm run preview
```

Run the Express server separately for API requests.

## GitHub Pages Deployment

The `Deploy to GitHub Pages` workflow builds the frontend and publishes the
`dist` directory when changes are pushed to `master`. In the repository's
Settings → Pages, set the build and deployment source to **GitHub Actions**.

GitHub Pages hosts only the frontend; it does not run the Express API. To use
donor search and registration on the published site, deploy the API separately.
Add a repository Actions variable named `VITE_API_BASE_URL` with the API's
public base URL (for example, `https://your-service.onrender.com`). The Pages
workflow passes this value into the frontend build.

## Safety and Privacy

- Use fictional data for demonstrations.
- Do not register real phone numbers or personal information in a public or shared database.
- Availability status is self-reported and is not medical verification.
- Medical eligibility and blood compatibility must be confirmed by qualified medical professionals.
