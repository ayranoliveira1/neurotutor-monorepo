---
name: release
description: Cria um PR de release da develop para main com relatório detalhado de contribuições
user-invokable: true
---

Crie um Pull Request de release da branch `develop` para a branch `main`, com um relatório detalhado do que está sendo enviado para produção.

## Passos

### 1. Validação

- Verifique a branch atual com `git branch --show-current`
- Faça checkout para `develop` se não estiver nela: `git checkout develop`
- Atualize a branch: `git pull origin develop`
- Verifique se há commits à frente de main: `git log main..develop --oneline`
- Se não houver commits, **pare** e informe que não há mudanças para release

### 2. Coleta de dados

Execute em paralelo:

- `git log main..develop --oneline` para listar todos os commits
- `git log main..develop --format="%H %an" --no-merges` para commits por autor (sem merges)
- `git diff main...develop --stat` para ver os arquivos alterados
- `git diff main...develop --shortstat` para o resumo de linhas
- `gh pr list --base develop --state merged --json number,title,author,mergedAt,additions,deletions --limit 100` para listar os PRs mergeados em develop desde o último release

### 3. Análise de contribuições por autor

Para cada autor encontrado no log:

- Conte os commits: `git log main..develop --author="<nome>" --oneline --no-merges | wc -l`
- Conte as linhas adicionadas e removidas: `git log main..develop --author="<nome>" --pretty=tformat: --numstat --no-merges` e some as colunas
- Liste os PRs que esse autor criou (filtrar do resultado do `gh pr list`)
- Identifique as principais funcionalidades que o autor implementou (analisando os commits)

### 4. Resumo geral

Calcule:

- Total de commits (sem merges)
- Total de PRs mergeados
- Total de linhas adicionadas
- Total de linhas removidas
- Total de arquivos alterados
- Lista de funcionalidades/mudanças principais

### 5. Versão

- Leia a versão atual de `apps/api/package.json` (campo `"version"`)
- Pergunte ao usuário qual será a nova versão (sugerindo bump de patch, minor ou major baseado no escopo das mudanças)
- Atualize o campo `"version"` em **ambos** os arquivos:
  - `apps/api/package.json`
  - `apps/web/package.json`
- Faça commit da versão: `git add apps/api/package.json apps/web/package.json && git commit -m "chore: bump version to v<versão>"`
- IMPORTANTE: ambos os package.json devem SEMPRE ter a mesma versão

### 6. Push e criação do PR

- Faça push da develop: `git push origin develop`
- Crie o PR usando `gh pr create` com:
  - `--base main`
  - `--head develop`
  - **Título**: `release: v<versão> — <YYYY-MM-DD>` (ex: `release: v1.2.0 — 2026-02-17`)
  - **Body**: em **português**, seguindo o template abaixo

### Template do body

```
## Release v<versão>

<Descrição geral do que está sendo enviado para produção (2-3 frases)>

---

### Estatísticas gerais

| Métrica | Valor |
|---|---|
| Commits | <total de commits (sem merges)> |
| Pull Requests | <total de PRs mergeados> |
| Arquivos alterados | <total> |
| Linhas adicionadas | <+total> |
| Linhas removidas | <-total> |

---

### Contribuidores

#### <Nome do contribuidor 1>

| Métrica | Valor |
|---|---|
| Commits | <total> |
| Pull Requests | <total> |
| Linhas adicionadas | <+total> |
| Linhas removidas | <-total> |

**O que implementou:**
- <Lista das funcionalidades/mudanças>
- <Baseado nos commits e PRs do autor>

**PRs:**
- #<número> — <título do PR>

---

#### <Nome do contribuidor 2>
<Mesmo formato acima para cada contribuidor>

---

### Funcionalidades e mudanças incluídas

<Lista agrupada de todas as funcionalidades e mudanças, com referência aos PRs>

- **<Nome da feature/mudança>** (#<PR>) — <descrição curta>

---

### Pull Requests incluídos

| PR | Título | Autor | Adições | Remoções |
|---|---|---|---|---|
| #<número> | <título> | <autor> | +<adições> | -<remoções> |

---

### Plano de verificação

- [ ] Deploy em staging
- [ ] Smoke tests em staging
- [ ] Verificação manual das funcionalidades críticas
- [ ] Deploy em produção
- [ ] Monitoramento pós-deploy
```

### 7. Resultado

Retorne a URL do PR criado para o usuário.

## Regras

- O body do PR deve ser SEMPRE em português
- O título deve seguir o formato `release: v<versão> — <YYYY-MM-DD>` com a versão do package.json e a data atual
- Ambos `apps/api/package.json` e `apps/web/package.json` devem SEMPRE ter a mesma versão
- Analise TODOS os commits e PRs, não apenas os recentes
- Os dados de linhas devem ser precisos — use os comandos git para calcular
- Separe claramente as contribuições de cada autor
- Liste TODOS os PRs mergeados na seção de PRs incluídos
- Use HEREDOC para passar o body ao `gh pr create` para manter a formatação
- NÃO inclua assinatura do Claude no título, body ou commits
- Se um autor for um bot (dependabot, renovate, etc), agrupe como "Automações"
- Os PRs devem ser listados do mais recente para o mais antigo
