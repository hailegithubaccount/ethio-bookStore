import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {createBrowserRouter}from "react-router-dom"; 



// Define the routes for your application
const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
]);

// Render the application



export default router;