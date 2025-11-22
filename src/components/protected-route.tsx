import { FC, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../services/store';
import { getUser } from '../services/slices/authSlice';
import { isAuthenticated } from '../utils/auth';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  const { loading } = useSelector((store) => store.auth);
  const location = useLocation();

  const hasTokens = isAuthenticated();

  useEffect(() => {
    if (hasTokens && !user && !loading) {
      dispatch(getUser());
    }
  }, [dispatch, hasTokens, user, loading]);

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    if (hasTokens && loading) {
      return <div>Loading...</div>;
    }

    if (!hasTokens) {
      return <Navigate to='/login' state={{ from: location }} replace />;
    }
  }

  return children;
};
