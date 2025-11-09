# Checklist de Implementação - Backend

## Sistema de Gerenciamento de Horários Escolares

---

## 🗄️ 1. Modelagem e Migrations

### 1.1 Schema do Banco de Dados

- [ ] Criar tabela `schools` (instituições)
- [ ] Criar tabela `users` (usuários)
- [ ] Criar tabela `teachers` (professores)
- [ ] Criar tabela `grades` (anos/séries)
- [ ] Criar tabela `classes` (turmas)
- [ ] Criar tabela `subjects` (disciplinas)
- [ ] Criar tabela `rooms` (salas)
- [ ] Criar tabela `schedules` (horários)
- [ ] Criar tabela `schedule_configs` (configurações de grade)
- [ ] Criar tabela `teacher_availability` (disponibilidade)
- [ ] Criar tabela `teacher_subjects` (relação N:N)
- [ ] Criar tabela `substitutions` (substituições)
- [ ] Criar tabela `schedule_changes` (alterações)
- [ ] Criar tabela `audit_logs` (auditoria)
- [ ] Criar tabela `notifications` (notificações)
- [ ] Criar tabela `schedule_templates` (templates)
- [ ] Criar tabela `class_students` (relação turma-aluno)

### 1.2 Índices e Otimizações

- [ ] Criar índices para chaves estrangeiras
- [ ] Índices compostos para queries frequentes
- [ ] Índice em campos de busca (nome, código, email)
- [ ] Índices para filtros de data/hora
- [ ] Índices únicos para evitar duplicatas
- [ ] Análise de performance de queries

### 1.3 Constraints e Validações

- [ ] Constraints de chave primária
- [ ] Constraints de chave estrangeira
- [ ] Constraints de unicidade
- [ ] Constraints de NOT NULL apropriadas
- [ ] CHECK constraints para validações
- [ ] Triggers para auditoria (se necessário)

---

## 🔐 2. Autenticação e Autorização

### 2.1 Sistema de Autenticação

- [ ] Implementar registro de usuários
- [ ] Hash de senhas com bcrypt/argon2
- [ ] Implementar login (geração de JWT)
- [ ] Implementar logout
- [ ] Refresh token mechanism
- [ ] Middleware de autenticação
- [ ] Validação de tokens
- [ ] Recuperação de senha (token temporário)
- [ ] Reset de senha
- [ ] Confirmação de email (opcional)

### 2.2 Controle de Acesso (RBAC)

- [ ] Definir roles (admin, coordenador, professor, aluno, responsável)
- [ ] Middleware de autorização por role
- [ ] Implementar verificação de permissões
- [ ] Guards para rotas protegidas
- [ ] Autorização em nível de recurso
- [ ] Testes de controle de acesso

### 2.3 Segurança

- [ ] Implementar rate limiting por rota
- [ ] Proteção contra SQL Injection (usar ORM corretamente)
- [ ] Sanitização de inputs
- [ ] Validação de dados com biblioteca (Joi/Yup/Zod)
- [ ] Headers de segurança (helmet)
- [ ] CORS configurado adequadamente
- [ ] Proteção contra XSS
- [ ] Logs de tentativas de acesso inválidas

---

## 📦 3. Módulos e APIs - Gestão Básica

### 3.1 API de Usuários

- [ ] POST /api/users - Criar usuário
- [ ] GET /api/users - Listar usuários (paginado)
- [ ] GET /api/users/:id - Buscar usuário
- [ ] PUT /api/users/:id - Atualizar usuário
- [ ] DELETE /api/users/:id - Deletar/desativar usuário
- [ ] GET /api/users/me - Perfil do usuário logado
- [ ] PUT /api/users/me - Atualizar perfil próprio
- [ ] POST /api/users/:id/photo - Upload de foto
- [ ] Validações de negócio
- [ ] Testes unitários e de integração

### 3.2 API de Instituições

- [ ] POST /api/schools - Criar instituição
- [ ] GET /api/schools - Listar instituições
- [ ] GET /api/schools/:id - Buscar instituição
- [ ] PUT /api/schools/:id - Atualizar instituição
- [ ] DELETE /api/schools/:id - Deletar instituição
- [ ] POST /api/schools/:id/logo - Upload de logo
- [ ] GET /api/schools/:id/config - Configurações
- [ ] PUT /api/schools/:id/config - Atualizar configurações
- [ ] Validações
- [ ] Testes

