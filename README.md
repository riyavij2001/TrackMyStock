# TrackMyStocks

TrackMyStocks is a web application designed to track real-time stock prices and allow users to subscribe to daily email notifications for their selected stocks. This tool scrapes stock data, displays it according to user preferences, and offers an easy way to monitor your favorite stocks with daily updates sent directly to your inbox.

## Features:
- **Stock Data Scraping**: Fetches live stock data from multiple sources.
- **User Preferences**: Displays stocks according to user-defined preferences.
- **Email Notifications**: Users can subscribe for daily email updates about their selected stocks.
- **Responsive UI**: Built with React and styled with Tailwind CSS to provide an elegant, mobile-friendly experience.
  
## Technologies Used:
- **Backend**: Go (Golang), MySQL
- **Frontend**: React.js, Tailwind CSS

### Prerequisites:
- Go (Golang) installed on your machine: [Download Go](https://go.dev/dl/)
- MySQL instance running (locally or via a cloud service).
- Node.js installed on your machine: [Download Node.js](https://nodejs.org/)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/riyavij2001/TrackMyStock.git
   cd TrackMyStocks/backend-go
   ```
2. Start the Backend Server:
    ```bash 
    make run
     ```

3. Configure MySQL:

   - Set up your MySQL connection in config/database.go.
   - You can use a local MySQL or connect to a cloud service


### Frontend Setup

1. Navigate to the frontend directory::
   ```bash
   cd /frontend
   ```
2. Install npm dependencies:
    ```bash 
    npm install
     ```

3. Configure the frontend to interact with the backend (e.g., update API endpoint URLs in the frontend components).

4. Start the frontend server::

    ```bash
    npm run dev
    ```

This will launch the Vite-powered React app on http://localhost:5173 (default Vite port).

```bash 
    This updated setup is now aligned with Vite, which uses `npm run dev` for development instead of `npm start`. Let me know if you need further adjustments!
```

### Running the Application

Once both the backend and frontend are running, you can:
- Visit http://localhost:5173 in your browser to view the app.
- Log in (or sign up) to add and track your favorite stocks.
-  Configure email preferences to receive daily stock updates.

### Contributing

- Fork this repository.
- Create a new branch (git checkout -b feature-branch).
- Make your changes and commit them (git commit -am 'Add new feature').
- Push your branch (git push origin feature-branch).
- Open a pull request to the main branch.