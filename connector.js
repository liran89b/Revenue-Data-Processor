const { Pool } = require('pg');

const DATABASE_NAME = process.env.DB_NAME || 'mydatabase';
const DB_USER = process.env.DB_USER || 'myuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'mypassword';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;

const pool = new Pool({
    user: DB_USER, 
    host: DB_HOST,
    database: DATABASE_NAME, 
    password: DB_PASSWORD, 
    port: DB_PORT
});

let client = null;

const getClient = async () => {
    try {
        if (!client) {
            client = await pool.connect();
            console.log('Connected to PostgreSQL');
        }
        return client;
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', err);
    }
};


module.exports = {
    getClient
};