### 3.3 API de Anos/Séries

- [ ] POST /api/grades - Criar ano/série
- [ ] GET /api/grades - Listar anos/séries
- [ ] GET /api/grades/:id - Buscar ano/série
- [ ] PUT /api/grades/:id - Atualizar
- [ ] DELETE /api/grades/:id - Deletar
- [ ] Validações (ordem, modalidade)
- [ ] Testes

### 3.4 API de Turmas

- [ ] POST /api/classes - Criar turma
- [ ] GET /api/classes - Listar turmas (filtros: turno, ano, etc)
- [ ] GET /api/classes/:id - Buscar turma
- [ ] PUT /api/classes/:id - Atualizar turma
- [ ] DELETE /api/classes/:id - Deletar turma
- [ ] POST /api/classes/:id/students - Adicionar alunos
- [ ] GET /api/classes/:id/students - Listar alunos da turma
- [ ] DELETE /api/classes/:id/students/:studentId - Remover aluno
- [ ] Validações
- [ ] Testes

### 3.5 API de Disciplinas

- [ ] POST /api/subjects - Criar disciplina
- [ ] GET /api/subjects - Listar disciplinas
- [ ] GET /api/subjects/:id - Buscar disciplina
- [ ] PUT /api/subjects/:id - Atualizar disciplina
- [ ] DELETE /api/subjects/:id - Deletar disciplina
- [ ] GET /api/subjects/:id/teachers - Professores habilitados
- [ ] Validações (carga horária, código único)
- [ ] Testes

### 3.6 API de Professores

- [ ] POST /api/teachers - Criar professor
- [ ] GET /api/teachers - Listar professores
- [ ] GET /api/teachers/:id - Buscar professor
- [ ] PUT /api/teachers/:id - Atualizar professor
- [ ] DELETE /api/teachers/:id - Deletar professor
- [ ] POST /api/teachers/:id/subjects - Adicionar disciplinas
- [ ] GET /api/teachers/:id/subjects - Listar disciplinas
- [ ] DELETE /api/teachers/:id/subjects/:subjectId - Remover disciplina
- [ ] PUT /api/teachers/:id/availability - Definir disponibilidade
- [ ] GET /api/teachers/:id/availability - Buscar disponibilidade
- [ ] Validações
- [ ] Testes

### 3.7 API de Salas

- [ ] POST /api/rooms - Criar sala
- [ ] GET /api/rooms - Listar salas
- [ ] GET /api/rooms/:id - Buscar sala
- [ ] PUT /api/rooms/:id - Atualizar sala
- [ ] DELETE /api/rooms/:id - Deletar/desativar sala
- [ ] GET /api/rooms/:id/schedule - Horários da sala
- [ ] GET /api/rooms/available - Salas disponíveis (filtro por horário)
- [ ] Validações
- [ ] Testes

---

## 📅 4. Módulo de Horários (Core)

### 4.1 API de Configuração de Grade

- [ ] POST /api/schedule-configs - Criar configuração
- [ ] GET /api/schedule-configs - Listar configurações
- [ ] GET /api/schedule-configs/:id - Buscar configuração
- [ ] PUT /api/schedule-configs/:id - Atualizar configuração
- [ ] Definir períodos (horário início/fim de cada aula)
- [ ] Definir dias da semana ativos
- [ ] Definir intervalos
- [ ] Validações
- [ ] Testes

### 4.2 API de Horários (Schedules)

- [ ] POST /api/schedules - Criar horário individual
- [ ] POST /api/schedules/bulk - Criar múltiplos horários
- [ ] GET /api/schedules - Listar horários (com filtros)
- [ ] GET /api/schedules/:id - Buscar horário
- [ ] PUT /api/schedules/:id - Atualizar horário
- [ ] DELETE /api/schedules/:id - Deletar horário
- [ ] GET /api/schedules/class/:classId - Grade da turma
- [ ] GET /api/schedules/teacher/:teacherId - Grade do professor
- [ ] GET /api/schedules/room/:roomId - Ocupação da sala
- [ ] PUT /api/schedules/:id/publish - Publicar horário
- [ ] Validações complexas
- [ ] Testes extensivos

### 4.3 Validação de Conflitos

