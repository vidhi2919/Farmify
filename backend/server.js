
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json()); // Parse incoming JSON requests

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../weather-app-frontend')));

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

app.get('/api/weather', async (req, res) => {
    try {
        const location = req.query.location;

        if (!location) {
            return res.status(400).json({ error: 'Location is required' });
        }

        const apiUrl = `${WEATHER_API_URL}?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch weather data' });
        }

        const weatherData = await response.json();
        const formattedData = {
            temperature: {
                min: weatherData.main.temp_min,
                max: weatherData.main.temp_max,
                labels: ['Today']
            },
            humidity: {
                values: [weatherData.main.humidity],
                labels: ['Today']
            },
            rainfall: {
                values: weatherData.rain ? [weatherData.rain['1h']] : [0],
                labels: ['Today']
            }
        };

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


