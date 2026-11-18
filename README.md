# Crave — Recipe Discovery App

A React + Tailwind recipe discovery application powered by TheMealDB.

## Features
- Search meals by name
- Filter by category, area/cuisine and ingredient
- Combine search and filters
- Recipe detail page with ingredients, instructions and YouTube link
- Save/remove favourites with localStorage
- Loading, error and empty states
- Responsive layout

## Run locally
1. Install Node.js (LTS).
2. Extract this project and open its folder in VS Code.
3. Open the terminal in the project folder.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open the local URL printed by Vite (usually http://localhost:5173).

## Build
Run `npm run build`. The production files are generated in `dist/`.

## Deploy to Netlify
1. Push this folder to a GitHub repository.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Connect the GitHub repository.
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy.

A `public/_redirects` file is included so React Router routes work after refresh.

## API
This project uses TheMealDB's public test key `1`:
https://www.themealdb.com/api.php

TheMealDB is a third-party service. API availability and returned data are controlled by that service.
