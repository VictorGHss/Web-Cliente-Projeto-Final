/**
 * Módulo de Estado da Inovare Serviços de Saúde
 * Gerencia o localStorage utilizando uma Classe ES6 com atributos privados (#).
 */
class Estado {
  // Atributos privados encapsulando os dados
  #usuarios = [];
  #consultas = [];

  constructor() {
    this.#inicializar();
  }

  /**
   * Inicializa o estado buscando do localStorage ou preenchendo com dados padrão da Inovare.
   */
  #inicializar() {
    const usuariosSalvos = localStorage.getItem('inovare_usuarios');
    const consultasSalvas = localStorage.getItem('inovare_consultas');

    // Inicializa os Usuários Padrão se vazio
    if (!usuariosSalvos) {
      const usuariosIniciais = [
        {
          email: "admin@inovare.com.br",
          nome: "Admin Inovare",
          perfil: "admin",
          senha: "123"
        },
        {
          email: "liliana.pilatti@inovare.com.br",
          nome: "Dra. Liliana Elias Pena Pilatti",
          perfil: "medico",
          especialidade: "Cardiologia",
          senha: "123"
        },
        {
          email: "giuliano.campanari@inovare.com.br",
          nome: "Dr. Giuliano Schultz Doretto Campanari",
          perfil: "medico",
          especialidade: "Dermatologia",
          senha: "123"
        },
        {
          email: "paciente@gmail.com",
          nome: "Victor Hass",
          perfil: "paciente",
          senha: "123"
        }
      ];
      this.#usuarios = usuariosIniciais;
      this.salvarUsuarios(usuariosIniciais);
    } else {
      try {
        this.#usuarios = JSON.parse(usuariosSalvos);
      } catch (e) {
        console.error("Erro ao ler usuários do localStorage", e);
        this.#usuarios = [];
      }
    }

    // Inicializa a Lista de Consultas se vazio
    if (!consultasSalvas) {
      this.#consultas = [];
      this.salvarConsultas([]);
    } else {
      try {
        this.#consultas = JSON.parse(consultasSalvas);
      } catch (e) {
        console.error("Erro ao ler consultas do localStorage", e);
        this.#consultas = [];
      }
    }
  }

  // Métodos Públicos
  getUsuarios() {
    return [...this.#usuarios];
  }

  salvarUsuarios(usuarios) {
    this.#usuarios = [...usuarios];
    localStorage.setItem('inovare_usuarios', JSON.stringify(this.#usuarios));
  }

  getConsultas() {
    return [...this.#consultas];
  }

  salvarConsultas(consultas) {
    this.#consultas = [...consultas];
    localStorage.setItem('inovare_consultas', JSON.stringify(this.#consultas));
  }
}

const estado = new Estado();
export default estado;
