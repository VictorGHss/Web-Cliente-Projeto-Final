import estado from './estado.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorMsgContainer = document.getElementById('error-message');

  if (!loginForm) return;

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Limpar mensagem de erro anterior
    if (errorMsgContainer) {
      errorMsgContainer.textContent = '';
      errorMsgContainer.style.display = 'none';
    }

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!emailInput || !passwordInput) return;

    const emailValue = emailInput.value.trim().toLowerCase();
    const passwordValue = passwordInput.value;

    // Buscar usuário correspondente no localStorage através da classe de Estado
    const usuarios = estado.getUsuarios();
    const usuarioEncontrado = usuarios.find(
      (user) => user.email.toLowerCase() === emailValue && user.senha === passwordValue
    );

    if (usuarioEncontrado) {
      // Salvar dados básicos do usuário no sessionStorage
      const dadosSessao = {
        email: usuarioEncontrado.email,
        nome: usuarioEncontrado.nome,
        perfil: usuarioEncontrado.perfil,
        especialidade: usuarioEncontrado.especialidade || null
      };
      
      sessionStorage.setItem('usuarioLogado', JSON.stringify(dadosSessao));

      // Redirecionamento baseado no perfil correspondente
      if (usuarioEncontrado.perfil === 'admin') {
        window.location.href = 'admin.html';
      } else if (usuarioEncontrado.perfil === 'medico') {
        window.location.href = 'medico.html';
      } else if (usuarioEncontrado.perfil === 'paciente') {
        window.location.href = 'paciente.html';
      } else {
        if (errorMsgContainer) {
          errorMsgContainer.textContent = 'Erro interno: Perfil de usuário desconhecido.';
          errorMsgContainer.style.display = 'block';
        }
      }
    } else {
      // Login inválido - Inserir mensagem de erro vermelha abaixo do formulário
      if (errorMsgContainer) {
        errorMsgContainer.textContent = 'E-mail ou senha incorretos.';
        errorMsgContainer.style.display = 'block';
      }
      // Limpar senha e focar o campo para nova digitação
      passwordInput.value = '';
      passwordInput.focus();
    }
  });
});
