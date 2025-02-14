export const isValidEmail = (currentEmail, email, originalEmail) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!currentEmail || !email) {
      alert('Por favor, preencha todos os campos');
      return false;
  }

  if (!emailRegex.test(currentEmail) || !emailRegex.test(email)) {
      alert('Por favor, insira emails válidos');
      return false;
  }

  if (currentEmail !== originalEmail) {
      alert('O email atual não corresponde ao email cadastrado');
      return false;
  }

  if (currentEmail === email) {
      alert('O novo email deve ser diferente do email atual');
      return false;
  }

  return true;
};
