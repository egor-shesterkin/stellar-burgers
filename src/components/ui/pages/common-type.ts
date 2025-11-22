import { SyntheticEvent, ChangeEvent } from 'react';

export type PageUIProps = {
  email: string;
  setEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  errorText: string;
  handleSubmit: (e: SyntheticEvent) => void;
};
