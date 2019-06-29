
type StatementSeriesNode = {
    statements: StatementNode[];
}

type StatementNode = {
    type: "using";
    statement: UsingStatement;
} | {
    type: "attr_definition";
    statement: AttributeDefinitionStatement;
} | {
    type: "named_attr_definition";
    statement: NamedAttributeDefinitionStatement;
};

type UsingStatement = {
    source_str: string;
    alias: string;
};

type AttributeDefinitionStatement = {
    attr_name: string;
    body: ObjExpression;
};

type NamedAttributeDefinitionStatement = {
    attr_name: string;
    body: ObjExpression;
};

type ObjExpression = {
    cls_name: string;
    statement_series: StatementSeriesNode;
};
