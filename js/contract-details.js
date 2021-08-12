// sessionStorage.clear();

var form = document.querySelector('#form');

form.addEventListener('submit', function(event) {
    // event.preventDefault();

    var dadosFornecidos = {
        data_inicio: form.data_inicio.value,
        data_termino: form.data_termino.value,
        ultimo_salario: form.ultimo_salario.value,
        numero_dependentes: form.numero_dependentes.value,
        motivo_termino: form.motivo_termino.value,
        ferias_vencidas: form.ferias_vencidas.value,
        aviso_previo: form.aviso_previo.value
    }    

    sessionStorage.setItem('dadosFornecidos', JSON.stringify(dadosFornecidos));
});