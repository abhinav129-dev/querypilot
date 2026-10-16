import time
from pathlib import Path

import duckdb
import requests
import sqlglot
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlglot import exp
from sqlglot.errors import SqlglotError

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "analytics.duckdb"
MODEL = "qwen2.5:3b"
MAX_ROWS = 100
OLLAMA_URL = "http://localhost:11434/api/generate"

SCHEMA = """
Table: orders
Columns:
order_id INTEGER
order_date DATE
category VARCHAR
product VARCHAR
region VARCHAR
quantity INTEGER
revenue DOUBLE
"""

app = FastAPI(title="QueryPilot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str = Field(min_length=1, max_length=1000)


class QueryResponse(BaseModel):
    sql: str
    columns: list[str]
    rows: list[list]
    row_count: int
    elapsed_ms: int
    model: str


def initialize_db() -> None:
    with duckdb.connect(DB_PATH) as con:
        con.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                order_id INTEGER,
                order_date DATE,
                category VARCHAR,
                product VARCHAR,
                region VARCHAR,
                quantity INTEGER,
                revenue DOUBLE
            )
        """)

        row = con.execute("SELECT COUNT(*) FROM orders").fetchone()
        count = row[0] if row else 0

        if count == 0:
            con.execute("""
                INSERT INTO orders VALUES
                (1, '2026-08-03', 'Electronics', 'Headphones', 'South', 2, 4000),
                (2, '2026-08-05', 'Books', 'AI Engineering', 'West', 3, 1500),
                (3, '2026-08-12', 'Electronics', 'Keyboard', 'North', 4, 6000),
                (4, '2026-09-02', 'Books', 'Python Guide', 'South', 5, 2500),
                (5, '2026-09-08', 'Electronics', 'Monitor', 'West', 2, 12000),
                (6, '2026-09-15', 'Books', 'AI Engineering', 'North', 4, 2000)
            """)


def generate_sql(question: str) -> str:
    prompt = f"""
Generate one DuckDB SQL query for the user's business question.

Schema:
{SCHEMA}

Rules:
- Return SQL only. No Markdown or explanation.
- Generate exactly one SELECT statement.
- Read only from the orders table.
- Use explicit columns, not SELECT *.
- Do not use comments or multiple statements.
- Do not use file-reading functions or external data sources.
- Add LIMIT {MAX_ROWS} unless the query is an aggregate.

Question: {question}

SQL:
"""
    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0},
        },
        timeout=120,
    )
    response.raise_for_status()
    return response.json()["response"].strip()


def validate_sql(sql: str) -> str:
    statements = sqlglot.parse(sql, read="duckdb")

    if len(statements) != 1 or statements[0] is None:
        raise ValueError("Only one SQL statement is allowed.")

    tree = statements[0]

    if not isinstance(tree, exp.Select):
        raise ValueError("Only SELECT queries are allowed.")

    for projection in tree.expressions:
        if isinstance(projection, exp.Star):
            raise ValueError("Use explicit column names.")
        if isinstance(projection, exp.Column) and isinstance(
            projection.this, exp.Star
        ):
            raise ValueError("Use explicit column names.")

    tables = list(tree.find_all(exp.Table))

    if not tables:
        raise ValueError("The query must read from orders.")

    for table in tables:
        if table.name.lower() != "orders":
            raise ValueError("Only the orders table is allowed.")
        if table.db or table.catalog:
            raise ValueError("Use only the unqualified orders table.")

    if tree.args.get("limit") is None:
        tree = tree.limit(MAX_ROWS)

    return tree.sql(dialect="duckdb")


def run_query(sql: str) -> tuple[list[str], list[list]]:
    con = duckdb.connect(
        DB_PATH,
        read_only=True,
        config={"enable_external_access": "false"},
    )

    try:
        con.execute("SET memory_limit = '1GB'")
        con.execute("SET threads = 2")
        con.execute("SET lock_configuration = true")

        result = con.execute(sql)
        columns = [col[0] for col in result.description]
        rows = [list(row) for row in result.fetchmany(MAX_ROWS)]

        return columns, rows
    finally:
        con.close()


@app.on_event("startup")
def startup() -> None:
    initialize_db()


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "model": MODEL}


@app.get("/api/schema")
def schema() -> dict:
    con = duckdb.connect(DB_PATH, read_only=True)
    try:
        description = con.execute("DESCRIBE orders").fetchall()
        return {
            "tables": [
                {
                    "name": "orders",
                    "columns": [
                        {"name": row[0], "type": row[1]} for row in description
                    ],
                }
            ]
        }
    finally:
        con.close()


@app.post("/api/query", response_model=QueryResponse)
def query(payload: QueryRequest) -> QueryResponse:
    started = time.perf_counter()

    try:
        raw_sql = generate_sql(payload.question)
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=503,
            detail=(
                "Cannot reach Ollama. Check that Ollama is running "
                f"and {MODEL} is installed."
            ),
        ) from exc

    try:
        safe_sql = validate_sql(raw_sql)
    except (ValueError, SqlglotError) as exc:
        raise HTTPException(
            status_code=400, detail=f"Generated SQL was rejected: {exc}"
        ) from exc

    try:
        columns, rows = run_query(safe_sql)
    except duckdb.Error as exc:
        raise HTTPException(
            status_code=400, detail=f"Query execution failed: {exc}"
        ) from exc

    elapsed_ms = int((time.perf_counter() - started) * 1000)

    return QueryResponse(
        sql=safe_sql,
        columns=columns,
        rows=rows,
        row_count=len(rows),
        elapsed_ms=elapsed_ms,
        model=MODEL,
    )
