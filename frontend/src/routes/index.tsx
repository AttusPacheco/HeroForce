import {Route, Routes} from 'react-router-dom';
import {Home} from "../pages/Home.tsx";
import {Login} from "../pages/Login.tsx";
import {Register} from "../pages/Register.tsx";
import {RequireAuth} from "../auth/RequireAuth.tsx";
import {Dashboard} from "../pages/Dashboard.tsx";
import {RequireGuest} from "../auth/RequireGuest.tsx";

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
        </Routes>
    );
}