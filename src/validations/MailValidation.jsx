import { toast } from 'react-toastify';

export const isValidEmail = (currentEmail, email, originalEmail) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const trimmedCurrentEmail = currentEmail.trim();
  const trimmedEmail = email.trim();

  if (!trimmedCurrentEmail || !trimmedEmail) {
    toast.warn('Por favor, preencha todos os campos.');
    return false;
  }

  if (!emailRegex.test(trimmedCurrentEmail) || !emailRegex.test(trimmedEmail)) {
    toast.error('Por favor, insira um e-mail válido.');
    return false;
  }

  if (trimmedCurrentEmail !== originalEmail) {
    toast.error('O e-mail atual não corresponde ao e-mail cadastrado.');
    return false;
  }

  if (trimmedCurrentEmail === trimmedEmail) {
    toast.warn('O novo e-mail deve ser diferente do e-mail atual.');
    return false;
  }

  return true;
};
