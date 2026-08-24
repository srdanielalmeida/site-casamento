/* ==========================================================================
   PRESENTES DATA — Dados dos presentes e Ícones Heráldicos/Customizados
   ========================================================================== */

/**
 * Mapa de Ícones SVG personalizados para categorias
 */
const CATEGORY_SVGS = {
  todos: `<svg viewBox="0 0 52 52" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M31.6,21.6c-1.2,0-2.2-1-2.2-2.2V5.5c0-1.2,1-2.2,2.2-2.2h14.2c1.2,0,2.2,1,2.2,2.2v13.9c0,1.2-1,2.2-2.2,2.2H31.6z"/><path d="M37.7,29.8l-8.2,8.9c-0.5,0.5-0.5,1.3,0,1.9l8.2,8.9c0.5,0.6,1.5,0.6,2,0l8.2-8.9c0.5-0.5,0.5-1.3,0-1.9l-8.2-8.9C39.2,29.2,38.3,29.2,37.7,29.8z"/><circle cx="13" cy="39.4" r="9.3"/><path d="M4.8,6.5l7.2-4.1c0.7-0.4,1.5-0.4,2.1,0l7.1,4.1c0.7,0.4,1.1,1.1,1.1,1.9v8.2c0,0.8-0.4,1.5-1.1,1.9l-7.1,4.1c-0.7,0.4-1.5,0.4-2.1,0l-7.2-4.1c-0.7-0.4-1.1-1.1-1.1-1.9V8.4C3.7,7.6,4.1,6.9,4.8,6.5z"/></svg>`,
  
  eletrodomesticos: `<svg viewBox="0 0 50 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6.9023438 3.9980469C5.2863438 3.9980469 3.9726562 5.3440469 3.9726562 6.9980469L3.9726562 14L32.033203 14L32.033203 7C32.033203 5.346 30.720516 4 29.103516 4L6.9023438 3.9980469 z M 9 7C9.553 7 10 7.448 10 8L10 11C10 11.552 9.553 12 9 12C8.447 12 8 11.552 8 11L8 8C8 7.448 8.447 7 9 7 z M 3.9726562 16L3.9726562 40.001953C3.9726562 41.655953 5.2872969 43.001953 6.9042969 43.001953L8 43.001953L8 45C8 45.552 8.447 46 9 46L13 46C13.553 46 14 45.552 14 45L14 43.001953L22 43L22 23C22 20.791 23.791 19 26 19L32.033203 19L32.033203 16L3.9726562 16 z M 9 19C9.553 19 10 19.448 10 20L10 24C10 24.552 9.553 25 9 25C8.447 25 8 24.552 8 24L8 20C8 19.448 8.447 19 9 19 z M 27 21C25.346 21 24 22.346 24 24L24 43C24 44.654 25.346 46 27 46L43 46C44.654 46 46 44.654 46 43L46 24C46 22.346 44.654 21 43 21L27 21 z M 38 24C38.552 24 39 24.448 39 25C39 25.552 38.552 26 38 26C37.448 26 37 25.552 37 25C37 24.448 37.448 24 38 24 z M 42 24C42.552 24 43 24.448 43 25C43 25.552 42.552 26 42 26C41.448 26 41 25.552 41 25C41 24.448 41.448 24 42 24 z M 35 29C38.309 29 41 31.691 41 35C41 38.309 38.309 41 35 41C31.691 41 29 38.309 29 35C29 31.691 31.691 29 35 29 z M 35 31 A 4 4 0 0 0 35 39 A 4 4 0 0 0 35 31 z"/></svg>`,
  
  moveis: `<svg viewBox="-1.5 0 19 19" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2.461 7.02a1.61 1.61 0 0 1 1.61 1.611v2.456h7.857V8.63a1.61 1.61 0 1 1 1.988 1.566v4.634a.476.476 0 0 1-.475.475H2.559a.476.476 0 0 1-.475-.475v-4.634A1.61 1.61 0 0 1 2.46 7.02zm1.059-.894a2.68 2.68 0 0 0-.227-.084V4.669A1.111 1.111 0 0 1 4.4 3.56h7.198a1.111 1.111 0 0 1 1.108 1.109v1.373a2.679 2.679 0 0 0-.227.084 2.717 2.717 0 0 0-1.66 2.505v1.347H5.18V8.631a2.72 2.72 0 0 0-1.66-2.505z"/></svg>`,
  
  cozinha: `<svg viewBox="0 0 55 55" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g><path d="M54.5,40h-6V18.459C48.5,8.453,40.253,0,30.492,0l-0.235,0.002C20.466,0.134,12.5,8.207,12.5,18v4.304 c-1.34-0.965-2.965-1.502-4.612-1.502c-1.635,0-3.17,0.515-4.441,1.488c-1.72,1.317-2.787,3.311-2.93,5.468 c-0.143,2.164,0.648,4.279,2.178,5.809c0.054,0.053,5.396,5.306,8.294,8.04c0.961,0.908,1.512,2.19,1.512,3.518V47h36v-1h6V40z M24.207,44.293l-1.414,1.414L21,43.914l-1.793,1.793l-1.414-1.414l1.793-1.793l-1.793-1.793l1.414-1.414L21,41.086l1.793-1.793 l1.414,1.414L22.414,42.5L24.207,44.293z M25,35.914l-1.793,1.793l-1.414-1.414l1.793-1.793l-1.793-1.793l1.414-1.414L25,33.086 l1.793-1.793l1.414,1.414L26.414,34.5l1.793,1.793l-1.414,1.414L25,35.914z M34.207,44.293l-1.414,1.414L31,43.914l-1.793,1.793 l-1.414-1.414l1.793-1.793l-1.793-1.793l1.414-1.414L31,41.086l1.793-1.793l1.414,1.414L32.414,42.5L34.207,44.293z M34.207,37.707 l-1.414-1.414l1.793-1.793l-1.793-1.793l1.414-1.414L36,33.086l1.793-1.793l1.414,1.414L37.414,34.5l1.793,1.793l-1.414,1.414 L36,35.914L34.207,37.707z M44.207,44.293l-1.414,1.414L41,43.914l-1.793,1.793l-1.414-1.414l1.793-1.793l-1.793-1.793l1.414-1.414 L41,41.086l1.793-1.793l1.414,1.414L42.414,42.5L44.207,44.293z M52.5,44h-4v-2h4V44z"/><rect x="12.5" y="49" width="36" height="6"/></g></svg>`,
  
  cama: `<svg viewBox="0 0 50 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5 10C3.347656 10 2 11.347656 2 13L2 26.8125C3.296875 25.6875 4.9375 24.777344 7 24.0625L7 20C7 17.339844 11.542969 17 15.5 17C19.457031 17 24 17.339844 24 20L24 22C24.335938 21.996094 24.65625 22 25 22C25.34375 22 25.664063 21.996094 26 22L26 20C26 17.339844 30.542969 17 34.5 17C38.457031 17 43 17.339844 43 20L43 24.03125C45.058594 24.742188 46.691406 25.671875 48 26.8125L48 13C48 11.347656 46.652344 10 45 10 Z M 25 24C5.90625 24 -0.015625 27.53125 0 37L50 37C50.015625 27.46875 44.09375 24 25 24 Z M 0 39L0 50L7 50L7 46C7 44.5625 7.5625 44 9 44L41 44C42.4375 44 43 44.5625 43 46L43 50L50 50L50 39Z"/></svg>`,
  
  mesa: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21,2H3A1,1,0,0,0,3,4H4V21a1,1,0,0,0,2,0V11H18V21a1,1,0,0,0,2,0V4h1a1,1,0,0,0,0-2ZM14,8H10a1,1,0,0,1,0-2h4a1,1,0,0,1,0,2Z"/></svg>`,
  
  banho: `<svg viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 3.5C2 2.11929 3.11929 1 4.5 1H6V2H7V0H4.5C2.567 0 1 1.567 1 3.5V7H0V8H1V9.5C1 11.2632 2.30385 12.7219 4 12.9646V15H5V13H10V15H11V12.9646C12.6961 12.7219 14 11.2632 14 9.5V8H15V7H2V3.5Z"/><path d="M8 4H5V3H8V4Z"/></svg>`,

  diversos: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15zM5 8.9v6.7l6 3.38V12.3L5 8.9zm14 6.7V8.9l-6 3.4v6.68l6-3.38z"/></svg>`
};

