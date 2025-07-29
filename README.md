# Expense Tracker

A simple web application to help you log and monitor your daily spending. This project provides a clean interface to add new expenses, view a history of your transactions, and see a summary of your income and expenses.

***

## Live Demo & Video

* **Live Project:** You can view and interact with the live project here: [**https://expense-tracker-alpha-six-36.vercel.app/**](https://expense-tracker-alpha-six-36.vercel.app/)
* **Demo Video:** [Watch the project demo on Google Drive](https://drive.google.com/file/d/1RkpX-NjLrLy6eBIa41AVAA6tLU9NQxTq/view?usp=sharing)

***

## Tech Stack

* **Frontend:** **React** (With **Vite**) was used to build the interactive and responsive user interface.
* **Backend & Hosting:**  This application's backend is built using **Node.js** where **Vercel** is used for both hosting the frontend and for the backend logic. The backend is implemented using **Serverless Functions**, which are managed by Vercel.
* **Database:** MongoDB is used to permanently store all expense entries.

***

## Project Structure

The project is organized into two main directories, separating the frontend and backend concerns.

```
/
├── api/        # Contains the backend serverless functions for API calls
└── src/        # Contains all the frontend React code (components, pages, styles)
```

* **`src` folder:** This directory holds the entire frontend application code, built with React. It includes all components, state management, and styling necessary to render the user interface.
* **`api` folder:** This directory contains the backend logic. Each file in this folder typically corresponds to a serverless function that handles a specific API endpoint (e.g., `api/add-expense.js`, `api/get-expenses.js`). Vercel automatically deploys these files as individual serverless functions.
