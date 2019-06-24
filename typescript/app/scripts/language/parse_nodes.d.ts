
type StatementSeriesNode = {
    statements: StatementNode[];
}

type StatementNode = {
    type: "using";
    statement: UsingStatement;
};

type UsingStatement = {
    source_str: string;
    alias: string;
};