/**
 * Retorna o SVG correspondente à categoria ou seu fallback
 */
function getCategoryIconSvg(categoryId, customIcon) {
  if (categoryId && CATEGORY_SVGS[categoryId]) {
    return CATEGORY_SVGS[categoryId];
  }
  if (customIcon) {
    if (customIcon.trim().startsWith('<svg')) {
      return customIcon;
    }
    if (CATEGORY_SVGS[customIcon.toLowerCase()]) {
      return CATEGORY_SVGS[customIcon.toLowerCase()];
    }
    return customIcon;
  }
  return CATEGORY_SVGS.todos;
}

const PRESENTES_DEFAULT_DATA = {
  "categories": [
    {
      "id": "eletrodomesticos",
      "name": "Eletrodomésticos",
      "icon": "eletrodomesticos"
    },
    {
      "id": "moveis",
      "name": "Móveis",
      "icon": "moveis"
    },
    {
      "id": "cozinha",
      "name": "Cozinha",
      "icon": "cozinha"
    },
    {
      "id": "cama",
      "name": "Cama",
      "icon": "cama"
    },
    {
      "id": "banho",
      "name": "Banho",
      "icon": "banho"
    },
    {
      "id": "diversos",
      "name": "Diversos",
      "icon": "📦"
    }
  ],
  "items": [
    {
      "id": 1,
      "name": "Máquina de Lavar Electrolux 13kg Cesto Inox LDA13",
      "image": "",
      "link": "https://meli.la/2Nkjpde",
      "category": "eletrodomesticos",
      "coupon": ""
    },
    {
      "id": 2,
      "name": "Micro-ondas Electrolux 36L Efficient ME36B",
      "image": "",
      "link": "https://meli.la/1fXrNjP",
      "category": "eletrodomesticos",
      "coupon": ""
    },
    {
      "id": 3,
      "name": "Geladeira Brastemp Frost Free 385L Duplex BRM46MB",
      "image": "",
      "link": "https://meli.la/31ckSg7",
      "category": "eletrodomesticos",
      "coupon": ""
    },
    {
      "id": 4,
      "name": "Ar Condicionado Split Inverter TCL 12000 BTUs",
      "image": "",
      "link": "https://meli.la/1s8jazq",
      "category": "eletrodomesticos",
      "coupon": ""
    },
    {
      "id": 5,
      "name": "Ar-condicionado Split Inverter 12000 BTU Prime Air",
      "image": "",
      "link": "https://meli.la/2BS4pS9",
      "category": "eletrodomesticos",
      "coupon": ""
    },
    {
      "id": 6,
      "name": "Cadeira Escritório Presidente Ergonômica 42 Molas Ensacadas",
      "image": "",
      "link": "https://meli.la/1p5ihHG",
      "category": "moveis",
      "coupon": ""
    },
    {
      "id": 7,
      "name": "Poltrona Amamentação Balanço Giratória com Puff",
      "image": "",
      "link": "https://meli.la/1LhJCyc",
      "category": "moveis",
      "coupon": ""
    },
    {
      "id": 8,
      "name": "Panela de Pressão Brinox 4,2L Vanilla",
      "image": "",
      "link": "https://meli.la/2ycxPcb",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 9,
      "name": "Jogo Talheres Faqueiro Búzios 24 Peças Tramontina",
      "image": "",
      "link": "https://meli.la/17gPHkE",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 10,
      "name": "Smart Tv Philco 50 4k",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_753324-MLA108743670040_032026-F.webp",
      "link": "https://meli.la/1YQ1o9k",
      "category": "eletrodomesticos",
      "coupon": ""
    },
    {
      "id": 11,
      "name": "Jogo 6 Copos Altos Em Vidro",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_758959-MLA95688831129_102025-F.webp",
      "link": "https://meli.la/1zucUwy",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 12,
      "name": "Forma Bolo Brinox Ceramic Life Bakeware 19,5cm 2,2l",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_919948-MLA107980347340_032026-F.webp",
      "link": "https://meli.la/2eb3MVb",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 13,
      "name": "Jarra Vidro Resistente 1,5litro",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_698065-MLB116185657701_082026-F-jarra-vidro-resistente-15litro-agua-suco-cha-transparente.webp",
      "link": "https://meli.la/2Ra34Lg",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 14,
      "name": "Kit 2 Jarras de Vidro 1 Litro com Tampa",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_745999-MLA81448788575_122024-F.webp",
      "link": "https://meli.la/1BrN9RG",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 15,
      "name": "Conjunto Jarra e 6 Taças Siciliano Hand Painting 1,5/240ml Cristal Lyor",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_811252-MLA111186663072_052026-F.webp",
      "link": "https://meli.la/1W7AJBq",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 16,
      "name": "Jogo Sobremesa/salada Bowls - 7 peças",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_724624-MLA107120830939_022026-F.webp",
      "link": "https://meli.la/2EX84qi",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 17,
      "name": "Jogo De 6 Xícaras Com Pires De Vidro 220ml",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_883641-MLA109238569962_042026-F.webp",
      "link": "https://meli.la/2v2ojAg",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 18,
      "name": "Mop Giratório Balde 13l Esfregão",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_713585-MLA114752395636_082026-F.webp",
      "link": "https://meli.la/1JnnCpt",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 19,
      "name": "Kit 10 Porta Mantimentos Hermetico",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_922611-MLA112197164369_052026-F.webp",
      "link": "https://meli.la/1VSDxhb",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 20,
      "name": "Kit 10 Pote De Vidro Marmita Hermético 370ml",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_605578-MLA113633610823_062026-F.webp",
      "link": "https://meli.la/18FUXVr",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 21,
      "name": "Kit Jogo Lençol De Cama Queen 4 Peças",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_769844-MLB83355346054_042025-F-kit-jogo-lencol-de-cama-ponto-palito-queen-percal-4-pecas.webp",
      "link": "https://meli.la/2zxSxkh",
      "category": "cama",
      "coupon": ""
    },
    {
      "id": 22,
      "name": "Kit Jogo Lençol De Cama Queen 4 Peças",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_720581-MLB83646703719_042025-F-kit-jogo-lencol-de-cama-ponto-palito-queen-percal-4-pecas.webp",
      "link": "https://meli.la/2zxSxkh",
      "category": "cama",
      "coupon": ""
    },
    {
      "id": 23,
      "name": "Jogo De Lençol 4 Peças Completo 100% Algodão",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_786947-MLB113206495055_062026-F-jogo-de-lencol-4-pecas-completo-100-algodao-teka.webp",
      "link": "https://meli.la/2eNaW1t",
      "category": "cama",
      "coupon": ""
    },
    {
      "id": 24,
      "name": "Panela De Pressão Antiaderente",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_899517-MLA95835507849_102025-F.webp",
      "link": "https://meli.la/2RHHZ9c",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 25,
      "name": "Kit Edredom Casal 300 Fios Com Fronhas 3 Peças",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_724720-MLB96317142902_102025-F-kit-edredom-casal-mnaco-fitado-300-fios-com-fronhas-3-pecas.webp",
      "link": "https://meli.la/1FE3hPz",
      "category": "cama",
      "coupon": ""
    },
    {
      "id": 26,
      "name": "Parafusadeira E Furadeira Impacto The Black Tools Tb-21pw 3/8",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_629064-MLA114933297788_082026-F.webp",
      "link": "https://meli.la/2CdQHe3",
      "category": "eletrodomesticos",
      "coupon": ""
    },
    {
      "id": 27,
      "name": "Esmerilhadeira Lixadeira Angular Bte750 4.1/2 750w Com Discos 4.1/2",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_925184-MLA99848508979_112025-F.webp",
      "link": "https://meli.la/27sBUpB",
      "category": "eletrodomesticos",
      "coupon": ""
    },
    {
      "id": 28,
      "name": "Garrafa Térmica De Café Laradore Bird - Branca E Dourada 1l Branca",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_840557-MLA108732927628_032026-F.webp",
      "link": "https://meli.la/2SCUsc8",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 29,
      "name": "Jogo Toalhas Banho E Rosto Grossas Macias 100% Algodão 4pçs",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_826474-MLB113641401862_072026-F-jogo-toalhas-banho-e-rosto-grossas-macias-100-algodo-4pcs.webp",
      "link": "https://meli.la/2Gw11Tf",
      "category": "banho",
      "coupon": ""
    },
    {
      "id": 30,
      "name": "Chaleira Wood 2,5 Litros Preta Em Aço Inoxidável",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_679547-MLA95691984446_102025-F.webp",
      "link": "https://meli.la/2LzghSg",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 31,
      "name": "3 Potes Vidro Tampa Vedação 960ml",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_684379-MLB114001784571_072026-F-3-potes-vidro-tampa-vedacao-960ml-mantimentos-decorar-doces.webp",
      "link": "https://meli.la/1Tit3BQ",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 32,
      "name": "Panela De Barro Capixaba 5l",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_664562-MLB112723272154_062026-F-panela-de-barro-capixaba-5l--estilo-cacarola.webp",
      "link": "https://meli.la/2aW7uZn",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 33,
      "name": "Tapetes E Passadeira 3 Peças Em Tear",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_950133-MLB85599759555_062025-F-tapetes-e-passadeira-3-pecas-em-tear-para-cozinha-axia-luxo.webp",
      "link": "https://meli.la/1JiG9Kd",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 34,
      "name": "Kit Tapetes De Cozinha 3 Peças 100% Algodão Natural Lavável",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_677040-MLA106755826652_022026-F.webp",
      "link": "https://meli.la/2Lj71ew",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 35,
      "name": "Caminho De Mesa Guipir 120-150-180-220cm Bordado Floral",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_661411-MLB110964401583_042026-F-caminho-de-mesa-guipir-120150180220cm-bordado-floral.webp",
      "link": "https://meli.la/2hXdswb",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 36,
      "name": "Toalha De Mesa Jacquard Inglês 6 Lugares",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_640954-MLB113034152409_062026-F-toalha-de-mesa-luxo-jacquard-ingls-6-lugares-retangular.webp",
      "link": "https://meli.la/1vvcrdo",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 37,
      "name": "Jogo 6 Taças De Vidro Com Fio De Ouro Diamond Lyor 325ml",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_847505-MLA95135075713_102025-F.webp",
      "link": "https://meli.la/131eW5q",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 38,
      "name": "Jogo 6 Copos Diamond 370ml Vidro Borda Dourada",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_892816-MLB112442903453_052026-F-jogo-6-copos-diamond-370ml-vidro-borda-dourada-copo-alto.webp",
      "link": "https://meli.la/2p1BQS9",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 39,
      "name": "Batedeira Prática Mondial 400W B-44 W",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_947888-MLA99469844446_112025-F.webp",
      "link": "https://meli.la/2Aes2mY",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 40,
      "name": "Ferro de Passar a Seco Mondial 1200W - FSN-55-B",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_871328-MLA99520020802_112025-F.webp",
      "link": "https://meli.la/2rqS963",
      "category": "eletrodomesticos",
      "coupon": ""
    },
    {
      "id": 41,
      "name": "Kit Jogo De Facas Inox Corte Afiado Antiaderente",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_660590-MLA80651394783_112024-F.webp",
      "link": "https://meli.la/2znG5xi",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 42,
      "name": "Kit 6 Peças Jogo Americano Redondo",
      "image": "https://m.media-amazon.com/images/I/817E+s-F2gL._AC_SL1254_.jpg",
      "link": "https://link.amazon/B07MRBG5P",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 43,
      "name": "Rolo de Massa em Madeira Natural",
      "image": "https://m.media-amazon.com/images/I/518IFou+UEL._AC_SL1254_.jpg",
      "link": "https://link.amazon/B09SUw7I9",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 44,
      "name": "Purificador De Água Ibbl E-due",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_620308-MLA99408879964_112025-F.webp",
      "link": "https://meli.la/2gr8GQ6",
      "category": "eletrodomesticos",
      "coupon": ""
    },
    {
      "id": 46,
      "name": "Kit 2 Travesseiro Premium 70cm x 50cm Antialérgico",
      "image": "https://a-static.mlcdn.com.br/800x560/kit-2-travesseiro-premium-pena-de-ganso-70cm-x-50cm-antialergico-rt-enxovais/rtenxovais/kit-2-travesseiro/751ec93fdc00005033b2d050959d00d1.jpeg",
      "link": "https://magazineluiza.onelink.me/589508454/3w2m3g1m",
      "category": "cama",
      "coupon": ""
    },
    {
      "id": 47,
      "name": "Jogo de Lençol KING 400 Fios 3 Peças Bordado",
      "image": "https://a-static.mlcdn.com.br/800x560/jogo-de-lencol-king-400-fios-3-pecas-bordado-ingles-roupa-de-cama-tecido-macio-aveludado-studio-casa/studiocasaibitinga/inglesking-bege/f2a231aa2adc0e483c56c137bcfbd95e.jpeg",
      "link": "https://magazineluiza.onelink.me/589508454/u812oojb",
      "category": "cama",
      "coupon": ""
    },
    {
      "id": 48,
      "name": "Pillow Top Ortobom Premium Casal",
      "image": "https://m.media-amazon.com/images/I/715Lo8T7ojL._AC_SL1500_.jpg",
      "link": "https://link.amazon/B01ciQ7xq",
      "category": "cama",
      "coupon": ""
    },
    {
      "id": 49,
      "name": "Barraca de camping de 2500mm",
      "image": "https://m.media-amazon.com/images/I/51RWzAbJbrL._AC_SL1000_.jpg",
      "link": "https://link.amazon/B0aoO4yRv",
      "category": "diversos",
      "coupon": ""
    },
    {
      "id": 50,
      "name": "Mala De Viagem Média 23Kg Polipropileno",
      "image": "https://m.media-amazon.com/images/I/61tq-aEwcxL._AC_SL1500_.jpg",
      "link": "https://link.amazon/B07unjgyp",
      "category": "diversos",
      "coupon": ""
    },
    {
      "id": 51,
      "name": "Escorredor de Louça 2 Andares Preto em Aço Inox com Drenagem",
      "image": "https://m.media-amazon.com/images/I/71SK8Mhoc4L._AC_SL1254_.jpg",
      "link": "https://link.amazon/B0bYHnkmp",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 52,
      "name": "Jogo Tapete Banheiro 3 Peças Atoalhado Bordado",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_670907-MLA103875881681_012026-F-jogo-tapete-banheiro-3-pecas-atoalhado-bordado-fabricante.webp",
      "link": "https://meli.la/1fQRc8F",
      "category": "banho",
      "coupon": ""
    },
    {
      "id": 53,
      "name": "Passadeira Tapete Tear Algodão Boho Artesanal 0,55x2,00 Cru",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_817714-MLB93832964029_092025-F-passadeira-tapete-tear-algodao-boho-artesanal-055x200-cru.webp",
      "link": "https://meli.la/111eEqQ",
      "category": "diversos",
      "coupon": ""
    },
    {
      "id": 54,
      "name": "Cobertor Casal Queen King",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_809594-MLB87784459766_072025-F-cobertor-casal-queen-king-manta-toque-de-seda-macio-quente.webp",
      "link": "https://meli.la/2Hw13Ua",
      "category": "cama",
      "coupon": ""
    },
    {
      "id": 55,
      "name": "Cestos de fermentação banneton Kook",
      "image": "https://m.media-amazon.com/images/I/81-QmJ2KRAL._AC_SL1500_.jpg",
      "link": "https://link.amazon/B03xfFRVv",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 56,
      "name": "Kit 50 Cabides Kparts Aveludado Preto",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_882454-MLB94573224655_102025-F-kit-50-cabides-kparts-aveludado-preto-e-cinza-bege.webp",
      "link": "https://meli.la/2LoHP3m",
      "category": "diversos",
      "coupon": ""
    },
    {
      "id": 57,
      "name": "Jogo De Facas 14 Peças, Branco Cremoso, Com Bloco E Tesoura",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_637463-MLB115281894693_072026-F-jogo-de-facas-14-pecas-branco-cremoso-com-bloco-e-tesoura.webp",
      "link": "https://meli.la/2M1saN8",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 58,
      "name": "Kit Cobre Leito King 3 Peças Estampado Colcha Dupla Face Floral Microfibra 150 Fios",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_618417-MLA112379513991_052026-F.webp",
      "link": "https://meli.la/1DC3g1s",
      "category": "cama",
      "coupon": ""
    },
    {
      "id": 59,
      "name": "Jogo De Cama Casal Buddemeyer Cotton Essential Cor Bege",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_828990-MLA96666146780_112025-F.webp",
      "link": "https://meli.la/2NqLuAG",
      "category": "cama",
      "coupon": ""
    },
    {
      "id": 60,
      "name": "Cortina De Linho Palha Off White 4,00x2,80 Trilho Suiço Maxi",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_862265-MLB112580605146_062026-F-cortina-de-linho-palha-off-white-400x280-trilho-suico-maxi.webp",
      "link": "https://meli.la/14n6ARz",
      "category": "diversos",
      "coupon": ""
    },
    {
      "id": 61,
      "name": "Kit 12 Utensílios Para Cozinha De Aço Inox",
      "image": "http://http2.mlstatic.com/D_NQ_NP_2X_757183-MLB106924541857_022026-F-kit-12-utensilios-para-cozinha-de-aco-inox-jogo-completo.webp",
      "link": "https://meli.la/1MYvG7L",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 62,
      "name": "Jogo 6 Taças De Vidro Com Fio De Ouro Diamond Lyor 325ml",
      "image": "https://meli.la/131eW5q",
      "link": "https://http2.mlstatic.com/D_NQ_NP_2X_904427-MLA110800498109_042026-F.webp",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 63,
      "name": "Jogo Com 5 Potes De Vidro Herméticos",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_607421-MLA100085867459_122025-F.webp",
      "link": "https://meli.la/2r8xrss",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 64,
      "name": "Kit C/ 2 Potes 800ml - Estampas Açucar / Café",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_861425-MLA107996725910_032026-F.webp",
      "link": "https://meli.la/1dKbrcw",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 65,
      "name": "3 Potes Vidro Tampa Vedação 960ml",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_684379-MLB114001784571_072026-F-3-potes-vidro-tampa-vedacao-960ml-mantimentos-decorar-doces.webp",
      "link": "https://meli.la/1Tit3BQ",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 66,
      "name": "Churrasqueira Montana",
      "image": "https://m.media-amazon.com/images/I/51HLWshy3GL._AC_SL1000_.jpg",
      "link": "https://link.amazon/B09Yax3zM",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 67,
      "name": "Torradeira Arno Soleil Marfim",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_974205-MLA99451193644_112025-F.webp",
      "link": "https://meli.la/1MKi9U5",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 68,
      "name": "Churrasqueira Portátil A Carvão Zenico Mini Para Camping",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_932922-MLB114542191128_082026-F-churrasqueira-portatil-a-carvao-zenico-mini-para-camping.webp",
      "link": "https://meli.la/1R7xtXY",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 69,
      "name": "Conjunto 6 Potes Hermeticos Transparente Vasilhas Plasticas",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_834732-MLB113745102931_062026-F-conjunto-6-potes-hermeticos-transparente-vasilhas-plasticas.webp",
      "link": "https://meli.la/2HthMBd",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 70,
      "name": "Organizador De Talheres 5 Divisórias Multiuso de Acrílico",
      "image": "https://m.media-amazon.com/images/I/61ZPZA3G0IL._AC_SL1200_.jpg",
      "link": "https://link.amazon/B06bCbhJk",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 71,
      "name": "Tábua De Corte De Vidro",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_792324-MLB116318652219_082026-F-tabua-de-corte-de-vidro-facil-de-limpar-sem-cheiro.webp",
      "link": "https://meli.la/1txBpcU",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 72,
      "name": "Kit C/ 3 Unidades Escorredor de Alimentos Peneira Inox Cozinha 22/25/28cm",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_775760-MLA114599267119_072026-F.webp",
      "link": "https://meli.la/23ryGm9",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 73,
      "name": "Oxford conjunto de 3 refratárias bake branco",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_738007-MLU77890286477_072024-F.webp",
      "link": "https://meli.la/1XQLRGH",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 74,
      "name": "Kit 4 Travessa Melamina",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_714943-MLA113551530330_072026-F.webp",
      "link": "https://meli.la/1WPcP5N",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 75,
      "name": "Kit 10 Petisqueira Canoa",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_983762-MLA112753762944_062026-F.webp",
      "link": "https://meli.la/1nuSjB8",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 76,
      "name": "Jogo De Taças Bowls De Vidro Para Sobremesas",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_761806-MLB110796598632_052026-F-jogo-de-tacas-bowls-de-vidro-para-sobremesas-e-sorvete.webp",
      "link": "https://meli.la/2gjax5m",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 77,
      "name": "Kit Par De Luvas Térmicas",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_787193-MLA109288115137_032026-F.webp",
      "link": "https://meli.la/2ieMKRi",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 78,
      "name": "Kit Luva E Pegador Estampado",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_856022-MLA93802608575_092025-F.webp",
      "link": "https://meli.la/17oymn1",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 79,
      "name": "Boleira Vidro Ruvolo, Boleira com Tampa Acrílica e Pé",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_924163-MLA96079187221_102025-F.webp",
      "link": "https://meli.la/125AMvJ",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 80,
      "name": "Lixeira Cesto De Lixo 5 Litros",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_765485-MLA93302565603_092025-F.webp",
      "link": "https://meli.la/1f7adcd",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 81,
      "name": "Açucareiro Com Tampa E Colher Radial Cristal Lyor Vidro",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_891331-MLU76718158719_052024-F-acucareiro-com-tampa-e-colher-radial-cristal-lyor-vidro.webp",
      "link": "https://meli.la/2PVQUav",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 82,
      "name": "Tabua De Passar Roupa Reforçada",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_860360-MLA98972660483_112025-F.webp",
      "link": "https://meli.la/2saMEU7",
      "category": "diversos",
      "coupon": ""
    },
    {
      "id": 83,
      "name": "Bandeja De Banheiro",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_722706-MLB116144392869_082026-F-bandeja-de-banheiro-cozinha-casa-master-plus-premium.webp",
      "link": "https://meli.la/193iyoy",
      "category": "banho",
      "coupon": ""
    },
    {
      "id": 84,
      "name": "Centro De Mesa Fruteira Vidro Twist 30cm",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_855967-MLA114712592336_082026-F-centro-de-mesa-fruteira-vidro-twist-30cm-lindo--moderno.webp",
      "link": "https://meli.la/2KyHhgP",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 85,
      "name": "Fruteira Cristal Com Pé Vidro",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_783500-MLB115863491275_082026-F-fruteira-cristal-com-pe-vidro-transparente-brasilia-30cm.webp",
      "link": "https://meli.la/1MkiMGD",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 86,
      "name": "Pano de Prato Atoalhado (Kit com 6 unidades)",
      "image": "https://m.media-amazon.com/images/I/718RETFDjsL._AC_SL1350_.jpg",
      "link": "https://link.amazon/B04AZfBfI",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 87,
      "name": "Livros Coleção Patrística",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_923501-MLB94942302540_102025-F-livros-colecao-patristica-completa-teologia-padres-da-igreja.webp",
      "link": "https://meli.la/1Qc3euK",
      "category": "diversos",
      "coupon": ""
    },
    {
      "id": 89,
      "name": "Cabideiro Mancebo Arara De Roupas 10 Ganchos",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_764473-MLB81387804365_122024-F-cabideiro-mancebo-arara-de-roupas-10-ganchos-madeira-cabides.webp",
      "link": "https://meli.la/1vePYK3",
      "category": "moveis",
      "coupon": ""
    },
    {
      "id": 90,
      "name": "Armário de Cozinha Compacta",
      "image": "https://a-static.mlcdn.com.br/420x420/armario-de-cozinha-compacta-pequim-multimoveis-v2933/multimoveis2/v2933-130/12e384cd6c6d06c066cacbc0f72d53cd.jpeg",
      "link": "https://m.magazineluiza.com.br/armario-de-cozinha-compacta-pequim-multimoveis-v2933/p/ge1gdkgh47/mo/moac/?seller_id=multimoveis2&ads=patrocinado",
      "category": "moveis",
      "coupon": ""
    },
    {
      "id": 91,
      "name": "Armário de Cozinha Compacta",
      "image": "https://a-static.mlcdn.com.br/420x420/armario-de-cozinha-compacta-mp2001-sofia-multimoveis-branco/multimoveis2/mp2001-156/ce2e08832ee5d426c9a7f6e3db6f49de.jpeg",
      "link": "https://m.magazineluiza.com.br/armario-de-cozinha-compacta-mp2001-sofia-multimoveis-branco/p/dd6kbb6e5h/mo/moac/?seller_id=multimoveis2",
      "category": "moveis",
      "coupon": ""
    },
    {
      "id": 92,
      "name": "Sofá Retrátil Reclinável 3 Lugares",
      "image": "https://a-static.mlcdn.com.br/420x420/sofa-retratil-reclinavel-3-lugares-suede-phormatta-evolution-smp/magazineluiza/121927508/eb294d5c195d655154606872091ebcaf.jpg",
      "link": "https://m.magazineluiza.com.br/sofa-retratil-reclinavel-3-lugares-suede-phormatta-evolution-smp/p/121927508/mo/msof/?seller_id=magazineluiza",
      "category": "moveis",
      "coupon": ""
    },
    {
      "id": 93,
      "name": "Cortina De Renda Cozinha Copa Clássica",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_909282-MLA96130532053_102025-F.webp",
      "link": "https://meli.la/2qomm4w",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 94,
      "name": "Relógio Parede Antigo",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_992593-MLB105891562925_012026-F-relogio-parede-antigo-decoracao-antiguidades-pendulo-balanca.webp",
      "link": "https://meli.la/1pN8LH4",
      "category": "moveis",
      "coupon": ""
    },
    {
      "id": 95,
      "name": "Mini Air Fryer Gaabor Fritadeira Elétrica",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_754774-MLA99407424646_112025-F.webp",
      "link": "https://meli.la/176o9cV",
      "category": "cozinha",
      "coupon": ""
    },
    {
      "id": 96,
      "name": "Cortina Tecido Oxford Grosso 3 Metros X 2,50 Largura",
      "image": "https://http2.mlstatic.com/D_NQ_NP_2X_979994-MLB113953870235_062026-F-cortina-tecido-oxford-grosso-3-metros-x-250-largura-premium.webp",
      "link": "https://meli.la/2pYY5re",
      "category": "diversos",
      "coupon": ""
    }
  ]
};

