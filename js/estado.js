/**
 * Módulo de Estado da Inovare Serviços de Saúde
 * Gerencia o localStorage utilizando uma Classe ES6 com atributos privados (#).
 */
class Estado {
  // Atributos privados encapsulando os dados
  #usuarios = [];
  #consultas = [];
  #especialidades = {};

  constructor() {
    this.#inicializar();
  }

  /**
   * Inicializa o estado buscando do localStorage ou preenchendo com dados padrão da Inovare.
   */
  #inicializar() {
    const usuariosSalvos = localStorage.getItem('inovare_usuarios');
    const consultasSalvas = localStorage.getItem('inovare_consultas');
    const especialidadesSalvas = localStorage.getItem('inovare_especialidades');

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
          email: "lilian.pilatti@inovare.com.br",
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
          nome: "Gabriel Hass",
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

    // Inicializa o Mapa Completo de Especialidades
    if (!especialidadesSalvas) {
      const especialidadesIniciais = {
        "Alergia e Imunologia": ["Dra. Vania Gulin"],
        "Cardiologia": [
          "Dra. Liliana Elias Pena Pilatti",
          "Dr. Marcelo Valladão Ferreira",
          "Dr. Rubens Sirtoli Filho"
        ],
        "Cirurgia do Aparelho Digestivo": [
          "Dr. Cesar Toshio Oda",
          "Dr. Joelson José Gulin"
        ],
        "Cirurgia Geral": ["Dr. Daniel Oda"],
        "Cirurgia Plástica": ["Dr. Victor Mauro"],
        "Cirurgia Torácica": ["Dr. Magno Zanellato"],
        "Cirurgia Vascular": [
          "Dr. Bruno Figueiredo Pançan",
          "Dra. Karen Kono Miyabukuro",
          "Dr. Ricardo Zanetti Gomes"
        ],
        "Clínica Geral": [
          "Dra. Ana Paula Costa Pádua de Carvalho",
          "Dr. Luiz Henrique Strack"
        ],
        "Dermatologia": ["Dr. Giuliano Schultz Doretto Campanari"],
        "Endocrinologia": ["Dr. Alexandre Barão Acuña"],
        "Fisioterapia": ["Dra. Juliana Borato"],
        "Fonoaudiologia": ["Dra. Cíntia Simão Cenovicz"],
        "Gastroenterologia": [
          "Dra. Caroline Tatim Saad",
          "Dr. Claudio Solak",
          "Dr. Danilo Saad"
        ],
        "Ginecologia": [
          "Dra. Brenda de Almeida Aguiar",
          "Dr. Carlos Alberto Batista da Silva",
          "Dr. Edson Delfrate",
          "Dr. Eduardo Serman",
          "Dra. Isabela Baumel Mongruel",
          "Dra. Lisa Paula Fernandes Teixeira",
          "Dra. Tatyellen Dalzotto"
        ],
        "Nefrologia": ["Dr. João Felipe Lara Bueno"],
        "Neurologia": [
          "Dr. Carlos Henrique Ferreira Camargo",
          "Dr. Marcelo Tessari"
        ],
        "Nutrição": ["Paola Francielle Pavlak"],
        "Nutrologia": ["Dr. Irineu Zanellato"],
        "Odontologia": ["Dr. Roberto Kravchychyn"],
        "Oftalmologia": [
          "Dra. Fernanda Cenovicz",
          "Dr. Marcelo Cenovicz",
          "Dr. Murilo Cenovicz"
        ],
        "Ortopedia": [
          "Dr. Carlos Miers",
          "Dr. Cristiano Gatelli",
          "Dr. Daniel Cartelli",
          "Dr. Franklin Roberto Hilgemberg",
          "Dr. Luis Felipe Villas Bôas",
          "Dra. Marina Polydoro",
          "Dr. Rafael Pançan de Biaggi",
          "Dr. Rodrigo Caldonazzo Fávaro"
        ],
        "Ortopedia Pediátrica": ["Dr. Eduardo Mattos"],
        "Pediatria": ["Dra. Fabíola Moreira Baigorria"],
        "Pneumologia": ["Dr. Magno Zanellato"],
        "Psicologia": ["Dra. Thais Fernanda Silvestre"],
        "Psiquiatria": ["Dra. Kelly Melina Brito Costa"],
        "Reumatologia": ["Dr. Marcelo Schafranski"],
        "Urologia": [
          "Dr. Alisson Vinicius Emerique Fucio",
          "Dr. Carlos Heidi Koga",
          "Dr. Eduardo Bisinella"
        ]
      };
      this.#especialidades = especialidadesIniciais;
      this.salvarEspecialidades(especialidadesIniciais);
    } else {
      try {
        this.#especialidades = JSON.parse(especialidadesSalvas);
      } catch (e) {
        console.error("Erro ao ler especialidades do localStorage", e);
        this.#especialidades = {};
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

  getEspecialidades() {
    return { ...this.#especialidades };
  }

  salvarEspecialidades(especialidades) {
    this.#especialidades = { ...especialidades };
    localStorage.setItem('inovare_especialidades', JSON.stringify(this.#especialidades));
  }
}

const estado = new Estado();
export default estado;
