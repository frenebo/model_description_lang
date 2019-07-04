
type StatementSeriesNode = {
    statements: StatementNode[];
}

type StatementNode = {
    type: "using";
    statement: UsingStatement;
} | {
    type: "assignment";
    statement: AssignmentStatement;
}
// {
//     type: "attr_definition";
//     statement: AttributeDefinitionStatement;
// } | {
//     type: "var_definition";
//     statement: NamedAttributeDefinitionStatement;
// };

type UsingStatement = {
    source_str: string;
    alias: string;
};

type AssignmentStatement = {
    lhs: Expression;
    rhs: Expression;
};

// type AttributeDefinitionStatement = {
//     attr_name: string;
//     body: Expression;
// };

// type NamedAttributeDefinitionStatement = {
//     attr_name: string;
//     body: Expression;
// };

type IdentifierExpression = {

};

type Expression = {
    type: "obj_expression";
    cls_name: string;
    statement_series: StatementSeriesNode;
} | {
    type: "list_expression";
    items: Expression[],
} | {
    type: "question_mark_expression";
} | {
    type: "number_literal_expression";
    number_value: number;
} | {
    type: "identifier_expression";
    identifier_exp: IdentifierExpression;
};
