export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface QueryResult {
  sql: string;
  columns: string[];
  rows: unknown[][];
  row_count: number;
  elapsed_ms: number;
  model: string;
}

export interface SchemaColumn {
  name: string;
  type: string;
}

export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parseError(res: Response): Promise<never> {
  let message = `Request failed with status ${res.status}.`;
  try {
    const body = (await res.json()) as { detail?: string };
    if (body.detail) message = body.detail;
  } catch {
    // keep default message
  }
  throw new ApiError(message, res.status);
}

export async function askQuestion(question: string): Promise<QueryResult> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
  } catch {
    throw new ApiError(
      "Cannot reach the QueryPilot API. Start the FastAPI server on port 8000.",
      0,
    );
  }
  if (!res.ok) await parseError(res);
  return (await res.json()) as QueryResult;
}

export async function fetchSchema(): Promise<{ tables: SchemaTable[] }> {
  const res = await fetch(`${API_BASE}/api/schema`, { cache: "no-store" });
  if (!res.ok) await parseError(res);
  return (await res.json()) as { tables: SchemaTable[] };
}
