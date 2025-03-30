# WeatherGenie – Your Personal Genie for Weather Insights
## Overview
WeatherGenie is a comprehensive weather data platform offering two distinct experiences. The free version presents essential weather information based on your device’s location through a sleek landing page, while the premium product takes weather monitoring to the next level. For premium users, we install an Arduino sensor that collects live weather data, which is then analyzed and displayed on a personalized dashboard. Our platform leverages the OpenWeather API for real-time updates and uses advanced machine learning models to predict future weather conditions.

## Product Versions
### Free Version
  - Landing Page: Instantly displays current weather information based on your device's location.
  - Data Source: Retrieves real-time weather updates using the OpenWeather API.

### Premium Version
  - Live Data Integration: Upon purchasing the product, an Arduino sensor is installed at your site to collect live weather data.
  - Personalized Dashboard: Access detailed insights including live sensor data, humidity, temperature trends, and interactive graphs.
  - Global Insights: Allocate any location worldwide on our graph tool to view historical and current weather data.
  - Advanced Predictions: Benefit from machine learning models built on OpenWeather data to forecast weather conditions.
  - Demo Access: For trial purposes, access our live Arduino data using these credentials:
   **Email: ard001@weathergenie.us**
    **Password: ARD001admin**
  - Upcoming Feature: We are developing a chatbot to provide personalized weather suggestions and insights.

## Problem Statement
Reliable and precise weather data is crucial for planning day-to-day activities and managing operations effectively. Conventional weather services often provide generalized forecasts that may not meet specific user needs. WeatherGenie addresses this gap by offering:

  - Localized Accuracy: Real-time, location-specific updates for everyday weather needs.
  - Customized Insights: In-depth analysis and graphical visualization for premium users.
  - Proactive Forecasting: Machine learning-driven predictions to help anticipate weather changes.
  - Seamless Integration: A platform designed to evolve with user requirements and incorporate advanced features like personalized chatbot support.

## Features

  - Interactive Landing Page: For free users, get instant weather updates based on device location.
  - Premium Dashboard: Experience a rich interface displaying:
  - Live sensor data from installed Arduino devices.
  - Detailed humidity and temperature analytics.
  - An interactive graph to explore weather data from any global location.

      **Machine Learning Predictions: Advanced weather forecasting powered by OpenWeather’s machine learning models.**
      **Trial Credentials: Demo access is provided to allow prospective users to experience live sensor data.**
  -  Future Chatbot Integration: Personalized weather suggestions will soon be available through an intelligent chatbot.

## Technologies Used
  - Hardware: Arduino for live weather data collection in premium installations.

  - APIs: OpenWeather API for real-time data and machine learning predictions.

  - Front-End: Built using React for a responsive and dynamic user interface.

  -  Back-End: Developed in Python with Flask to efficiently handle data processing and API requests.

  -  Database: MongoDB manages user profiles, sensor data, and historical weather records.

  -  Machine Learning: Integration with OpenWeather’s predictive models to forecast weather trends

## Setup and Installation
### Prerequisites
Ensure you have the following installed:

 - Node.js (includes npm)
 - Python (version 3.x recommended)
 - Git (optional, for repository cloning)
 - Arduino Environment: For premium hardware integration.
 - MongoDB: For local or cloud-based database management.

Cloning the Repository
Clone the WeatherGenie repository to your local machine:

bash
Copy
git clone https://github.com/yourusername/weathergenie.us.git
cd weathergenie.us
Setting Up the Backend
Navigate to the backend directory:

bash
Copy
cd backend
Create a virtual environment:

bash
Copy
python -m venv env
Activate the virtual environment:

On Windows:

bash
Copy
.\env\Scripts\activate
On MacOS/Linux:

bash
Copy
source env/bin/activate
Install the required Python packages:

bash
Copy
pip install -r requirements.txt
Start the Flask server:

bash
Copy
flask run
Setting Up the Frontend
Navigate to the frontend directory:

bash
Copy
cd ../frontend
Install npm packages:

bash
Copy
npm install
Start the React development server:

bash
Copy
npm start
The application will open in
## Additional Configuration
  - API Keys: Securely configure your API keys for OpenWeather and any other external services in your environment variables or configuration files.

  - Hardware Setup: For premium users, follow the provided guidelines to install the Arduino sensor.

  - Database Connection: Update the backend configuration with your MongoDB connection string.

  - Future Updates: Watch for upcoming releases, including our personalized chatbot feature for enhanced user experience.

© 2025 WeatherGenie Team. All rights reserved.
No part of this documentation, including text, images, and software, may be reproduced, distributed, or transmitted without prior written permission, except in the case of brief quotations for critical reviews or other noncommercial uses permitted by copyright law
