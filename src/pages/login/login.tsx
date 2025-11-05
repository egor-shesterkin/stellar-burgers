import { FC, SyntheticEvent, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { loginUser, clearError } from '../../services/slices/authSlice';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((store) => store.auth);

  const [form, handleChange] = useForm({
    email: '',
    password: ''
  });

  const { email, password } = form;

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={handleChange}
      password={password}
      setPassword={handleChange}
      handleSubmit={handleSubmit}
      loading={loading}
    />
  );
};
