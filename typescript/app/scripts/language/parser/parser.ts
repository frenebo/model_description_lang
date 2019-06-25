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

    private static consume_toktype(tok_types: TokenType[], toks: Token[], start_idx: number): Token[] | ParseError {
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
        const try_consume = Parser.consume_toktype(
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
        console.log(try_consume);

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

    private static parse_statement(tokens: Token[], start_idx: number): ParseResult<StatementNode> | ParseError {
        const results: Array<ParseResult<StatementNode> | ParseError> = [
            Parser.parse_using_statement,
        ].map(func => func(tokens, start_idx));

        // return
        return this.longest_parsed_or_furthest_error<StatementNode>(results);
    }

    public parse_statement_series(
        tokens: Token[],
        end_tok_type: TokenType = TokenType.EndOfInput
    ): ParseResult<StatementSeriesNode> | ParseError {
        let consumed = 0;
        const statement_nodes: StatementNode[] = [];

        while (tokens[consumed].token_type !== end_tok_type) {
            const try_parse = Parser.parse_statement(tokens, consumed);

            if (try_parse instanceof ParseError) return try_parse;

            statement_nodes.push(try_parse.parsed);
            consumed += try_parse.consumed;
        }

        return new ParseResult({
            statements: statement_nodes,
        }, consumed);
    }
}