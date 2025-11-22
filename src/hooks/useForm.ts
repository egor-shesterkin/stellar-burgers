import { useState, ChangeEvent } from 'react';

export function useForm<T extends Record<string, string>>(initialForm: T) {
  const [form, setForm] = useState<T>(initialForm);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  return [form, handleChange, resetForm] as const;
}
