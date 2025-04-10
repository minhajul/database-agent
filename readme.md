## Database Agent Node.js App

Database Agent is a Node.js application that intelligently generates SQL queries and interacts with your database to fetch, filter, and deliver data on demand. It streamlines data access by translating user requests into optimized SQL commands, enabling seamless integration and automation.

### 🚀 Getting Started

Follow these steps to run the app locally.

### 1. Clone the Repository

```
git clone https://github.com/minhajul/database-agent.git
cd database-agent
```

### 2. Install Dependencies
```npm install```

### 3. Start Docker

We're using Docker Compose to run the PostgreSQL database. Simply start Docker and run the command below to get your database up and running.

```docker-compose up --build -d```

Also run below command to migrate the database:

```
npm run generate
npm run migrate
```

We're using Drizzle to interact with the PostgreSQL database. To modify the database schema, update ```schema.js``` and run ```npm run migrate``` to apply the changes.

### 4. Create a ```.env``` File

Run this ```cp .env.example .env``` command to create a ```.env``` file with the example from ```.env.example```:

```
DATABASE_URL=postgresql://admin:admin@localhost:5431/postgres
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_DEPLOYMENT=
AZURE_OPENAI_API_KEY=
AZURE_API_VERSION=
```

### 5. Run the App

```npm run start```

### Example Usage

Send a POST request to ```api/database-agents``` endpoint with a natural language query:

```json
{
  "prompt": "give me the total number of users."
}
```

Response:

```json
{
  "status": "ok",
  "data": {
    "success": true,
    "data": {
      "command": "SELECT",
      "rowCount": 1,
      "oid": null,
      "rows": [
        {
          "count": "10"
        }
      ]
    }
  }
}
```

### Made with ❤️ by [[minhajul](https://github.com/minhajul)]
