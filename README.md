<div style="background-color: rgba(99, 122, 156, 0.48); padding: 20px;">
<!-- <div style="background-color: rgba(2, 103, 255, 0.4); padding: 20px;"> -->

<img src="./src/assets/icons/readme-icons/SIG Sports Logo.png" alt="SIG Sports Logo" width="1000"/>
<!-- logo centralizada abaixo -->
<!-- <div style="text-align: center;">
  <img src="./src/assets/icons/readme-icons/SIG Sports Logo.png" alt="SIG Sports Logo" width="1000">
</div> -->

<!-- → -->

# ***SIG Sports*** – **S**istema **I**ntegrado de **G**erenciamento **<font color="#0179db">Esportivo</font>**
### 📝 Descrição:
O **[<font color="#0179db">*SIG Sports*</font>](https://sites.google.com/view/sig-sports-frontend-project/)** foi desenvolvido para suprir as necessidades da escola de futebol [*PS Sport's*](https://pssports.com.br/), no âmbito do **Projeto Integrador** como atividade de culminância da formação do programa [*Bolsa Futuro Digital (BFD)*](https://aponti.org.br/capital-humano#programa-bfd), promovido pela [*Aponti*](https://aponti.org.br/). A [*PS Sport's*](https://pssports.com.br/) necessitava de uma plataforma digital para apoiar e otimizar seus processos internos, centralizando informações e facilitando a gestão das atividades administrativas e esportivas.

Diante dessa demanda, este projeto tem como objetivo facilitar o gerenciamento de **atletas**, **responsáveis**, **interessados (leads)**, **treinadores**, **turmas**, **categorias** e **modalidades**, por meio de uma interface *moderna*, *responsiva* e *intuitiva*. O frontend foi desenvolvido para consumir APIs externas (Backend), permitindo a exibição dos dados de forma *clara*, *organizada* e *eficiente*.

O sistema foi planejado, prototipado e implementado, seguindo *boas práticas de desenvolvimento*, com foco em *organização*, *usabilidade* e *experiência do usuário*, buscando oferecer uma *solução funcional* e *escalável* que *atenda às demandas da instituição*.

---

## Índice
- [1. Descrição](#-descrição)
- [2. Objetivo do Projeto](#-objetivo-do-projeto)
- [3. Tecnologias e Ferramentas Utilizadas](#️-tecnologias-e-ferramentas-utilizadas)
- [4. Design de Interfaces e Prototipação](#-design-de-interfaces-e-prototipação-figma)
- [5. Responsividade](#-responsividade)
- [6. Gerenciamento do Projeto](#-gerenciamento-do-projeto-jira)
- [7. Metodologias adotadas no Projeto](#-metodologias-adotadas-ágeis)
- [8. Arquitetura do Projeto](#-arquitetura-do-projeto-frontend)
- [9. Funcionalidades Principais](#-funcionalidades-principais)
  - [9.1. Segurança e Controle de Acesso](#-segurança-e-controle-de-acesso)
  - [9.2. Interface de Monitoramento (BI)](#-interface-de-monitoramento-bi)
  - [9.3. Gestão de Entidades](#️-gestão-de-entidades-crud)
- [10. Equipe e Contribuições](#-equipe-e-contribuições)
  - [10.1. Contribuições dos Integrantes da Equipe](#contribuições-dos-integrantes-da-equipe)
  - [10.2. Contribuições de Colaboradores Externos](#contribuições-de-colaboradores-externos)
- [11. Dependências Necessárias](#-dependências-necessárias)
    - [11.1. Como Baixar e Utilizar o Repositório](#️-como-baixar-e-utilizar-o-repositório)
        - [11.1.1. Scripts Disponíveis](#️-scripts-disponíveis)
- [12. Status do Projeto](#-status-do-projeto)
- [13. Apresentação e Demonstração](#-apresentação-e-demonstração)
  - [13.1. Pitch de Negócio (Apresentação)](#-1-pitch-de-negócio-apresentação)
  - [13.1. Demonstração do Software (Demo)](#-2-demonstração-do-software-demo)
- [14. Apoio](#-apoio)
- [15. Versionamento](#️-versionamento)
    - [15.1. Significado das versões](#-significado-das-versões)
    - [15.2. Objetivo do versionamento](#-objetivo-do-versionamento)
- [16. Colaboração](#-colaboração)
- [17. Documentação do Sistema](#-documentação-do-sistema)
- [18. Licença](#-licença)
<!-- - [Como baixar e utilizar o sistema](#️-como-baixar-e-utilizar-o-sistema) -->

---

## 🎯 Objetivo do Projeto
O Sistema foi desenvolvido para fornecer uma **interface web responsiva e interativa** para o gerenciamento da escola de atletas PS Sport's, integrando dados e funcionalidades de forma clara e intuitiva. O projeto permite:

- Integração com o **Backend**.
    - Projeto desenvolvido em colaboração com uma equipe de Backend de outra turma do [mesmo curso (BFD)](https://aponti.org.br/capital-humano#programa-bfd), **[clique aqui para ver o repositório do Backend](https://github.com/cabarros3/ps-sports)**.
- Garantia de *boa experiência do usuário (UX/UI)*.
- Desenvolvimento de novos módulos e visualizações de dados.
- Expansão para novas páginas, gráficos e recursos interativos.

O projeto resulta tanto da aplicação dos conhecimentos adquiridos ao longo do programa quanto do esforço de pesquisa, estudo e aprofundamento extraclasse realizado pelos responsáveis pelo desenvolvimento, envolvendo **análise de problemas reais**, **elicitação** e **organização de requisitos** e **avaliação de soluções tecnológicas adequadas**.

O desenvolvimento contemplou etapas de **prototipação de alta fidelidade**, **implementação técnica** e **validação de soluções**, aplicando *boas práticas de engenharia de software* e *design de interfaces (UI/UX)*.

Nesse contexto, foram aplicados conhecimentos fundamentais para o ecossistema Front-end moderno, tais como:
- **🎨 Design e Prototipação:** Transposição de layouts e fluxos de usuário desenhados no **Figma** para componentes funcionais.
- **⚛️ Desenvolvimento Frontend:** Construção de interfaces declarativas e modulares utilizando **React** e **JavaScript (ES6+)**, focando em componentes reutilizáveis e estados dinâmicos.
- **💨 Estilização Avançada:** Implementação de design responsivo e sistemas de design consistentes com **Tailwind CSS**.
* **🌐 Ambiente e Consumo de Dados:** Utilização do ecossistema **Node.js** como base do ambiente de desenvolvimento para gestão de dependências e com foco no consumo e tratamento de dados provenientes de **APIs RESTful**, garantindo a sincronia entre cliente e servidor.
- **🏗️ Arquitetura de Software:** Estruturação do projeto seguindo o modelo **Component-Based (Modular)**, organizando o código em camadas de *Components*, *Hooks* e *Services* para garantir alta reutilização e facilidade de manutenção.
- **📊 Gestão e Metodologia Ágil:** Organização de tarefas, prazos e fluxo de trabalho utilizando o **Jira**.
- **🔧 Versionamento e Colaboração:** Gestão de código e ciclo de vida da aplicação através de **Git** e **GitHub**, aplicando boas práticas de *commits* semânticos, gerenciamento de branches e manutenção de código limpo. Para mais detalhes sobre o fluxo de trabalho, consulte as seções de [Versionamento](#️-versionamento) e [Colaboração](#-colaboração).

---

### 🖥️ Tecnologias e Ferramentas Utilizadas
<!-- React -->
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="React" width="20" height="20"/> **[*React.js*](https://react.dev/)**
<!-- JavaScript ES6+ -->
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="JavaScript" width="20" height="20"/> **[*JavaScript (ES6+)*](https://www.javascript.com/)**
<!-- SWC (Rust-based Fast Compiler) -->
- <img src="./src/assets/icons/readme-icons/swc-icon.png" alt="SWC" width="20" height="20"/> **[*SWC*](https://swc.rs/)** (Compilador em Rust para builds rápidos)
<!-- Vite -->
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg" alt="Vite" width="20" height="20"/> **[*Vite*](https://vite.dev/)**
<!-- Node.js -->
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="Node.js" width="20" height="20"/> **[*Node.js*](https://nodejs.org/)**
<!-- Tailwind CSS -->
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" width="20" height="20" alt="Tailwind"/> **[*Tailwind CSS*](https://tailwindcss.com/)**
<!-- HTML5 -->
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" alt="HTML5" width="20" height="20"/> **[*HTML5*](https://html.com/)**
<!-- CSS3 -->
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" alt="CSS3" width="20" height="20"/> **[*CSS3*](https://www.w3.org/Style/CSS/)**
<!-- JSON Server -->
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg" alt="JSON" width="20" height="20"/> **[*JSON Server*](https://my-json-server.typicode.com/)** (API fake para simulação de backend)
<!-- Git -->
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg" alt="Git" width="20" height="20"/> **[*Git*](https://git-scm.com/)**
<!-- Github -->
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" alt="GitHub" width="20" height="20"/>  **[*GitHub*](https://github.com/)**
<!-- Figma -->
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/figma/figma-original.svg" alt="Figma" width="20" height="20"/> **[*Figma*](https://www.figma.com/)**
<!-- Jira -->
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/jira/jira-original.svg" alt="Jira" width="20" height="20"/> **[*Jira*](https://www.atlassian.com/br/software/jira)**

---

## 🎨 Design de Interfaces e Prototipação (Figma)
Todas as interfaces foram desenvolvidas e prototipadas no **[*Figma*](https://www.figma.com/)**, garantindo:
- Padronização visual
- Melhor UX/UI
- Redução de retrabalho
- Fidelidade entre design e implementação
- Interface construída com componentes reutilizáveis e escaláveis, garantindo consistência visual e facilidade de manutenção.

---

## 📱 Responsividade
O projeto é totalmente responsivo, garantindo boa experiência em:
- Desktop
- Tablet
- Mobile

---

## 📋 Gerenciamento do Projeto (Jira)
O **[Jira](https://www.atlassian.com/br/software/jira)** foi utilizado para organizar e acompanhar o desenvolvimento do projeto, utilizando práticas de **Scrum** e **Kanban**, garantindo:
- Criação, organização e priorização do **Product Backlog**
- Planejamento e acompanhamento das **sprints**
- Visualização do fluxo de trabalho por meio do **quadro Kanban**
- Distribuição de tarefas e acompanhamento do progresso
- Melhor comunicação e transparência no desenvolvimento
- Documentação, refinamento e acompanhamento dos **requisitos funcionais**

---

## ⚡ Metodologias adotadas (Ágeis)
Durante o desenvolvimento deste projeto, adotamos *metodologias ágeis* para *otimizar o fluxo de trabalho*, *priorizar tarefas* e *entrega de valor*, além de *garantir a qualidade técnica*. Utilizamos o framework ***Scrumban***, uma abordagem híbrida entre **Scrum** e **Kanban**, incorporando também práticas de **XP (eXtreme Programming)** e princípios **Lean**.

- **Scrum** — Planejamento de sprints, acompanhamento de progresso, reuniões regulares de alinhamento, remoção de impedimentos, revisões e retrospectivas para aprendizado, ajustes de processos e evolução contínua do time

- **Kanban** — Controle visual do fluxo de tarefas (*Workflow*), priorização e gerenciamento contínuo do trabalho em andamento para evitar gargalos.

- **XP (eXtreme Programming)** — Desenvolvimento baseado em Histórias do usuário, pair programming, integração contínua, feedback rápido, refatoração constante para assegurar a qualidade do código.

- **Lean** — Foco na maximização do valor entregue ao usuário e na eliminação de desperdícios no processo desperdícios durante todo o ciclo de desenvolvimento.

---

## 🧱 Arquitetura do Projeto (Frontend)
<!-- falta corrigir a estrutura da pasta src (porem preciso refatorar o codigo para ver os pathings), tb falta colocar os comentários -->
```bash
├── src/
│   ├── assets/                # Arquivos estáticos (Imagens, Ícones, Logotipos)
│   │   ├── icons/
│   │
│   ├── components/            # Componentes reutilizáveis (Buttons, Inputs, Cards, etc.)
│   │   └── AcaoRapida/
│   │   │   └── index.jsx
│   │   │
│   │   └── AdminPanel/ 
│   │   │   └── AdminPanel.jsx
│   │   │   └── .jsx
│   │   │   └── .jsx
│   │   │
│   │   └── Auth/ 
│   │   │   └── Cadastro.jsx
│   │   │   └── EsqueciSenha.jsx
│   │   │   └── UsuariosTable.jsx
│   │   │
│   │   └── Banner/ 
│   │   │   └── index.jsx
│   │   │
│   │   └── BotaoAdicionar/ 
│   │   │   └── BotaoAdicionar.jsx
│   │   │
│   │   └── Card/ 
│   │   │   └── index.jsx
│   │   │
│   │   └── DataTable/ 
│   │   │   └── DataTable.jsx
│   │   │   └── index.js
│   │   │
│   │   └── Header/ 
│   │   │   └── Header.jsx
│   │   │
│   │   └── Login/ 
│   │   │   └── Login.jsx
│   │   │
│   │   └── Logout/ 
│   │   │   └── Logout.jsx
│   │   │
│   │   └── Navbar/ 
│   │   │   └── Navbar.jsx
│   │   │   └── NavbarMobile.jsx
│   │   │
│   │   └── Notificacao/ 
│   │   │   └── NotificationIcon.jsx
│   │   │
│   │   └── AutocompleteAtleta.jsx
│   │
│   ├── context/               # 
│   │   ├── AuthContext.js 
│   │
│   ├── data/                  # 
│   │   ├── api.js
│   │   ├── dadosUsuarios.js
│   ├── modals/                # 
│   │   └── forms/             # 
│   │   │   └── ModalCadastroCategoria.jsx
│   │   │   └── ModalCadastroInteressado.jsx
│   │   │   └── ModalCadastroModalidade.jsx
│   │   │   └── ModalCadastroResponsavel.jsx
│   │   │   └── ModalCadastroTreinador.jsx
│   │   │   └── ModalCadastroTurma.jsx
│   │   │   └── ModalCadastroUsuario.jsx
│   │   │   └── PlayerTemplateModal.jsx
│   │   │
│   │   └── views/             # 
│   │   │   └── EditPlayersModal.jsx
│   │   │   └── ModalVisualizarCadastroResponsavel.jsx
│   │   │
│   │   └── AnimatedSubTitle.jsx
│   │   └── AnimatedTitle.jsx
│   │   └── ModalConfirmarSaída.jsx
│   │
│   ├── pages/                 # Componentes de rota (Telas principais do sistema)
│   │   └── Administracao.jsx  #  
│   │   └── Cadastros.jsx      #  
│   │   └── Dashboard.jsx      #  
│   │   └── Financeiro.jsx     #  
│   │   └── Interessados.jsx   #  
│   │   └── Presencas.jsx      #  
│   │   └── Relatorios.jsx     #  
│   │
│   ├── styles/                # Estilizações globais e configurações de temas
│   │   └── token.css          # 
│   │
│   ├── utils/                 # Funções auxiliares (Formatadores, Validadores)
│   │   └── permissoes.js      # 
│   │
│   ├── App.css                # 
│   │
│   ├── App.jsx                # Componente raiz com as rotas
│   │
│   ├── index.css              # 
│   │
│   └── main.jsx               # Ponto de entrada da aplicação (Renderização)
│
├── .env.example               # Modelo de variáveis de ambiente
├── .gitignore                 # Arquivos ignorados pelo Git
├── CONTRIBUTING.md            # 
├── db.json                    # Banco de dados simulado (JSON Server) se aplicável
├── eslint.config.js           # Configuração de padronização do código
├── index.html                 # Estrutura HTML principal
├── LICENSE                    # 
├── package-lock.json          # 
├── package.json               # Gerenciamento de dependências e scripts
├── postcss.config.js          # Configuração do PostCSS (Tailwind)
├── README.md                  # Documentação do projeto
└── vite.config.js             # Configuração do bundler Vite
```

---

## ✨ Funcionalidades Principais
#### 🔒 Segurança e Controle de Acesso
- **Autenticação de Usuários:** Sistema de cadastro e login seguro para proteção das informações.
- **Recuperação de Senha:** Fluxo de redefinição de acesso via e-mail ou tokens de segurança, garantindo a autonomia do usuário.
- **Níveis de Permissão (RBAC):**
  - **Administrador:** Controle total do sistema, gestão de usuários e configurações globais.
  - **Treinador:** Acesso restrito às ferramentas de gestão técnica, acompanhamento de turmas e desempenho de atletas.

#### 📊 Interface de Monitoramento (BI)
- **Dashboard Gerencial:** Painel administrativo com visualização centralizada de métricas, facilitando a análise de dados e a tomada de decisão estratégica em tempo real.

#### ⚙️ Gestão de Entidades (CRUD)
O sistema oferece o gerenciamento completo (Criação, Consulta, Atualização e Exclusão) dos seguintes módulos:
- **Módulo Esportivo:**
  - Modalidades, Categorias e Turmas.
- **Módulo de Pessoas:**
  - Atletas e seus Responsáveis vinculados.
  - Treinadores e membros da Comissão Técnica.
- **Módulo de Captação:**
  - Gestão de Interessados (Lead Tracking) para conversão de novos alunos.

---

## 👥 Equipe e Contribuições: 
Apresentamos abaixo a estrutura da nossa equipe e as respectivas responsabilidades de cada membro, detalhando as contribuições individuais que tornaram o desenvolvimento deste sistema possível.

- ### 💼Contribuições dos Integrantes da Equipe

<table>
<!-- Cabeçalho -->
  <thead>
    <tr>
      <th style="background-color: rgba(3, 0, 175, 0.85); font-size: 20px; color: rgba(255, 255, 255, 1); padding: 16px 20px;">Nome</th>
      <th style="background-color: rgba(3, 0, 175, 0.85); font-size: 20px; color: rgba(255, 255, 255, 1); padding: 16px 250px;">Contribuições</th>
      <th style="background-color: rgba(3, 0, 175, 0.85); font-size: 20px; color: rgba(255, 255, 255, 1); padding: 16px 20px;">Papel</th>
      <th style="background-color: rgba(3, 0, 175, 0.85); font-size: 20px; color: rgba(255, 255, 255, 1); padding: 16px 16px;">Equipe</th>
      <th style="background-color: rgba(3, 0, 175, 0.85); font-size: 20px; color: rgba(255, 255, 255, 1); padding: 16px 50px;">LinkedIn & Github</th>
      <!-- <th style="background-color: rgba(3, 0, 175, 0.85); font-size: 20px; color: rgba(255, 255, 255, 1); padding: 16px 2px;">GitHub</th> -->
    </tr>
  </thead>
  <!-- <style>
    .titulo-paragrafo {
      background-color: blue;
    }
  </style> -->
<!-- Corpo (Items da tabela) -->
  <tbody>
    <!-- Contribuidor 1 (Leonardo Rafael) -->
    <tr>
      <td>Leonardo Rafael</td>
      <td>Responsabilidades de Scrum Master; Responsabilidades de Product Owner; Responsabilidades de DevOps e QA; Apoio técnico aos desenvolvedores; Design de interfaces e elaboração do Protótipo no Figma; Elaboração do Readme; Revisão técnica e Controle de qualidade geral; Desenvolvimento do Pitch e Slides; Apresentação do Pitch; Roteiro do vídeo de demonstração do projeto; Comunicação e Integração com o Backend desenvolvido por outra equipe; Construção do Google Sites do Projeto; Desenvolvimento da Logotipo.</td>
      <td>Scrum Master; DevOps; QA; Product Owner</td>
      <td>DevOps & QA; Docs; Development; Design; Communication</td>
      <td align="center">
        <a href="https://www.linkedin.com/in/leonardorafael1604/" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg" width="18" height="18" align="center"> 
          <span>/leonardorafael1604</span>
        </a>
        <br><br>
        <a href="https://github.com/LeonardoRDA1604" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" width="18" height="18" align="center"> 
          <span>/LeonardoRDA1604</span>
        </a>
      </td>
    </tr>
    <!-- Contribuidor 2 (Leandro Wilke) -->
    <tr>
      <td>Leandro Wilke</td>
      <td>Responsabilidades de Tech Leader; Responsabilidades de DevOps; Revisão técnica; Comunicação e Integração com o Backend desenvolvido por outra equipe; Correção de inconsistências no Backend; Componentização; Desenvolvimento Frontend; Apoio técnico aos desenvolvedores; Suporte ao desenvolvimento da Logotipo</td>
      <td>Tech Leader and DevOps</td>
      <td>Development; DevOps & QA; Communication</td>
      <td align="center">
        <a href="https://www.linkedin.com/in/leandro-wilke/" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg" width="18" height="18" align="center"> 
          <span>/leandro-wilke</span>
        </a>
        <br><br>
        <a href="https://github.com/LeandroWilkeDev" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" width="18" height="18" align="center"> 
          <span>/LeandroWilkeDev</span>
        </a>
      </td>
    </tr>
    <!-- Contribuidor 3 (Guilherme Henrique) -->
    <tr>
      <td>Guilherme Henrique</td>
      <td>Design de interfaces e elaboração do Protótipo no Figma; Componentização; Desenvolvimento Frontend; Apoio técnico aos desenvolvedores; Integração com o Backend desenvolvido por outra equipe; Suporte ao desenvolvimento da Logotipo; Gravação e Edição do Vídeo Demo</td>
      <td>Scrum Team</td>
      <td>Design; Development</td>
      <td align="center">
        <a href="https://www.linkedin.com/in/guilhermechroma/" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg" width="18" height="18" align="center"> 
          <span>/guilhermechroma</span>
        </a>
        <br><br>
        <a href="https://github.com/guilhermechroma" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" width="18" height="18" align="center"> 
          <span>/guilhermechroma</span>
        </a>
      </td>
    </tr>
    <!-- Contribuidor 4 (Mateus Soares) -->
    <tr>
      <td>Mateus Soares</td>
      <td>Design de interfaces e elaboração do Protótipo no Figma; Desenvolvimento do Pitch e Slides; Desenvolvimento Frontend; Construção do Google Sites do Projeto; Suporte ao desenvolvimento da Logotipo; Gravação e Edição do Vídeo Demo</td>
      <td>Scrum Team</td>
      <td>Design; Development</td>
      <td align="center">
        <a href="https://www.linkedin.com/in//mateeussoares/" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg" width="18" height="18" align="center"> 
          <span>/mateeussoares</span>
        </a>
        <br><br>
        <a href="https://github.com/mateeussoares" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" width="18" height="18" align="center"> 
          <span>/mateeussoares</span>
        </a>
      </td>
    </tr>
    <!-- Contribuidor 5 (Luana Vitorino) -->
    <tr>
      <td>Luana Vitorino</td>
      <td>Elaboração da documentação do projeto; Desenvolvimento Frontend; Construção do Backlog no Jira</td>
      <td>Scrum Team</td>
      <td>Docs; Development</td>
      <td align="center">
        <a href="https://www.linkedin.com/in/luana-de-melo-527415352/" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg" width="18" height="18" align="center"> 
          <span>/luana-de-melo</span>
        </a>
        <br><br>
        <a href="https://github.com/luanavitorino" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" width="18" height="18" align="center"> 
          <span>/luanavitorino</span>
        </a>
      </td>
    </tr>
    <!-- Contribuidor 6 (Gabriel Josimar) -->
    <tr>
      <td>Gabriel Josimar</td>
      <td>Elaboração da documentação do projeto; Suporte ao desenvolvimento da Logotipo; Desenvolvimento de Slides do Pitch; Construção do Google Sites do Projeto; Construção do Backlog no Jira</td>
      <td>Scrum Team</td>
      <td>Docs</td>
      <td align="center">
        <a href="https://www.linkedin.com/in/gabriel-josimar-306000249/" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg" width="18" height="18" align="center"> 
          <span>/gabriel-josimar</span>
        </a>
        <br><br>
        <a href="https://github.com/GabrielJosimar123" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" width="18" height="18" align="center"> 
          <span>/GabrielJosimar123</span>
        </a>
      </td>
    </tr>
    <!-- Contribuidor 7 (Lucas Silva) -->
    <tr>
      <td>Lucas Silva</td>
      <td>Design de interfaces e elaboração do Protótipo no Figma; Gravação e Edição do Vídeo Demo</td>
      <td>Scrum Team</td>
      <td>Design</td>
      <td align="center">
        <a href="http://www.linkedin.com/in/joselucasdg" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg" width="18" height="18" align="center"> 
          <span>/joselucasdg</span>
        </a>
        <br><br>
        <a href="https://github.com/lukaaszx" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" width="18" height="18" align="center"> 
          <span>/lukaaszx</span>
        </a>
      </td>
    </tr>
    <!-- Contribuidor 8 (Jean Menino) -->
    <tr>
      <td>Jean Menino</td>
      <td>Desenvolvimento Frontend; Gravação e Edição do Vídeo Demo</td>
      <td>Scrum Team</td>
      <td>Development</td>
      <td align="center">
        <a href="https://www.linkedin.com/in/jean-menino-dos-santos-j%C3%BAnior-507a48311/" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg" width="18" height="18" align="center"> 
          <span>/jean-menino-dos-santos</span>
        </a>
        <br><br>
        <a href="https://github.com/jeanwox" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" width="18" height="18" align="center"> 
          <span>/jeanwox</span>
        </a>
      </td>
    </tr>
    <!-- Contribuidor 9 (Guilherme Manoel) -->
    <tr>
      <td>Guilherme Manoel</td>
      <td>Construção do Google Sites do Projeto; Construção do Backlog no Jira</td>
      <td>Scrum Team</td>
      <td>Docs</td>
      <td align="center">
        <a href="https://www.linkedin.com/in/guilherme-costa-825aa43a6/" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg" width="18" height="18" align="center"> 
          <span>/guilherme-costa</span>
        </a>
        <br><br>
        <a href="https://github.com/guizihn" target="_blank" rel="noopener noreferrer">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" width="18" height="18" align="center"> 
          <span>/guizihn</span>
        </a>
      </td>
    </tr>
<!-- Fim do Corpo (Items da tabela) -->
  </tbody>
</table>

<br>

- ### 🤝Contribuições de Colaboradores Externos

<table>
<!-- Cabeçalho -->
  <thead>
    <tr>
      <th style="background-color: rgba(3, 0, 175, 0.85); font-size: 20px; color: rgba(255, 255, 255, 1); padding: 16px 40px;">Nome</th>
      <th style="background-color: rgba(3, 0, 175, 0.85); font-size: 20px; color: rgba(255, 255, 255, 1); padding: 16px 12px;">Contribuições</th>
      <th style="background-color: rgba(3, 0, 175, 0.85); font-size: 20px; color: rgba(255, 255, 255, 1); padding: 16px 12px;">LinkedIn</th>
      <th style="background-color: rgba(3, 0, 175, 0.85); font-size: 20px; color: rgba(255, 255, 255, 1); padding: 16px 12px;">GitHub</th>
    </tr>
  </thead>
<!-- Corpo (Items da tabela) -->
  <tbody>
    <!-- Colaborador externo 1 (Camila Moura) -->
    <tr>
      <td>Camila Moura</td>
      <td>Documentação de Requisitos; Apoio na elaboração do README; Desenvolvimento de Slides do Pitch; Suporte ao desenvolvimento da Logotipo</td>
      <td><a href="https://www.linkedin.com/in/camilacelestino" target="_blank" rel="noopener noreferrer">/camilacelestino</a></td>
      <td><a href="https://github.com/ccelesti" target="_blank" rel="noopener noreferrer">/ccelesti</a></td>
    </tr>
    <!-- Colaborador externo 2 (Gabriel Lucas) -->
    <tr>
      <td>Gabriel Lucas</td>
      <td>Documentação de Requisitos</td>
      <td><a href="https://www.linkedin.com/in/gabriel-lucas-de-oliveira-xavier-507564358/" target="_blank" rel="noopener noreferrer">/gabriel-lucas</a></td>
      <td><a href="https://github.com/Ggeasy1574" target="_blank" rel="noopener noreferrer">/Ggeasy1574</a></td>
    </tr>
    <!-- Colaborador externo 3 (Samuel Victor) -->
    <tr>
      <td>Samuel Victor</td>
      <td>Documentação do Projeto; Desenvolvimento de Slides do Pitch</td>
      <td><a href="https://www.linkedin.com/in/samuel-victor-3426b3368/" target="_blank" rel="noopener noreferrer">/samuel-victorr</a></td>
      <td><a href="https://github.com/SamuelVictorr" target="_blank" rel="noopener noreferrer">/SamuelVictorr</a></td>
    </tr>
<!-- Fim do Corpo (Items da tabela) -->
  </tbody>
</table>

<!--
---
## 🖥️ Como baixar e utilizar o Sistema:
1. Baixe o sistema em nosso site:
    - https://sites.google.com/view/ps-sports-frontend-project

2. Fazer um Tutorial 
3. #to-do
4. #to-do
5. #to-do
6. #to-do
7. #to-do

-->

---

## 📦 Dependências Necessárias
1. Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas:
    - **[Git](https://git-scm.com/)** — Controle de versão
        - Versão recomendada: [![Git](https://img.shields.io/badge/Git-2.30+-orange.svg)](https://git-scm.com/)

    - **[Node.js](https://nodejs.org/)** — Ambiente de execução JavaScript
        - Versão recomendada: [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/) *(Versão LTS)*

    - **[npm (Node Package Manager)](https://www.npmjs.com/)** — Gerenciador de pacotes (instalado junto com o Node.js)
        - Versão recomendada: [![npm](https://img.shields.io/badge/npm-9.x+-red.svg)](https://www.npmjs.com/)

> ⚠️ **Nota:** 
As demais dependências são instaladas automaticamente ao seguir o [tutorial de como baixar e utilizar o repositório](#️-como-baixar-e-utilizar-o-repositório), via `npm install`, conforme definido no arquivo [package.json](https://github.com/LeonardoRDA1604/PS-Sports-Frontend/blob/main/package.json). \

> ℹ️ As versões exatas podem ser consultadas [aqui](https://github.com/LeonardoRDA1604/PS-Sports-Frontend/blob/main/package.json).

2. Verifique a instalação.
Após instalar as dependências globais, verifique se estão disponíveis com os comandos:
```bash
git --version
```

```bash
node --version
```

```bash
npm --version
```

## ▶️ Como Baixar e Utilizar o Repositório:

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.

Para informações sobre como contribuir com o projeto, consulte a seção [Colaboração](#-colaboração).


1. Clone o repositório para sua máquina local.
```bash
git clone https://github.com/LeonardoRDA1604/PS-Sports-Frontend
```
- > ℹ️ Ou, se preferir, [baixe o projeto como arquivo .zip](https://github.com/LeonardoRDA1604/PS-Sports-Frontend/archive/refs/heads/main.zip) pelo [GitHub](https://github.com/LeonardoRDA1604/PS-Sports-Frontend).

2. Acesse a pasta do projeto.
```bash
cd ./PS-Sports-Frontend/
```

3. Instale todas as dependências do projeto com:
```bash
npm install
```

4. Execute o projeto (Frontend) com:
```bash
npm run dev
```
- > ℹ️ O projeto será executado em um endereço semelhante a: [http://localhost:5173](http://localhost:5173)

5. Para simular uma API local: Servidor fake (JSON Server)
    - **Em outro terminal** (cmd, powershell, git bash, etc.), execute: 
```bash
npm run server
```
- > ℹ️ O servidor será executado em um endereço semelhante a: [http://localhost:3001](http://localhost:3001)

<br>
<br>

### ⌨️ Scripts Disponíveis:
```bash
npm run dev         # Inicia o frontend em modo desenvolvimento

npm run build       # Gera a build de produção

npm run preview     # Visualiza a build localmente

npm run lint        # Executa a verificação de lint com ESLint

npm run server      # Inicia o JSON Server para simulação de backend
```

---

## 🚧 Status do Projeto

✅ **Primeira Versão (MVP): Concluída** O sistema já conta com as funcionalidades core de gestão e está pronto para o uso inicial.

---

## 📺 Apresentação e Demonstração
Para uma visão mais profunda sobre o propósito e a execução do projeto, disponibilizamos dois conteúdos complementares que detalham a jornada desde a concepção estratégica até a implementação técnica:

#### 🎤 1. Pitch de Negócio (Apresentação)
Aborda os desafios enfrentados pela **PS Sports**, a análise das dores do mercado e como nossa solução foi arquitetada para transformar a gestão esportiva e gerar valor real.
* [Assistir ao Pitch de Negócio](https://youtu.be/uP9eL_eKz3s)

#### 🎬 2. Demonstração do Software (Demo)
Um *walkthrough* detalhado pelas funcionalidades da plataforma, destacando a interface responsiva, a fluidez da experiência do usuário (UX) e as regras de negócio aplicadas.
* [Assistir à Demo do Software](https://youtu.be/frXxWNagzAA)

---

## 📚 Apoio:
### Aponti
- Site: https://aponti.org.br/
- LinkedIn: [/aponti](https://www.linkedin.com/company/aponti/)
- Instagram: [@apontipe](https://www.instagram.com/apontipe/)
    - ##### Programa [Bolsa Futuro Digital (BFD)](https://aponti.org.br/capital-humano#programa-bfd)

### PS Sport's
- Site: https://pssports.com.br/
- LinkedIn: [/ps-sport-s](https://www.linkedin.com/company/ps-sport-s/)
- Instagram: [@pssportsfc](https://www.instagram.com/pssportsfc/)


### Prof. Rudimacy Duprat
  - LinkedIn: [/rudimacy-duprat-desenvolvimentosistemas](https://www.linkedin.com/in/rudimacy-duprat-desenvolvimentosistemas/)
  - Github: [/RudimacyDuprat](https://github.com/RudimacyDuprat)

---

## 🏷️ Versionamento
Este projeto segue o padrão [Semantic Versioning (SemVer)](https://semver.org/) para controle de versões, garantindo clareza, previsibilidade e compatibilidade entre as mudanças. Todas as versões publicadas do projeto podem ser consultadas por meio das [*tags* do repositório](https://github.com/LeonardoRDA1604/PS-Sports-Frontend/tags), onde cada tag representa um marco importante na evolução do sistema.

O versionamento utiliza o seguinte formato:
```bash
MAJOR.MINOR.PATCH
```

#### 🔹 Significado das versões
- **MAJOR** → Alterações incompatíveis com versões anteriores (*breaking changes*)
- **MINOR** → Novas funcionalidades adicionadas de forma retrocompatível
- **PATCH** → Correções de bugs e pequenos ajustes que não afetam a compatibilidade

#### 🔹 Objetivo do versionamento
- Melhor rastreabilidade da evolução do projeto
- Identificação clara de mudanças relevantes
- Facilidade na manutenção, colaboração e integração contínua 

<!-- ## 🏷️ Versionamento
<details>
<summary>▶️  Clique para ver detalhes</summary>

Este projeto segue o padrão [Semantic Versioning (SemVer)](https://semver.org/) para controle de versões, garantindo clareza, previsibilidade e compatibilidade entre as mudanças. Todas as versões publicadas do projeto podem ser consultadas por meio das [*tags* do repositório](https://github.com/LeonardoRDA1604/PS-Sports-Frontend/tags), onde cada tag representa um marco importante na evolução do sistema.

O versionamento utiliza o seguinte formato:
```bash
MAJOR.MINOR.PATCH
```

#### 🔹 Significado das versões
- **MAJOR** → Alterações incompatíveis com versões anteriores (*breaking changes*)
- **MINOR** → Novas funcionalidades adicionadas de forma retrocompatível
- **PATCH** → Correções de bugs e pequenos ajustes que não afetam a compatibilidade

#### 🔹 Objetivo do versionamento
- Melhor rastreabilidade da evolução do projeto
- Identificação clara de mudanças relevantes
- Facilidade na manutenção, colaboração e integração contínua 
</details> -->

---

## 🤝 Colaboração
 >⚠️ **Nota:**   
 Para contribuir com o projeto, leia o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para obter detalhes sobre o nosso código de conduta e o processo de contribuição.

Após a leitura, sinta-se à vontade para abrir uma [*Issue*](https://github.com/LeonardoRDA1604/PS-Sports-Frontend/issues) ou enviar um [*Pull Request*](https://github.com/LeonardoRDA1604/PS-Sports-Frontend/pulls). 
Ideias, sugestões de melhorias e feedbacks são sempre bem-vindos!

1. Faça um fork do projeto.
2. Crie uma branch nos padrões descritos no [CONTRIBUTING.md](CONTRIBUTING.md).
3. Desenvolva sua contribuição.
4. Faça o commit das suas alterações.
5. Faça o push para a branch.
6. Com a contribuição concluída, abra um [*Pull Request*](https://github.com/LeonardoRDA1604/PS-Sports-Frontend/pulls).
<!-- - 1️⃣ Faça um fork do projeto.
- 2️⃣ Crie uma branch nos padrões descritos no [CONTRIBUTING.md](CONTRIBUTING.md).
- 3️⃣ Desenvolva sua contribuição.
- 4️⃣ Faça o commit das suas alterações.
- 5️⃣ Faça o push para a branch.
- 6️⃣ Com a contribuição concluída, abra um [*Pull Request*](https://github.com/LeonardoRDA1604/PS-Sports-Frontend/pulls). -->

<!-- Emojis de números
0️⃣ | 1️⃣ | 2️⃣ | 3️⃣ | 4️⃣ | 5️⃣ | 6️⃣ | 7️⃣ | 8️⃣ | 9️⃣ | 🔟
➊ | ➋ | ➌ | ➍ | ➎ | ➏ | ➐ | ➑ | ➒ | ➓ 
-->

---

## 📖 Documentação do Sistema
A documentação detalhada dos requisitos, fluxos de interface e especificações técnicas do front-end está disponível para consulta externa e pode ser visualizada no documento através do link abaixo:
- [📄 Visualizar Documentação Técnica (PDF)](https://drive.google.com/file/d/1pUAkCxrXqQsrxrY-NJn3jxBiqQwk9jAW/view?usp=sharing)

---

## 📄 Licença
Este projeto está sob a [Licença MIT](https://opensource.org/license/mit) - veja o arquivo [LICENSE](LICENSE) para detalhes.

[![License MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/license/mit)

---

## 📧 Contato
Para mais informações, entre em contato com o administrador do repositório pelo e-mail leonardo.rafael1604@gmail.com, ou via <a href="https://www.linkedin.com/in/leonardorafael1604/" target="_blank" rel="noopener noreferrer">Linkedin</a>.