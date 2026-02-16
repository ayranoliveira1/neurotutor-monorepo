---
name: commit
description: Analisa alterações e gera comandos git de commit organizados por funcionalidade
user-invokable: true
---

Analise todas as alterações na branch atual e gere comandos git para o usuário rodar no terminal, dividindo as mudanças em múltiplos commits organizados por funcionalidade.

## Passos

### 1. Limpar staging area

- Se houver algo em staged (`git diff --cached --name-only`), remova com `git reset HEAD`
- Isso garante que TODAS as alterações sejam avaliadas do zero

### 2. Coletar alterações

Execute em paralelo:

- `git status --porcelain` para listar todos os arquivos alterados, criados e deletados
- `git diff` para ver o conteúdo das mudanças em arquivos tracked
- `git diff --stat` para ter uma visão geral das mudanças
- `git ls-files --others --exclude-standard` para listar arquivos untracked (novos)

Para cada arquivo novo (untracked), leia o conteúdo do arquivo para entender o que foi criado.

### 3. Analisar e agrupar

Analise TODAS as mudanças e agrupe por funcionalidade/contexto. Exemplos de agrupamento:

- Configurações (eslint, tsconfig, docker, prisma schema, env, package.json, etc)
- Migrations de banco de dados
- Entidades e repositórios de domínio
- Use cases de uma feature específica
- Controllers e módulos de uma feature específica
- Testes de uma feature específica
- Componentes frontend de uma feature específica
- Correções de bugs (agrupar por bug)
- Refatorações (agrupar por escopo)

Cada grupo vira um commit separado.

### 4. Ordenar commits

Ordene os commits na seguinte prioridade:

1. Configurações e infraestrutura (tooling, docker, env, packages)
2. Migrations de banco de dados
3. Backend: domínio (entidades, repositórios)
4. Backend: aplicação (use cases)
5. Backend: infra (controllers, módulos, mappers, presenters)
6. Backend: testes
7. Frontend: componentes e páginas
8. Frontend: testes

### 5. Gerar comandos

Para cada grupo, gere um bloco de comandos `git add` + `git commit` no formato:

```bash
# <breve descrição do que este commit faz>
git add <arquivo1> <arquivo2> ...
git commit -m "<mensagem do commit>"
```

Se a lista de arquivos for muito longa, use paths agrupados (ex: `apps/api/src/domain/application/use-cases/admin/user/`) quando possível.

### 6. Apresentar ao usuário

Mostre TODOS os comandos organizados em um único bloco de código que o usuário pode copiar e colar no terminal. Antes do bloco, dê um resumo breve do que cada commit faz.

## Padrão Conventional Commits

Todas as mensagens DEVEM seguir o padrão **Conventional Commits** (`<type>(<scope>): <description>`):

- `feat:` — nova funcionalidade
- `fix:` — correção de bug
- `refactor:` — refatoração sem mudança de comportamento
- `test:` — adição ou correção de testes
- `chore:` — tarefas de manutenção (configs, deps, scripts)
- `docs:` — documentação
- `style:` — formatação, lint (sem mudança de lógica)
- `perf:` — melhoria de performance
- `ci:` — mudanças em CI/CD
- `build:` — mudanças no build system ou deps externas

O `scope` é opcional mas recomendado para contexto (ex: `feat(admin): add user CRUD endpoints with pagination`).

## Regras

- As mensagens de commit devem ser SEMPRE em inglês
- As mensagens devem ser descritivas e explicar o "o quê" e o "porquê" (ex: `feat(admin): add user CRUD use cases with pagination and filtering`)
- NUNCA inclua assinatura do Claude (`Co-Authored-By: Claude`, `Generated with Claude`, etc) nos commits
- NUNCA faça `git add .` ou `git add -A` — sempre adicione arquivos específicos
- Se um arquivo contém credenciais ou segredos (.env, credentials, etc), AVISE o usuário e NÃO inclua no commit
- Separe os comandos com uma linha em branco entre cada grupo para facilitar a leitura
- Se não houver alterações, informe o usuário que não há nada para commitar
- O output deve ser SOMENTE os comandos para rodar — não execute nenhum comando git de escrita
