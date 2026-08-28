---
name: create-pr
description: Cria um Pull Request da branch atual para develop
user-invocable: true
---

Crie um Pull Request da branch atual para a branch `develop`.

## Passos

### 1. Validação

- Verifique a branch atual com `git branch --show-current`
- Se a branch atual for `develop` ou `main`, **pare** e informe que não é possível criar PR dessas branches
- Verifique se há commits à frente de develop com `git log develop..HEAD --oneline`
- Se não houver commits, **pare** e informe que não há mudanças para criar PR

### 2. Análise das diferenças

Execute em paralelo:

- `git log develop..HEAD --oneline` para listar todos os commits
- `git diff develop...HEAD --stat` para ver os arquivos alterados
- `git diff develop...HEAD` para entender o conteúdo das mudanças

Analise cuidadosamente TODAS as mudanças para entender o escopo completo do que foi feito.

### 3. Push da branch

- Faça push da branch com `git push -u origin <branch-atual>`

### 4. Criação do PR

Crie o PR usando `gh pr create` com:

- `--base develop`
- `--head <branch-atual>`
- **Título**: siga o padrão conventional commits (`feat`, `fix`, `refactor`, `test`, `chore`, etc). Curto e descritivo. Em inglês.
- **Body**: em **português**, seguindo o template abaixo

### Template do body

```
## Resumo

<Descrição clara e objetiva do que foi feito e por quê (2-3 frases)>

### O que foi feito

- <Lista detalhada de cada mudança significativa>
- <Use bullet points>
- <Agrupe por funcionalidade quando fizer sentido>

### Arquivos alterados

| Arquivo | Alteração |
|---|---|
| <caminho relativo simplificado do arquivo> | <descrição curta da alteração> |

## Plano de testes

- [x] <Testes automatizados que já passaram>
- [ ] <Verificações manuais necessárias>
```

### 5. Resultado

Retorne a URL do PR criado para o usuário.

## Regras

- O body do PR deve ser SEMPRE em português
- O título deve ser SEMPRE em inglês seguindo conventional commits
- Analise TODOS os commits, não apenas o último
- A tabela de arquivos deve usar nomes simplificados (sem o path completo repetitivo)
- O resumo deve explicar o "porquê" da mudança, não apenas o "o quê"
- Use HEREDOC para passar o body ao `gh pr create` para manter a formatação
- NÃO inclua assinatura do Claude (como "Co-Authored-By: Claude" ou "Gerado com Claude") no título, body ou commits
