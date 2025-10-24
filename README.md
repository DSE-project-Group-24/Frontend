# Frontend

This frontend provides UI for hospital staff, patient records, accidents, predictions, and integrates with the backend via a centralized API client.

This README describes the project layout, how to run the app, where to change the backend URL, and how to run the included Cypress tests.

---

## Project structure (selected)

Frontend/
│
├── public/ # static assets
├── src/
│ ├── assets/ # images, icons, etc.
│ ├── components/ # React UI components (e.g. forms, charts)
│ ├── pages/ # page-level components / routes
│ ├── contexts/ # React context providers
│ ├── navbars/ # navigation components
│ ├── utils/
│ │ └── api.js # API client & auth interceptor ([`API`](src/utils/api.js))
│ ├── App.jsx # main App component
│ ├── main.jsx # ReactDOM entry
│ └── index.css / App.css # styles
├── cypress/ # end-to-end tests
│ ├── e2e/
│ └── support/
├── .env
├── package.json
├── vite.config.js
└── README.md

---

## Important details

- API client

  - The frontend uses the centralized client at [`src/utils/api.js`](src/utils/api.js). Update the `baseURL` there to point to your backend if needed. The client also automatically adds the JWT from `localStorage` to each request header (`Authorization: Bearer <token>`).

- Routing & pages

  - Main application mounting and routing starts at [src/main.jsx](src/main.jsx) and [src/App.jsx](src/App.jsx).

- Tests
  - E2E tests live under [cypress/e2e](cypress/e2e) and global support under [cypress/support/e2e.js](cypress/support/e2e.js).

---

## Requirements

- Node.js (14+ recommended)
- npm or yarn
- (Optional) .env for runtime configuration—frontend reads `src/utils/api.js` for backend URL, and some features may expect JWT in `localStorage`.

---

## Install

```bash
npm install
# or
yarn
```

---

## Run locally

Start the dev server:

```bash
npm run dev
# or
yarn dev
```

---

## Run Cypress tests

Open Cypress UI:

```bash
npx cypress open
# or
npm run cy:open  # if a script is configured
```

Run headless:

```bash
npx cypress run
# or
npm run cy:run
```

---

## Configuration notes

- To point the frontend to a different backend, update the `baseURL` in [`src/utils/api.js`](src/utils/api.js).
- Authentication tokens are read from `localStorage` key `access_token` by the API client.

---