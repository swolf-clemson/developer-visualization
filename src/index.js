import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App";
import Visualization from "./components/vis";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element:  <div className="w-96 h-96">HOME</div>,
      },
      {
        path: "vis",
        element: <Visualization />,
      },
      {
        path: "info",
        element: <div className="w-96 h-96">INFO</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
