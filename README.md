# DevTech Academy

Sistema de cadastro de alunos do estudo de caso EC01. A aplicação usa HTML e JavaScript e mantém os registros em memória. Recarregar ou fechar a página limpa os dados.

## Rodar com Docker

Com o Docker em execução, abra o terminal na pasta do projeto e execute:

```sh
docker compose up --build
```

Abra [localhost:8080](http://localhost:8080). O Nginx serve os arquivos da pasta `public`. Durante o desenvolvimento, salve suas alterações e recarregue a página para vê-las.

Se a porta 8080 estiver ocupada, execute `$env:DEVTECH_PORT = '8081'` no PowerShell antes de iniciar o Compose e abra [localhost:8081](http://localhost:8081).

Para encerrar o ambiente, pressione Ctrl+C e execute `docker compose down`. Também é possível abrir `public/index.html` diretamente no navegador.

## Exercícios

| Exercício | Implementação |
| --- | --- |
| 1 | Formulário HTML sem CSS com nome, idade, curso e nota final. A tabela permite cadastrar, consultar, editar e excluir alunos. |
| 2 | A classe `Aluno` inicializa os quatro atributos. `isAprovado()` verifica se a nota é maior ou igual a 7 e `toString()` formata o registro para a lista de aprovados. |
| 3 | O formulário e os botões usam `addEventListener` com funções anônimas. As operações sobre o array usam arrow functions. As mensagens aparecem na página e no console. |
| 4 | Os relatórios usam `filter` para aprovação, `map` e `reduce` para médias, `map` e `sort` para ordenar nomes, `reduce` para contar por curso e `forEach` para exibir as listas. |

O formulário aceita idades inteiras positivas e notas de 0 a 10, incluindo decimais.

## Teste rápido

1. Cadastre Zoe, 20 anos, JavaScript, nota 7.
2. Cadastre Ana, 24 anos, Python, nota 6,5.
3. Confira se apenas Zoe aparece como aprovada, se Ana vem antes de Zoe, se as médias são 6,75 e 22, e se Java está com zero alunos.
4. Edite a nota de Ana para 8 e confirme que ambas aparecem como aprovadas.
5. Exclua os dois registros e confira se a tabela fica vazia e as médias exibem “Sem dados”.

## Referências

- Enunciado EC01 — Alunos.
- [Imagem oficial do Nginx](https://hub.docker.com/_/nginx).
