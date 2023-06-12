# Mid-Term CodeFellows 401 Project

## Project: Helen House Application: Backend

### Authors

- [Francisco Sanchez](https://github.com/c0d3cisco)
- [Heather Holcomb](https://github.com/holcombheather)
- [Katherine Lee](https://github.com/KatiLee)
- [Malik Sadiki-Torres](https://github.com/MalikTorres)
- [Nick Mullaney](https://github.com/nickmullaney)
- [Ike Steoger](https://github.com/IkeSteoger)

### Problem Domain

The problem we’re solving is the need for a secure and efficient database application that can handle large amounts of demographic data, simplify the process of collecting this information, and provide easy querying for Helen House, a rural LGBTQ+ youth center. This solution will not only digitize their current paper-based data collection but also enhance data accuracy, accessibility, and the ability to generate insights for grant applications.

### Links and Resources

- [Trello](https://trello.com/invite/b/KisbuKmx/ATTI8636c0c7dd7edb956f96bd8d8b9555f89A203B63/agile-board-template-trello)
- [GitHub Actions ci/cd](https://github.com/MissionDrivenDevs/helen-house-backend/actions)
- [Team Agreement](./teamAgreement.md)
<!-- - [back-end dev server url]() -->
<!-- - [back-end prod server url]() -->

### Collaborators

### Setup

#### How to initialize/run your application

Clone repo, `npm i`, alter `.env.sample` into `.env` and make any needed changes, `npm start`.

### Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/MissionDrivenDevs/helen-house-backend
   ```

2. Install dependencies:

   ```bash
   npm i
   ```

To use Postgres and SQLite databases with the application, please follow the steps below:

#### Postgres & SQLite

1. Create a new database for the project.
2. Update the `.env` file with the Postgres connection details, including the host, port, database name, username, and password.
3. Update the `.env` file with the SQLite database path.

#### Tests

To run tests, after running `npm i`, run the command `npm test`. The tests are implemented using Jest and Supertest. The test cases are located in the `tests` directory. The tests cover the API routes and ensure the proper functioning of the backend.

### CRUD Routes

The application provides the following CRUD routes for basic Create, Read, Read One, Update, and Delete operations:

- **Create**: `POST /api/resource` - Create a new resource.
- **Read**: `GET /api/resource` - Get all resources.
- **Read One**: `GET /api/resource/:id` - Get a specific resource by ID.
- **Update**: `PUT /api/resource/:id` - Update a specific resource by ID.
- **Delete**: `DELETE /api/resource/:id` - Delete a specific resource by ID.

### Testing and Program Flow

The application allows users to log in and post information to either the Checkin Database Table or the UserData Database Table in Postgres. The application is hosted on render.com.

#### User Flow

1. Users sign up and create their own username, which will be stored in the UserData database table.
2. Users log in and update the Checkin Database Table every time they log in.
3. The application also provides an admin functionality. Admins can log in and query all the data from the two tables to build different search queries based on their parameters.

#### Data Flow

1. Users sign up and their username is stored in the UserData database table.
2. Users log in and update the Checkin Database Table with their check-in information.
3. Admins can log in and query the UserData and CheckinData tables to retrieve data based on their search criteria.

### UML

![Alt text](assets/uml.png)
