"use strict";
// Cria uma função anônima
(function () {
    var _a;
    // Acesso aos inputs e button do HTML 
    const $ = (query) => document.querySelector(query);
    garagem().render(); // renderiza na tela os dados.
    // Evento que faz a manipulação dos dados. Evento Click.
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        var _a, _b, _c, _d, _e;
        // captura dados dos inputs
        const nomeUsuario = (_a = $("#usuario")) === null || _a === void 0 ? void 0 : _a.value;
        const cpf = (_b = $("#cpf")) === null || _b === void 0 ? void 0 : _b.value;
        const nome = (_c = $("#nome")) === null || _c === void 0 ? void 0 : _c.value;
        const placa = (_d = $("#placa")) === null || _d === void 0 ? void 0 : _d.value;
        const vaga = (_e = $("#vaga")) === null || _e === void 0 ? void 0 : _e.value;
        // Verifica se os dados existem.
        if (!nomeUsuario || !cpf || !nome || !placa || !vaga) {
            alert("Informe os campos nome e placa para prosseguir!");
            return; // Caso seja o contrário.
        }
        // Função que recebe a lógica dos conteúdos.
        // Atribuição dao dados.   
        const pessoa = {
            nome: nomeUsuario.toUpperCase(),
            cpf: cpf
        };
        const carro = {
            usuario: { nome: pessoa.nome, cpf: pessoa.cpf },
            nome: nome.toUpperCase(),
            placa: placa.toUpperCase(),
            entrada: new Date().toLocaleDateString(),
            vaga: vaga,
        };
        // Envoca o método Adicionar.
        garagem().adicionar(carro, true);
    });
    function garagem() {
        // Faz a leitura dos dados.
        function ler() {
            return localStorage.garagem ? JSON.parse(localStorage.garagem) : [];
        }
        // adiciona itens na lista.
        function adicionar(carro, salva) {
            // O parâmetro salvar é opcional devido ao ? após seu nome.
            var _a, _b;
            // Cria e Adiciona dados em elemento HTML <tr>.
            const tr = document.createElement("tr");
            tr.innerHTML = `
             <td class="nome">${carro.usuario.nome}</td>
             <td>${carro.usuario.cpf}</td>
             <td>${carro.nome}</td>
             <td>${carro.placa}</td>
             <td>${carro.entrada}</td>
             <td>${carro.vaga}</td>
             <td><button class="remover" data-placa="${carro.placa}">Remover</button></td>`;
            (_a = tr.querySelector('.remover')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                remover(carro.placa, carro.nome);
            });
            (_b = $("#garagem")) === null || _b === void 0 ? void 0 : _b.appendChild(tr);
            let nome = carro.usuario.nome.toUpperCase();
            // Se correto salva os dados.
            salva ? salvar([...ler(), carro]) : console.log(`Erro ao salvar dados ${nome}`);
        }
        // salva dados no banco local.
        function salvar(carros) {
            localStorage.setItem("garagem", JSON.stringify(carros));
            limpar(); // Limpa os campos inputs.
        }
        // Calcular tempo de estacionamento.
        function calcularTempo(milessegundos) {
            // Floor Arredonda para cima.
            const minutos = Math.floor(milessegundos / 60000); // acha os mintutos.
            const segundos = Math.floor(milessegundos % 60000); // acha os segundos.
            return `${minutos} min : ${segundos} s`; // retorna os dados do tempo calculados.                
        }
        // remove os dados da lista.
        function remover(placa, nome) {
            // cria duas variaveis.
            ler().find(carro => { carro.nome === nome; });
            ler().find(carro => { carro.placa === placa; });
            // Calcula o tempo de estacionamento na garagem.
            const tempo = calcularTempo((new Date().getTime()) - new Date().getTime());
            // Exibe uma caixa de mensagem se deseja finalizar o estacionamento no local.
            if (!confirm(`O Carro ${nome} permaneceu por ${tempo}. Deseja finalizar?`))
                return;
            // Caso sim ele remove o carro do banco de dados local.
            salvar(ler().filter(carro => carro.placa !== placa));
            // E renderiza a tela novamente.                
            limpar(); // Limpa os campos inputs.
        }
        function limpar() {
            $("#usuario").value = "";
            $("#cpf").value = "";
            $("#nome").value = "";
            $("#placa").value = "";
            render();
        }
        // rederiza os dados na tela.
        function render() {
            $("#garagem").innerHTML = ""; // Limpa os dados existentes para gerar novos dados.
            const carros = ler(); // constante que pega os carros.
            if (carros.length) { // Imprime de acordo com a quantidade de itens. 
                // lista tos os itens do Array.
                carros.map(carro => garagem().adicionar(carro));
            }
        }
        // executa as funções.
        return { ler, adicionar, salvar, remover, render };
    }
})();
