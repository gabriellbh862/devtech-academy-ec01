"use strict";

class Aluno {
  constructor(nome, idade, curso, notaFinal) {
    this.nome = nome;
    this.idade = idade;
    this.curso = curso;
    this.notaFinal = notaFinal;
  }

  isAprovado() {
    return this.notaFinal >= 7;
  }

  toString() {
    return `${this.nome} (${this.idade} anos, ${this.curso}, nota ${formatarNota.format(this.notaFinal)})`;
  }
}

const alunos = [];
let alunoEmEdicao = null;

const form = document.querySelector("#form-aluno");
const nome = form.elements.namedItem("nome");
const idade = form.elements.namedItem("idade");
const curso = form.elements.namedItem("curso");
const notaFinal = form.elements.namedItem("notaFinal");
const tituloFormulario = document.querySelector("#titulo-formulario");
const botaoSalvar = document.querySelector("#salvar");
const botaoCancelar = document.querySelector("#cancelar");
const tabela = document.querySelector("#lista-alunos");
const mensagem = document.querySelector("#mensagem");
const cursos = Array.from(curso.options, (opcao) => opcao.value).filter(Boolean);
const formatarNota = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 20 });
const formatarMedia = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

const cadastrarAluno = (aluno) => alunos.push(aluno);
const atualizarAluno = (original, atualizado) => {
  alunos[alunos.indexOf(original)] = atualizado;
};
const excluirAluno = (aluno) => alunos.splice(alunos.indexOf(aluno), 1);
const calcularMedia = (valores) => {
  if (valores.length === 0) return "Sem dados";

  const soma = valores.reduce((total, valor) => total + valor, 0);
  return formatarMedia.format(soma / valores.length);
};

function notificar(texto) {
  mensagem.textContent = texto;
  console.log(texto);
}

function limparFormulario() {
  alunoEmEdicao = null;
  form.reset();
  nome.setCustomValidity("");
  tituloFormulario.textContent = "Cadastrar aluno";
  botaoSalvar.textContent = "Cadastrar";
  botaoCancelar.hidden = true;
}

function iniciarEdicao(aluno) {
  alunoEmEdicao = aluno;
  nome.setCustomValidity("");
  nome.value = aluno.nome;
  idade.value = aluno.idade;
  curso.value = aluno.curso;
  notaFinal.value = aluno.notaFinal;
  tituloFormulario.textContent = "Editar aluno";
  botaoSalvar.textContent = "Salvar alterações";
  botaoCancelar.hidden = false;
  notificar(`Editando ${aluno.nome}.`);
  nome.focus();
}

function criarBotao(rotulo, aluno) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = rotulo;
  botao.setAttribute("aria-label", `${rotulo} ${aluno.nome}`);
  return botao;
}

function renderizarTabela() {
  tabela.replaceChildren();

  if (alunos.length === 0) {
    const celula = tabela.insertRow().insertCell();
    celula.colSpan = 6;
    celula.textContent = "Nenhum aluno cadastrado.";
    return;
  }

  alunos.forEach((aluno) => {
    const linha = tabela.insertRow();
    const valores = [
      aluno.nome,
      aluno.idade,
      aluno.curso,
      formatarNota.format(aluno.notaFinal),
      aluno.isAprovado() ? "Aprovado" : "Reprovado",
    ];
    valores.forEach((valor) => {
      linha.insertCell().textContent = valor;
    });

    const editar = criarBotao("Editar", aluno);
    editar.addEventListener("click", function () {
      iniciarEdicao(aluno);
    });

    const excluir = criarBotao("Excluir", aluno);
    excluir.addEventListener("click", function () {
      if (!window.confirm(`Excluir ${aluno.nome}?`)) return;

      if (alunoEmEdicao === aluno) limparFormulario();
      excluirAluno(aluno);
      renderizar();
      notificar(`${aluno.nome} foi excluído do cadastro.`);
      nome.focus();
    });

    linha.insertCell().append(editar, " ", excluir);
  });
}

function preencherLista(seletor, itens, textoVazio) {
  const lista = document.querySelector(seletor);
  lista.replaceChildren();

  const textos = itens.length ? itens : [textoVazio];
  textos.forEach((texto) => {
    const item = document.createElement("li");
    item.textContent = texto;
    lista.append(item);
  });
}

function renderizarRelatorios() {
  const aprovados = alunos.filter((aluno) => aluno.isAprovado());
  const nomesOrdenados = alunos.map((aluno) => aluno.nome)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  const quantidadePorCurso = alunos.reduce((quantidades, aluno) => {
    quantidades[aluno.curso]++;
    return quantidades;
  }, Object.fromEntries(cursos.map((nomeCurso) => [nomeCurso, 0])));

  document.querySelector("#media-notas").textContent = calcularMedia(alunos.map((aluno) => aluno.notaFinal));
  document.querySelector("#media-idades").textContent = calcularMedia(alunos.map((aluno) => aluno.idade));
  preencherLista("#aprovados", aprovados.map((aluno) => aluno.toString()), "Nenhum aluno aprovado.");
  preencherLista("#nomes-ordenados", nomesOrdenados, "Nenhum aluno cadastrado.");
  preencherLista("#alunos-por-curso", cursos.map((nomeCurso) => `${nomeCurso}: ${quantidadePorCurso[nomeCurso]}`));
}

function renderizar() {
  renderizarTabela();
  renderizarRelatorios();
}

nome.addEventListener("input", function () {
  nome.setCustomValidity("");
});

form.addEventListener("submit", function (evento) {
  evento.preventDefault();
  const nomeLimpo = nome.value.trim();
  if (!nomeLimpo) {
    nome.setCustomValidity("Informe o nome do aluno.");
    nome.reportValidity();
    return;
  }

  const aluno = new Aluno(nomeLimpo, idade.valueAsNumber, curso.value, notaFinal.valueAsNumber);
  if (alunoEmEdicao) {
    atualizarAluno(alunoEmEdicao, aluno);
    notificar(`Alterações de ${aluno.nome} salvas.`);
  } else {
    cadastrarAluno(aluno);
    notificar(`${aluno.nome} foi cadastrado com sucesso.`);
  }
  limparFormulario();
  renderizar();
  nome.focus();
});

botaoCancelar.addEventListener("click", function () {
  limparFormulario();
  notificar("Edição cancelada.");
  nome.focus();
});

renderizar();
