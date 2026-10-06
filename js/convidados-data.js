/* ============================================================
   Lista Oficial de Convidados — Daniel & Franciellen Maria
   ============================================================ */

const CONVIDADOS_DEFAULT_LISTA = [
  "Ana Delice & Cláudio",
  "Aniny",
  "Antônio, Iolete & Aniny",
  "Bia, Breno & Maria",
  "Edson & Cris",
  "Eliaques, Lídia, Yasmim, Everton & Felipe",
  "Elizeu & Família",
  "Fernanda",
  "Fernando, Andreza & Arthur",
  "Flávio",
  "Fleidemar, Clarice, Sarah & Benjamin",
  "Gilson & Socorro",
  "Joselma & Gabriel",
  "Julielle",
  "Julianny & Felipe",
  "Julinho, Amanda, Julia & Geraldo",
  "Junior & Francineide",
  "Kevilly",
  "Lauro & Janete",
  "Leandro & Jane Meire",
  "Luan & Cristina",
  "Luan, Cristina & Lizzie",
  "Lukas & Michele",
  "Maciel, Raquel & Oscar",
  "Maciel, Raquel, Oscar & Otávio",
  "Madalena",
  "Maeli & Maria Santiago",
  "Maria Rita, Antônio, Julia, Yasmin & Alisson",
  "Marinete, Rafaela & Miguel",
  "Mateus, Débora & Arthur",
  "Michely",
  "Neto, Beth, Chris & Rayane",
  "Paulo, Cris & Kalel",
  "Pe. Zeno",
  "Raiane, Nilo & Kauã",
  "Railson, Neyde & Família",
  "Rany Belizário",
  "Richardson, Andressa & Amélia",
  "Robson",
  "Rosilda, Juventino & Roque",
  "Rosevelt & Camila",
  "Rubens, Rosângela & Isaías",
  "Samily",
  "Sandra, Geovane & Geovana",
  "Torres & Lucidalva",
  "Valdinar & Ivonete",
  "Vitória, Otávio & Miguel",
  "Yohanan"
];

const LS_CONVIDADOS_LISTA = 'convidados_lista';

/**
 * Retorna a lista atual de convidados (do localStorage ou padrão).
 * @returns {string[]}
 */
function getConvidadosData() {
  try {
    const raw = localStorage.getItem(LS_CONVIDADOS_LISTA);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[Convidados] Erro ao ler lista do localStorage:', e);
  }
  return [...CONVIDADOS_DEFAULT_LISTA];
}

/**
 * Salva a lista de convidados no localStorage e atualiza a variável global.
 * @param {string[]} lista
 */
function saveConvidadosData(lista) {
  try {
    if (Array.isArray(lista)) {
      localStorage.setItem(LS_CONVIDADOS_LISTA, JSON.stringify(lista));
      CONVIDADOS_LISTA = lista;
    }
  } catch (e) {
    console.warn('[Convidados] Erro ao salvar lista no localStorage:', e);
  }
}

/**
 * Restaura a lista de convidados para o padrão inicial.
 * @returns {string[]}
 */
function resetarConvidadosData() {
  try {
    localStorage.removeItem(LS_CONVIDADOS_LISTA);
    CONVIDADOS_LISTA = [...CONVIDADOS_DEFAULT_LISTA];
    return CONVIDADOS_LISTA;
  } catch (e) {
    console.warn('[Convidados] Erro ao resetar lista:', e);
    return [...CONVIDADOS_DEFAULT_LISTA];
  }
}

// Inicializa a variável global com dados atualizados
var CONVIDADOS_LISTA = getConvidadosData();
