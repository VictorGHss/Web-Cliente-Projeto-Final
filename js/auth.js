import estado from './estado.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const feedbackMsg = document.getElementById('feedback-msg');

  if (!loginForm) return;

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Limpar feedbacks anteriores
    if (feedbackMsg) {
      feedbackMsg.textContent = '';
      feedbackMsg.className = 'feedback-message';
    }

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!emailInput || !passwordInput) return;

    const emailVal = emailInput.value.trim().toLowerCase();
    const passwordVal = passwordInput.value;

    // Buscar usuário correspondente
    const usuarios = estado.getUsuarios();
    const usuarioEncontrado = usuarios.find(
      (user) => user.email.toLowerCase() === emailVal && user.senha === passwordVal
    );

    if (usuarioEncontrado) {
      // Salvar na sessão (sessionStorage)
      const sessaoUsuario = {
        email: usuarioEncontrado.email,
        nome: usuarioEncontrado.nome,
        perfil: usuarioEncontrado.perfil,
        especialidade: usuarioEncontrado.especialidade || null
      };
      
      sessionStorage.setItem('usuarioLogado', JSON.stringify(sessaoUsuario));

      // Exibir feedback de sucesso
      if (feedbackMsg) {
        feedbackMsg.textContent = 'Login efetuado com sucesso! Redirecionando...';
        feedbackMsg.className = 'feedback-message success';
      }

      // Redirecionamento baseado no perfil com um pequeno delay para experiência visual suave
      setTimeout(() => {
        switch (usuarioEncontrado.perfil) {
          case 'admin':
            window.location.href = 'admin.html';
            break;
          case 'medico':
            window.location.href = 'medico.html';
            break;
          case 'paciente':
            window.location.href = 'paciente.html';
            break;
          default:
            if (feedbackMsg) {
              feedbackMsg.textContent = 'Erro de perfil. Contate o administrador.';
              feedbackMsg.className = 'feedback-message error';
            }
        }
      }, 800);

    } else {
      // Credenciais inválidas
      if (feedbackMsg) {
        feedbackMsg.textContent = 'E-mail ou senha incorretos. Tente novamente.';
        feedbackMsg.className = 'feedback-message error';
      }
      passwordInput.value = '';
      passwordInput.focus();
    }
  });
});
