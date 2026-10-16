import requests
import duckdb
import sqlglot
import streamlit as st
from sqlglot import exp

DB_PATH = "analytics.duckdb"
MODEL = "qwen2.5:3b"
MAX_ROWS = 100

st.set_page_config(page_title="QueryPilot", page_icon="📊")
st.title("📊 QueryPilot")
st.caption("Ask questions about your local sales data.")

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


def initialize_db():
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

        count = con.execute(
            "SELECT COUNT(*) FROM orders"
        ).fetchone()[0]

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


def generate_sql(question):
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
        "http://localhost:11434/api/generate",
        json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0}
        },
        timeout=120
    )
    response.raise_for_status()
    return response.json()["response"].strip()


def validate_sql(sql):
    statements = sqlglot.parse(sql, read="duckdb")

    if len(statements) != 1 or statements[0] is None:
        raise ValueError("Only one SQL statement is allowed.")

    tree = statements[0]

    if not isinstance(tree, exp.Select):
        raise ValueError("Only SELECT queries are allowed.")

    # Reject SELECT * but allow COUNT(*).
    for projection in tree.expressions:
        if isinstance(projection, exp.Star):
            raise ValueError("Use explicit column names.")
        if (
            isinstance(projection, exp.Column)
            and isinstance(projection.this, exp.Star)
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


def run_query(sql):
    # Read-only connection plus restricted DuckDB capabilities.
    con = duckdb.connect(
        DB_PATH,
        read_only=True,
        config={"enable_external_access": "false"}
    )

    try:
        con.execute("SET memory_limit = '1GB'")
        con.execute("SET threads = 2")
        con.execute("SET lock_configuration = true")

        result = con.execute(sql)
        columns = [col[0] for col in result.description]
        rows = result.fetchmany(MAX_ROWS)

        return columns, rows
    finally:
        con.close()


initialize_db()

question = st.text_input(
    "Ask a business question",
    placeholder="Which category generated the most revenue?"
)

if st.button("Analyze", type="primary", disabled=not question.strip()):
    try:
        with st.spinner("Generating SQL with Ollama..."):
            raw_sql = generate_sql(question)

        safe_sql = validate_sql(raw_sql)

        st.subheader("SQL query")
        st.code(safe_sql, language="sql")

        with st.spinner("Querying DuckDB..."):
            columns, rows = run_query(safe_sql)

        st.subheader("Results")
        st.dataframe(
            [dict(zip(columns, row)) for row in rows],
            use_container_width=True
        )

        st.success(f"Query completed: {len(rows)} row(s).")

    except requests.RequestException:
        st.error(
            "Cannot reach Ollama. Check that Ollama is running "
            "and qwen2.5:3b is installed."
        )
    except Exception as exc:
        st.error(f"Request failed: {exc}")
