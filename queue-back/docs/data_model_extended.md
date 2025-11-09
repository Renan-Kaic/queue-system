# Modelo de Dados Estendido - Sistema de Gerenciamento de Horários Escolares

## 1. Visão Geral das Mudanças

Este documento define o modelo de dados completo para o sistema de gerenciamento de horários escolares com suporte a:

- **Departamentos**: Estrutura administrativa paralela com agendas independentes
- **Temporalidade**: Horários temporários, turmas temporárias, disponibilidades pontuais
- **Governança Colaborativa**: Comissões de planejamento com rastreabilidade de decisões
- **Flexibilidade**: Suporte a múltiplas configurações simultâneas

---

## 2. Tabelas do Núcleo Institucional

### SCHOOLS

Armazena dados das instituições de ensino.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| name | VARCHAR(255) | NOT NULL, UNIQUE | Nome da instituição |
| logo | VARCHAR(500) | NULLABLE | URL ou caminho do logo |
| address | TEXT | NULLABLE | Endereço completo |
| phone | VARCHAR(20) | NULLABLE | Telefone principal |
| email | VARCHAR(255) | NULLABLE | Email de contato |
| website | VARCHAR(500) | NULLABLE | Site da instituição |
| status | ENUM | NOT NULL, DEFAULT 'active' | active, inactive |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices**: `(name)`, `(status)`

---

### DEPARTMENTS

Define departamentos administrativos da instituição (ex: Fundamental I, Fundamental II, Médio, Técnico).

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| school_id | UUID | FOREIGN KEY (schools.id), NOT NULL | Instituição |
| name | VARCHAR(255) | NOT NULL | Nome do departamento |
| code | VARCHAR(50) | NOT NULL, UNIQUE per school | Código único |
| description | TEXT | NULLABLE | Descrição/objetivos |
| head_teacher_id | UUID | FOREIGN KEY (teachers.id), NULLABLE | Professor chefe |
| budget | DECIMAL(12,2) | NULLABLE | Orçamento alocado |
| status | ENUM | NOT NULL, DEFAULT 'active' | active, inactive |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices**: `(school_id, code)`, `(status)`, `(head_teacher_id)`

---

### DEPARTMENT_SCHEDULE_CONFIG

Configurações de grade horária específicas por departamento.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| department_id | UUID | FOREIGN KEY (departments.id), NOT NULL | Departamento |
| period_start | DATE | NOT NULL | Data de início do período |
| period_end | DATE | NOT NULL | Data de término do período |
| active_weekdays | VARCHAR(7) | NOT NULL | Dias ativos (ex: "1234560" = seg a sab) |
| default_period_duration | INT | NOT NULL | Duração padrão em minutos |
| break_configs_json | JSON | NULLABLE | Configuração de intervalos |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices**: `(department_id, period_start)`

**Nota**: `break_configs_json` armazena array de objetos com período_número, tipo (break/lesson), duração_minutos

---

## 3. Tabelas de Pessoas e Permissões

### USERS

Usuários do sistema (estrutura base).

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email (login) |
| password_hash | VARCHAR(255) | NOT NULL | Senha hash (bcrypt) |
| name | VARCHAR(255) | NOT NULL | Nome completo |
| phone | VARCHAR(20) | NULLABLE | Telefone de contato |
| photo_url | VARCHAR(500) | NULLABLE | URL da foto de perfil |
| status | ENUM | NOT NULL, DEFAULT 'active' | active, inactive, suspended |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices**: `(email)`, `(status)`

---

### USER_ROLES

Associação de usuários com papéis na instituição.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| user_id | UUID | FOREIGN KEY (users.id), NOT NULL | Usuário |
| school_id | UUID | FOREIGN KEY (schools.id), NOT NULL | Instituição |
| role | ENUM | NOT NULL | admin, coordinator, teacher, student, parent, department_head, committee_member |
| assigned_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atribuição |
| removed_at | TIMESTAMP | NULLABLE | Data de remoção (soft delete) |

