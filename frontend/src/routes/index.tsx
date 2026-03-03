import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from "../auth/RequireAuth.tsx";
import { RequireGuest } from "../auth/RequireGuest.tsx";

import { Home } from "../pages/Home.tsx";
import { Login } from "../pages/Login.tsx";
import { Register } from "../pages/Register.tsx";
import { Dashboard } from "../pages/Dashboard.tsx";
import { CreateProject } from "../pages/Projects/CreateProject.tsx";
import { ProjectDetails } from "../pages/Projects/ProjectDetails.tsx";
import { Profile } from "../pages/Profile.tsx";
import { AuthLayout } from "../layout/AuthLayout.tsx";

export function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <RequireGuest>
                        <Home />
                    </RequireGuest>
                }
            />
            <Route
                path="/login"
                element={
                    <RequireGuest>
                        <Login />
                    </RequireGuest>
                }
            />
            <Route
                path="/register"
                element={
                    <RequireGuest>
                        <Register />
                    </RequireGuest>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <RequireAuth>
                        <AuthLayout>
                            <Dashboard />
                        </AuthLayout>
                    </RequireAuth>
                }
            />

            <Route
                path="/profile"
                element={
                    <RequireAuth>
                        <AuthLayout>
                            <Profile />
                        </AuthLayout>
                    </RequireAuth>
                }
            />

            <Route
                path="/projects/new"
                element={
                    <RequireAuth>
                        <AuthLayout>
                            <CreateProject />
                        </AuthLayout>
                    </RequireAuth>
                }
            />
            <Route
                path="/projects/:id"
                element={
                    <RequireAuth>
                        <AuthLayout>
                            <ProjectDetails />
                        </AuthLayout>
                    </RequireAuth>
                }
            />
        </Routes>
    );
}