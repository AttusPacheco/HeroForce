import {Route, Routes} from 'react-router-dom';
import {RequireAuth} from "../auth/RequireAuth.tsx";
import {RequireGuest} from "../auth/RequireGuest.tsx";

import {Home} from "../pages/Home.tsx";
import {Login} from "../pages/Login.tsx";
import {Register} from "../pages/Register.tsx";
import {Dashboard} from "../pages/Dashboard.tsx";
import {CreateProject} from "../pages/Projects/CreateProject.tsx";

export function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <RequireGuest>
                        <Home/>
                    </RequireGuest>
                }
            />
            <Route
                path="/login"
                element={
                    <RequireGuest>
                        <Login/>
                    </RequireGuest>
                }
            />
            <Route
                path="/register"
                element={
                    <RequireGuest>
                        <Register/>
                    </RequireGuest>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <RequireAuth>
                        <Dashboard/>
                    </RequireAuth>
                }
            />

            <Route
                path="/projects/new"
                element={
                    <RequireAuth>
                        <CreateProject/>
                    </RequireAuth>
                }
            />
        </Routes>
    );
}