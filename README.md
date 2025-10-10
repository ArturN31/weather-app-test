# Weather Explorer - Next.js Weather Application

## Overview

This is a responsive, web-based application built with Next.js that provides current weather information and a five-day forecast for any location, using an open weather API. It is designed with a mobile-first approach and uses client-side storage to remember recent searches.

## Tech Stack

This project is built using the latest stable and recommended technologies:

**Framework**: Next.js (App Router)

**Language**: TypeScript

**UI**: React, Material UI

**Styling**: Tailwind CSS

**Code Quality**: ESLint

## Getting Started

To run the Next.js application, follow these steps to prepare the environment and start the server.

### 1. Prerequisites & Installation

Ensure you have Node.js (version 18.x or later) and npm installed.

Clone the repository and install the dependencies:

`git clone [YOUR-REPO-LINK] weather-app-test`

`cd weather-app-test`

`npm install`

### 2. API Key Configuration (Crucial Step)

As required, all external API calls are proxied through a Next.js server route to secure the API key.

- Obtain an API key from a weather provider (e.g., OpenWeatherMap).

- Create a file named `.env.local` in the root of the project directory.

- Add your key to the file using the variable name defined below:

  `WEATHER_API_KEY="YOUR_API_KEY_HERE"`

### 3. Run the Development Server

Start the application in development mode:

`npm run dev`

Open http://localhost:3000 in your web browser to see the result.

## Deliverables & Key Decisions

### 1. Zod-Validated API Endpoint - Weather forecast (/api/weather)

This API endpoint provides weather forecast data and is built for security and scalability through input validation. The central architectural decision was either using a library like Zod or implement custom if checks.

Usage of Zod allowed all validation rules to be defined in a single, highly readable schema, guaranteeing that only truly valid and correctly typed coordinate numbers are processed.

For improved client debugging and a better user experience (UX), the endpoint employs granular error reporting and precise HTTP status codes.

### 2. Data Transformation & Aggregation (/api/weather/utils.ts)

The utility module (`/api/weather/utils.ts`) is dedicated to transforming the raw 3-hour API data into the required 5-day daily forecast. This separation keeps the API route handler clean. The module performs key aggregation steps for each day:

- grouping all hourly data determining the absolute minimum and maximum temperatures (`min_temp`, `max_temp`),
- calculating the average temperature (arithmetic mean),
- and finding the dominant weather condition and description using frequency counting for a single, brief daily summary.

### 3. Geolocation API Endpoint (/api/geolocation)

This endpoint is responsible for taking a user's location search (city or postcode), validating it using Zod, and securely converting it into the precise latitude and longitude coordinates required for the weather API. It acts as a secure server-side proxy for the OpenWeatherMap Geocoding service.

### 4. Client-Side UX

Main Layout prioritises visual fluidity and input usability:

**Sidebar usability**:

- A dynamic City/Postcode toggle was implemented under the search bar. This ensures input clarity by updating the search bar's placeholder text based on the selected mode, reducing user error in form submission.
- The "Open Sidebar" button's state has a 500ms delay via setTimeout. Implemented to precisely match the CSS transition duration, guaranteeing a smooth entry of the button into the viewport.
- A list of recent searches with unlimited storage, but limited display to preserve all user history while preventing UI clutter. The `useRecentSearches` hook stores all successful searches in `localStorage`. The locations are displayed as pills with keyboard navigation.

### 5. Clientside Architecture

- The `GeolocationSearchContext` provider completely isolates all geocoding logic (input state, debouncing, API call, loading status, and error messages) from the main UI components. This is a crucial architectural decision that makes the logic unit-testable outside of the React rendering environment.
- The provider uses the `useDebounce` with a 500ms delay on the `searchbarLocation` state. This prevents excessive and costly API calls while the user is actively typing, optimising resource usage and avoiding potential API rate limits.
- The `useRecentSearches` hook implemented to manage the history of succesful location lookups. It synchronizes the state with `localStorage`, including logic to safely handle JSON parsing errors and prevent rendering issues.

## Trade-offs and Limitations

### 1. API Endpoint

- **External Service Failure (Limitation)**: The application remains dependent on third-party uptime.

### 2. Data Accuracy and Aggregation Method (/api/weather/utils.ts)

- **Dominant Condition (Trade-off)**: The daily weather summary relies on frequency counting, not weather severity.

- **Temperature Metrics (Trade-off)**: Average Temperature is a simple arithmetic mean of 3-hour points.

- **Daily Grouping (Limitation)**: Daily grouping is strictly based on the API's UTC date string.

### 3. Geolocation

- **Multiple City Results (Limitation)**: The Geocoding API for city names can return up to five locations with the same name. The front-end must be designed to handle this array and potentially prompt the user to select the correct location.
- **Immediate Geolocation Failures (Limitation)**: The `MyLocationBtn` provides immediate feedback to the user on basic browser permission denial ("Sorry, no position available.") or feature absence ("Geolocation is not supported"). However, it performs no retries or advanced error handling, immediately aborting the attempt upon the first failure.

## Potential Improvements / Further work