/**
 * Retorna os dados dos presentes do cache local ou padrão.
 */
function getPresentesData() {
  try {
    const stored = localStorage.getItem('presentes_data');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.categories && parsed.items && parsed.items.length >= PRESENTES_DEFAULT_DATA.items.length) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Erro ao ler dados do localStorage, usando padrão:', e);
  }
  return PRESENTES_DEFAULT_DATA;
}

/**
 * Salva dados dos presentes no localStorage.
 */
function savePresentesData(data) {
  localStorage.setItem('presentes_data', JSON.stringify(data));
}

/* ============================================================
   SACOLA DE PRESENTES — Funções utilitárias & Sincronização
   ============================================================ */

const LS_MINHA_SACOLA          = 'presentes_minha_sacola';
const LS_COMPRADOS             = 'presentes_comprados';
const LS_COMPRADOS_PENDENTES   = 'presentes_comprados_pendentes';

/**
 * Retorna IDs dos presentes separados neste dispositivo.
 * @returns {number[]}
 */
function getSacolaIds() {
  try {
    const raw = localStorage.getItem(LS_MINHA_SACOLA);
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr.map(Number) : [];
  } catch (_) { return []; }
}

/**
 * Salva IDs da sacola no localStorage.
 * @param {number[]} ids
 */