- [ ] Serviço de validação de conflitos
- [ ] Validar conflito de professor
- [ ] Validar conflito de sala
- [ ] Validar conflito de turma
- [ ] Validar disponibilidade do professor
- [ ] Validar carga horária máxima do professor
- [ ] Identificar janelas de horário
- [ ] Validar carga horária mínima da disciplina
- [ ] Retornar lista detalhada de conflitos
- [ ] Testes de casos extremos

### 4.4 Geração Automática de Horários

- [ ] Endpoint POST /api/schedules/generate
- [ ] Implementar algoritmo básico (backtracking)
- [ ] Implementar algoritmo avançado (genetic algorithm/constraint satisfaction)
- [ ] Parâmetros configuráveis
- [ ] Priorizar distribuição uniforme
- [ ] Evitar janelas de professores
- [ ] Respeitar preferências
- [ ] Calcular score de qualidade da grade
- [ ] Modo dry-run (simulação)
- [ ] Testes com diferentes cenários

### 4.5 Templates de Horários

- [ ] POST /api/schedule-templates - Salvar como template
- [ ] GET /api/schedule-templates - Listar templates
- [ ] GET /api/schedule-templates/:id - Buscar template
- [ ] POST /api/schedule-templates/:id/apply - Aplicar template
- [ ] DELETE /api/schedule-templates/:id - Deletar template
- [ ] Validações
- [ ] Testes

---

## 🔄 5. Módulo de Substituições e Alterações

### 5.1 API de Substituições

- [ ] POST /api/substitutions - Criar substituição
- [ ] GET /api/substitutions - Listar substituições
- [ ] GET /api/substitutions/:id - Buscar substituição
- [ ] PUT /api/substitutions/:id - Atualizar substituição
- [ ] DELETE /api/substitutions/:id - Cancelar substituição
- [ ] GET /api/substitutions/pending - Substituições pendentes
- [ ] GET /api/substitutions/teacher/:teacherId - Substituições do professor
- [ ] Validações (professor disponível, mesma disciplina, etc)
- [ ] Testes

### 5.2 API de Alterações Permanentes

- [ ] PUT /api/schedules/:id/change - Registrar alteração permanente
- [ ] GET /api/schedule-changes - Histórico de alterações
- [ ] GET /api/schedule-changes/:scheduleId - Alterações de um horário
- [ ] Auditoria completa
- [ ] Validações
- [ ] Testes

### 5.3 Bloqueios e Reservas

- [ ] POST /api/schedules/block - Bloquear horário
- [ ] GET /api/schedules/blocks - Listar bloqueios
- [ ] DELETE /api/schedules/blocks/:id - Remover bloqueio
- [ ] Integração com validação de conflitos
- [ ] Testes

---

## 📊 6. Módulo de Relatórios

### 6.1 Relatório de Carga Horária

- [ ] GET /api/reports/workload/teachers - Carga horária por professor
- [ ] GET /api/reports/workload/teacher/:id - Carga de um professor
- [ ] GET /api/reports/workload/subjects - Carga por disciplina
- [ ] Cálculos e agregações
- [ ] Formato JSON e exportação
- [ ] Testes

### 6.2 Relatório de Distribuição

- [ ] GET /api/reports/distribution/subjects - Distribuição de disciplinas
- [ ] GET /api/reports/distribution/class/:classId - Distribuição por turma
- [ ] Análise de cumprimento curricular
- [ ] Testes

### 6.3 Relatório de Ocupação

- [ ] GET /api/reports/occupancy/rooms - Taxa de ocupação por sala
- [ ] GET /api/reports/occupancy/room/:id - Ocupação de uma sala
- [ ] Identificar salas subutilizadas
- [ ] Testes

### 6.4 Relatório de Conflitos

- [ ] GET /api/reports/conflicts - Conflitos atuais
- [ ] GET /api/reports/conflicts/history - Histórico
- [ ] Indicadores de qualidade
- [ ] Testes

### 6.5 Dashboard (Métricas)

- [ ] GET /api/dashboard/metrics - KPIs principais
- [ ] Total de aulas alocadas
- [ ] Taxa de conflitos
- [ ] Taxa de ocupação média
- [ ] Professores com sobrecarga
- [ ] Alertas e pendências
- [ ] Cache de métricas
- [ ] Testes

---

## 🔔 7. Módulo de Notificações

### 7.1 Sistema de Notificações

