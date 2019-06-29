import { Token, TokenType } from "../tokens.js";

export class ParseError {
    constructor(
        public readonly reason: string,
        // public readonly token_pos: number,
        public readonly problem_pos: number,
    ) {
        // empty
    }
}

class ParseResult<T> {
    constructor(
        public readonly parsed: T,
        public readonly consumed: number,
    ) {}
}

export class Parser {
    constructor() {
    }

    private static parse_string_literal(tok: Token): string {
        return tok.text.substring(1, tok.text.length - 1);
    }

    private static consume_toktypes(tok_types: TokenType[], toks: Token[], start_idx: number): Token[] | ParseError {
        let position = start_idx;
        const parsed_toks: Token[] = [];

        for (const tok_type of tok_types) {
            if (toks[position].token_type != tok_type) {
                return new ParseError(
                    `Expected ${tok_type} token, got ${toks[position].token_type}`,
                    position
                );
            }
            parsed_toks.push(toks[position]);
            position++;
        }

        return parsed_toks;
    }

    private static parse_using_statement(tokens: Token[], start_idx: number): ParseResult<StatementNode> | ParseError {
        const try_consume = Parser.consume_toktypes(
            [
                TokenType.UsingKeyword,
                TokenType.StringLiteral,
                TokenType.AsKeyword,
                TokenType.Identifier,
                TokenType.Semicolon,
            ],
            tokens,
            start_idx,
        );
        if (try_consume instanceof ParseError) return try_consume;

        const source_str = Parser.parse_string_literal(try_consume[1]);
        const alias = try_consume[3].text;

        const consumed = try_consume.length;

        return new ParseResult<StatementNode>({
            type: "using",
            statement: {
                source_str: source_str,
                alias: alias,
            },
        }, consumed);
    }

    private static longest_parsed_or_furthest_error<T>(results: Array<ParseResult<T> | ParseError>): ParseResult<T> | ParseError {
        if (results.length === 0) throw Error("Zero length array of parse results or parse errors");

        let longest_parsed: null | ParseResult<T> = null;
        let longest_error: null | ParseError = null;

        for (const result of results) {
            if (result instanceof ParseError) {
                if (longest_error === null || result.problem_pos > longest_error.problem_pos) {
                    longest_error = result;
                }
            } else {
                if (longest_parsed === null || result.consumed > longest_parsed.consumed) {
                    longest_parsed = result;
                }
            }
        }

        if (longest_parsed != null) return longest_parsed;
        else return longest_error as ParseError;
    }

    private static parse_definition_body(tokens: Token[], start_idx: number): ParseResult<ObjExpression> | ParseError {
        let consumed = 0;
        const try_consume_name_and_open_brace = Parser.consume_toktypes(
            [TokenType.Identifier, TokenType.OpenBrace],
            tokens,
            start_idx + consumed,
        );
        if (try_consume_name_and_open_brace instanceof ParseError) return try_consume_name_and_open_brace;
        consumed += try_consume_name_and_open_brace.length;

        const try_parse_statement_series = Parser.parse_statement_series(
            tokens,
            TokenType.CloseBrace,
            start_idx + consumed,
        );
        if (try_parse_statement_series instanceof ParseError) return try_parse_statement_series;
        consumed += try_parse_statement_series.consumed;

        const try_consume_close_brace = Parser.consume_toktypes([TokenType.CloseBrace], tokens, start_idx + consumed);
        if (try_consume_close_brace instanceof ParseError) return try_consume_close_brace;
        consumed += try_consume_close_brace.length;

        return new ParseResult<ObjExpression>({
            cls_name: try_consume_name_and_open_brace[0].text,
            statement_series: try_parse_statement_series.parsed,
        }, consumed);
    }

    private static parse_attr_definition(tokens: Token[], start_idx: number): ParseResult<StatementNode> | ParseError {
        // const
        const try_consume_start = Parser.consume_toktypes(
            [
                TokenType.Period,
                TokenType.Identifier,
                TokenType.EqualsSign,
            ],
            tokens,
            start_idx,
        );
        if (try_consume_start instanceof ParseError) return try_consume_start;

        const attr_name = try_consume_start[1].text;
        let consumed = try_consume_start.length;

        const try_parse_body = Parser.parse_definition_body(tokens, start_idx + consumed);
        if (try_parse_body instanceof ParseError) return try_parse_body;
        consumed += try_parse_body.consumed;

        return new ParseResult<StatementNode>({
            type: "attr_definition",
            statement: {
                attr_name: attr_name,
                body: try_parse_body.parsed,
            }
        }, consumed);
    }

    private static parse_named_attr_definition(tokens: Token[], start_idx: number): ParseResult<StatementNode> | ParseError {
        const try_consume_start = Parser.consume_toktypes(
            [
                TokenType.StringLiteral,
                TokenType.Colon,
            ],
            tokens,
            start_idx,
        );
        if (try_consume_start instanceof ParseError) return try_consume_start;

        const attr_name = Parser.parse_string_literal(try_consume_start[0]);
        let consumed = try_consume_start.length;

        const try_parse_body = Parser.parse_definition_body(tokens, start_idx + consumed);
        if (try_parse_body instanceof ParseError) return try_parse_body;
        consumed += try_parse_body.consumed;

        return new ParseResult<StatementNode>({
            type: "named_attr_definition",
            statement: {
                attr_name: attr_name,
                body: try_parse_body.parsed,
            }
        }, consumed);
    }

    private static parse_statement(tokens: Token[], start_idx: number): ParseResult<StatementNode> | ParseError {
        const results: Array<ParseResult<StatementNode> | ParseError> = [
            Parser.parse_using_statement,
            Parser.parse_attr_definition,
            Parser.parse_named_attr_definition,
        ].map(func => func(tokens, start_idx));

        // return
        return this.longest_parsed_or_furthest_error<StatementNode>(results);
    }

    public static parse_statement_series(
        tokens: Token[],
        end_tok_type: TokenType = TokenType.EndOfInput,
        start_idx = 0,
    ): ParseResult<StatementSeriesNode> | ParseError {
        let consumed = 0;
        const statement_nodes: StatementNode[] = [];

        while (tokens[start_idx + consumed].token_type !== end_tok_type) {
            const try_parse = Parser.parse_statement(tokens, start_idx + consumed);

            if (try_parse instanceof ParseError) return try_parse;

            statement_nodes.push(try_parse.parsed);
            consumed += try_parse.consumed;
        }

        return new ParseResult({
            statements: statement_nodes,
        }, consumed);
    }
}