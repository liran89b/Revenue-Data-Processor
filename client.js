const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

const SECRET = process.env.SECRET || 'secret';
const sendEvent = async (event) =>  {
    try {
        const response = await axios.post('http://localhost:8000/liveEvent', event, {
            headers: {
                'Authorization': SECRET 
            }
        });
        console.log('Event sent successfully:', response.status);
    } catch (error) {
        console.error('Error sending event:', error.message);
    }
}

const sendEventsFromFile = async (filePath) => {
    const fileStream = fs.createReadStream(filePath, 'utf8');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const eventPromises = [];

    rl.on('line', (line) => {
        if (line.trim() !== '') {
            const event = JSON.parse(line);
            eventPromises.push(sendEvent(event)); 
        }
    });

    rl.on('close', async () => {
        try {
            const results = await Promise.allSettled(eventPromises);
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    console.log(`Event ${index + 1} sent successfully.`);
                } else {
                    console.error(`Event ${index + 1} failed: ${result.reason.message}`);
                }
            });
        } catch (error) {
            console.error('Error sending events:', error.message);
        }
    });

    rl.on('error', (error) => {
        console.error('Error reading file:', error.message);
    });
}

sendEventsFromFile('events.jsonl');
