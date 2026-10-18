# WanderWise

WanderWise is a comprehensive travel planning application designed to streamline the process of organizing trips. It includes features such as trip details, daily itineraries, and map locations, making it easy to keep everything in one place. This project showcases my ability to integrate multiple technologies and tools to create a user-friendly and efficient solution for travel planning.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- [Node.js](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org)
- [Nodemon](https://nodemon.io) (optional for development)

### Installing

A step-by-step series of examples that tell you how to get a development environment running:

1. Clone the repository to your local machine.
2. Install the necessary dependencies by running `npm install`.
3. Create a `.env` file at the root of the project and configure the required environment variables (refer to the `.env.example` file for guidance).
4. Set up the database. `database.sql` is a reference snapshot of the schema
   and can't build a fresh database on its own. Schema changes are SQL files
   in `migrations/` (see [Database migrations](#database-migrations)).
5. Start the server using `npm run server`.
6. In a separate terminal, start the client using `npm run client`.
7. Navigate to `http://localhost:5173` to view the application.

### Database migrations

Schema changes are SQL files in `migrations/`, numbered in the order they
apply (`001_ai_usage.sql`, `002_...`). There is no migration tool, so apply
each new file by hand with `psql`, first to the Neon dev branch, then to prod:

```
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/001_ai_usage.sql
```

Also copy each change into `database.sql` so the snapshot stays current.

## Built With

- [React](https://reactjs.org/) - The web framework used
- [Redux](https://redux.js.org/) - State management
- [Express](https://expressjs.com/) - Server framework
- [PostgreSQL](https://www.postgresql.org) - Database

## Authors

- *_Adam Troxell_ - _Initial work_ - [adamtxl](https://github.com/adamtxl)

## Acknowledgments

- Blaine Booher for his instruction and patience with teaching
- David Vinson for making sure I stayed on task and worked through the important parts first
- My Wife for being the inspiration for this project.
