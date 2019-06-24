import { Lexer } from "./language/lexer.js";

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

  const runButton = document.createElement("button");
  div.appendChild(runButton);
  runButton.innerText = "run";
  runButton.onclick = () => setTimeout(() => {
    const code = editor.getValue();
    console.log(new Lexer().lex(code));
    // const tokens = lex(code);
    // const parse_node = parseProgram(tokens);

    // if (parse_node !== null) executeProgram(parse_node!);
    // else throw new Error("Couldn't parse program");

  }, 0);
}
