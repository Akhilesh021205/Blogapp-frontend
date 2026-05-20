# Frontend

Frontend for Blog App
using React.js, Vite, and Tailwind CSS.

## Features are

- User Registration
- User Login Authentication
- Forgot Password
- Reset Password
- Create Articles
- Edit Articles
- Delete Articles
- View All Articles
- Author Dashboard
- Author Profile
- Protected Routes
- JWT Authentication
- Responsive UI
- API Integration
- State Management using Zustand
- Error Handling
- Dynamic Routing

## Packages Used

Create React App using Vite:
npm create vite@latest

Install Dependencies:
npm install

Install React:
npm install react react-dom

Install React Router:
npm install react-router-dom

Install Axios:
npm install axios

Install Tailwind CSS:
npm install tailwindcss @tailwindcss/vite

Install Zustand:
npm install zustand

Install JWT Decode:
npm install jwt-decode


### Frontend Folder Structure

- public

- src
  - assets
    - react.svg

  - components
    - ArticleById.jsx
    - ArticlesFeed.jsx
    - AuthorArticles.jsx
    - AuthorProfile.jsx
    - ConfirmationModal.jsx
    - EditArticleForm.jsx
    - ErrorBoundry.jsx
    - Footer.jsx
    - ForgotPassword.jsx
    - Header.jsx
    - Home.jsx
    - Login.jsx
    - Logo.jsx
    - ProtectedRoute.jsx
    - Register.jsx
    - ResetPassword.jsx
    - RootLayout.jsx
    - SubscriptionModal.jsx
    - Unauthorize.jsx
    - UserProfile.jsx
    - WriteArticle.jsx

  - store
    - authStore.js
    - themeStore.js

  - styles
    - common.js

  - App.jsx
  - index.css
  - main.jsx

- node_modules
- .gitignore
- package.json
- package-lock.json
- vite.config.js
- index.html
- README.md


## To Run Project

npm install
npm run dev


## Environment Variables

env
VITE_BACKEND_URL=http://localhost:4000