**Índices**: `(user_id, school_id)`, `(role)`, `UNIQUE(user_id, school_id, role)` (sem removed_at)

---

### DEPARTMENT_MEMBERSHIPS

Associação de pessoas com departamentos.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| user_id | UUID | FOREIGN KEY (users.id), NOT NULL | Usuário |
| department_id | UUID | FOREIGN KEY (departments.id), NOT NULL | Departamento |
| role | ENUM | NOT NULL | head, instructor, support |
| start_date | DATE | NOT NULL | Data de início |
| end_date | DATE | NULLABLE | Data de término (sem valor = indefinido) |
| status | ENUM | NOT NULL, DEFAULT 'active' | active, inactive |

**Índices**: `(user_id, department_id)`, `(department_id)`, `UNIQUE(user_id, department_id)` (com status = active)

---

### COMMITTEES

Comissões responsáveis pelo planejamento e aprovação de horários.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| school_id | UUID | FOREIGN KEY (schools.id), NOT NULL | Instituição |
| department_id | UUID | FOREIGN KEY (departments.id), NULLABLE | Departamento (NULL = comissão escolar) |
| name | VARCHAR(255) | NOT NULL | Nome da comissão |
| description | TEXT | NULLABLE | Descrição de responsabilidades |
| objective | TEXT | NULLABLE | Objetivo/meta |
| created_by | UUID | FOREIGN KEY (users.id), NOT NULL | Criado por |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| status | ENUM | NOT NULL, DEFAULT 'active' | active, inactive |

**Índices**: `(school_id)`, `(department_id)`, `(status)`

---

### COMMITTEE_MEMBERS

Membros das comissões.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| committee_id | UUID | FOREIGN KEY (committees.id), NOT NULL | Comissão |
| user_id | UUID | FOREIGN KEY (users.id), NOT NULL | Membro |
| role | ENUM | NOT NULL | coordinator, member, observer |
| assigned_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de designação |
| removed_at | TIMESTAMP | NULLABLE | Data de remoção |
| permissions_json | JSON | NULLABLE | Permissões específicas do membro |

**Índices**: `(committee_id)`, `(user_id)`, `UNIQUE(committee_id, user_id)` (sem removed_at)

**Nota**: `permissions_json` pode conter: `{can_approve, can_edit, can_resolve_conflicts, can_veto}`

---

### COMMITTEE_DECISIONS

Registro formal de decisões tomadas por comissões.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| committee_id | UUID | FOREIGN KEY (committees.id), NOT NULL | Comissão responsável |
| decision_type | ENUM | NOT NULL | schedule_approved, conflict_resolved, resource_allocated, policy_changed, other |
| related_entity_type | VARCHAR(50) | NOT NULL | Tipo de entidade (schedule, conflict, etc) |
| related_entity_id | UUID | NOT NULL | ID da entidade relacionada |
| decision_json | JSON | NOT NULL | Conteúdo da decisão (flexível) |
| decided_by | UUID | FOREIGN KEY (users.id), NOT NULL | Quem tomou a decisão |
| decided_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Quando foi decidido |
| rationale | TEXT | NULLABLE | Justificativa/motivo |
| status | ENUM | NOT NULL, DEFAULT 'approved' | approved, pending_review, rejected |

**Índices**: `(committee_id)`, `(related_entity_type, related_entity_id)`, `(decided_at)`

---

## 4. Tabelas de Estrutura Escolar

### GRADES

Anos/séries da instituição.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| school_id | UUID | FOREIGN KEY (schools.id), NOT NULL | Instituição |
| name | VARCHAR(100) | NOT NULL | Nome (ex: "6º ano", "1º Médio") |
| code | VARCHAR(50) | NOT NULL, UNIQUE per school | Código |
| modality | ENUM | NOT NULL | fundamental_i, fundamental_ii, high_school, technical, adult_education |
| order | INT | NOT NULL | Ordem de exibição |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices**: `(school_id, order)`, `(code)`

