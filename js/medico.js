import estado from './estado.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Proteção de Rota Interna e Validação de Sessão
  const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  if (!usuarioLogado || usuarioLogado.perfil !== 'medico') {
    window.location.href = 'index.html';
    return;
  }

  // 2. Elementos da Interface
  const doctorInfoSpan = document.getElementById('doctor-info');
  const btnLogout = document.getElementById('btn-logout');
  
  const mobileCardsWrapper = document.getElementById('mobile-cards-wrapper');
  const desktopTableWrapper = document.getElementById('desktop-table-wrapper');
  const appointmentsTbody = document.getElementById('appointments-tbody');
  const appointmentsTotalContainer = document.getElementById('appointments-total-container');
  const emptyAppointments = document.getElementById('empty-appointments');

  // Preencher dados dinâmicos do cabeçalho
  if (doctorInfoSpan) {
    const especialidade = usuarioLogado.especialidade || 'Geral';
    doctorInfoSpan.textContent = `${usuarioLogado.nome} | Especialidade: ${especialidade}`;
  }

  // Configuração de Logout
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem('usuarioLogado');
      window.location.href = 'index.html';
    });
  }

  // 3. Renderização Dinâmica (Dual Display: Cards no Mobile e Tabela no Desktop)
  function redesenharAgenda() {
    if (!appointmentsTbody || !mobileCardsWrapper) return;

    // Limpar ambos os contêineres antes de renderizar
    appointmentsTbody.innerHTML = '';
    mobileCardsWrapper.innerHTML = '';

    const todasConsultas = estado.getConsultas();

    // Filtrar consultas correspondentes ao médico logado
    const minhasConsultas = todasConsultas.filter(
      (c) => c.medico === usuarioLogado.nome
    );

    // Se o médico não tiver consultas na agenda
    if (minhasConsultas.length === 0) {
      if (mobileCardsWrapper) mobileCardsWrapper.style.display = 'none';
      if (desktopTableWrapper) desktopTableWrapper.style.display = 'none';
      if (appointmentsTotalContainer) appointmentsTotalContainer.style.display = 'none';
      if (emptyAppointments) emptyAppointments.style.display = 'block';
      return;
    }

    // Exibe os contêineres (limpando o display: none inline para as classes CSS tomarem conta da visibilidade)
    if (mobileCardsWrapper) mobileCardsWrapper.style.display = '';
    if (desktopTableWrapper) desktopTableWrapper.style.display = '';
    if (appointmentsTotalContainer) appointmentsTotalContainer.style.display = 'block';
    if (emptyAppointments) emptyAppointments.style.display = 'none';

    // Gerar elementos para ambos os modos de exibição
    minhasConsultas.forEach((consulta) => {
      const dataFormatada = formatarData(consulta.data);

      // --- MODO 1: TABELA (DESKTOP) ---
      const tr = document.createElement('tr');

      const tdPaciente = document.createElement('td');
      tdPaciente.textContent = consulta.paciente;
      tr.appendChild(tdPaciente);

      const tdData = document.createElement('td');
      tdData.textContent = dataFormatada;
      tr.appendChild(tdData);

      const tdHora = document.createElement('td');
      tdHora.textContent = consulta.hora;
      tr.appendChild(tdHora);

      const tdStatusTable = document.createElement('td');
      const spanStatusTable = document.createElement('span');
      spanStatusTable.className = `badge-status ${consulta.status.toLowerCase()}`;
      spanStatusTable.textContent = consulta.status;
      tdStatusTable.appendChild(spanStatusTable);
      tr.appendChild(tdStatusTable);

      const tdAcoesTable = document.createElement('td');
      if (consulta.status === 'Agendado') {
        const btnConfirmTable = document.createElement('button');
        btnConfirmTable.className = 'btn-confirm';
        btnConfirmTable.textContent = 'Confirmar Atendimento';
        btnConfirmTable.addEventListener('click', () => {
          alterarStatusConsulta(consulta.id, 'Confirmado');
        });
        tdAcoesTable.appendChild(btnConfirmTable);

        const btnCancelTable = document.createElement('button');
        btnCancelTable.className = 'btn-cancel-appt';
        btnCancelTable.textContent = 'Cancelar Horário';
        btnCancelTable.addEventListener('click', () => {
          alterarStatusConsulta(consulta.id, 'Cancelado');
        });
        tdAcoesTable.appendChild(btnCancelTable);
      } else {
        tdAcoesTable.textContent = '-';
        tdAcoesTable.style.textAlign = 'center';
      }
      tr.appendChild(tdAcoesTable);
      appointmentsTbody.appendChild(tr);

      // --- MODO 2: CARDS VERTICAIS (MOBILE) ---
      const card = document.createElement('article');
      card.className = 'appointment-doctor-card';

      // Nome do Paciente
      const pPaciente = document.createElement('p');
      const strongPaciente = document.createElement('strong');
      strongPaciente.textContent = 'Paciente';
      const spanPaciente = document.createElement('span');
      spanPaciente.textContent = consulta.paciente;
      pPaciente.appendChild(strongPaciente);
      pPaciente.appendChild(spanPaciente);
      card.appendChild(pPaciente);

      // Data e Horário
      const pDataHora = document.createElement('p');
      const strongDataHora = document.createElement('strong');
      strongDataHora.textContent = 'Data/Hora';
      const spanDataHora = document.createElement('span');
      spanDataHora.textContent = `${dataFormatada} às ${consulta.hora}`;
      pDataHora.appendChild(strongDataHora);
      pDataHora.appendChild(spanDataHora);
      card.appendChild(pDataHora);

      // Status
      const pStatusCard = document.createElement('p');
      const strongStatusCard = document.createElement('strong');
      strongStatusCard.textContent = 'Status';
      const spanStatusCard = document.createElement('span');
      spanStatusCard.className = `badge-status ${consulta.status.toLowerCase()}`;
      spanStatusCard.textContent = consulta.status;
      pStatusCard.appendChild(strongStatusCard);
      pStatusCard.appendChild(spanStatusCard);
      card.appendChild(pStatusCard);

      // Ações no Card
      if (consulta.status === 'Agendado') {
        const divAcoesCard = document.createElement('div');
        divAcoesCard.className = 'card-actions';

        const btnConfirmCard = document.createElement('button');
        btnConfirmCard.className = 'btn-confirm';
        btnConfirmCard.textContent = 'Confirmar Atendimento';
        btnConfirmCard.addEventListener('click', () => {
          alterarStatusConsulta(consulta.id, 'Confirmado');
        });
        divAcoesCard.appendChild(btnConfirmCard);

        const btnCancelCard = document.createElement('button');
        btnCancelCard.className = 'btn-cancel-appt';
        btnCancelCard.textContent = 'Cancelar Horário';
        btnCancelCard.addEventListener('click', () => {
          alterarStatusConsulta(consulta.id, 'Cancelado');
        });
        divAcoesCard.appendChild(btnCancelCard);

        card.appendChild(divAcoesCard);
      }

      mobileCardsWrapper.appendChild(card);
    });

    // 4. Atualizar Totalizador Geral
    if (appointmentsTotalContainer) {
      appointmentsTotalContainer.textContent = `Total de atendimentos: ${minhasConsultas.length}`;
    }
  }

  // Função auxiliar para formatar data de YYYY-MM-DD para DD/MM/YYYY
  function formatarData(dataString) {
    const partes = dataString.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataString;
  }

  // 5. Alteração de Status no CRUD (Update)
  function alterarStatusConsulta(id, novoStatus) {
    const todasConsultas = estado.getConsultas();
    const index = todasConsultas.findIndex((c) => c.id === id);
    if (index !== -1) {
      todasConsultas[index].status = novoStatus;
      estado.salvarConsultas(todasConsultas);
      redesenharAgenda(); // Recarrega ambas as visões com os novos status salvos
    }
  }

  // Carregar dados iniciais
  redesenharAgenda();
});
