// ------- INSS - TABELA ALÍQUOTA E FATOR DE DEDUÇÃO -------
// class Tabela_INSS {

//     constructor(baseCalculoINSS) {
//         this._baseCalculoINSS = baseCalculoINSS;
        
//         let faixa = 0;

//         this._baseCalculoINSS >= 0 && this._baseCalculoINSS <= 1100 ? faixa = 1
//         : this._baseCalculoINSS >= 1100.01 && this._baseCalculoINSS <= 2203.48 ? faixa = 2
//         : this._baseCalculoINSS >= 2203.43 && this._baseCalculoINSS <= 3305.22 ? faixa = 3
//         : this._baseCalculoINSS >= 3305.23 && this._baseCalculoINSS <= 6433.57 ? faixa = 4
//         : faixa = 5; // devo alterar o else caso não feche

//         switch (faixa) {
//             case 1:
//                 this._aliquotaINSS = 0.075;
//                 this._parcelaINSS = 0;
//                 break;
//             case 2:
//                 this._aliquotaINSS = 0.09;
//                 this._parcelaINSS = 1100.01 * (0.09 - 0.075);
//                 break;
//             case 3:
//                 this._aliquotaINSS = 0.12;
//                 this._parcelaINSS = 2203.43 * (0.12 - 0.09);
//                 break;
//             case 4:
//                 this._aliquotaINSS = 0.14;
//                 this._parcelaINSS = 3305.23 * (0.14 - 0.12);
//                 break;
//             // case 5:
//             //     aliquotaINSS = 0.14;
//             //     parcelaINSS = 148.708;
//             //     break;
//         }
//     }

//     get baseCalculoINSS() {
//         return this._baseCalculoINSS;
//     }

//     get aliquotaINSS() {
//         return this._aliquotaINSS;
//     }

//     get parcelaINSS() {
//         return this._parcelaINSS;
//     }
// }
