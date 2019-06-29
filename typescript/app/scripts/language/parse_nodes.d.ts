
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
    body: Expression;
};

type NamedAttributeDefinitionStatement = {
    attr_name: string;
    body: Expression;
};

type Expression = {
    type: "obj_expression";
    cls_name: string;
    statement_series: StatementSeriesNode;
} | {
    type: "list_expression";
    items: Expression[],
};