function saveSacolaIds(ids) {
  localStorage.setItem(LS_MINHA_SACOLA, JSON.stringify((ids || []).map(Number)));
}

/**
 * Retorna lista de presentes comprados (compartilhada / local).
 * @returns {{ id: number, timestamp: string, nomeConvidado: string, audit_info?: any }[]}
 */
function getCompradosList() {
  try {
    const raw = localStorage.getItem(LS_COMPRADOS);
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr.map(item => ({ ...item, id: Number(item.id) })) : [];
  } catch (_) { return []; }
}

/**
 * Salva lista de presentes comprados no localStorage.
 */
function saveCompradosList(list) {
  const normalized = (list || []).map(item => ({ ...item, id: Number(item.id) }));
  localStorage.setItem(LS_COMPRADOS, JSON.stringify(normalized));
}

/**
 * Retorna lista de itens comprados pendentes de envio ao Supabase.
 * @returns {{ id: number, nomeConvidado: string, audit_info?: any, timestamp: string }[]}
 */
function getCompradosPendentes() {
  try {
    const raw = localStorage.getItem(LS_COMPRADOS_PENDENTES);
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr.map(item => ({ ...item, id: Number(item.id) })) : [];
  } catch (_) { return []; }
}

/**
 * Salva lista de pendências no localStorage.
 */
