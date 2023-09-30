# Expense-tracker

![Expense-tracker page](./public/image/001.jpg)
![Expense-tracker page](./public/image/002.jpg)

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Facebook App Configuration](#facebook-app-configuration)
  - [Running the App](#running-the-app)
  - [Test-Accounts](#Test-Accounts)

<!-- prettier-ignore -->
> Note: Ensure you have the following prerequisites installed on your machine:
> - [Node.js v18](https://nodejs.org/) or later

### Installation

1. Clone the repository to your local machine:

   ```bash
   $ git clone https://github.com/shccgxqp/expense-tracker.git

2. Navigate to the project directory:

   ```bash
   $ cd expense-tracker
   ```

3. Install the required npm packages:

   ```bash
   $ npm install
   ```

### Database-Setup

1. Run the mongoose seed to set up the database tables and seed initial data:

   ```bash
   $ npm run seed
   ```

### Facebook-App-Configuration

1. Create a Facebook App for OAuth login by visiting the Facebook Developers Portal.

After creating the app, you will get a Client ID and a Client Secret. Set them in your .env file as follows:

   ```bash
   FACEBOOK_CLIENT_ID=your_client_id
   FACEBOOK_CLIENT_SECRET=your_client_secret
   MONGODB_URI=your_mongodb_url
   ```

### Running-the-App

1. Start the web app:

   ```bash
   $ npm run start
   ```

Or, if you prefer to run it in development mode with auto-reloading:

   ```bash
   $ npm run dev
   ```
   

The app should now be running locally. You can access it by opening your web browser and navigating to http://localhost:3000.


## Test-Accounts

You can use the following test accounts to log in to the application:

- Test User 1
  - name: 廣志
  - Email: user1@example.com
  - Password: 12345678

- Test User 2
  - name: 小新
  - Email: user2@example.com
  - Password: 12345678