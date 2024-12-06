
const fs = require('fs');
const readline = require('readline');
const {getClient} = require('./connector');

const EVENTS_TYPES = {
    ADD_REVENUE: 'add_revenue',
    SUBTRACT_REVENUE: 'subtract_revenue',
}
let client = null;

const updateRevenueForEvent = async (userId, value) => {
    const query = `
        INSERT INTO user_revenue (user_id, revenue)
        VALUES ($1, $2)
        ON CONFLICT (user_id) 
        DO UPDATE SET revenue = user_revenue.revenue + EXCLUDED.revenue;
    `;
    try {
        await client.query(query, [userId, value]);
    } catch (error) {
        console.error('Error updating revenue:', error.message);
    }
};

const processEventsFile = async (filePath) => {
    let lastFileSize = fs.statSync(filePath).size; 
    client = await getClient();
    
    setInterval(() => {
        const currentFileSize = fs.statSync(filePath).size;
        
        if (currentFileSize === lastFileSize) 
            return;

        const fileStream = fs.createReadStream(filePath, {
                encoding: 'utf8',
                start: lastFileSize, 
                end: currentFileSize  
            });

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        const promiseArray = [];
        
        rl.on('line', (line) => {
            if (line.trim() !== '') {
                console.log('Processing event:', line);
                const event = JSON.parse(line);
                const { userId, name, value } = event;
                
                switch (name) {
                    case EVENTS_TYPES.ADD_REVENUE:
                        promiseArray.push(updateRevenueForEvent(userId, value));
                        break;
                    case EVENTS_TYPES.SUBTRACT_REVENUE:
                        promiseArray.push(updateRevenueForEvent(userId, -value));
                        break;
                    default:
                        console.error('Invalid event type:', name);
                        break;
                }
            }
        });

        rl.on('close', () => {
            Promise.all(promiseArray).then(() => {
                console.log('Finished processing events.');
                lastFileSize = currentFileSize;  
            }).catch((error) => {
                console.error('Error processing events:', error.message);
            });
        });

        rl.on('error', (error) => {
            console.error('Error reading file:', error.message);
        });
    }, 1000);  
};

processEventsFile('new_rows.txt').then(() => {
    console.log('Started processing events...');
}).catch((error) => {
    console.error('Error processing events:', error.message);
});