function saveCompradosPendentes(list) {
  localStorage.setItem(LS_COMPRADOS_PENDENTES, JSON.stringify((list || []).map(item => ({ ...item, id: Number(item.id) }))));
}

/**
 * Verifica se um item está comprado.
 * @param {number|string} id
 * @returns {boolean}
 */
function isItemComprado(id) {
  const numId = Number(id);
  return getCompradosList().some(c => Number(c.id) === numId);
}

/**
 * Tenta enviar o status de comprado de um item diretamente ao Supabase.
 * @param {number} id
 * @param {string} [nomeConvidado]
 * @param {Object|null} [auditInfo]
 * @param {string} [timestamp]
 * @returns {Promise<boolean>} Retorna true se gravou com sucesso no Supabase.
 */
async function _enviarCompraSupabase(id, nomeConvidado, auditInfo, timestamp) {
  const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (!sb) return false;

  const numId = Number(id);
  const ts = timestamp || new Date().toISOString();
  const nome = nomeConvidado || '';

  // 1ª tentativa: Payload completo com audit_info
  try {
    const payload = {
      is_purchased: true,
      purchased_by: nome,
      purchased_at: ts
    };
    if (auditInfo) {
      payload.audit_info = auditInfo;
    }

    const res = await sb.from('presentes_itens').update(payload).eq('id', numId);
    if (!res.error) {
      return true;
    }
    console.warn('[Supabase] Erro ao atualizar item com audit_info:', res.error);
  } catch (err) {
    console.warn('[Supabase] Exceção na 1ª tentativa com audit_info:', err);
  }

  // 2ª tentativa: Payload simples sem audit_info (fallback de schema)
  try {
    const res2 = await sb.from('presentes_itens').update({
      is_purchased: true,
      purchased_by: nome,
      purchased_at: ts
    }).eq('id', numId);

    if (!res2.error) {
      return true;
    }
    console.warn('[Supabase] Erro também no fallback sem audit_info:', res2.error);
  } catch (err2) {
    console.warn('[Supabase] Exceção no fallback simples:', err2);
  }

  return false;
}

