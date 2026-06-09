# SPA Contact Application

Full-stack SPA project for managing contact records with a React front end, Go REST API, and SQLite database.

## Technologies

- HTML5
- React + Vite + TanStack Router
- TanStack Query and TanStack Table
- Go + Fiber REST API
- SQLite database
- Tailwind CSS

## Requirement Coverage

| Requirement | Implementation |
| --- | --- |
| HTML5 + JavaScript SPA | React application in `apps/frontend` |
| Front-end framework | React |
| REST-style backend API | Go Fiber API under `/api/v1` |
| SQL or NoSQL database | SQLite |
| Table with object data | Contacts table on the home page |
| Numeric identifier | `Contact.id` |
| Text attributes | `name`, `email`, `note` |
| Numeric attribute | `phone` |
| Add data | `/create` form and `POST /api/v1/contacts` |
| Delete data | Delete action and `DELETE /api/v1/contacts/:id` |
| Edit data | `/edit/:id` form and `PUT /api/v1/contacts/:id` |
| Filter by text attribute | Search by `name`, `email`, and `note` |

## Extra Features

- Backend validation for contact payloads
- Demo seed data for an empty database
- Toast notifications for create, update, and delete outcomes
- Delete confirmation dialog
- Sortable table columns
- Client-side pagination
- Loading, error, and empty states
- Light/dark theme toggle

## Run With Docker

```bash
docker compose up --build
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:8080/api/v1`

## Run Locally

Backend:

```bash
cd apps/backend
go run .
```

Frontend:

```bash
cd apps/frontend
npm install
npm run dev
```

## Useful Commands

Backend tests:

```bash
cd apps/backend
go test ./...
```

Frontend checks:

```bash
cd apps/frontend
npm run build
npm run check
```
