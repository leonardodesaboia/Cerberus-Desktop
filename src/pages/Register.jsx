import { useState, useEffect } from 'react'; 
import Input from '../components/Input';
import '../styles/Register.css';

function Register() {
  const [formData, setFormData] = useState({
      email: '',
      cpf: '',
      username: '',
      password: '',
      confirmPassword: ''
  });

  const [errors, setErrors] = useState({
      email: '',
      cpf: '',
      username: '',
      password: '',
      confirmPassword: ''
  });

  const [touched, setTouched] = useState({
      email: false,
      cpf: false,
      username: false,
      password: false,
      confirmPassword: false
  });

  // Validadores
  const validators = {
      email: (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value) return 'Email é obrigatório';
          if (!emailRegex.test(value)) return 'Email inválido';
          return '';
      },

      cpf: (value) => {
          const cpfRegex = /^\d{11}$/;
          if (!value) return 'CPF é obrigatório';
          if (!cpfRegex.test(value)) return 'CPF deve conter 11 dígitos';
          
          // Validação do CPF
          const digits = value.split('').map(Number);
          
          // Verifica dígitos repetidos
          if (digits.every(digit => digit === digits[0])) return 'CPF inválido';
          
          // Validação do primeiro dígito verificador
          let sum = 0;
          for (let i = 0; i < 9; i++) {
              sum += digits[i] * (10 - i);
          }
          const digit1 = (sum * 10) % 11 % 10;
          if (digit1 !== digits[9]) return 'CPF inválido';
          
          // Validação do segundo dígito verificador
          sum = 0;
          for (let i = 0; i < 10; i++) {
              sum += digits[i] * (11 - i);
          }
          const digit2 = (sum * 10) % 11 % 10;
          if (digit2 !== digits[10]) return 'CPF inválido';
          
          return '';
      },

      username: (value) => {
          if (!value) return 'Username é obrigatório';
          if (value.length < 3) return 'Username deve ter no mínimo 3 caracteres';
          if (value.length > 20) return 'Username deve ter no máximo 20 caracteres';
          if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username deve conter apenas letras, números e _';
          return '';
      },

      password: (value) => {
          if (!value) return 'Senha é obrigatória';
          if (value.length < 8) return 'Senha deve ter no mínimo 8 caracteres';
          if (!/[A-Z]/.test(value)) return 'Senha deve conter pelo menos uma letra maiúscula';
          if (!/[a-z]/.test(value)) return 'Senha deve conter pelo menos uma letra minúscula';
          if (!/[0-9]/.test(value)) return 'Senha deve conter pelo menos um número';
          if (!/[!@#$%^&*]/.test(value)) return 'Senha deve conter pelo menos um caractere especial (!@#$%^&*)';
          return '';
      },

      confirmPassword: (value, password) => {
          if (!value) return 'Confirmação de senha é obrigatória';
          if (value !== password) return 'As senhas não coincidem';
          return '';
      }
  };

  const formatCPF = (value) => {
    // Remove tudo que não é número
    const cpf = value.replace(/\D/g, '');
    
    // Adiciona os pontos e traço conforme digita
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para atualizar o formData
  const handleChange = (field) => (e) => {
    let value = e.target.value;
    
    // Se for o campo CPF, aplica a formatação
    if (field === 'cpf') {
        const numbersOnly = value.replace(/\D/g, '');
        if (numbersOnly.length <= 11) {
            value = formatCPF(numbersOnly);
        } else {
            return;
        }
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
        // Para o CPF, remove a formatação antes de validar
        const valueToValidate = field === 'cpf' ? value.replace(/\D/g, '') : value;
        const validationError = field === 'confirmPassword' 
            ? validators[field](value, formData.password)
            : validators[field](valueToValidate);
        setErrors(prev => ({ ...prev, [field]: validationError }));
    }
};

  // Função para marcar campo como tocado
  const handleBlur = (field) => () => {
      setTouched(prev => ({ ...prev, [field]: true }));
      const validationError = field === 'confirmPassword'
          ? validators[field](formData[field], formData.password)
          : validators[field](formData[field]);
      setErrors(prev => ({ ...prev, [field]: validationError }));
  };

  // Validar ao mudar a senha (para atualizar a validação da confirmação)
  useEffect(() => {
      if (touched.confirmPassword) {
          const validationError = validators.confirmPassword(formData.confirmPassword, formData.password);
          setErrors(prev => ({ ...prev, confirmPassword: validationError }));
      }
  }, [formData.password]);

  const handleSubmit = (event) => {
      event.preventDefault();
      
      // Marcar todos os campos como tocados
      const allTouched = Object.keys(touched).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setTouched(allTouched);

      // Validar todos os campos
      const newErrors = {
          email: validators.email(formData.email),
          cpf: validators.cpf(formData.cpf),
          username: validators.username(formData.username),
          password: validators.password(formData.password),
          confirmPassword: validators.confirmPassword(formData.confirmPassword, formData.password)
      };
      setErrors(newErrors);

      // Verificar se há erros
      const hasErrors = Object.values(newErrors).some(error => error !== '');
      if (!hasErrors) {
          console.log('Formulário válido:', formData);
          // Aqui você pode enviar os dados para o servidor
      }
  };

  return (
      <div className="register-container">
          <div className="register-header">
              <h1>Cerberus</h1>
          </div>

          <div className="form-container">
              <form onSubmit={handleSubmit} className="register-form">
                  <Input 
                      label="Email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleChange('email')}
                      onBlur={handleBlur('email')}
                      error={errors.email}
                      placeholder="Digite seu email"
                  />

                  <Input 
                      label="CPF" 
                      type="text" 
                      value={formData.cpf}
                      onChange={handleChange('cpf')}
                      onBlur={handleBlur('cpf')}
                      error={errors.cpf}
                      placeholder="Digite o seu CPF"
                  />  

                  <Input
                      label="Username" 
                      type="text" 
                      value={formData.username}
                      onChange={handleChange('username')}
                      onBlur={handleBlur('username')}
                      error={errors.username}
                      placeholder="Digite o seu nome de usuário"
                  />
                  
                  <Input 
                      label="Senha" 
                      type="password" 
                      value={formData.password}
                      onChange={handleChange('password')}
                      onBlur={handleBlur('password')}
                      error={errors.password}
                      placeholder="Digite sua senha"
                  />

                  <Input 
                      label="Confirmar senha" 
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      error={errors.confirmPassword}
                      placeholder="Confirme sua senha"
                  />

                  <button type="submit" className="register-button">
                      Cadastrar
                  </button>
              </form>
          </div>

          <div className="wave-container">
              <img src='/Vector.png' alt='Bottom img' className='wave'/>
          </div>
      </div>
  );
}

export default Register;