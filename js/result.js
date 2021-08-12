var objRecuperado = JSON.parse(localStorage.getItem('dadosFornecidos'));
console.log(objRecuperado);

// let $ = document.querySelector.bind(document);

// ------- CONVERSÃO OBJ PARA VARIÁVEIS -------
var dataInicio = new Date(objRecuperado.data_inicio.split('-'));
var dataTermino = new Date(objRecuperado.data_termino.split('-'));
var ultimoSalario = parseFloat(objRecuperado.ultimo_salario);
var numeroDependentes = parseInt(objRecuperado.numero_dependentes);
var motivoTermino = objRecuperado.motivo_termino;
var possuiFeriasVencidas = JSON.parse(objRecuperado.ferias_vencidas);
var cumpriuAvisoPrevio = JSON.parse(objRecuperado.aviso_previo);

// ------- CONVERSÃO DE DATA -------
var diaTermino = dataTermino.getUTCDate();
var difMilissegundos = dataTermino - dataInicio;
var difSegundos = difMilissegundos / 1000;
var difMinutos = difSegundos / 60;
var difHoras = difMinutos / 60;
var difDias = difHoras / 24;
var difMeses = difDias / 30;
var difAnos = difMeses / 12;
var mesesCompletos = Math.floor(difMeses - 12);
var mesesCalcFeriasDecimo = diaTermino > 14 ? mesesCompletos + 1 : mesesCompletos;

// ------- VARIÁVEIS -------
var aliquotaINSS = 0;
var aliquotaINSSDec = 0;
var aliquotaINSSAP = 0;
var parcelaINSS = 0;
var aliquotaIRRF = 0;
var aliquotaIRRFDec = 0;
var parcelaIRRF = 0;
var baseCalculoIRRF = 0;
var valorPorDependente = 189.59;
var totalRescisao = 0;
var rescisaoDetalhada = 0;
var totalProventos = 0;
var totalDescontos = 0;

// ------- INSS - TABELA ALÍQUOTA E FATOR DE DEDUÇÃO -------
class Tabela_INSS {

    constructor(baseCalculoINSS) {

        this._baseCalculoINSS = baseCalculoINSS;
        let faixa = 0;

        this._baseCalculoINSS >= 0 && this._baseCalculoINSS <= 1100 ? faixa = 1
        : this._baseCalculoINSS >= 1100.01 && this._baseCalculoINSS <= 2203.48 ? faixa = 2
        : this._baseCalculoINSS >= 2203.43 && this._baseCalculoINSS <= 3305.22 ? faixa = 3
        : faixa = 4

        switch (faixa) {
            case 1:
                this._aliquotaINSS = 0.075;
                this._parcelaINSS = 0;
                break;
            case 2:
                this._aliquotaINSS = 0.09;
                this._parcelaINSS = Math.round((1100.01 * (0.09 - 0.075) * 100)) / 100;
                break;
            case 3:
                this._aliquotaINSS = 0.12;
                this._parcelaINSS = Math.round((2203.43 * (0.12 - 0.09) * 100)) / 100;
                break;
            case 4:
                this._aliquotaINSS = 0.14;
                this._parcelaINSS = Math.round((3305.23 * (0.14 - 0.12)) * 100) / 100;;
                break;
        }
    }

    get baseCalculoINSS() {
        return this._baseCalculoINSS;
    }

    get aliquotaINSS() {
        return this._aliquotaINSS;
    }

    get parcelaINSS() {
        return this._parcelaINSS;
    }
}

// ------- IRRF - TABELA ALÍQUOTA E DEDUÇÃO -------
class Tabela_IRRF {

