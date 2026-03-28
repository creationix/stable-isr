import { compile } from "./rex"

const src = rex`
  // This is rex code that will be compiled to rexc bytecode
  // and interpreted in proxy routing.
  // We can set a custom response header
  res.headers.x-flow-26 = "Hack the planet with style!"

  // We can do arbitrary routing logic
  when res.path == "/hello" do
    name = req.query.name or "world"
    res.headers.x-greeting = "Hwllo, " + name + "!"
  end
`


export default { routes: { src } }

function rex([string]: TemplateStringsArray) {
  return `rex:${compile(string.trim())}`
}