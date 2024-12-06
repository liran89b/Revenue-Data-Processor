# Revenue Data Processor

This project contains a server-side script to process revenue-related events. It listens to a file (`new_rows.txt`) that contains events in JSONL format, calculates user revenue based on events, and updates a PostgreSQL database accordingly. The database table will be updated based on the event types `add_revenue` and `subtract_revenue`.

## Overview

The `Revenue Data Processor` works as follows:
- It reads events from a file (`new_rows.txt`), which is updated with new events periodically.
- The script calculates the user's revenue based on the event type and value and updates the database accordingly.


### Event Types Supported
- `add_revenue`: Adds the specified value to the user's revenue.
- `subtract_revenue`: Subtracts the specified value from the user's revenue.

---

## How to Run

### Prerequisites
1. **Node.js**: Ensure that Node.js is installed on your machine.
2. **PostgreSQL**: Run PostgreSQL Docker Image By running `docker-compose up` 

### Step 1: Create the Database Table
Before running the script, you need to create the required table in your PostgreSQL database.

1. **Run `db.sql`** to create the `user_revenue` table:

   ```sql
   CREATE TABLE IF NOT EXISTS user_revenue (
       user_id VARCHAR(255) PRIMARY KEY,
       revenue INTEGER DEFAULT 0
   );
   ```

### Step 2: Setup and Install Dependencies

1. Clone the repository or navigate to your project folder.
2. Install the required dependencies by running:

   ```bash
   npm install
   ```

### Step 3: Run the Scripts

The following scripts are available in the `package.json` file:

- **Start the server**: This will run the server-side code.
  
  ```bash
  npm run server
  ```

  This will start the server script (`server.js`), which is responsible for monitoring the `new_rows.txt` file and processing events.

- **ETL Process**: This will run the ETL (Extract, Transform, Load) script, which processes the event file and updates the database.

  ```bash
  npm run etl
  ```

- **Start the client**: This will run the client-side code.

  ```bash
  npm run client
  ```

  This will start the client script (`client.js`), which reads events from the `events.jsonl` file and sends them to the server.



  This script (`etl.js`) is responsible for reading the event file, calculating the revenue for each user, and updating the database.

### Step 4: Monitor the File for New Events

- The `etl.js` script periodically checks for new content in `new_rows.txt`, processes the new events, and updates the user revenue accordingly.

---

### Example Usage

1. **Run the server** to start processing events :

   ```bash
   npm run server
   ```

2. **Run the ETL script** to process the events and update the database:

   ```bash
   npm run etl
   ```

3. **Run the server** to send events to server:

   ```bash
   npm run client
   ```

Make sure to have the required database table created using the SQL script before running these commands.

