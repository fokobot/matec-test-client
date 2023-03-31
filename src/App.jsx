import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProductionState } from "./context/productions/ProductionState";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Productions } from "./pages/Productions";
import { ProductionOfTheDay } from "./pages/ProductionOfTheDay";
import { AdminProductions } from "./pages/AdminProductions";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/productions",
        element: <Productions />,
    },
    {
        path: "/admin",
        element: <AdminProductions />,
    },
    // {
    //     path: "/user/productions",
    //     element: <UserProductions />,
    // },
    {
        path: "/production-of-the-day",
        element: <ProductionOfTheDay />,
    }
]);

function App() {
    return <div className="App">
        <ProductionState>
            <RouterProvider router={router} />
        </ProductionState>
    </div>;
}

export default App;
