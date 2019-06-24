export enum TokenType {
    EndOfInput = "EndOfInput",
    Whitespace = "Whitespace",
    Newline = "Newline",

    UsingKeyword = "UsingKeyword",
    AsKeyword = "AsKeyword",
    StringLiteral = "StringLiteral",
    NumberLiteral = "NumberLiteral",
    Identifier = "Identifier",
};

export class Token {
    constructor(
        public readonly token_type: TokenType,
        public readonly text: string,
    ) {

    }
}