    constructor(baseIR) {

        this._baseCalculoIRRF = baseIR;
        let faixa = 0;

        this._baseCalculoIRRF >= 0 && this._baseCalculoIRRF <= 1903.98 ? faixa = 1
        : this._baseCalculoIRRF >= 1903.99 && this._baseCalculoIRRF <= 2826.65 ? faixa = 2
        : this._baseCalculoIRRF >= 2826.66 && this._baseCalculoIRRF <= 3751.05 ? faixa = 3
        : this._baseCalculoIRRF >= 3751.06 && this._baseCalculoIRRF <= 4664.68 ? faixa = 4
        : faixa = 5;

        switch (faixa) {
            case 1:
                this._aliquotaIRRF = 0;
                this._parcelaIRRF = 0;
                break;
            case 2:
                this._aliquotaIRRF = 0.075;
                this._parcelaIRRF = 142.80;
                break;
            case 3:
                this._aliquotaIRRF = 0.15;
                this._parcelaIRRF = 354.80;
                break;
            case 4:
                this._aliquotaIRRF = 0.225;
                this._parcelaIRRF = 636.13;
                break;
            case 5:
                this._aliquotaIRRF = 0.275;
                this._parcelaIRRF = 869.36;
                break;
        }
    }

    get baseCalculoIRRF() {
        return this._baseCalculoIRRF;
    }

    get aliquotaIRRF() {
        return this._aliquotaIRRF;
    }

    get aliquotaIRRF() {
        return this._parcelaIRRF;
    }
}

// ------- SALÁRIO -------
var diasAdicional = adicionalAnualAP(difAnos);
var saldoSalario = saldoDeSalario(ultimoSalario, diaTermino);
var indAvisoPrevio = avisoPrevio(ultimoSalario, diasAdicional, cumpriuAvisoPrevio);

// ------- FÉRIAS -------
var feriasVenc = feriasVencidas(possuiFeriasVencidas, ultimoSalario);
var adicFerias = adicionalFerias(ultimoSalario);
var feriasProporc = feriasProporcionais(mesesCalcFeriasDecimo, ultimoSalario);
var adicionalFeriasProp = adicionalFeriasProporcionais(mesesCalcFeriasDecimo, ultimoSalario);

// ------- FÉRIAS AVISO PRÉVIO -------
var indFeriasAP = feriasAvisoPrevio(motivoTermino, ultimoSalario);
var adicFeriasAP = adicionalFeriasAP(motivoTermino, ultimoSalario);

// ------- DÉCIMO TERCEIRO -------
var proporcionalDecimoTerc = decimoTerceiroProporcional(mesesCalcFeriasDecimo, ultimoSalario);
var decimoAvisoPrevio = decimoTerceiroAvisoPrevio(motivoTermino, cumpriuAvisoPrevio, ultimoSalario);

// ------- INSS -------
var inssSalario = inssSobreSalario(saldoSalario);
var inssDecimo = inssSobreDecimo(proporcionalDecimoTerc);
var inssAvisoPrevio = inssSobreAvisoPrevio(indAvisoPrevio);

// ------- IRRF -------
var irrfSalario = irrfSobreSalario(numeroDependentes, valorPorDependente, saldoSalario, proporcionalDecimoTerc, inssSalario, inssDecimo);
var irrfDecimo = irrfSobreDecimo(numeroDependentes, valorPorDependente, proporcionalDecimoTerc, inssDecimo);

// CÁLCULO DIAS ADICIONAIS AVISO PRÉVIO
function adicionalAnualAP(difAnos) {
    
    let anosTrabalhados = Math.floor(difAnos);
    let adicional = 0;

    if (difAnos < 1) {
        adicional = 0;
    } else if (difAnos >= 1 && anosTrabalhados <= 20) {    
        adicional = 3 * anosTrabalhados;
    } else if (anosTrabalhados > 20) {
        adicional = 60; 
    } 

    return adicional;
}

// ------- SALDO DE SALÁRIO -------
function saldoDeSalario(ultimoSalario, diaTermino) {

    let saldoDeSalario = ultimoSalario * (diaTermino / 30);
    saldoDeSalario = Math.round(saldoDeSalario * 100) / 100;

    return saldoDeSalario;
}

// ------- AVISO PRÉVIO INDENIZADO OU TRABALHADO -------
function avisoPrevio(ultimoSalario, diasAdicional, cumpriuAvisoPrevio) {
    
    let periodoMinimo = 30;
    let avisoPrevio = 0;

    (!cumpriuAvisoPrevio) ?
        (motivoTermino == 'pedido_de_demissao' ? avisoPrevio = (- ultimoSalario) //API pelo func ao patrão;
        : avisoPrevio = ultimoSalario * ((periodoMinimo + diasAdicional) / 30)) //API pelo patrão ao func;
    : 
        (diasAdicional >= 1 ? avisoPrevio = ultimoSalario * (diasAdicional / 30) //APT + ind adicional
        : avisoPrevio = 0)
        
    avisoPrevio = Math.round(avisoPrevio * 100) / 100;
    
    return avisoPrevio;
}

