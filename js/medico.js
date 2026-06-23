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
  const tableWrapper = document.getElementById('table-wrapper');
  const appointmentsTbody = document.getElementById('appointments-tbody');
  const emptyAppointments = document.getElementById('empty-appointments');
  const appointmentsTotalCell = document.getElementById('appointments-total');

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

  // 3. Renderização Dinâmica dos Atendimentos do Médico
  function redesenharTabela() {
    if (!appointmentsTbody) return;

    appointmentsTbody.innerHTML = '';
    const todasConsultas = estado.getConsultas();

    // Filtrar apenas as consultas em que o nome do médico coincida com o logado
    const minhasConsultas = todasConsultas.filter(
      (c) => c.medico === usuarioLogado.nome
    );

    // Se o médico não possuir consultas, oculta a tabela e mostra mensagem amigável
    if (minhasConsultas.length === 0) {
      if (tableWrapper) tableWrapper.style.display = 'none';
      if (emptyAppointments) emptyAppointments.style.display = 'block';
      return;
    }

    // Exibe a tabela e esconde a mensagem vazia
    if (tableWrapper) tableWrapper.style.display = 'block';
    if (emptyAppointments) emptyAppointments.style.display = 'none';

    // Criação segura de cada linha da tabela
    minhasConsultas.forEach((consulta) => {
      const tr = document.createElement('tr');

      // Coluna: Paciente
      const tdPaciente = document.createElement('td');
      tdPaciente.textContent = consulta.paciente;
      tr.appendChild(tdPaciente);

      // Coluna: Data
      const tdData = document.createElement('td');
      tdData.textContent = formatarData(consulta.data);
      tr.appendChild(tdData);

      // Coluna: Horário
      const tdHora = document.createElement('td');
      tdHora.textContent = consulta.hora;
      tr.appendChild(tdHora);

      // Coluna: Status Atual
      const tdStatus = document.createElement('td');
      const spanStatus = document.createElement('span');
      spanStatus.className = `badge-status ${consulta.status.toLowerCase()}`;
      spanStatus.textContent = consulta.status;
      tdStatus.appendChild(spanStatus);
      tr.appendChild(tdStatus);

      // Coluna: Ações
      const tdAcoes = document.createElement('td');
      if (consulta.status === 'Agendado') {
        // Botão de Confirmar (verde)
        const btnConfirm = document.createElement('button');
        btnConfirm.className = 'btn-confirm';
        btnConfirm.textContent = 'Confirmar Atendimento';
        btnConfirm.addEventListener('click', () => {
          alterarStatusConsulta(consulta.id, 'Confirmado');
        });
        tdAcoes.appendChild(btnConfirm);

        // Botão de Cancelar (vermelho)
        const btnCancel = document.createElement('button');
        btnCancel.className = 'btn-cancel-appt';
        btnCancel.textContent = 'Cancelar Horário';
        btnCancel.addEventListener('click', () => {
          alterarStatusConsulta(consulta.id, 'Cancelado');
        });
        tdAcoes.appendChild(btnCancel);
      } else {
        // Consultas já finalizadas ou canceladas
        tdAcoes.textContent = '-';
        tdAcoes.style.textAlign = 'center';
      }
      tr.appendChild(tdAcoes);

      appointmentsTbody.appendChild(tr);
    });

    // 4. Rodapé dinâmico da tabela (Cálculo do total de atendimentos)
    if (appointmentsTotalCell) {
      appointmentsTotalCell.textContent = `Total de atendimentos: ${minhasConsultas.length}`;
    }
  }

  // Função auxiliar para formatação de data de YYYY-MM-DD para DD/MM/YYYY
  function formatarData(dataString) {
    const partes = dataString.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataString;
  }

  // 5. Atualização de Status da Consulta (CRUD - Update)
  function alterarStatusConsulta(id, novoStatus) {
    const todasConsultas = estado.getConsultas();
    const index = todasConsultas.findIndex((c) => c.id === id);
    if (index !== -1) {
      todasConsultas[index].status = novoStatus;
      estado.salvarConsultas(todasConsultas);
      redesenharTabela(); // Redesenha a tabela com os novos status e ações ocultas
    }
  }

  // Redesenhar a tabela na primeira inicialização
  redesenharTabela();
});
