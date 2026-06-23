import estado from './estado.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Proteção de Rota Interna e validação de sessão
  const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  if (!usuarioLogado || usuarioLogado.perfil !== 'paciente') {
    window.location.href = 'index.html';
    return;
  }

  // 2. Elementos da Interface
  const patientNameSpan = document.getElementById('patient-name');
  const btnLogout = document.getElementById('btn-logout');
  const appointmentsList = document.getElementById('appointments-list');
  const appointmentForm = document.getElementById('appointment-form');
  const selectSpecialty = document.getElementById('select-specialty');
  const selectDoctor = document.getElementById('select-doctor');
  const appointmentDate = document.getElementById('appointment-date');
  const appointmentTime = document.getElementById('appointment-time');

  // Preencher nome do cabeçalho
  if (patientNameSpan) {
    patientNameSpan.textContent = usuarioLogado.nome;
  }

  // Configuração de Logout
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem('usuarioLogado');
      window.location.href = 'index.html';
    });
  }

  // 3. Preencher o select de Especialidades dinamicamente
  const especialidadesMap = estado.getEspecialidades();
  const listaEspecialidades = Object.keys(especialidadesMap).sort();

  listaEspecialidades.forEach((esp) => {
    const option = document.createElement('option');
    option.value = esp;
    option.textContent = esp;
    selectSpecialty.appendChild(option);
  });

  // 4. Lógica Assíncrona para Carregamento de Médicos
  selectSpecialty.addEventListener('change', async (event) => {
    const especialidadeSelecionada = event.target.value;

    // Se nenhuma especialidade for selecionada, limpa e desabilita o select de médicos
    if (!especialidadeSelecionada) {
      selectDoctor.innerHTML = '<option value="">Selecione uma especialidade primeiro...</option>';
      selectDoctor.disabled = true;
      selectDoctor.classList.remove('loading-select');
      return;
    }

    // Configura o carregamento visual e desabilita o campo temporariamente
    selectDoctor.disabled = true;
    selectDoctor.classList.add('loading-select');
    selectDoctor.innerHTML = '<option value="">Buscando médicos na Inovare...</option>';

    // Simulação assíncrona: Promise com setTimeout de 800ms
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Limpa e popula com os médicos correspondentes
      selectDoctor.innerHTML = '<option value="">Selecione o(a) médico(a)...</option>';
      const medicos = especialidadesMap[especialidadeSelecionada] || [];

      medicos.forEach((medico) => {
        const option = document.createElement('option');
        option.value = medico;
        option.textContent = medico;
        selectDoctor.appendChild(option);
      });

      // Libera o campo após carregar
      selectDoctor.disabled = false;
    } catch (error) {
      console.error('Erro ao consultar médicos:', error);
      selectDoctor.innerHTML = '<option value="">Erro ao buscar profissionais</option>';
    } finally {
      // Remove a classe de carregamento visual
      selectDoctor.classList.remove('loading-select');
    }
  });

  // 5. Renderização (Redesenho) da Lista de Consultas do Paciente
  function redesenharConsultas() {
    if (!appointmentsList) return;
    
    appointmentsList.innerHTML = '';
    const todasConsultas = estado.getConsultas();

    // Filtrar apenas as consultas pertencentes ao paciente logado atualmente
    const minhasConsultas = todasConsultas.filter(
      (c) => c.paciente === usuarioLogado.nome
    );

    if (minhasConsultas.length === 0) {
      appointmentsList.innerHTML = '<p class="empty-message">Nenhuma consulta agendada no momento.</p>';
      return;
    }

    // Gerar os cards empilhados via Flexbox
    minhasConsultas.forEach((consulta) => {
      const card = document.createElement('article');
      card.className = 'appointment-card';

      // Converter data do padrão YYYY-MM-DD para DD/MM/YYYY
      const dataFormatada = formatarData(consulta.data);

      card.innerHTML = `
        <p><strong>Especialidade:</strong> ${consulta.especialidade}</p>
        <p><strong>Médico(a):</strong> ${consulta.medico}</p>
        <p><strong>Data/Hora:</strong> ${dataFormatada} às ${consulta.hora}</p>
        <p><strong>Status:</strong> <span class="badge-status agendado">${consulta.status}</span></p>
        <button type="button" class="btn-cancel" data-id="${consulta.id}">Cancelar Consulta</button>
      `;

      appointmentsList.appendChild(card);
    });

    // Vincular evento de cancelamento em cada botão
    const botoesCancelar = appointmentsList.querySelectorAll('.btn-cancel');
    botoesCancelar.forEach((botao) => {
      botao.addEventListener('click', (e) => {
        const idConsulta = e.target.getAttribute('data-id');
        cancelarConsulta(idConsulta);
      });
    });
  }

  // Função auxiliar para formatação de data
  function formatarData(dataString) {
    const partes = dataString.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataString;
  }

  // 6. Remoção de Consultas (CRUD - Delete)
  function cancelarConsulta(id) {
    const todasConsultas = estado.getConsultas();
    const consultasAtualizadas = todasConsultas.filter((c) => c.id !== id);
    estado.salvarConsultas(consultasAtualizadas);
    redesenharConsultas();
  }

  // 7. Submissão do Formulário de Agendamento (CRUD - Create)
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const especialidade = selectSpecialty.value;
      const medico = selectDoctor.value;
      const data = appointmentDate.value;
      const hora = appointmentTime.value;

      // Validação básica de preenchimento dos campos obrigatórios
      if (!especialidade || !medico || !data || !hora) {
        return;
      }

      // Criar nova consulta
      const novaConsulta = {
        id: Date.now().toString(),
        paciente: usuarioLogado.nome,
        especialidade,
        medico,
        data,
        hora,
        status: 'Agendado'
      };

      // Salvar na coleção de consultas
      const todasConsultas = estado.getConsultas();
      todasConsultas.push(novaConsulta);
      estado.salvarConsultas(todasConsultas);

      // Limpar o formulário e resetar select de médicos
      appointmentForm.reset();
      selectDoctor.innerHTML = '<option value="">Selecione uma especialidade primeiro...</option>';
      selectDoctor.disabled = true;

      // Atualizar interface
      redesenharConsultas();
    });
  }

  // Desenhar consultas na inicialização da página
  redesenharConsultas();
});
