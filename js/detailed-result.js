var rescisaoDetalhada = JSON.parse(localStorage.getItem('rescisaoDetalhada'));

for (const i in rescisaoDetalhada) {
    adicionaRegistroNaTabela(rescisaoDetalhada[i]);
}

function adicionaRegistroNaTabela(arrayRescisao) {
    var tr = montaTr(arrayRescisao);
    var tbody = document.querySelector('table tbody');
    tbody.appendChild(tr);
}

function montaTr(arrayRescisao) {
    var tr = document.createElement("tr");
    tr.classList.add("row");

    tr.appendChild(montaTd(arrayRescisao.evento, "info-evento"));
    tr.appendChild(montaTd(arrayRescisao.ref, "info-ref"));
    tr.appendChild(montaTd(arrayRescisao.provento, "info-provento"));
    tr.appendChild(montaTd(arrayRescisao.desconto, "info-desconto"));

    return tr;
}

function montaTd(dado, classe){
    var td = document.createElement("td");
    td.textContent = dado;
    td.classList.add(classe);

    return td;
}