- [ ] POST /api/notifications - Criar notificação
- [ ] GET /api/notifications - Listar notificações do usuário
- [ ] GET /api/notifications/:id - Buscar notificação
- [ ] PUT /api/notifications/:id/read - Marcar como lida
- [ ] PUT /api/notifications/read-all - Marcar todas como lidas
- [ ] DELETE /api/notifications/:id - Deletar notificação
- [ ] Serviço de envio de notificações
- [ ] Testes

### 7.2 Notificações por Email

- [ ] Configurar serviço de email (SendGrid/AWS SES)
- [ ] Templates de email
- [ ] Fila de emails (Bull/BullMQ)
- [ ] Workers para processar fila
- [ ] Email de alteração de horário
- [ ] Email de substituição
- [ ] Email de publicação de grade
- [ ] Logs de emails enviados
- [ ] Testes

### 7.3 Notificações Push (PWA)

- [ ] Implementar Web Push Notifications (opcional)
- [ ] Registro de service worker
- [ ] Endpoint para subscription
- [ ] Envio de push notifications
- [ ] Testes

---

## 📤 8. Exportação e Importação

### 8.1 Exportação de Dados

- [ ] GET /api/export/schedules/pdf - Exportar grade em PDF
- [ ] GET /api/export/schedules/excel - Exportar grade em Excel
- [ ] GET /api/export/schedules/csv - Exportar em CSV
- [ ] GET /api/export/schedules/ical - Exportar em iCal
- [ ] Biblioteca para geração de PDF (puppeteer/pdfkit)
- [ ] Biblioteca para Excel (exceljs)
- [ ] Templates de exportação
- [ ] Testes

### 8.2 Importação de Dados

- [ ] POST /api/import/teachers - Importar professores (CSV/Excel)
- [ ] POST /api/import/students - Importar alunos
- [ ] POST /api/import/subjects - Importar disciplinas
- [ ] POST /api/import/classes - Importar turmas
- [ ] Validação de dados importados
- [ ] Relatório de erros de importação
- [ ] Processamento em background (fila)
- [ ] Testes

---

## 🔗 9. Integrações e APIs Externas

### 9.1 API Pública

- [ ] Documentação Swagger/OpenAPI
- [ ] Versionamento de API (v1, v2)
- [ ] Rate limiting por cliente
- [ ] API Keys para autenticação
- [ ] Webhooks para eventos importantes
- [ ] Logs de uso da API
- [ ] Testes

### 9.2 Compartilhamento Público

- [ ] GET /api/public/schedules/:token - Visualização pública
- [ ] Geração de token único por turma/professor
- [ ] QR Code generation
- [ ] Link de compartilhamento
- [ ] Configuração de permissões públicas
- [ ] Testes

---

## 🧪 10. Testes

### 10.1 Testes Unitários

- [ ] Configurar framework de testes (Jest/Vitest)
- [ ] Testes de services
- [ ] Testes de validações
- [ ] Testes de utils
- [ ] Mocks adequados
- [ ] Cobertura > 80%

### 10.2 Testes de Integração

- [ ] Testes de endpoints (supertest)
- [ ] Testes de fluxos completos
- [ ] Testes de autenticação
- [ ] Testes de autorização
- [ ] Banco de dados de testes
- [ ] Setup e teardown adequados

### 10.3 Testes E2E

- [ ] Cenários críticos de negócio
- [ ] Fluxo de criação de horário completo
- [ ] Fluxo de geração automática
- [ ] Fluxo de substituição

### 10.4 Testes de Performance

- [ ] Load testing (k6/Artillery)
- [ ] Stress testing
- [ ] Testes de queries lentas
- [ ] Otimizações baseadas em resultados

---

## 📝 11. Logs e Monitoramento

### 11.1 Sistema de Logs

- [ ] Configurar logger estruturado (Winston/Pino)
- [ ] Logs de requisições HTTP
- [ ] Logs de erros com stack trace
- [ ] Logs de operações críticas
- [ ] Níveis de log adequados (debug, info, warn, error)
- [ ] Rotação de logs
- [ ] Centralização de logs (ELK/Datadog/Sentry)

### 11.2 Auditoria

- [ ] Implementar tabela de audit_logs
- [ ] Registrar todas operações CRUD importantes
- [ ] Identificar usuário responsável
- [ ] Timestamp de operações
- [ ] Dados before/after
- [ ] Endpoint para consulta de logs de auditoria

### 11.3 Monitoramento

