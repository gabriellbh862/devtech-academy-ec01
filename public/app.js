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
const formatarNota = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 20 });

function cadastrarAluno(aluno) {
  alunos.push(aluno);
}

function atualizarAluno(original, atualizado) {
  alunos[alunos.indexOf(original)] = atualizado;
}

function excluirAluno(aluno) {
  alunos.splice(alunos.indexOf(aluno), 1);
}

function notificar(texto) {
  mensagem.textContent = texto;
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
  botao.setAttribute("aria-label", `${rotulo} ${aluno.toString()}`);
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
    editar.onclick = function () {
      iniciarEdicao(aluno);
    };

    const excluir = criarBotao("Excluir", aluno);
    excluir.onclick = function () {
      if (!window.confirm(`Excluir ${aluno.nome}?`)) return;

      if (alunoEmEdicao === aluno) limparFormulario();
      excluirAluno(aluno);
      renderizar();
      notificar(`${aluno.nome} foi excluído do cadastro.`);
      nome.focus();
    };

    linha.insertCell().append(editar, " ", excluir);
  });
}

function renderizar() {
  renderizarTabela();
}

nome.oninput = function () {
  nome.setCustomValidity("");
};

form.onsubmit = function (evento) {
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
};

botaoCancelar.onclick = function () {
  limparFormulario();
  notificar("Edição cancelada.");
  nome.focus();
};

renderizar();
