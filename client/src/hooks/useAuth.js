import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser, checkAuth, clearError } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, checkingAuth } = useSelector((state) => state.auth);

  const login = (credentials) => dispatch(loginUser(credentials));
  const register = (userData) => dispatch(registerUser(userData));
  const logout = () => dispatch(logoutUser());
  const verifySession = () => dispatch(checkAuth());
  const resetError = () => dispatch(clearError());

  return {
    user,
    isAuthenticated,
    loading,
    error,
    checkingAuth,
    login,
    register,
    logout,
    verifySession,
    resetError,
  };
};

export default useAuth;
