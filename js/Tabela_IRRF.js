// ------- IRRF - TABELA ALÍQUOTA E FATOR DE DEDUÇÃO -------
// class Tabela_IRRF {

//     constructor(saldoSalario, proporcionalDecimoTerc) {
//         this._baseCalculoIRRF = saldoSalario + proporcionalDecimoTerc;
        
//         let faixa = 0;

//         this._baseCalculoIRRF >= 0 && this._baseCalculoIRRF <= 1903.98 ? faixa = 1
//         : this._baseCalculoIRRF >= 1903.99 && this._baseCalculoIRRF <= 2826.65 ? faixa = 2
//         : this._baseCalculoIRRF >= 2826.66 && this._baseCalculoIRRF <= 3751.05 ? faixa = 3
//         : this._baseCalculoIRRF >= 3751.06 && this._baseCalculoIRRF <= 4664.68 ? faixa = 4
//         : faixa = 5;

//         switch (faixa) {
//             case 1:
//                 this._aliquotaIRRF = 0.075;
//                 this._parcelaIRRF = 0;
//                 break;
//             case 2:
//                 this._aliquotaIRRF = 0.15;
//                 this._parcelaIRRF = 142.80;
//                 break;
//             case 3:
//                 this._aliquotaIRRF = 0.225;
//                 this._parcelaIRRF = 354.80;
//                 break;
//             case 4:
//                 this._aliquotaIRRF = 0.275;
//                 this._parcelaIRRF = 636.13;
//                 break;
//             case 5:
//                 this._aliquotaIRRF = 0.14;
//                 this._parcelaIRRF = 869.36;
//                 break;
//         }
//     }

//     get baseCalculoIRRF() {
//         return this._baseCalculoIRRF;
//     }

//     get aliquotaIRRF() {
//         return this._aliquotaIRRF;
//     }

//     get aliquotaIRRF() {
//         return this._parcelaIRRF;
//     }
// }