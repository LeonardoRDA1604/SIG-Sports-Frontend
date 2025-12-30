<div align="center" style="background-color:#111; color:#fff; padding:20px; border-radius:8px; font-size:18px;">
  Português (Brasil) [PT-BR]
</div>


# Contribuindo com o PS Sports Frontend

Obrigado pelo interesse em contribuir com o **PS Sports Frontend**!
Este documento descreve as regras, padrões e fluxo que devem ser seguidos ao contribuir com o projeto.

---

## 📌 Regras do Projeto

- **NÃO faça commit diretamente na branch `main`**
- Todas as alterações devem ser feitas em branches separadas e enviadas via Pull Request
- Apenas administradores do repositório podem aprovar e realizar merge de Pull Requests

---

## 🌿 Estratégia de Branches

Crie branches seguindo o padrão:

- `feat/*` — novas funcionalidades
- `fix/*` — correção de bugs
- `chore/*` — tarefas de manutenção ou configuração
- `refactor/*` — refatoração de código sem mudança de comportamento

### Exemplos:
```bash
git checkout -b feat/lista-atletas
git checkout -b fix/validacao-login
git checkout -b chore/configuracao-inicial
```

---

## 📝 Padrão de Mensagens de Commit

Este projeto segue o padrão **Conventional Commits**.

Formato:
```text
tipo(escopo opcional): descrição curta em inglês
```

Exemplos:
```text
feat: add athlete list page
fix(auth): correct token validation
chore: configure eslint and prettier
```

---

## 🔁 Regras de Pull Request

- Todos os Pull Requests devem ter como destino a branch `main`
- Pull Requests exigem **pelo menos 1 aprovação**
- Todos os comentários de revisão devem ser resolvidos antes do merge
- Caso novos commits sejam adicionados, a aprovação será removida e uma nova revisão será necessária

---

## 👤 Quem Pode Aprovar

- Apenas administradores do repositório podem aprovar e realizar merge de Pull Requests
- Contribuidores podem abrir Pull Requests e solicitar revisão

---

## 🎨 Padrão de Código

- Siga as regras do ESLint
- Mantenha o código limpo, legível e organizado
- Evite complexidade desnecessária

---

## 📖 Precisa de Ajuda?

Caso tenha dúvidas, abra uma Issue ou entre em contato com o administrador do repositório.


<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

---
<br />
<div align="center" style="background-color:#111; color:#fff; padding:20px; border-radius:8px; font-size:18px;">
  [EN] English
</div>


# Contributing to PS Sports Frontend

Thank you for your interest in contributing to the **PS Sports Frontend** project!
This document describes the rules, standards, and workflow that must be followed when contributing.

---

## 📌 Project Rules

- **Do NOT commit directly to the `main` branch**
- All changes must be made through feature branches and submitted via Pull Requests
- Only repository administrators can approve and merge Pull Requests

---

## 🌿 Branch Strategy

Create branches following this pattern:

- `feat/*` — new features
- `fix/*` — bug fixes
- `chore/*` — maintenance or configuration tasks
- `refactor/*` — code refactoring without behavior changes

### Examples:
```bash
git checkout -b feat/athlete-list
git checkout -b fix/login-validation
git checkout -b chore/project-setup
```

---

## 📝 Commit Message Convention

This project follows **Conventional Commits**.

Format:
```text
type(scope optional): short description
```

Examples:
```text
feat: add athlete list page
fix(auth): correct token validation
chore: configure eslint and prettier
```

---

## 🔁 Pull Request Rules

- All Pull Requests must target the `main` branch
- Pull Requests require **at least 1 approval**
- All review comments must be resolved before merging
- If new commits are pushed, approvals will be dismissed and re-review is required

---

## 👤 Who Can Approve

- Only repository administrators can approve and merge Pull Requests
- Contributors can open Pull Requests and request reviews

---

## 🎨 Code Style

- Follow ESLint rules
- Keep code clean, readable, and well-organized
- Avoid unnecessary complexity

---

## 📖 Need Help?

If you have any questions, open an Issue or contact the repository administrator.

---
