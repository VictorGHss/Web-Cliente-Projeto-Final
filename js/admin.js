import estado from './estado.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Proteção de Rota Interna e Validação de Sessão Administrativa
  const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  if (!usuarioLogado || usuarioLogado.perfil !== 'admin') {
    window.location.href = 'index.html';
    return;
  }

  // 2. Elementos da Interface
  const adminDisplayName = document.getElementById('admin-display-name');
  const btnLogout = document.getElementById('btn-logout');
  const doctorForm = document.getElementById('doctor-form');
  const nameInput = document.getElementById('doctor-name');
  const emailInput = document.getElementById('doctor-email');
  const specialtySelect = document.getElementById('doctor-specialty');
  const passwordInput = document.getElementById('doctor-password');
  const btnSaveDoctor = document.getElementById('btn-save-doctor');
  const btnCancelEdit = document.getElementById('btn-cancel-edit');
  const doctorsList = document.getElementById('doctors-list');
  const formSectionTitle = document.getElementById('form-section-title');
  const formSectionDesc = document.getElementById('form-section-desc');

  // Preencher nome do administrador no cabeçalho
  if (adminDisplayName) {
    adminDisplayName.textContent = usuarioLogado.nome;
  }

  // Configuração de Logout
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem('usuarioLogado');
      window.location.href = 'index.html';
    });
  }

  // 3. População do select de Especialidades
  const especialidadesMap = estado.getEspecialidades();
  const listaEspecialidades = Object.keys(especialidadesMap).sort();

  listaEspecialidades.forEach((esp) => {
    const option = document.createElement('option');
    option.value = esp;
    option.textContent = esp;
    specialtySelect.appendChild(option);
  });

  // 4. Variável de Controle de Estado de Edição (E-mail do médico)
  let emailMedicoEmEdicao = null;

  // 5. Redesenhar a Listagem de Médicos em Formato de Cards (Foco Mobile)
  function redesenharMedicos() {
    if (!doctorsList) return;

    doctorsList.innerHTML = '';
    const todosUsuarios = estado.getUsuarios();

    // Filtrar apenas usuários com perfil 'medico'
    const medicos = todosUsuarios.filter((u) => u.perfil === 'medico');

    if (medicos.length === 0) {
      doctorsList.innerHTML = '<p class="empty-message">Nenhum médico cadastrado no momento.</p>';
      return;
    }

    // Criar cards de médicos empilhados via Flexbox
    medicos.forEach((medico) => {
      const card = document.createElement('article');
      card.className = 'appointment-card';

      card.innerHTML = `
        <p><strong>Nome:</strong> ${medico.nome}</p>
        <p><strong>E-mail:</strong> ${medico.email}</p>
        <p><strong>Especialidade:</strong> ${medico.especialidade}</p>
        <div class="card-actions">
          <button type="button" class="btn-edit" data-email="${medico.email}">Editar</button>
          <button type="button" class="btn-delete" data-email="${medico.email}">Excluir</button>
        </div>
      `;

      doctorsList.appendChild(card);
    });

    // Event Listeners para Editar e Excluir
    doctorsList.querySelectorAll('.btn-edit').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const email = e.target.getAttribute('data-email');
        carregarParaEdicao(email);
      });
    });

    doctorsList.querySelectorAll('.btn-delete').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const email = e.target.getAttribute('data-email');
        excluirMedico(email);
      });
    });
  }

  // 6. Lógica de Carregamento para Edição (Update - Parte 1)
  function carregarParaEdicao(email) {
    const usuarios = estado.getUsuarios();
    const medico = usuarios.find((u) => u.email === email && u.perfil === 'medico');

    if (!medico) return;

    // Preencher campos
    nameInput.value = medico.nome;
    emailInput.value = medico.email;
    emailInput.disabled = true; // Desabilita edição de e-mail (chave de busca)
    specialtySelect.value = medico.especialidade;
    passwordInput.value = medico.senha;

    // Atualiza controle
    emailMedicoEmEdicao = email;

    // Atualizar UI do Formulário
    formSectionTitle.textContent = 'Editar Médico';
    formSectionDesc.textContent = `Editando os dados cadastrais de: ${medico.nome}`;
    btnSaveDoctor.textContent = 'Atualizar Cadastro';
    if (btnCancelEdit) btnCancelEdit.style.display = 'block';

    // Rolar a tela de volta ao topo de forma suave (foco no formulário em celulares)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 7. Lógica de Cancelamento da Edição
  function cancelarEdicao() {
    doctorForm.reset();
    emailInput.disabled = false;
    emailMedicoEmEdicao = null;

    formSectionTitle.textContent = 'Cadastrar Novo Médico';
    formSectionDesc.textContent = 'Insira as informações do profissional para autorizar acesso ao sistema';
    btnSaveDoctor.textContent = 'Salvar Médico';
    if (btnCancelEdit) btnCancelEdit.style.display = 'none';
  }

  if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', cancelarEdicao);
  }

  // 8. Lógica de Remoção (Delete do CRUD)
  function excluirMedico(email) {
    // Se o médico sendo excluído for o que está em edição, cancela o modo edição
    if (emailMedicoEmEdicao === email) {
      cancelarEdicao();
    }

    const todosUsuarios = estado.getUsuarios();
    // Filtra removendo o médico específico
    const usuariosFiltrados = todosUsuarios.filter(
      (u) => !(u.email === email && u.perfil === 'medico')
    );

    estado.salvarUsuarios(usuariosFiltrados);
    redesenharMedicos();
  }

  // 9. Lógica de Submissão do Formulário (Create & Update)
  if (doctorForm) {
    doctorForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const nome = nameInput.value.trim();
      const email = emailInput.value.trim().toLowerCase();
      const especialidade = specialtySelect.value;
      const senha = passwordInput.value;

      if (!nome || !email || !especialidade || !senha) {
        return;
      }

      const todosUsuarios = estado.getUsuarios();

      if (emailMedicoEmEdicao === null) {
        // MODO INSERÇÃO (Create)
        // Validar se e-mail já existe no sistema
        const emailJaExiste = todosUsuarios.some(
          (u) => u.email.toLowerCase() === email
        );

        if (emailJaExiste) {
          alert('Este e-mail de acesso já está cadastrado.');
          return;
        }

        const novoMedico = {
          nome,
          email,
          especialidade,
          senha,
          perfil: 'medico'
        };

        todosUsuarios.push(novoMedico);
        estado.salvarUsuarios(todosUsuarios);
        
        doctorForm.reset();
      } else {
        // MODO EDIÇÃO (Update - Parte 2)
        const index = todosUsuarios.findIndex(
          (u) => u.email === emailMedicoEmEdicao && u.perfil === 'medico'
        );

        if (index !== -1) {
          todosUsuarios[index].nome = nome;
          todosUsuarios[index].especialidade = especialidade;
          todosUsuarios[index].senha = senha;
          estado.salvarUsuarios(todosUsuarios);
        }

        cancelarEdicao();
      }

      // Recarregar listagem
      redesenharMedicos();
    });
  }

  // Renderização inicial dos médicos cadastrados
  redesenharMedicos();
});