---

### CLASSES

Turmas permanentes vinculadas a uma série.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| school_id | UUID | FOREIGN KEY (schools.id), NOT NULL | Instituição |
| grade_id | UUID | FOREIGN KEY (grades.id), NOT NULL | Série |
| department_id | UUID | FOREIGN KEY (departments.id), NULLABLE | Departamento |
| name | VARCHAR(100) | NOT NULL | Nome (ex: "6ºA", "1ºB") |
| code | VARCHAR(50) | NOT NULL, UNIQUE per school | Código único |
| shift | ENUM | NOT NULL | morning, afternoon, evening, full_time |
| capacity | INT | NOT NULL | Capacidade de alunos |
| default_room_id | UUID | FOREIGN KEY (rooms.id), NULLABLE | Sala padrão |
| status | ENUM | NOT NULL, DEFAULT 'active' | active, inactive |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices**: `(school_id, grade_id)`, `(department_id)`, `(code)`, `(shift)`

---

### TEMPORARY_CLASSES

Turmas com duração limitada (workshops, cursos, projetos especiais).

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| school_id | UUID | FOREIGN KEY (schools.id), NOT NULL | Instituição |
| department_id | UUID | FOREIGN KEY (departments.id), NULLABLE | Departamento |
| name | VARCHAR(255) | NOT NULL | Nome da turma temporária |
| code | VARCHAR(50) | NOT NULL | Código |
| start_date | DATE | NOT NULL | Data de início |
| end_date | DATE | NOT NULL | Data de término |
| shift | ENUM | NOT NULL | morning, afternoon, evening, full_time |
| capacity | INT | NOT NULL | Capacidade |
| purpose | ENUM | NOT NULL | workshop, course, extension, special_project, exam_preparation, remedial |
| created_by | UUID | FOREIGN KEY (users.id), NOT NULL | Criado por |
| status | ENUM | NOT NULL, DEFAULT 'active' | active, inactive, completed |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices**: `(school_id)`, `(department_id)`, `(start_date, end_date)`, `(purpose)`

---

### CLASS_STUDENTS

Matrícula de alunos em turmas.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| class_id | UUID | FOREIGN KEY (classes.id), NULLABLE | Turma permanente |
| temporary_class_id | UUID | FOREIGN KEY (temporary_classes.id), NULLABLE | Turma temporária |
| student_id | UUID | FOREIGN KEY (users.id), NOT NULL | Aluno |
| enrolled_date | DATE | NOT NULL | Data de matrícula |
| removed_date | DATE | NULLABLE | Data de remoção |
| status | ENUM | NOT NULL, DEFAULT 'active' | active, inactive, transferred |

**Restrição**: Exatamente um de `class_id` ou `temporary_class_id` deve ser NOT NULL

**Índices**: `(class_id)`, `(temporary_class_id)`, `(student_id)`, `(status)`

---

## 5. Tabelas de Recursos Humanos

### TEACHERS

Professores da instituição.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| user_id | UUID | FOREIGN KEY (users.id), NOT NULL, UNIQUE | Usuário associado |
| specialization_area | VARCHAR(255) | NULLABLE | Área de especialização |
| contracted_hours | INT | NOT NULL | Horas contratadas semanalmente |
| primary_department_id | UUID | FOREIGN KEY (departments.id), NOT NULL | Departamento principal |
| status | ENUM | NOT NULL, DEFAULT 'active' | active, inactive, on_leave |
| hire_date | DATE | NOT NULL | Data de contratação |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices**: `(user_id)`, `(primary_department_id)`, `(status)`

---

### TEACHER_DEPARTMENTS

Associação de professores com múltiplos departamentos.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| teacher_id | UUID | FOREIGN KEY (teachers.id), NOT NULL | Professor |
| department_id | UUID | FOREIGN KEY (departments.id), NOT NULL | Departamento secundário |
| secondary_allocation_hours | INT | NOT NULL | Horas alocadas neste departamento |
| role | ENUM | NOT NULL | primary, secondary, collaborative |
| start_date | DATE | NOT NULL | Data de início |
| end_date | DATE | NULLABLE | Data de término |

