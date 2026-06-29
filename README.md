# Agenda de Produção — Fábrica de Ideias

App de gestão de agenda mensal para equipe de criação de conteúdo.
Publicado no Netlify, banco de dados no Firebase Firestore, login com Google.

---

## 1. Configurar o Firebase

### 1.1 Criar o projeto
1. Acesse https://console.firebase.google.com
2. Clique em **Criar projeto** → dê um nome (ex: `agenda-fabrica`)
3. Pode desativar o Google Analytics se quiser
4. Aguarde a criação

### 1.2 Ativar o banco de dados (Firestore)
1. No menu lateral, clique em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Modo de produção** → Next
4. Escolha a região mais próxima (ex: `southamerica-east1` para São Paulo)
5. Clique em **Ativar**

### 1.3 Configurar regras do Firestore
Vá em **Firestore → Regras** e substitua pelo conteúdo abaixo:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Qualquer usuário autenticado pode ler
    match /profissionais/{doc} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    match /clientes/{doc} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    match /admins/{uid} {
      allow read: if request.auth != null;
      allow write: if false; // Só via Console do Firebase
    }
  }
}
```

### 1.4 Ativar o login com Google
1. No menu lateral, clique em **Authentication**
2. Clique em **Começar**
3. Na aba **Sign-in method**, clique em **Google**
4. Ative e coloque o nome do projeto e e-mail de suporte
5. Salve

### 1.5 Pegar as credenciais do app
1. Na página inicial do projeto Firebase, clique em **</>** (Web)
2. Dê um apelido ao app (ex: `agenda-web`) → **Registrar app**
3. Copie o objeto `firebaseConfig` que aparecer

### 1.6 Colar as credenciais no código
Abra o arquivo `src/lib/firebase.js` e substitua os valores:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",           // ← cole aqui
  authDomain: "agenda-fabrica.firebaseapp.com",
  projectId: "agenda-fabrica",
  storageBucket: "agenda-fabrica.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

---

## 2. Adicionar administradores

Administradores podem editar profissionais e clientes. Para adicionar:

1. Faça login no app pelo menos uma vez com a conta Google da Luiza (ou de quem for admin)
2. No Firebase Console → **Authentication** → copie o **UID** do usuário
3. No Firebase Console → **Firestore** → clique em **Iniciar coleção**
4. Nome da coleção: `admins`
5. ID do documento: cole o UID copiado
6. Adicione um campo: `email` (string) → com o e-mail do usuário
7. Salve

Repita para cada admin que quiser adicionar.

---

## 3. Publicar no Netlify

### Opção A — Via GitHub (recomendado)
1. Suba o projeto para um repositório no GitHub
2. Acesse https://app.netlify.com → **Add new site → Import an existing project**
3. Conecte ao GitHub e selecione o repositório
4. Build command: `npm run build`
5. Publish directory: `build`
6. Clique em **Deploy site**
7. Após o deploy, copie a URL gerada (ex: `https://agenda-fabrica.netlify.app`)

### Opção B — Deploy manual
1. No terminal, dentro da pasta do projeto:
   ```bash
   npm install
   npm run build
   ```
2. No Netlify, arraste a pasta `build` para a área de deploy

### Autorizar o domínio no Firebase
1. No Firebase → **Authentication → Configurações → Domínios autorizados**
2. Clique em **Adicionar domínio**
3. Cole a URL do Netlify (ex: `agenda-fabrica.netlify.app`)

---

## 4. Compartilhar com a equipe

Envie a URL do Netlify para cada profissional via Slack.
Cada um faz login com sua conta Google na primeira vez.
Somente os admins verão o menu **Configurações**.

---

## Estrutura do projeto

```
src/
├── lib/
│   ├── firebase.js      ← credenciais do Firebase
│   ├── gerarAgenda.js   ← lógica de geração de tarefas por mês
│   └── seedData.js      ← dados iniciais (profissionais e clientes)
├── hooks/
│   ├── useAuth.js       ← autenticação Google
│   └── useData.js       ← leitura/escrita no Firestore
├── components/
│   ├── Login.jsx        ← tela de login
│   ├── AgendaSemana.jsx ← grade de tarefas por semana
│   ├── ModalProfissional.jsx
│   └── ModalCliente.jsx
├── pages/
│   ├── Agenda.jsx       ← página principal
│   └── Configuracoes.jsx
└── App.jsx              ← navegação e layout
```

---

## Dúvidas?

Fale com Vinícius / Luiza ou abra uma issue no repositório.