// ------- FÉRIAS VENCIDAS -------
function feriasVencidas(possuiFeriasVencidas, ultimoSalario) {
    
    let feriasVencidas = possuiFeriasVencidas ? ultimoSalario : 0;
    feriasVencidas = Math.round(feriasVencidas * 100) / 100;

    return feriasVencidas;
}

// ------- FÉRIAS PROPORCIONAIS -------
function feriasProporcionais(mesesCalcFeriasDecimo, ultimoSalario) {

    let feriasProporcionais = (mesesCalcFeriasDecimo / 12) * ultimoSalario;
    feriasProporcionais = Math.round(feriasProporcionais * 100) / 100;

    return feriasProporcionais;
}

// ------- FÉRIAS SOBRE AVISO PRÉVIO -------
function feriasAvisoPrevio(motivoTermino, ultimoSalario) {

    let feriasAvisoPrevio = 0;

    motivoTermino == 'dispensa_sem_justa_causa' ? feriasAvisoPrevio = (1 / 12) * ultimoSalario : feriasAvisoPrevio = 0;
    feriasAvisoPrevio = Math.round(feriasAvisoPrevio * 100) / 100;
        
    return feriasAvisoPrevio;
}

// ------- 1 / 3 FÉRIAS -------
function adicionalFerias(ultimoSalario) { 
    
    let adicionalFerias = ultimoSalario * (1 / 3);
    adicionalFerias = Math.round(adicionalFerias * 100) / 100;

    return adicionalFerias;
}

// ------- 1 / 3 FÉRIAS PROPORCIONAIS -------
function adicionalFeriasProporcionais(mesesCalcFeriasDecimo, ultimoSalario) { 
    
    let adicionalFeriasProporcionais = (mesesCalcFeriasDecimo / 12) * (ultimoSalario * (1 / 3));
    adicionalFeriasProporcionais = Math.round(adicionalFeriasProporcionais * 100) / 100;

    return adicionalFeriasProporcionais;
}

// ------- 1 / 3 FÉRIAS SOBRE AVISO PRÉVIO -------
function adicionalFeriasAP(motivoTermino, ultimoSalario) { 
    
    let adicionalFeriasAP = 0;

    motivoTermino == 'dispensa_sem_justa_causa' ? adicionalFeriasAP = (1 / 12) * (ultimoSalario * (1 / 3)) : adicFeriasAP = 0;
    adicionalFeriasAP = Math.round(adicionalFeriasAP * 100) / 100;

    return adicionalFeriasAP;
}

// ------- 13º PROPORCIONAL -------
function decimoTerceiroProporcional(mesesCalcFeriasDecimo, ultimoSalario) {
    
    let decimoTerceiroProporcional = (mesesCalcFeriasDecimo / 12) * ultimoSalario;
    decimoTerceiroProporcional = Math.round(decimoTerceiroProporcional * 100) / 100;

    return decimoTerceiroProporcional;
}

// ------- 13º SOBRE AVISO PRÉVIO -------
function decimoTerceiroAvisoPrevio(motivoTermino, cumpriuAvisoPrevio, ultimoSalario) {
    
    let decimoTerceiroAvisoPrevio = 0; 

    if (!cumpriuAvisoPrevio && motivoTermino == 'dispensa_sem_justa_causa') {
        decimoTerceiroAvisoPrevio = (1 / 12) * ultimoSalario;        
    }

    decimoTerceiroAvisoPrevio = Math.round(decimoTerceiroAvisoPrevio * 100) / 100;

    return decimoTerceiroAvisoPrevio;
}

// ------- INSS SOBRE SALÁRIO -------
function inssSobreSalario(saldoSalario) {
    
    let tabelaSalarioINSS = new Tabela_INSS(saldoSalario);
    baseCalculoINSS = tabelaSalarioINSS._baseCalculoINSS;
    aliquotaINSS = tabelaSalarioINSS._aliquotaINSS;
    parcelaINSS = tabelaSalarioINSS._parcelaINSS;

    let inssSobreSalario = baseCalculoINSS * aliquotaINSS - parcelaINSS;
    inssSobreSalario = Math.round(inssSobreSalario * 100) / 100;

    return inssSobreSalario;
}

