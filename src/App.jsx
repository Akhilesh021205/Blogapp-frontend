import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/RootLayout";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import AuthorProfile from "./components/AuthorProfile";
import ArticleByID from "./components/ArticleById";
import AuthorArticles from "./components/AuthorArticles";
import WriteArticle from "./components/WriteArticle";
import { Toaster } from "react-hot-toast";
import EditArticle from "./components/EditArticleForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorize from "./components/Unauthorize";
import ArticlesFeed from "./components/ArticlesFeed";
import ErrorBoundry from "./components/ErrorBoundry";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";


function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorBoundry />,

      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "reset-password/:token",
          element: <ResetPassword />,
        },
        {
          path: "articles",
          element: <ArticlesFeed />,
        },
        {
          path: "unauthorize",
          element: <Unauthorize />,
        },
        {
          element: <ProtectedRoute allowedRoles={["USER", "AUTHOR", "ADMIN"]} />,
          children: [
            {
              path: "user-profile",
              element: <UserProfile />,
            },
          ],
        },
        {
          element: <ProtectedRoute allowedRoles={["AUTHOR"]} />,
          children: [
            {
              path: "author-profile",
              element: <AuthorProfile />,
              children: [
                {
                  index: true,
                  element: <AuthorArticles />,
                },
                {
                  path: "articles",
                  element: <AuthorArticles />,
                },
                {
                  path: "write-article",
                  element: <WriteArticle />,
                },
              ],
            },
            {
              path: "edit-article",
              element: <EditArticle />,
            },
          ],
        },
        {
          path: "article/:id",
          element: <ArticleByID />,
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>
  );
}

export default App;


