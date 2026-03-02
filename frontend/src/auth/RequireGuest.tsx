import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

type Props = {
    children: JSX.Element;
};

export function RequireGuest({ children }: Props) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}