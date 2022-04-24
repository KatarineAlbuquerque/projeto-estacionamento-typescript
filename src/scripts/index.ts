
// Interfaces
interface IPessoa {
    nome:string;
    cpf: string;
}

interface IEstacionamento {
    usuario: IPessoa;
    nome: string;
    placa: string;
    entrada: Date | string;
    vaga: string;
}

// Cria uma função anônima
(function () {

    // Acesso aos inputs e button do HTML 
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    garagem().render(); // renderiza na tela os dados.

    // Evento que faz a manipulação dos dados. Evento Click.
    $("#cadastrar")?.addEventListener('click', () => {

        // captura dados dos inputs
        const nomeUsuario = $("#usuario")?.value;
        const cpf = $("#cpf")?.value;
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        const vaga = $("#vaga")?.value;

        // Verifica se os dados existem.
        if (!nomeUsuario || !cpf || !nome || !placa || !vaga) {
            alert("Informe os campos nome e placa para prosseguir!");
            return; // Caso seja o contrário.
        }

        // Função que recebe a lógica dos conteúdos.
        

        // Atribuição dao dados.   
        const pessoa: IPessoa = {
            nome: nomeUsuario.toUpperCase(),
            cpf: cpf
        }       

        const carro: IEstacionamento = {
            usuario: {nome: pessoa.nome, cpf: pessoa.cpf},
            nome: nome.toUpperCase(),
            placa: placa.toUpperCase(),
            entrada: new Date().toLocaleDateString(),
            vaga: vaga,
        }

        // Envoca o método Adicionar.
        garagem().adicionar(carro, true);
    });

    function garagem() {
        // Faz a leitura dos dados.
        function ler(): IEstacionamento[] { // Se o Local existir converte para Json, senão exibe um array vazio.               
            return localStorage.garagem ? JSON.parse(localStorage.garagem) : [];
        }

        // adiciona itens na lista.
        function adicionar(carro: IEstacionamento, salva?: boolean) { 
            // O parâmetro salvar é opcional devido ao ? após seu nome.
            
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

             tr.querySelector('.remover')?.addEventListener('click', function() {
                 remover(carro.placa, carro.nome);
             });

             $("#garagem")?.appendChild(tr);

            let nome = carro.usuario.nome.toUpperCase();

            // Se correto salva os dados.
            salva ? salvar([...ler(), carro]) : console.log(`Erro ao salvar dados ${nome}`);
        }

        // salva dados no banco local.
        function salvar(carros: IEstacionamento[]) { 
            localStorage.setItem("garagem", JSON.stringify(carros));
            limpar(); // Limpa os campos inputs.
         }

         // Calcular tempo de estacionamento.
         function calcularTempo(milessegundos: number) {
            // Floor Arredonda para cima.
            const minutos = Math.floor(milessegundos / 60000); // acha os mintutos.
            const segundos = Math.floor(milessegundos % 60000); // acha os segundos.

            return `${minutos} min : ${segundos} s`; // retorna os dados do tempo calculados.                
         }

        // remove os dados da lista.
        function remover(placa: string, nome: string) {
            // cria duas variaveis.
            ler().find(carro => {carro.nome === nome});
            ler().find(carro => {carro.placa === placa});
            
            // Calcula o tempo de estacionamento na garagem.
            const tempo = calcularTempo((new Date().getTime()) - new Date().getTime());
            // Exibe uma caixa de mensagem se deseja finalizar o estacionamento no local.
            if(!confirm(`O Carro ${nome} permaneceu por ${tempo}. Deseja finalizar?`)) return;
            // Caso sim ele remove o carro do banco de dados local.
            salvar(ler().filter(carro => carro.placa !== placa));
            // E renderiza a tela novamente.                
            
            limpar(); // Limpa os campos inputs.
         }

         function limpar() {
            $("#usuario")!.value="";
            $("#cpf")!.value="";
            $("#nome")!.value="";
            $("#placa")!.value="";
            render();
         }

        // rederiza os dados na tela.
        function render() { 
            $("#garagem")!.innerHTML=""; // Limpa os dados existentes para gerar novos dados.

            const carros = ler(); // constante que pega os carros.

            if(carros.length) { // Imprime de acordo com a quantidade de itens. 
                // lista tos os itens do Array.
                carros.map(carro => garagem().adicionar(carro));
            }                
        }

        // executa as funções.
        return { ler, adicionar, salvar, remover, render }
    }

})();