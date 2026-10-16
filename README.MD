# QueryPilot

A local AI data analyst that translates natural-language business questions into SQL and executes queries against DuckDB.

## Features

- Natural-language-to-SQL generation using a locally hosted LLM.
- Local analytical database powered by DuckDB.
- SQL parsing and basic query validation with SQLGlot.
- Interactive results using Streamlit.
- No paid LLM API required for the local setup.

## Tech Stack

- Python
- DuckDB
- Streamlit
- Ollama with Qwen 2.5 3B
- SQLGlot

## Getting Started

### Prerequisites

- Python 3.11 or newer
- [Ollama](https://ollama.com/download)
- Git

### Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd querypilot
```

Create and activate a virtual environment on Windows:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

Download the model:

```powershell
ollama pull qwen2.5:3b
```

Run the application:

```powershell
python -m streamlit run app.py
```

Open the local URL shown in your terminal, usually `http://localhost:8501`.

## Web App (Next.js + FastAPI)

The project also ships a Next.js workspace UI and a FastAPI backend.

### One-command setup

From the project root:

```powershell
npm install
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:8000 (health check: `/api/health`)

`npm run dev` starts both processes in one terminal with prefixed logs (`[api]` and `[web]`). It uses the virtual environment at `.venv/Scripts/python.exe` directly, so no separate activation is needed. Press `Ctrl+C` to stop both processes.

### Fresh clone

If `frontend/node_modules` is missing, install the frontend dependencies once:

```powershell
npm --prefix frontend install
```

### Prerequisites

The backend requires the Python packages from `requirements.txt` (install them inside `.venv`):

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## How It Works

1. A user submits a business question.
2. The local LLM generates SQL.
3. SQLGlot parses and validates the generated query.
4. DuckDB executes the query against the local sample dataset.
5. Streamlit displays the query and results.

## Limitations

This is an experimental MVP. SQL validation provides basic safeguards, not a complete security sandbox. Do not expose it to untrusted users without additional security controls.

## Roadmap

- [ ] Automatic chart selection
- [ ] CSV upload and schema discovery
- [ ] Conversation history and follow-up questions
- [ ] Automated SQL safety tests
- [ ] Snowflake integration

## License

License to be selected.