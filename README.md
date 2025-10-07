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

## Trade-offs and Limitations

## Potential Improvements / Further work