**Índices**: `(teacher_id)`, `(department_id)`, `UNIQUE(teacher_id, department_id)` (sem end_date)

---

### TEACHER_QUALIFICATIONS

Qualificações e certificações de professores.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| teacher_id | UUID | FOREIGN KEY (teachers.id), NOT NULL | Professor |
| subject_id | UUID | FOREIGN KEY (subjects.id), NOT NULL | Disciplina |
| qualification_level | ENUM | NOT NULL | bachelor, specialist, master, doctorate |
| certification_date | DATE | NOT NULL | Data da certificação |
| expiration_date | DATE | NULLABLE | Data de expiração (se houver) |

**Índices**: `(teacher_id)`, `(subject_id)`, `UNIQUE(teacher_id, subject_id)`

---

### TEACHER_AVAILABILITY

Disponibilidade semanal recorrente de professores.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| teacher_id | UUID | FOREIGN KEY (teachers.id), NOT NULL | Professor |
| weekday | INT | NOT NULL | Dia da semana (0-6, seg-dom) |
| period_id | UUID | FOREIGN KEY (schedule_periods.id), NULLABLE | Período específico |
| available | BOOLEAN | NOT NULL, DEFAULT true | Disponível neste período |
| preference_level | ENUM | NOT NULL | unavailable, low, medium, high, preferred |
| notes | TEXT | NULLABLE | Observações |

**Índices**: `(teacher_id, weekday)`, `UNIQUE(teacher_id, weekday, period_id)`

---

### TEACHER_TEMPORARY_AVAILABILITY

Indisponibilidades ou restrições temporárias de professores.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| teacher_id | UUID | FOREIGN KEY (teachers.id), NOT NULL | Professor |
| start_date | DATE | NOT NULL | Data de início |
| end_date | DATE | NOT NULL | Data de término |
| weekday | INT | NULLABLE | Dia específico (-1 = todos os dias) |
| period_id | UUID | FOREIGN KEY (schedule_periods.id), NULLABLE | Período específico (NULL = o dia todo) |
| availability_status | ENUM | NOT NULL | available, unavailable, restricted |
| reason | VARCHAR(255) | NULLABLE | Motivo (doença, congresso, etc) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices**: `(teacher_id, start_date, end_date)`, `(availability_status)`

---

## 6. Tabelas de Recursos Físicos

### ROOMS

Salas e ambientes da instituição.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| school_id | UUID | FOREIGN KEY (schools.id), NOT NULL | Instituição |
| department_id | UUID | FOREIGN KEY (departments.id), NULLABLE | Departamento (NULL = compartilhada) |
| name | VARCHAR(255) | NOT NULL | Nome (ex: "Sala 101") |
| code | VARCHAR(50) | NOT NULL, UNIQUE per school | Código único |
| type | ENUM | NOT NULL | classroom, lab, gym, auditorium, workshop, library, other |
| capacity | INT | NOT NULL | Capacidade de pessoas |
| resources_json | JSON | NULLABLE | Recursos disponíveis (projetor, computadores, etc) |
| status | ENUM | NOT NULL, DEFAULT 'active' | active, inactive, maintenance |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices**: `(school_id)`, `(department_id)`, `(type)`, `(code)`

**Nota**: `resources_json` pode conter: `{projector, computers, whiteboard, smartboard, sound_system, etc}`

---

### ROOM_SCHEDULE_CONFIG

Configuração de disponibilidade e horário de salas.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| room_id | UUID | FOREIGN KEY (rooms.id), NOT NULL, UNIQUE | Sala |
| available_from_time | TIME | NOT NULL | Horário de abertura |
| available_to_time | TIME | NOT NULL | Horário de fechamento |
| available_weekdays | VARCHAR(7) | NOT NULL | Dias disponíveis (ex: "1234560") |
| status | ENUM | NOT NULL, DEFAULT 'active' | active, inactive |

