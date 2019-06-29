import { Lexer, LexError } from "./language/lexer.js";
import { Parser, ParseError } from "./language/parser/parser.js";

export function run(div: HTMLDivElement): void {
  const aceDiv = document.createElement("div");

  div.appendChild(aceDiv);

  aceDiv.style.width = "100%";
  aceDiv.style.height = "80%";

  var editor = ace.edit(aceDiv);

  editor.setOptions({
    fontSize: "15pt",
  });

  editor.setTheme("ace/theme/monokai");

  editor.getSession().on("change", () => {
    updateErrors();
  });

  function showErrorMessage(code: string, mssg: string, pos: number) {
    const lines: string[] = code.split("\n");

    let line_idx = 0;
    let pos_in_line = 0;

    let covered = 0;
    while (covered < pos) {
      const line = lines[line_idx];
      if (line.length >= pos - covered) {
        pos_in_line = pos - covered;
        break;
      } else {
        covered += line.length + 1; // plus one for return
        line_idx++;
      }
    }

    editor.getSession().setAnnotations([{
      row: line_idx,
      column: pos_in_line,
      text: mssg,
      type: "error",
    }]);
  }

  function showNoErrorMessage() {
    editor.getSession().setAnnotations([]);
  }

  function updateErrors() {
    const code = editor.getValue();

    const lexed = new Lexer().lex(code);
    if (lexed instanceof LexError) {
      showErrorMessage(code, lexed.reason, lexed.position);
    } else {
      const parsed = Parser.parse_statement_series(lexed);
      if (parsed instanceof ParseError) {
        showErrorMessage(code, parsed.reason, parsed.problem_tok.text_pos);
      } else {
        showNoErrorMessage();
      }
    }

    // editor.getSession().setAnnotations([{
    //   row: 1,
    //   column: 0,
    //   text: "Error Message", // Or the Json reply from the parser
    //   type: "error" // also "warning" and "information"
    // }]);
    // if (lexed instanceof LexError) s
  }

  const runButton = document.createElement("button");
  div.appendChild(runButton);
  runButton.innerText = "run";
  runButton.onclick = () => setTimeout(() => {
    const code = editor.getValue();
    const lexed = new Lexer().lex(code);
    console.log(lexed);
    if (lexed instanceof LexError) return;
    const parsed = Parser.parse_statement_series(lexed);
    console.log(parsed);
    // const tokens = lex(code);
    // const parse_node = parseProgram(tokens);

    // if (parse_node !== null) executeProgram(parse_node!);
    // else throw new Error("Couldn't parse program");

  }, 0);
}
