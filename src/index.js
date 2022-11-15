import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App";
import Visualization from "./components/vis";
import "./index.css";
import StaticDemo from "./components/info";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element:  <div className="flex mx-auto m-4">HOME</div>,
      },
      {
        path: "vis",
        element: <Visualization />,
      },
      {
        path: "info",
        element: <StaticDemo/>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
