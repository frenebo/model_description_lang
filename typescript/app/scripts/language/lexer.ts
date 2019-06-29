import {Token, TokenType} from "./tokens.js"

export class LexError {
    constructor(
        public readonly position: number,
        public readonly reason: string,
    ) {

    }
}

export class Lexer {
    private static readonly exact_matches = new Map<string, TokenType>([
        ["using", TokenType.UsingKeyword],
        ["as", TokenType.AsKeyword],
        [";", TokenType.Semicolon],
        [".", TokenType.Period],
        ["=", TokenType.EqualsSign],
        [":", TokenType.Colon],
        ["{", TokenType.OpenBrace],
        ["}", TokenType.CloseBrace],
        ["[", TokenType.OpenBracket],
        ["]", TokenType.CloseBracket],
        [",", TokenType.Comma],
    ]);

    private static readonly whitespace_chars: string[] = [" ", "\t", "\n"];

    private static readonly norm_identifier_chars = "_qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    private static readonly num_chars = "1234567890";

    constructor() {
        // empty
    }

    public lex(text: string): Token[] | LexError {
        let tokens: Token[] = [];

        let consumed_chars = 0;

        while (text.length - consumed_chars > 0) {
            const tok: Token | LexError = this.lex_tok(text, consumed_chars);
            if (tok instanceof LexError) return tok;

            consumed_chars += tok.text.length;
            tokens.push(tok);
        }

        // Remove whitespace
        tokens = tokens.filter((tok) => tok.token_type != TokenType.Whitespace);

        tokens.push(new Token(TokenType.EndOfInput, "", text.length - 1));

        return tokens;
    }

    private static parse_string_literal(text: string, start_idx: number): Token | null {
        // let
        if (text[start_idx] != "\"") return null;
        const next_quotation_mark = text.substring(start_idx + 1).indexOf("\"");
        if (next_quotation_mark == -1) return null;

        const consumed = next_quotation_mark + 2;

        return new Token(TokenType.StringLiteral, text.substring(start_idx, start_idx + consumed), start_idx);
    }

    private static parse_number_literal(text: string, start_idx: number): Token | null {
        let consumed = 0;
        let seen_period = false;
        // do something with each of these later?
        let before_period_digits = 0;
        let after_period_digits = 0;

        do {
            const next_ch = text[start_idx + consumed];

            if (next_ch == ".") {
                if (seen_period) break;
                else seen_period = true;
            } else if (Lexer.num_chars.indexOf(next_ch) != -1) {
                if (seen_period) after_period_digits++;
                else before_period_digits++;
            } else {
                break;
            }

            consumed++;
        } while(text.length - start_idx - consumed > 0);

        if (before_period_digits == 0) return null;
        if (seen_period && after_period_digits == 0) return null;

        return new Token(TokenType.NumberLiteral, text.substring(start_idx, start_idx + consumed), start_idx);
    }

    private static parse_identifier(text: string, start_idx: number): Token | null {
        if (Lexer.norm_identifier_chars.indexOf(text[start_idx]) == -1) return null;
        let consumed = 1;
        while (text.length - start_idx - consumed > 0 &&
                (Lexer.norm_identifier_chars + Lexer.num_chars).indexOf(text[start_idx + consumed]) != -1
        ) {
            consumed++;
        }

        return new Token(TokenType.Identifier, text.substring(start_idx, start_idx + consumed), start_idx);
    }

    private static parse_whitespace(text: string, start_idx: number): Token | null {
        let consumed = 0;

        while (text.length - start_idx - consumed > 0 &&
            Lexer.whitespace_chars.indexOf(text[start_idx + consumed]) != -1
        ) {
            consumed++;
        }

        if (consumed == 0) return null;
        else return new Token(TokenType.Whitespace, text.substring(start_idx, start_idx + consumed), start_idx);
    }

    private lex_tok(text: string, start_idx: number): Token | LexError {
        const matches: Array<Token | null> = [
            Lexer.lex_exact_matches,
            Lexer.parse_whitespace,
            Lexer.parse_string_literal,
            Lexer.parse_identifier,
            Lexer.parse_number_literal,
        ].map(func => func(text, start_idx));

        let longest_match: Token | null = null;

        for (const match of matches) {
            if (match != null && (longest_match == null || match.text.length > longest_match.text.length)) {
                longest_match = match;
            }
        }

        if (longest_match == null) {
            return new LexError(start_idx, "Could not lex text");
        }

        return longest_match;
    }

    private static lex_exact_matches(text: string, start_idx: number): Token | null {
        for (const [match_text, match_tok_type] of Lexer.exact_matches) {
            if (
                match_text.length <= text.length &&
                text.substr(start_idx, match_text.length) == match_text
            ) {
                    return new Token(match_tok_type, match_text, start_idx);
            }
        }

        return null;
    }
}