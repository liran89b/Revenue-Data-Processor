const express = require('express');
const fs = require('fs/promises');
const {getClient} = require('./connector');

// consts
const PORT =  process.env.port || 8000;
const SECRET = process.env.SECRET || 'secret'

const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500
}

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    if (req.headers['authorization'] === SECRET) {
        next();
    } else {
        res.status(HTTP_STATUS.FORBIDDEN).send('Forbidden');
    }
});

app.post('/liveEvent', async (req, res) => {
    const event = req.body;
    if (!event.value || !event.name || !event.userId) {
        res.status(400).send('Missing required fields');
        return;
    }
    try {
        const eventData = JSON.stringify(event) + '\n';
        await fs.appendFile('new_rows.txt', eventData);
        return res.status(HTTP_STATUS.OK).send('Event added');
    }
    catch (err) {
        console.error(err);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send('Internal server error');
    }
});

app.get('/userEvents/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const client = await getClient();
        const query = `SELECT * FROM public."user_revenue" WHERE user_id = $1`;
        const result = await client.query(query, [userId]);
        if (result.rowCount === 0) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send('User not found');
        }
        return res.status(HTTP_STATUS.OK).send(result.rows);
    }
    catch (error) {
        console.error('Error querying the database:', error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send('Internal server error');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
