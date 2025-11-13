// Aguarda o DOM estar completamente carregado para executar o script
document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Seleção de Elementos do DOM ---
    const btnModoCLT = document.getElementById("btn-modo-clt");
    const btnModoPJ = document.getElementById("btn-modo-pj");
    const formCLT = document.getElementById("form-clt");
    const formPJ = document.getElementById("form-pj");
    const relatorioDiv = document.getElementById("relatorio");
    const relatorioConteudo = document.getElementById("relatorio-conteudo");

    const btnCalcularCLT = document.getElementById("calcular-clt");
    const btnCalcularPJ = document.getElementById("calcular-pj");

    // --- 2. Lógica de Eventos da Interface ---

    // Mostrar formulário CLT
    btnModoCLT.addEventListener("click", () => {
        formCLT.classList.remove("hidden");
        formPJ.classList.add("hidden");
        relatorioDiv.classList.add("hidden");
    });

    // Mostrar formulário PJ
    btnModoPJ.addEventListener("click", () => {
        formPJ.classList.remove("hidden");
        formCLT.classList.add("hidden");
        relatorioDiv.classList.add("hidden");
    });

    // Botão de cálculo CLT
    btnCalcularCLT.addEventListener("click", handleCalcularCLT);

    // Botão de cálculo PJ
    btnCalcularPJ.addEventListener("click", handleCalcularPJ);


    // --- 3. Funções de Lógica Principal (Handlers) ---

    function handleCalcularCLT() {
        // Obter valores dos inputs
        const salarioBruto = parseFloat(document.getElementById("salario-bruto").value) || 0;
        const dependentes = parseInt(document.getElementById("dependentes").value) || 0;

        if (salarioBruto <= 0) {
            alert("Por favor, insira um Salário Bruto válido.");
            return;
        }

        // Executar cálculos
        const fgts = calcularFGTS(salarioBruto); //
        const inss = calcularINSS(salarioBruto); //
        const irrf = calcularIRRF(salarioBruto, inss, dependentes); //
        const salarioLiquido = calcularSalarioLiquido(salarioBruto, inss, irrf); //

        // Exibir relatório
        const resultadoHTML = `
            <h4>Resultado do Cálculo CLT</h4>
            <p class="relatorio-item">Salário Bruto: ${formatarMoeda(salarioBruto)}</p>
            <p class="relatorio-item">Depósito FGTS (pela empresa): ${formatarMoeda(fgts)}</p>
            <p class="relatorio-desconto">Desconto INSS: ${formatarMoeda(inss)}</p>
            <p class="relatorio-desconto">Desconto IRRF: ${formatarMoeda(irrf)}</p>
            <p class="relatorio-liquido">Salário Líquido: ${formatarMoeda(salarioLiquido)}</p>
        `;
        exibirRelatorio(resultadoHTML);
    }

    function handleCalcularPJ() {
        // Obter valores dos inputs
        const faturamentoBruto = parseFloat(document.getElementById("faturamento-bruto").value) || 0;
        const regime = document.getElementById("regime-pj").value;

        if (faturamentoBruto <= 0) {
            alert("Por favor, insira um Faturamento Bruto válido.");
            return;
        }

        let calculo;
        let titulo;

        // Chamar a função de cálculo correta baseada no regime
        if (regime === "simples") {
            calculo = calcularSimplesNacional(faturamentoBruto); //
            titulo = "Resultado - Simples Nacional (Anexo III)";
        } else {
            calculo = calcularLucroPresumido(faturamentoBruto); //
            titulo = "Resultado - Lucro Presumido (Simplificado)";
        }

        // Exibir relatório
        const resultadoHTML = `
            <h4>${titulo}</h4>
            <p class="relatorio-item">Faturamento Bruto: ${formatarMoeda(faturamentoBruto)}</p>
            <p class="relatorio-desconto">Total de Impostos Pagos: ${formatarMoeda(calculo.impostoPago)}</p>
            <p class="relatorio-liquido">Lucro Líquido: ${formatarMoeda(calculo.lucroLiquido)}</p>
        `;
        exibirRelatorio(resultadoHTML);
    }

    function exibirRelatorio(html) {
        relatorioConteudo.innerHTML = html;
        relatorioDiv.classList.remove("hidden");
    }


    // --- 4. Funções de Cálculo CLT ---

    /** Formata um número para o padrão monetário BRL */
    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    /** Calcula 8% do salário bruto */
    function calcularFGTS(salarioBruto) {
        return salarioBruto * 0.08;
    }

    /** Calcula o INSS de forma progressiva (faixa por faixa) */
    function calcularINSS(salario) {
        const tetoFaixa1 = 1412.00;
        const tetoFaixa2 = 2666.68;
        const tetoFaixa3 = 4000.03;
        const tetoFaixa4 = 7786.02; // Teto

        let inss = 0;
        
        // Se o salário for maior que o teto, considera o teto
        const salarioContribuicao = Math.min(salario, tetoFaixa4);

        // Faixa 1 (7.5%)
        let baseFaixa1 = Math.min(salarioContribuicao, tetoFaixa1);
        inss += baseFaixa1 * 0.075;

        // Faixa 2 (9%)
        if (salarioContribuicao > tetoFaixa1) {
            let baseFaixa2 = Math.min(salarioContribuicao, tetoFaixa2) - tetoFaixa1;
            inss += baseFaixa2 * 0.09;
        }

        // Faixa 3 (12%)
        if (salarioContribuicao > tetoFaixa2) {
            let baseFaixa3 = Math.min(salarioContribuicao, tetoFaixa3) - tetoFaixa2;
            inss += baseFaixa3 * 0.12;
        }

        // Faixa 4 (14%)
        if (salarioContribuicao > tetoFaixa3) {
            let baseFaixa4 = salarioContribuicao - tetoFaixa3;
            inss += baseFaixa4 * 0.14;
        }

        return inss;
    }

    /** Calcula o IRRF com base na tabela progressiva (Alíquota - Parcela a Deduzir) */
    function calcularIRRF(salarioBruto, inss, dependentes) {
        const valorPorDependente = 189.59; //
        const deducaoDependentes = dependentes * valorPorDependente; //
        
        // Base de Cálculo = Salário Bruto - INSS - Dependentes
        const baseCalculo = salarioBruto - inss - deducaoDependentes;

        let irrf = 0;

        // Tabela IRRF
        if (baseCalculo <= 2259.20) {
            irrf = 0;
        } else if (baseCalculo <= 2826.65) {
            irrf = (baseCalculo * 0.075) - 169.44;
        } else if (baseCalculo <= 3751.05) {
            irrf = (baseCalculo * 0.15) - 381.44;
        } else if (baseCalculo <= 4664.68) {
            irrf = (baseCalculo * 0.225) - 662.77;
        } else { // Acima de 4664.68
            irrf = (baseCalculo * 0.275) - 896.00;
        }

        // O IRRF não pode ser negativo
        return Math.max(0, irrf);
    }

    /** Calcula Salário Líquido = Bruto - INSS - IRRF */
    function calcularSalarioLiquido(salarioBruto, inss, irrf) {
        return salarioBruto - inss - irrf;
    }

    // --- 5. Funções de Cálculo PJ (Simplificadas conforme o guia) ---

    /** Alíquota de 6% sobre o faturamento */
    function calcularSimplesNacional(faturamento) {
        const impostoPago = faturamento * 0.06;
        const lucroLiquido = faturamento - impostoPago;
        return { impostoPago, lucroLiquido };
    }

    /** Soma dos impostos (PIS, COFINS, ISS, IRPJ, CSLL) */
    function calcularLucroPresumido(faturamento) {
        const pis = faturamento * 0.0065; //
        const cofins = faturamento * 0.03; //
        const iss = faturamento * 0.05; //

        // IRPJ (15% sobre 32% do faturamento)
        const irpj = (faturamento * 0.32) * 0.15;
        // CSLL (9% sobre 32% do faturamento)
        const csll = (faturamento * 0.32) * 0.09;

        const impostoTotal = pis + cofins + iss + irpj + csll;
        const lucroLiquido = faturamento - impostoTotal;

        return { impostoPago: impostoTotal, lucroLiquido };
    }

});