// ------- INSS SOBRE 13º -------
function inssSobreDecimo(proporcionalDecimoTerc) {
    
    let tabelaDecimoINSS = new Tabela_INSS(proporcionalDecimoTerc);
    baseCalculoINSS = tabelaDecimoINSS._baseCalculoINSS;
    aliquotaINSSDec = tabelaDecimoINSS._aliquotaINSS;
    parcelaINSS = tabelaDecimoINSS._parcelaINSS;

    let inssSobreDecimo = baseCalculoINSS * aliquotaINSSDec - parcelaINSS;
    inssSobreDecimo = Math.round(inssSobreDecimo * 100) / 100;

    return inssSobreDecimo;
}

// ------- INSS SOBRE AVISO PRÉVIO -------
function inssSobreAvisoPrevio(indAvisoPrevio) {
    
    let tabelaAvisoPrevioINSS = new Tabela_INSS(indAvisoPrevio);
    baseCalculoINSS = tabelaAvisoPrevioINSS._baseCalculoINSS;
    aliquotaINSSAP = tabelaAvisoPrevioINSS._aliquotaINSS;
    parcelaINSS = tabelaAvisoPrevioINSS._parcelaINSS;

    let inssSobreAvisoPrevio = baseCalculoINSS * aliquotaINSSAP - parcelaINSS;
    inssSobreAvisoPrevio = Math.round(inssSobreAvisoPrevio * 100) / 100;
    
    return inssSobreAvisoPrevio;
}

// ------- IRRF SOBRE SALÁRIO -------
function irrfSobreSalario(numeroDependentes, valorPorDependente, saldoSalario, proporcionalDecimoTerc, inssSalario, inssDecimo) {
    
    let deduzirDependente = 0;
    deduzirDependente = numeroDependentes > 0 ? numeroDependentes * valorPorDependente : 0;

    let baseIR = saldoSalario + proporcionalDecimoTerc - (inssSalario + inssDecimo) - deduzirDependente;
    
    let tabelaIRRFSalario = new Tabela_IRRF(baseIR);
    baseCalculoIRRF = tabelaIRRFSalario._baseCalculoIRRF;
    aliquotaIRRF = tabelaIRRFSalario._aliquotaIRRF;
    parcelaIRRF = tabelaIRRFSalario._parcelaIRRF;

    let irrfSobreSalario = baseCalculoIRRF * aliquotaIRRF - parcelaIRRF;
    irrfSobreSalario = Math.round(irrfSobreSalario * 100) / 100;

    return irrfSobreSalario;
}

// ------- IRRF SOBRE 13º -------
function irrfSobreDecimo(numeroDependentes, valorPorDependente, proporcionalDecimoTerc, inssDecimo) {
    
    let deduzirDependente = 0;
    deduzirDependente = numeroDependentes > 0 ? numeroDependentes * valorPorDependente : 0;

    let baseIR = proporcionalDecimoTerc - inssDecimo - deduzirDependente;
    
    let tabelaIRRFDecimo = new Tabela_IRRF(baseIR);
    baseCalculoIRRF = tabelaIRRFDecimo._baseCalculoIRRF;
    aliquotaIRRFDec = tabelaIRRFDecimo._aliquotaIRRF;
    parcelaIRRF = tabelaIRRFDecimo._parcelaIRRF;

    let irrfSobreDecimo = baseCalculoIRRF * aliquotaIRRFDec - parcelaIRRF;
    irrfSobreDecimo = Math.round(irrfSobreDecimo * 100) / 100;

    return irrfSobreDecimo;
}

// ------- CRIANDO UM OBJETO PARA EVENTO -------
function createObject(evento, ref, provento, desconto) {

    var obj = new Object();
    obj.evento = evento;
    obj.ref = ref;
    obj.provento = provento;
    obj.desconto = desconto;

    return obj;
}

