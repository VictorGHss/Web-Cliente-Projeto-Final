/**
 * Módulo de Gerenciamento de Especialidades Médicas da Inovare
 * Gerencia a lista de médicos por especialidade em localStorage.
 */
export default class GerenciadorMedicos {
  // Atributo privado encapsulando o mapa de especialidades
  #especialidades = {};

  constructor() {
    this.#inicializar();
  }

  /**
   * Inicializa o mapa a partir do localStorage ou preenche com a base padrão de médicos da Inovare.
   */
  #inicializar() {
    const especialidadesSalvas = localStorage.getItem('inovare_especialidades');

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
      this.#salvarNoStorage();
    } else {
      try {
        this.#especialidades = JSON.parse(especialidadesSalvas);
      } catch (error) {
        console.error("Falha ao parsear especialidades do localStorage:", error);
        this.#especialidades = {};
      }
    }
  }

  /**
   * Salva a coleção de especialidades atualizada no localStorage.
   */
  #salvarNoStorage() {
    localStorage.setItem('inovare_especialidades', JSON.stringify(this.#especialidades));
  }

  /**
   * Retorna uma cópia limpa do mapa de especialidades.
   * @returns {Object} Mapa de especialidades e médicos associados
   */
  getEspecialidades() {
    return JSON.parse(JSON.stringify(this.#especialidades));
  }

  /**
   * Retorna os médicos cadastrados para uma determinada especialidade.
   * @param {string} especialidade - Nome da especialidade médica
   * @returns {Array} Lista de nomes de médicos
   */
  getMedicosPorEspecialidade(especialidade) {
    const medicos = this.#especialidades[especialidade];
    return medicos ? [...medicos] : [];
  }

  /**
   * Adiciona o nome de um médico à lista de uma determinada especialidade no localStorage.
   * @param {string} especialidade - Nome da especialidade médica
   * @param {string} nomeMedico - Nome do médico a ser adicionado
   */
  adicionarMedicoAIEspecialidade(especialidade, nomeMedico) {
    if (!this.#especialidades[especialidade]) {
      this.#especialidades[especialidade] = [];
    }
    // Evita duplicidades
    if (!this.#especialidades[especialidade].includes(nomeMedico)) {
      this.#especialidades[especialidade].push(nomeMedico);
      this.#salvarNoStorage();
    }
  }
}
