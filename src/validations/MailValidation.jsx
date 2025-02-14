export const isValidEmail =(email)=>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!currentEmail || !email) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    if (!emailRegex.test(currentEmail) || !emailRegex.test(email)) {
      alert('Por favor, insira emails válidos');
      return;
    }

    if (currentEmail !== originalEmail) {
      alert('O email atual não corresponde ao email cadastrado');
      return;
    }

    if (currentEmail === email) {
      alert('O novo email deve ser diferente do email atual');
      return;
    }

}