var objSaldoDeSalario = createObject('Saldo de Salário', diaTermino, saldoSalario.toFixed(2), ' - ');
var objIndAvisoPrevio = createObject('Aviso Prévio Indenizado', diasAdicional, indAvisoPrevio >= 0 ? indAvisoPrevio.toFixed(2) : ' - ', indAvisoPrevio < 0 ? indAvisoPrevio.toFixed(2) : ' - ');
var objFeriasVenc = createObject('Férias Vencidas', Number(possuiFeriasVencidas), feriasVenc.toFixed(2), ' - ');
var objAdicFerias = createObject('1/3 Férias', ' - ', adicFerias.toFixed(2), ' - ');
var objFeriasProporc = createObject('Férias Proporcionais', mesesCalcFeriasDecimo + '/12', feriasProporc.toFixed(2), ' - ');
var objAdicionalFeriasProp = createObject('1/3 Férias Proporcionais', '1/12', adicionalFeriasProp.toFixed(2), ' - ');
var objIndFeriasAP = createObject('Férias sobre Aviso Prévio', Number(!cumpriuAvisoPrevio), indFeriasAP.toFixed(2), ' - ');
var objAdicFeriasAP = createObject('1/3 Férias Aviso Prévio', ' - ', adicFeriasAP.toFixed(2), ' - ');
var objProporcionalDecimoTerc = createObject('13º Salário Proporcional', mesesCalcFeriasDecimo + '/12', proporcionalDecimoTerc.toFixed(2), ' - ');
var objDecimoAvisoPrevio = createObject('13º Salario Aviso Prévio', Number(!cumpriuAvisoPrevio), decimoAvisoPrevio.toFixed(2), ' - ');
var objInssSalario = createObject('INSS Salário', (Math.round((aliquotaINSS * 100) * 100) / 100) + '%', ' - ', inssSalario.toFixed(2));
var objInssDecimo = createObject('INSS 13º Salário', (Math.round((aliquotaINSSDec * 100) * 100) / 100) + '%', ' - ', inssDecimo.toFixed(2));
var objInssAvisoPrevio = createObject('INSS sobre Aviso Prévio', (Math.round((aliquotaINSSAP * 100) * 100) / 100) + '%', ' - ', inssAvisoPrevio.toFixed(2));
var objIrrfSalario = createObject('IRRF Salário', (Math.round((aliquotaIRRF * 100) * 100) / 100) + '%', ' - ', irrfSalario.toFixed(2));
var objIrrfDecimo = createObject('IRRF 13º Salário', (Math.round((aliquotaIRRFDec * 100) * 100) / 100) + '%', ' - ', irrfDecimo.toFixed(2));

// ------- SELEÇÃO MOTIVO TÉRMINO E EXECUÇÃO DO CÁLCULO -------
var rescisaoDetalhada = [];

