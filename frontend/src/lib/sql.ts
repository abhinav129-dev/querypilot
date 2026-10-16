const KEYWORDS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "GROUP",
  "ORDER",
  "BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "AS",
  "AND",
  "OR",
  "NOT",
  "IN",
  "IS",
  "NULL",
  "LIKE",
  "BETWEEN",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "DESC",
  "ASC",
  "DISTINCT",
  "ON",
  "UNION",
  "ALL",
  "JOIN",
  "INNER",
  "LEFT",
  "RIGHT",
  "FULL",
  "CROSS",
]);

const FUNCTIONS = new Set(["SUM", "COUNT", "AVG", "MIN", "MAX"]);

export type SqlTokenType =
  | "keyword"
  | "function"
  | "identifier"
  | "number"
  | "string"
  | "punctuation"
  | "space";

export interface SqlToken {
  text: string;
  type: SqlTokenType;
}

const TOKEN_PATTERN =
  /(\s+)|('(?:[^']|'')*')|(\d+(?:\.\d+)?)|([A-Za-z_][A-Za-z0-9_]*)|(.)/g;

export function tokenizeSql(sql: string): SqlToken[] {
  const tokens: SqlToken[] = [];
  for (const match of sql.matchAll(TOKEN_PATTERN)) {
    const [text, space, stringLiteral, number, word] = match;
    if (space !== undefined) {
      tokens.push({ text, type: "space" });
    } else if (stringLiteral !== undefined) {
      tokens.push({ text, type: "string" });
    } else if (number !== undefined) {
      tokens.push({ text, type: "number" });
    } else if (word !== undefined) {
      const upper = word.toUpperCase();
      if (KEYWORDS.has(upper)) {
        tokens.push({ text: upper, type: "keyword" });
      } else if (FUNCTIONS.has(upper)) {
        tokens.push({ text: upper, type: "function" });
      } else {
        tokens.push({ text, type: "identifier" });
      }
    } else {
      tokens.push({ text, type: "punctuation" });
    }
  }
  return tokens;
}

const CLAUSE_STARTERS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "UNION",
]);

const TWO_WORD_CLAUSES: Record<string, string> = {
  GROUP: "GROUP BY",
  ORDER: "ORDER BY",
};

const JOIN_PREFIXES = new Set(["INNER", "LEFT", "RIGHT", "FULL", "CROSS"]);

function splitTopLevel(tokens: SqlToken[]): SqlToken[][] {
  const parts: SqlToken[][] = [[]];
  let depth = 0;
  for (const token of tokens) {
    if (token.type === "punctuation") {
      if (token.text === "(") depth += 1;
      if (token.text === ")") depth -= 1;
      if (token.text === "," && depth === 0) {
        parts.push([]);
        continue;
      }
    }
    parts[parts.length - 1].push(token);
  }
  return parts;
}

function joinTokens(tokens: SqlToken[]): string {
  return tokens
    .map((token) => token.text)
    .join("")
    .trim();
}

export function formatSql(sql: string): string {
  const tokens = tokenizeSql(sql).filter(
    (token, index, all) =>
      !(token.type === "space" && (index === 0 || all[index - 1].type === "space")),
  );

  const lines: string[] = [];
  let current: SqlToken[] = [];
  let inSelect = false;
  let indentNext = false;

  const flush = () => {
    const text = joinTokens(current);
    if (text) lines.push(indentNext ? `  ${text}` : text);
    current = [];
    indentNext = false;
  };

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    const next = tokens[i + 1];

    if (token.type === "keyword") {
      const twoWord =
        TWO_WORD_CLAUSES[token.text] &&
        next?.type === "space" &&
        tokens[i + 2]?.text.toUpperCase() === "BY"
          ? TWO_WORD_CLAUSES[token.text]
          : null;

      if (twoWord) {
        flush();
        current.push({ text: twoWord, type: "keyword" });
        inSelect = false;
        i += 2;
        continue;
      }

      if (CLAUSE_STARTERS.has(token.text)) {
        flush();
        current.push(token);
        inSelect = token.text === "SELECT";
        continue;
      }

      if (
        (token.text === "JOIN" || JOIN_PREFIXES.has(token.text)) &&
        !inSelect
      ) {
        flush();
        current.push(token);
        continue;
      }

      if ((token.text === "AND" || token.text === "OR") && !inSelect) {
        flush();
        indentNext = true;
        current.push(token);
        continue;
      }
    }

    current.push(token);
  }
  flush();

  return lines
    .map((line) => {
      if (!line.toUpperCase().startsWith("SELECT ")) return line;
      const projectionTokens = tokenizeSql(line.slice("SELECT".length));
      const parts = splitTopLevel(projectionTokens)
        .map((part) => joinTokens(part))
        .filter(Boolean);
      if (parts.length <= 1) return line;
      return ["SELECT", ...parts.map((part, index) => `  ${part}${index < parts.length - 1 ? "," : ""}`)].join(
        "\n",
      );
    })
    .join("\n");
}