/**
 * Processa a fila de compras pendentes de sincronização com o Supabase.
 */
async function processarSincronizacaoPendentes() {
  const pendentes = getCompradosPendentes();
  if (pendentes.length === 0) return;

  const restantes = [];
  for (const item of pendentes) {
    const sucesso = await _enviarCompraSupabase(item.id, item.nomeConvidado, item.audit_info, item.timestamp);
    if (!sucesso) {
      restantes.push(item);
    }
  }
  saveCompradosPendentes(restantes);
}

/**
 * Marca um item como comprado (no localStorage de forma resiliente e no Supabase).
 * @param {number|string} id
 * @param {string} [nomeConvidado] - Nome informado pelo convidado (opcional)
 * @param {Object|null} [auditInfo] - Dados de auditoria do dispositivo (coletarAuditoria)
 * @returns {Promise<boolean>}
 */
async function marcarComoComprado(id, nomeConvidado, auditInfo) {
  const numId = Number(id);
  const list = getCompradosList();
  const timestamp = new Date().toISOString();
  const nome = nomeConvidado || '';

  // 1. Grava no cache local imediatamente
  if (!list.some(c => Number(c.id) === numId)) {
    const registro = {
      id: numId,
      timestamp,
      nomeConvidado: nome,
      audit_info: auditInfo || null
    };
    list.push(registro);
    saveCompradosList(list);
  }

  // 2. Remove da sacola local
  let sacolaIds = getSacolaIds().filter(i => Number(i) !== numId);
  saveSacolaIds(sacolaIds);

  // 3. Adiciona à fila de pendências
  const pendentes = getCompradosPendentes().filter(p => Number(p.id) !== numId);
  pendentes.push({ id: numId, nomeConvidado: nome, audit_info: auditInfo || null, timestamp });
  saveCompradosPendentes(pendentes);

  // 4. Tenta sincronizar com o Supabase
  const sucessoNuvem = await _enviarCompraSupabase(numId, nome, auditInfo, timestamp);
  if (sucessoNuvem) {
    // Se a nuvem confirmou, remove da fila de pendentes
    const atualizados = getCompradosPendentes().filter(p => Number(p.id) !== numId);
    saveCompradosPendentes(atualizados);
  }

  return true;
}

