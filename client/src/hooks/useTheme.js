import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '../redux/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const toggle = () => dispatch(toggleTheme());
  const selectTheme = (mode) => dispatch(setTheme(mode));

  return {
    theme,
    toggle,
    selectTheme,
    isDark: theme === 'dark',
  };
};

export default useTheme;
