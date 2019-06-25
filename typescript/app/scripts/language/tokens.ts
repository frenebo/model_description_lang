export enum TokenType {
    EndOfInput = "EndOfInput",
    Whitespace = "Whitespace",
    Semicolon = "Semicolon",
    Period = "Period",
    EqualsSign = "EqualsSign",
    Colon = "Colon",
    OpenBrace = "OpenBrace",
    CloseBrace = "CloseBrace",

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