**Índices**: `(room_id)`

---

### ROOM_MAINTENANCE

Registros de manutenção de salas.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| room_id | UUID | FOREIGN KEY (rooms.id), NOT NULL | Sala |
| start_date | DATE | NOT NULL | Data de início da manutenção |
| end_date | DATE | NOT NULL | Data de término da manutenção |
| maintenance_type | ENUM | NOT NULL | preventive, corrective, emergency |
| description | TEXT | NOT NULL | Descrição dos trabalhos |
| status | ENUM | NOT NULL, DEFAULT 'scheduled' | scheduled, in_progress, completed |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |

**Índices**: `(room_id, start_date)`, `(status)`

---

## 7. Tabelas de Conteúdo Curricular

### SUBJECTS

Disciplinas oferecidas pela instituição.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| school_id | UUID | FOREIGN KEY (schools.id), NOT NULL | Instituição |
| department_id | UUID | FOREIGN KEY (departments.id), NULLABLE | Departamento (NULL = toda escola) |
| name | VARCHAR(255) | NOT NULL | Nome da disciplina |
| code | VARCHAR(50) | NOT NULL, UNIQUE per school | Código único |
| weekly_hours_required | INT | NOT NULL | Horas semanais obrigatórias |
| knowledge_area | VARCHAR(100) | NULLABLE | Área (ex: Linguagens, Matemática) |
| color_hex | VARCHAR(7) | NULLABLE | Cor para visualização (#RRGGBB) |
| is_mandatory | BOOLEAN | NOT NULL, DEFAULT true | É obrigatória |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices**: `(school_id)`, `(code)`, `(knowledge_area)`

---

### SUBJECT_PREREQUISITES

Pré-requisitos entre disciplinas.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| subject_id | UUID | FOREIGN KEY (subjects.id), NOT NULL | Disciplina que requer pré-req |
| prerequisite_subject_id | UUID | FOREIGN KEY (subjects.id), NOT NULL | Disciplina pré-requisito |
| compliance_required | BOOLEAN | NOT NULL, DEFAULT true | É obrigatório |

**Índices**: `UNIQUE(subject_id, prerequisite_subject_id)`

---

### CURRICULUM_MAPPING

Mapeamento de disciplinas e horas por série/turma.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| grade_id | UUID | FOREIGN KEY (grades.id), NOT NULL | Série |
| subject_id | UUID | FOREIGN KEY (subjects.id), NOT NULL | Disciplina |
| weekly_hours | INT | NOT NULL | Horas semanais para esta série |
| semester | ENUM | NOT NULL | first, second, full_year |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices**: `(grade_id, subject_id)`, `UNIQUE(grade_id, subject_id, semester)`

---

## 8. Tabelas do Núcleo de Horários

### SCHEDULE_PERIODS

Períodos (aulas) configurados no sistema.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| schedule_config_id | UUID | FOREIGN KEY (department_schedule_config.id), NOT NULL | Configuração |
| period_number | INT | NOT NULL | Número do período (1, 2, 3...) |
| start_time | TIME | NOT NULL | Horário de início |
| end_time | TIME | NOT NULL | Horário de término |
| type | ENUM | NOT NULL | lesson, break, administrative |
| description | VARCHAR(255) | NULLABLE | Descrição (ex: "1ª Aula", "Intervalo") |
| duration_minutes | INT | NOT NULL | Duração em minutos |

**Índices**: `(schedule_config_id, period_number)`, `UNIQUE(schedule_config_id, period_number)`

---

### SCHEDULES

Alocações regulares de aulas na grade horária.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| class_id | UUID | FOREIGN KEY (classes.id), NULLABLE | Turma permanente |
| temporary_class_id | UUID | FOREIGN KEY (temporary_classes.id), NULLABLE | Turma temporária |
| subject_id | UUID | FOREIGN KEY (subjects.id), NOT NULL | Disciplina |
| teacher_id | UUID | FOREIGN KEY (teachers.id), NOT NULL | Professor |
| room_id | UUID | FOREIGN KEY (rooms.id), NOT NULL | Sala |
| department_id | UUID | FOREIGN KEY (departments.id), NOT NULL | Departamento |
| weekday | INT | NOT NULL | Dia da semana (0-6) |
| period_id | UUID | FOREIGN KEY (schedule_periods.id), NOT NULL | Período |
| schedule_type | ENUM | NOT NULL | regular, temporary, special |
| status | ENUM | NOT NULL, DEFAULT 'draft' | draft, published, active, archived |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atualização |

**Restrição**: Exatamente um de `class_id` ou `temporary_class_id` deve ser NOT NULL

**Índices**: `(class_id)`, `(temporary_class_id)`, `(teacher_id)`, `(room_id)`, `(department_id)`, `(status)`, `(weekday, period_id)`

---

### SCHEDULE_TEMPLATES

Templates reutilizáveis de grades horárias.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| department_id | UUID | FOREIGN KEY (departments.id), NULLABLE | Departamento (NULL = template escolar) |
| created_by | UUID | FOREIGN KEY (users.id), NOT NULL | Criado por |
| name | VARCHAR(255) | NOT NULL | Nome do template |
| description | TEXT | NULLABLE | Descrição de uso |
| template_data_json | JSON | NOT NULL | Dados do template (estrutura de aulas) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |

**Índices**: `(department_id)`, `(created_by)`

---

### TEMPORARY_SCHEDULES

Aulas fora da grade regular com duração limitada.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| parent_schedule_id | UUID | FOREIGN KEY (schedules.id), NULLABLE | Horário base (se substitui algum) |
| class_id | UUID | FOREIGN KEY (classes.id), NULLABLE | Turma permanente |
| temporary_class_id | UUID | FOREIGN KEY (temporary_classes.id), NULLABLE | Turma temporária |
| subject_id | UUID | FOREIGN KEY (subjects.id), NOT NULL | Disciplina |
| teacher_id | UUID | FOREIGN KEY (teachers.id), NOT NULL | Professor |
| room_id | UUID | FOREIGN KEY (rooms.id), NOT NULL | Sala |
| weekday | INT | NOT NULL | Dia da semana (0-6) |
| period_id | UUID | FOREIGN KEY (schedule_periods.id), NOT NULL | Período |
| start_date | DATE | NOT NULL | Data de início |
| end_date | DATE | NOT NULL | Data de término |
| reason | ENUM | NOT NULL | substitution, special_activity, exam_period, makeup_class, special_event, other |
| created_by | UUID | FOREIGN KEY (users.id), NOT NULL | Criado por |
| status | ENUM | NOT NULL, DEFAULT 'draft' | draft, approved, active, completed, cancelled |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |

**Restrição**: Exatamente um de `class_id` ou `temporary_class_id` deve ser NOT NULL

**Índices**: `(class_id)`, `(temporary_class_id)`, `(start_date, end_date)`, `(reason)`, `(status)`

---

## 9. Tabelas de Validação e Conflitos

### SCHEDULE_CONFLICTS

Registro de conflitos detectados na grade horária.

| Campo | Tipo | Restrições | Descrição |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Identificador único |
| schedule_id | UUID | FOREIGN KEY (schedules.id), NOT NULL | Horário com conflito |
| conflict_type | ENUM | NOT NULL | teacher_overlap, room_overlap, class_overlap, unavailability, workload_excess, workload_deficit, curriculum_gap |
| severity | ENUM | NOT NULL | info, warning, error |
| description | TEXT | NOT NULL | Descrição detalhada do conflito |
| entities_involved_json | JSON | NOT NULL | Entidades envolvidas (IDs de professores, salas, etc) |
| detected_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Quando foi