/**
 * Desmarca um item como comprado (restaurar).
 * @param {number|string} id
 */
async function desmarcarComprado(id) {
  const numId = Number(id);

  // 1. Remove do cache local
  const list = getCompradosList().filter(c => Number(c.id) !== numId);
  saveCompradosList(list);

  // 2. Remove das pendências
  const pendentes = getCompradosPendentes().filter(p => Number(p.id) !== numId);
  saveCompradosPendentes(pendentes);

  // 3. Sincroniza com Supabase se disponível
  const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (sb) {
    try {
      const res = await sb.from('presentes_itens').update({
        is_purchased: false,
        purchased_by: '',
        purchased_at: null,
        audit_info: null
      }).eq('id', numId);

      if (res.error) {
        console.warn('[Supabase] Erro ao desmarcar comprado na nuvem:', res.error);
      }
    } catch (e) {
      console.warn('[Supabase] Exceção ao desmarcar comprado na nuvem:', e);
    }
  }
}

/**
 * Busca dados em nuvem do Supabase de forma assíncrona.
 * Se configurado, atualiza o cache local e retorna os dados mais recentes com MERGE NÃO-DESTRUTIVO.
 */
async function fetchPresentesDataFromSupabase() {
  const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (!sb) return getPresentesData();

  try {
    const [catsRes, itemsRes] = await Promise.all([
      sb.from('presentes_categorias').select('*').order('ordem', { ascending: true }),
      sb.from('presentes_itens').select('*').order('id', { ascending: true })
    ]);

    if (catsRes.error) throw catsRes.error;
    if (itemsRes.error) throw itemsRes.error;

    const categories = (catsRes.data && catsRes.data.length > 0) ? catsRes.data : PRESENTES_DEFAULT_DATA.categories;
    const items = (itemsRes.data && itemsRes.data.length > 0) ? itemsRes.data : PRESENTES_DEFAULT_DATA.items;

    const data = { categories, items };
    savePresentesData(data);

    // ── MERGE SEGURO DE ITENS COMPRADOS (NÃO DESTRUTIVO) ──────────────
    const compradosLocais = getCompradosList();
    const mapaComprados = new Map();

    // 1. Coloca os itens locais no mapa
    compradosLocais.forEach(item => {
      mapaComprados.set(Number(item.id), item);
    });

    // 2. Mescla itens confirmados na nuvem
    if (itemsRes.data && itemsRes.data.length > 0) {
      itemsRes.data.forEach(it => {
        const numId = Number(it.id);
        if (it.is_purchased === true) {
          mapaComprados.set(numId, {
            id: numId,
            timestamp: it.purchased_at || new Date().toISOString(),
            nomeConvidado: it.purchased_by || '',
            audit_info: it.audit_info || null
          });
        }
      });
    }

    const compradosMesclados = Array.from(mapaComprados.values());
    saveCompradosList(compradosMesclados);

    // 3. Tenta descarregar compras pendentes que ainda não subiram
    processarSincronizacaoPendentes().catch(err => {
      console.warn('[Sync] Falha ao processar pendências em segundo plano:', err);
    });

    return data;
  } catch (err) {
    console.warn('[Supabase] Falha ao buscar presentes da nuvem, usando dados completos locais:', err);
    return getPresentesData();
  }
}