switch (motivoTermino) {
    case 'pedido_de_demissao':
        totalRescisao = saldoSalario + indAvisoPrevio + proporcionalDecimoTerc + decimoAvisoPrevio +
        feriasVenc + adicFerias + feriasProporc + adicionalFeriasProp + indFeriasAP + adicFeriasAP -
        inssSalario - inssDecimo - inssAvisoPrevio - irrfSalario - irrfDecimo;
        
        totalProventos = saldoSalario + indAvisoPrevio + proporcionalDecimoTerc + decimoAvisoPrevio +
        feriasVenc + adicFerias + feriasProporc + adicionalFeriasProp + indFeriasAP + adicFeriasAP;
        
        totalDescontos = inssSalario + inssDecimo + inssAvisoPrevio + irrfSalario + irrfDecimo;

        rescisaoDetalhada = [
            objSaldoDeSalario, objIndAvisoPrevio, objFeriasVenc, objAdicFerias, objFeriasProporc,
            objAdicionalFeriasProp, objIndFeriasAP, objAdicFeriasAP, objProporcionalDecimoTerc,
            objDecimoAvisoPrevio, objInssSalario, objInssDecimo, objInssAvisoPrevio, objIrrfSalario,
            objIrrfDecimo
        ]
        break;

    case 'dispensa_com_justa_causa':
        totalRescisao = saldoSalario + feriasVenc + adicFerias - inssSalario - irrfSalario;
        
        totalProventos = saldoSalario + feriasVenc + adicFerias;

        totalDescontos = inssSalario + irrfSalario;

        rescisaoDetalhada = [
            objSaldoDeSalario, objFeriasVenc, objAdicFerias, objInssSalario, objIrrfSalario
        ]
        break;

    case 'dispensa_sem_justa_causa':
        totalRescisao = saldoSalario + indAvisoPrevio + proporcionalDecimoTerc + decimoAvisoPrevio +
        feriasVenc + adicFerias + feriasProporc + adicionalFeriasProp + indFeriasAP + adicFeriasAP -
        inssSalario - inssDecimo - inssAvisoPrevio - irrfSalario - irrfDecimo;
        
        totalProventos = saldoSalario + indAvisoPrevio + proporcionalDecimoTerc + decimoAvisoPrevio +
        feriasVenc + adicFerias + feriasProporc + adicionalFeriasProp + indFeriasAP + adicFeriasAP;

        totalDescontos = inssSalario + inssDecimo + inssAvisoPrevio + irrfSalario + irrfDecimo;

        rescisaoDetalhada = [
            objSaldoDeSalario, objIndAvisoPrevio, objFeriasVenc, objAdicFerias, objFeriasProporc,
            objAdicionalFeriasProp, objIndFeriasAP, objAdicFeriasAP, objProporcionalDecimoTerc,
            objDecimoAvisoPrevio, objInssSalario, objInssDecimo, objInssAvisoPrevio, objIrrfSalario,
            objIrrfDecimo
        ]
        break;

    case 'rescisão_indireta':
        totalRescisao = saldoSalario + indAvisoPrevio + proporcionalDecimoTerc + decimoAvisoPrevio +
        feriasVenc + adicFerias + feriasProporc + adicionalFeriasProp + indFeriasAP + adicFeriasAP -
        inssSalario - inssDecimo - inssAvisoPrevio - irrfSalario - irrfDecimo;
        
        totalProventos = saldoSalario + indAvisoPrevio + proporcionalDecimoTerc + decimoAvisoPrevio +
        feriasVenc + adicFerias + feriasProporc + adicionalFeriasProp + indFeriasAP + adicFeriasAP;

        totalDescontos = inssSalario + inssDecimo + inssAvisoPrevio + irrfSalario + irrfDecimo;

        rescisaoDetalhada = [
            objSaldoDeSalario, objIndAvisoPrevio, objFeriasVenc, objAdicFerias, objFeriasProporc,
            objAdicionalFeriasProp, objIndFeriasAP, objAdicFeriasAP, objProporcionalDecimoTerc,
            objDecimoAvisoPrevio, objInssSalario, objInssDecimo, objInssAvisoPrevio, objIrrfSalario,
            objIrrfDecimo
        ]
        break;

    case 'rescisão_culpa_recíproca':
        totalRescisao = saldoSalario + proporcionalDecimoTerc + feriasVenc + adicFerias + feriasProporc +
        adicionalFeriasProp + inssSalario - inssDecimo - irrfSalario - irrfDecimo;
        
        totalProventos = saldoSalario + proporcionalDecimoTerc + feriasVenc + adicFerias + feriasProporc +
        adicionalFeriasProp + inssSalario;

        totalDescontos = inssDecimo + irrfSalario + irrfDecimo;

        rescisaoDetalhada = [
            objSaldoDeSalario, objFeriasVenc, objAdicFerias, objFeriasProporc, objAdicionalFeriasProp, 
            objProporcionalDecimoTerc, objInssSalario, objInssDecimo, objIrrfSalario, objIrrfDecimo
        ]
        break;
}
var objTotal = createObject('Total', ' - ', 'R$ ' + totalProventos.toFixed(2) , '- R$ ' + totalDescontos.toFixed(2));
rescisaoDetalhada.push(objTotal);


// ------- EXIBIR RESULTADO -------
let exibirTotal = document.querySelector('#valor span');
exibirTotal.innerHTML = Math.round(totalRescisao * 100) / 100;

// ------- SOLICITAR DETALHAMENTO DO RESULTADO -------
var btnVerMaisDetalhes = document.querySelector("#detalhar");
btnVerMaisDetalhes.addEventListener("click", function(){

    localStorage.setItem('rescisaoDetalhada', JSON.stringify(rescisaoDetalhada));
});