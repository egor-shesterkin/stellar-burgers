import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { useForm } from '../../hooks/useForm';

export const ForgotPassword: FC = () => {
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const [form, handleChange] = useForm({
    email: ''
  });

  const { email } = form;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setError(null);
    forgotPasswordApi({ email })
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err) => setError(err));
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message || ''}
      email={email}
      setEmail={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
