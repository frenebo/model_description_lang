import { Token, TokenType } from "../tokens.js";

export class ParseError {
    constructor(
        public readonly token_pos: number,
        public readonly reason: string,
    ) {
        // empty
    }
}

export class Parser {
    constructor() {

    }

    private parse_using_statement(tokens: Token[], start_idx: number): StatementNode | ParseError {

    }

    private parse_statement(tokens: Token[], start_idx: number): StatementNode | ParseError {
        const results: Array<StatementNode | ParseError> = [
            this.parse_using_statement,
        ].map(func => func(tokens, start_idx));

        for (const result of results) {
            if (! (result instanceof ParseError)) return result;
        }

        return new ParseError(start_idx, "Could not parse statement");
        // const results = this.parse_using_statement(tokens, start_idx);


        // token
    }

    public parse_statement_series(
        tokens: Token[],
        end_tok_type: TokenType = TokenType.EndOfInput
    ): StatementSeriesNode | ParseError {

    }
}