import { compile } from "./rex"

const src = rex`
  // This is rex code that will be compiled to rexc bytecode
  // and interpreted in proxy routing.
  headers.x-flow-26 = "Hack the planet with style!"
`



export default { routes: { src } }





function rex([string]: TemplateStringsArray) {
  return `rex:${compile(string.trim())}`
}