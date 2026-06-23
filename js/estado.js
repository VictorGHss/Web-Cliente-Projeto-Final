/**
 * Módulo de Estado da Inovare Serviços de Saúde
 * Gerencia o localStorage utilizando padrões ES6 e encapsulamento privado.
 */
class Estado {
  // Propriedades privadas para encapsular os dados do sistema
  #usuarios = [];
  #consultas = [];

  constructor() {
    this.#inicializar();
  }

  /**
   * Inicializa o estado buscando do localStorage ou preenchendo com dados padrão.
   */
  #inicializar() {
    const usuariosSalvos = localStorage.getItem('inovare_usuarios');
    const consultasSalvas = localStorage.getItem('inovare_consultas');

    // Inicialização de Usuários
    if (!usuariosSalvos) {
      const usuariosIniciais = [
        {
          email: 'admin@inovare.com.br',
          senha: '123',
          perfil: 'admin',
          nome: 'Administrador Geral'
        },
        {
          email: 'arnaldo@inovare.com.br',
          senha: '123',
          perfil: 'medico',
          nome: 'Dr. Arnaldo Souza',
          especialidade: 'Cardiologia'
        },
        {
          email: 'clara@inovare.com.br',
          senha: '123',
          perfil: 'medico',
          nome: 'Dra. Clara Mendes',
          especialidade: 'Pediatria'
        },
        {
          email: 'paciente@gmail.com',
          senha: '123',
          perfil: 'paciente',
          nome: 'Paciente de Teste'
        }
      ];
      this.#usuarios = usuariosIniciais;
      this.salvarUsuarios(usuariosIniciais);
    } else {
      try {
        this.#usuarios = JSON.parse(usuariosSalvos);
      } catch (error) {
        console.error('Falha ao parsear usuários do localStorage:', error);
        this.#usuarios = [];
      }
    }

    // Inicialização de Consultas
    if (!consultasSalvas) {
      const consultasIniciais = [];
      this.#consultas = consultasIniciais;
      this.salvarConsultas(consultasIniciais);
    } else {
      try {
        this.#consultas = JSON.parse(consultasSalvas);
      } catch (error) {
        console.error('Falha ao parsear consultas do localStorage:', error);
        this.#consultas = [];
      }
    }
  }

  /**
   * Retorna uma cópia da lista de usuários.
   * @returns {Array} Lista de usuários cadastrados
   */
  getUsuarios() {
    // Retorna uma cópia rasa para manter o encapsulamento seguro
    return [...this.#usuarios];
  }

  /**
   * Salva a nova lista de usuários na memória e no localStorage.
   * @param {Array} novosUsuarios - A nova lista de usuários a ser salva
   */
  salvarUsuarios(novosUsuarios) {
    if (!Array.isArray(novosUsuarios)) {
      throw new Error('O conjunto de usuários precisa ser uma lista.');
    }
    this.#usuarios = [...novosUsuarios];
    localStorage.setItem('inovare_usuarios', JSON.stringify(this.#usuarios));
  }

  /**
   * Retorna uma cópia da lista de consultas.
   * @returns {Array} Lista de consultas do sistema
   */
  getConsultas() {
    return [...this.#consultas];
  }

  /**
   * Salva a nova lista de consultas na memória e no localStorage.
   * @param {Array} novasConsultas - A nova lista de consultas a ser salva
   */
  salvarConsultas(novasConsultas) {
    if (!Array.isArray(novasConsultas)) {
      throw new Error('O conjunto de consultas precisa ser uma lista.');
    }
    this.#consultas = [...novasConsultas];
    localStorage.setItem('inovare_consultas', JSON.stringify(this.#consultas));
  }
}

// Instanciação e exportação de um Singleton para garantir que o estado seja compartilhado entre os arquivos
const estado = new Estado();
export default estado;
