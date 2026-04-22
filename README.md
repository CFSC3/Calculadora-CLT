# 🧮 Calculadora de Impostos: CLT vs. PJ

Uma aplicação web interativa desenvolvida para realizar simulações financeiras detalhadas, comparando os principais regimes de contratação no Brasil e auxiliando na análise de encargos e lucro líquido.

## 📝 Sobre o Projeto
Este projeto foi desenvolvido para oferecer transparência sobre o impacto dos tributos na remuneração profissional. A ferramenta utiliza **JavaScript puro** para processar cálculos complexos de legislação trabalhista e tributária, permitindo que o usuário visualize de forma clara a diferença entre faturamento bruto e o valor real após deduções.

A lógica do sistema foi construída para simular cenários reais, sendo ideal para profissionais em transição de carreira ou em fase de negociação salarial.

## ✨ Funcionalidades

### **Módulo CLT (Consolidação das Leis do Trabalho)**
- **Cálculo de FGTS:** Projeção automática da reserva de 8% sobre o salário bruto.
- **INSS Progressivo:** Implementação da tabela de contribuição previdenciária com 4 faixas de alíquotas (7.5% a 14%), respeitando o teto vigente.
- **IRRF com Dependentes:** Cálculo do Imposto de Renda Retido na Fonte, subtraindo deduções por dependentes e aplicando a tabela progressiva oficial.
- **Salário Líquido:** Demonstração final da remuneração após todos os descontos obrigatórios.

### **Módulo PJ (Pessoa Jurídica)**
- **Simples Nacional (Anexo III):** Simulação simplificada com alíquota de 6% sobre o faturamento.
- **Lucro Presumido:** Cálculo detalhado somando impostos federais e municipais (PIS, COFINS, ISS, IRPJ e CSLL).
- **Lucro Líquido:** Resultado do faturamento bruto subtraído da carga tributária total do regime escolhido.

## 🛠️ Tecnologias Utilizadas
- **HTML5:** Estrutura semântica com seções dinâmicas.
- **CSS3:** Interface limpa, responsiva e com feedback visual para descontos (vermelho) e valores líquidos (verde).
- **JavaScript (ES6+):** Lógica de cálculo, manipulação de DOM e formatação de moeda para o padrão BRL.

## 📸 Demonstração
<div align="center">
  <img src="./screenshot.png" alt="Interface da Calculadora CLT vs PJ" width="600px">
</div>

## 🚀 Como Executar
