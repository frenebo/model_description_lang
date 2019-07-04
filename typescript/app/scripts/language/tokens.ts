export enum TokenType {
    EndOfInput = "EndOfInput",
    Whitespace = "Whitespace",
    Semicolon = "Semicolon",
    Period = "Period",
    EqualsSign = "EqualsSign",
    Colon = "Colon",
    Comma = "Comma",
    OpenBrace = "OpenBrace",
    CloseBrace = "CloseBrace",
    OpenBracket = "OpenBracket",
    CloseBracket = "CloseBracket",
    QuestionMark = "QuestionMark",

    UsingKeyword = "UsingKeyword",
    AsKeyword = "AsKeyword",
    StringLiteral = "StringLiteral",
    NumberLiteral = "NumberLiteral",
    Name = "Name",
};

export class Token {
    constructor(
        public readonly token_type: TokenType,
        public readonly text: string,
        public readonly text_pos: number,
    ) {

    }
}