- [ ] Health check endpoint (GET /health)
- [ ] Métricas de aplicação (Prometheus)
- [ ] Monitoramento de performance (APM)
- [ ] Alertas para erros críticos
- [ ] Dashboard de monitoramento

---

## 🛠️ 12. DevOps e Infraestrutura

### 12.1 Containerização

- [ ] Criar Dockerfile otimizado
- [ ] Criar docker-compose.yml (dev)
- [ ] Configurar volumes para desenvolvimento
- [ ] Multi-stage build para produção
- [ ] .dockerignore apropriado

### 12.2 CI/CD

- [ ] Configurar pipeline de CI (GitHub Actions/GitLab CI)
- [ ] Executar testes automaticamente
- [ ] Análise de código estático (SonarQube)
- [ ] Build automatizado
- [ ] Deploy automatizado (staging/production)
- [ ] Rollback automático em caso de falha

### 12.3 Ambiente de Produção

- [ ] Configurar servidor/cloud
- [ ] Configurar banco de dados de produção
- [ ] Setup de backup automático
- [ ] Configurar CDN para assets
- [ ] SSL/TLS configurado
- [ ] Firewall e security groups
- [ ] Load balancer (se necessário)
- [ ] Auto-scaling (se necessário)

### 12.4 Documentação de Deploy

- [ ] Instruções de deploy manual
- [ ] Variáveis de ambiente necessárias
- [ ] Comandos de migrations
- [ ] Procedimentos de backup/restore
- [ ] Troubleshooting comum

---

## 🔧 13. Otimizações e Performance

### 13.1 Cache

- [ ] Implementar cache Redis
- [ ] Cache de consultas frequentes
- [ ] Cache de sessões de usuário
- [ ] Invalidação de cache adequada
- [ ] TTL configurado por tipo de dado

### 13.2 Otimização de Queries

- [ ] Analisar queries lentas
- [ ] Adicionar índices necessários
- [ ] Evitar N+1 queries (eager loading)
- [ ] Paginação em listagens
- [ ] Query optimization
- [ ] Connection pooling adequado

### 13.3 Background Jobs

- [ ] Implementar sistema de filas (Bull/BullMQ)
- [ ] Worker para processamento assíncrono
- [ ] Jobs de envio de email
- [ ] Jobs de geração de relatórios
- [ ] Jobs de importação de dados
- [ ] Retry strategy para jobs falhados
- [ ] Dashboard de monitoramento de filas

---

## 📚 14. Documentação

### 14.1 Documentação Técnica

- [ ] README.md completo
- [ ] Documentação da arquitetura
- [ ] Diagrama ER do banco de dados
- [ ] Documentação de APIs (Swagger)
- [ ] Guia de contribuição
- [ ] Code comments em pontos críticos

### 14.2 Documentação de Negócio

- [ ] Regras de negócio documentadas
- [ ] Fluxos principais documentados
- [ ] Casos de uso
- [ ] Glossário de termos

---

## ✅ 15. Finalização

### 15.1 Revisão Final

- [ ] Code review completo
- [ ] Verificar todos os testes passando
- [ ] Verificar cobertura de testes
- [ ] Análise de segurança (OWASP)
- [ ] Verificar performance
- [ ] Verificar logs e monitoramento funcionando

### 15.2 Preparação para Produção

- [ ] Seed de dados iniciais
- [ ] Scripts de migração testados
- [ ] Backup inicial
- [ ] Documentação de deploy final
- [ ] Plano de rollback
- [ ] Monitoramento configurado
- [ ] Alertas configurados

### 15.3 Handover

- [ ] Treinamento da equipe
- [ ] Documentação entregue
- [ ] Credenciais compartilhadas (de forma segura)
- [ ] Procedimentos operacionais documentados

---

## 📋 Resumo de Prioridades

### Prioridade 1 (MVP)

- Setup inicial e banco de dados
- Autenticação e autorização
- CRUDs básicos (usuários, turmas, professores, disciplinas, salas)
- Criação manual de horários com validação de conflitos
- Visualização de grades

### Prioridade 2 (Funcionalidades Avançadas)

- Geração automática de horários
- Sistema de substituições
- Relatórios básicos
- Notificações por email
- Exportações

### Prioridade 3 (Otimizações e Extras)

- Dashboard e métricas
- Relatórios avançados
- Importações de dados
- API pública
- Otimizações de performance

---

**Última atualização**: Outubro de 2025
