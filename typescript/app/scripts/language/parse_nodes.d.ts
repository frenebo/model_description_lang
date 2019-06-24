
type ProgramNode = {
    statements: StatementNode[];
}

type StatementNode = UsingStatement;

type UsingStatement = {
    type: "using_statement";
    source_str: string;
    alias: string;
}