/**
 * Inicia a subscrição Realtime do Supabase para a tabela presentes_itens.
 * @param {function(newRow: Object): void} onUpdate - Chamado com a nova linha
 * @returns {function(): void} Função para cancelar a subscrição
 */
function iniciarRealtimePresentes(onUpdate) {
  const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (!sb || typeof sb.channel !== 'function') return () => {};

  const channel = sb
    .channel('presentes-realtime')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'presentes_itens' },
      (payload) => {
        if (payload && payload.new) {
          const updatedRow = payload.new;
          const numId = Number(updatedRow.id);

          if (updatedRow.is_purchased === true) {
            const list = getCompradosList();
            if (!list.some(c => Number(c.id) === numId)) {
              list.push({
                id: numId,
                timestamp: updatedRow.purchased_at || new Date().toISOString(),
                nomeConvidado: updatedRow.purchased_by || '',
                audit_info: updatedRow.audit_info || null
              });
              saveCompradosList(list);
            }
          } else if (updatedRow.is_purchased === false) {
            const list = getCompradosList().filter(c => Number(c.id) !== numId);
            saveCompradosList(list);
          }

          if (typeof onUpdate === 'function') {
            onUpdate(updatedRow);
          }
        }
      }
    )
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR') {
        console.warn('[Supabase Realtime] Erro no canal presentes-realtime.');
      }
    });

  return () => {
    try { sb.removeChannel(channel); } catch (_) {}
  };
}
