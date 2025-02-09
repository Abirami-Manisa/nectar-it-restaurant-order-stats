# Restaurant Dashboard

This project is a restaurant statistics dashboard built with React, Tailwind CSS, and Chart.js. It visualizes various metrics such as highest sold items, rate vs. quantity, order processing time, orders per delivery person, order preferences, and order distribution.

## Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (Recommended: LTS version)
- [npm](https://www.npmjs.com/) (Comes with Node.js)

## Installation

1.  Clone the repository:
   ```sh
     git clone https://github.com/Abirami-Manisa/nectar-it-restaurant-order-stats.git
     cd nectar-it-restaurant-order-stats
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Running the Project

To start the development server, run:
```sh
npm run dev
```
This will start the application, and you can access it at `http://localhost:5173/` (or the port specified in your Vite configuration).

## Project Structure
```
project-directory/
│── src/
|   ├── assets/       # Data json and logo file
│   ├── components/   # React components
│   ├── App.jsx       # Main application component
│   ├── main.jsx      # Entry point
│── public/           # Static assets
│── package.json      # Dependencies and scripts
│── tailwind.config.js # Tailwind CSS configuration
│── vite.config.js    # Vite configuration
```

## Dependencies
The project uses the following main dependencies:
- **React** - JavaScript library for building user interfaces
- **Vite** - Fast build tool for frontend development
- **Chart.js & react-chartjs-2** - For rendering charts
- **Tailwind CSS** - Utility-first CSS framework

## Deployment
To build the project for production, run:
```sh
npm run build
```
This will generate an optimized `dist/` folder that can be deployed to a hosting service like Vercel, Netlify, or any static server.

## License
This project is licensed under the MIT License.

## Contact
For any questions or contributions, feel free to reach out.
