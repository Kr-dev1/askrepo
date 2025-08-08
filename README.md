<br/>
<div align="center">
  <h1>AskRepo</h1>
  <p><strong>Your AI-powered guide to any GitHub repository.</strong></p>
  <p>Ask questions about codebases in natural language and get instant, context-aware answers.</p>        

  <br/>

  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B7?style=for-the-badge&logo=google-gemini&logoColor=white)](https://gemini.google.com/)

</div>

---

Tired of spending hours trying to understand a new codebase? **AskRepo** is a powerful tool that leverages Large Language Models (LLMs) to create a searchable, intelligent knowledge base from any GitHub repository.

Simply link a repo, and start asking questions. Whether you're onboarding a new developer, exploring an open-source project, or just trying to find a specific piece of logic, AskRepo is your personal code expert.

## ✨ Features

*   **🔐 Secure Authentication:** Sign up/in with email and password or Google OAuth, powered by NextAuth.js.
*   **🔗 Easy Repo Linking:** Connect any public or private GitHub repository using a URL and an optional personal access token.
*   **🤖 AI-Powered Indexing:** Automatically clones, parses, summarizes, and creates vector embeddings for your entire codebase using Google's Gemini models.
*   **💬 Natural Language Q&A:** Ask complex questions about functionality, code structure, or specific implementations and get detailed, code-aware answers.
*   **🔍 Contextual Answers:** Utilizes Retrieval-Augmented Generation (RAG) to provide answers grounded in your repository's actual code.
*   **📜 Commit Summaries:** Automatically fetches and summarizes the latest commits to keep you updated on recent changes.
*   **✨ Modern & Responsive UI:** Built with Next.js, Tailwind CSS, and shadcn/ui for a clean and intuitive user experience.

## 🛠️ How It Works

AskRepo uses a two-stage Retrieval-Augmented Generation (RAG) pipeline to provide accurate, context-aware answers.

1.  **Indexing Pipeline:**
    *   When a repo is linked, a background job uses LangChain's `GithubRepoLoader` to fetch the code.    
    *   Each file is then processed by Google Gemini to generate a concise summary.
    *   This summary is converted into a vector embedding and stored in a PostgreSQL database (with the `pgvector` extension) alongside the original code and summary.

2.  **Q&A Pipeline:**
    *   When you ask a question, it's converted into a vector embedding.
    *   A similarity search is performed against the stored code embeddings to find the most relevant code chunks.
    *   These chunks (the context) and your original question are passed to Gemini, which generates a comprehensive, human-readable answer based on the provided information.

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18 or later)
*   [Bun](https://bun.sh/) (or `npm`/`yarn`)
*   [PostgreSQL](https://www.postgresql.org/) database
*   The [`pgvector` extension](https://github.com/pgvector/pgvector) enabled on your PostgreSQL instance. 

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ask-repo.git
cd ask-repo
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add the following variables. You can copy the structure from `.env.example` if one exists.

```env
# Prisma - Your PostgreSQL connection string with pgvector
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# NextAuth.js
AUTH_SECRET="your-super-secret-auth-secret" # Generate one: openssl rand -base64 32
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Gemini API Key
GEMINI_API_KEY="your-gemini-api-key"

# GitHub Token (for accessing repositories)
GITHUB_TOKEN="your-github-personal-access-token"
```

### 4. Set Up the Database

Generate the Prisma client and run the database migrations.

```bash
# Generate Prisma Client
bunx prisma generate

# Apply migrations to your database
bunx prisma migrate dev
```

### 5. Run the Development Server

You're all set! Start the development server.

```bash
bun run dev
```
