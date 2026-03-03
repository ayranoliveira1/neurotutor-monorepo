1. Dashboard de Desempenho / Analytics do Estudante  


- Gráfico de evolução de acertos ao longo do tempo
- Taxa de acerto por matéria (radar chart)
- Questões respondidas por dia/semana (heatmap estilo GitHub)
- Tempo médio por questão por matéria
- Matérias mais fracas (recomendação de foco)
- Streak de dias estudados consecutivos

2. Modo Simulado com Timer Global

- Timer regressivo global (ex: 4h para 100 questões)
- Caderno de questões com navegação por número
- Marcar questões para revisão
- Gabarito provisório antes de finalizar
- Resultado comparativo com outros usuários (percentil)

3. Revisão Inteligente (Spaced Repetition)

- Questões erradas entram automaticamente na fila de revisão
- Intervalos crescentes (1 dia → 3 dias → 7 dias → 30 dias)
- Deck de revisão diária personalizado
- Indicador de "força da memória" por assunto

4. Caderno de Erros

- Listar todas as questões que o aluno errou
- Filtrar por matéria/data/dificuldade
- Refazer questões erradas como nova lista
- Comentários/anotações do aluno por questão

5. Gamificação (XP, Streaks, Conquistas)

- XP por questão respondida (bônus por acerto)
- Streak de dias consecutivos de estudo
- Badges/Conquistas (ex: "100 questões de Português", "7 dias seguidos")
- Ranking semanal entre alunos (leaderboard)
- Nível do estudante baseado em XP

6. Comentários/Explicações nas Questões

- Explicação da resposta correta (campo no cadastro da questão)
- Comentário do professor (texto ou link de vídeo)
- Estatísticas da questão (% de acerto geral)

7. Plano de Estudos / Metas ✅ (já implementado!)

- Definir metas semanais
- Acompanhar progresso da meta
- Sugestão automática de matérias baseada em fraquezas
- Cronograma semanal de estudos

8. Importação em Massa de Questões (CSV/Excel)

- Upload de planilha com questões
- Preview e validação antes de importar
- Relatório de questões importadas/rejeitadas

9. Relatórios PDF do Desempenho

- Gerar PDF com relatório de desempenho do aluno
- Gráficos de evolução, pontos fortes/fracos
- Exportar resultados de simulados

10. Sistema de Flashcards

- Flashcards por matéria/tema
- Algoritmo de repetição espaçada
- Criação de flashcards pelo admin e pelo próprio aluno
- Modo de estudo rápido (5-10 minutos)

---

A #7 (Plano de Estudos) já foi implementada. Quer escolher a próxima para implementarmos?

---

## Novas Sugestões

11. Calendário de Estudos

- Visualização mensal/semanal das sessões de estudo realizadas
- Integração com planos de estudo (exibir metas e prazos no calendário)
- Agendamento de sessões futuras com lembrete
- Heatmap de atividade embutido na view de calendário
- Exportar para Google Calendar / iCal

12. Lembretes e Notificações de Estudo (Email + Push)

- Configurar horários de estudo diários ("Estudar às 20h")
- Notificações push via browser (Web Push API)
- Email de resumo semanal automático (questões respondidas, acertos, streaks)
- Alerta quando a meta semanal do plano de estudos estiver em risco
- Lembrete de revisão quando há questões prontas para spaced repetition

13. Progresso por Concurso / Edital

- Usuário seleciona o concurso/vestibular que está preparando (ENEM, OAB, Concurso X)
- Cada concurso tem um edital com matérias e pesos cadastrados pelo admin
- Dashboard mostra cobertura do edital: % de matérias praticadas vs total
- Recomendação automática de foco baseada nos pesos do edital e desempenho atual
- Admin gerencia lista de concursos e seus editais

14. Dashboard do Professor

- Professores acompanham o desempenho dos seus alunos em tempo real
- Identificar alunos com dificuldade em matérias específicas
- Enviar feedback personalizado por questão ou lista de exercícios
- Criar turmas e vincular alunos
- Relatório de engajamento da turma (quem está estudando, quem parou)

15. Questões Discursivas (Resposta Aberta)

- Suporte a questões de texto livre além de múltipla escolha
- Aluno digita a resposta e o professor avalia manualmente
- Opcional: correção automática com IA (comparar com gabarito modelo)
- Pontuação parcial configurável pelo professor
- Histórico de respostas discursivas com feedback do professor

16. Arenas (Duelo ao Vivo)

- Sala de competição em tempo real entre dois ou mais alunos
- Ambos respondem as mesmas questões com timer individual
- Pontuação por velocidade + acerto (acertar rápido vale mais XP)
- Convite via link ou código da sala
- Ranking de vitórias e histórico de duelos

17. Banco de Questões Colaborativo (Marketplace)

- Professores publicam seus bancos de questões para outros professores usarem
- Sistema de avaliação das questões (upvote/downvote, reviews)
- Filtros por matéria, nível de dificuldade, banca, ano
- Questões gratuitas e pagas (integração com pagamento já existente)
- Admin modera conteúdo antes de publicar

18. Anotações e Caderno Digital

- Anotações pessoais por matéria/tema (editor rich text)
- Vincular anotações a questões específicas
- Organização por tags e pastas
- Busca por conteúdo das anotações
- Exportar anotações como PDF ou Markdown

19. Certificados de Conclusão

- Certificado gerado automaticamente ao concluir um plano de estudo
- Certificado ao atingir metas de questões (ex: "500 questões de Direito")
- Layout customizável pelo admin (logo, nome do curso, assinatura)
- URL pública de verificação do certificado (anti-fraude)
- Exportar em PDF ou compartilhar no LinkedIn

20. Modo Estudo Focado (Pomodoro Integrado)

- Timer Pomodoro integrado na tela de resolução (25min estudo / 5min pausa)
- Estatísticas de sessões Pomodoro por dia/semana
- Bloqueia navegação para fora da plataforma durante a sessão (modo foco)
- Sons ambiente opcionais (chuva, café, biblioteca)
- Meta de pomodoros diários configurável pelo usuário

---

