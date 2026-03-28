import { compile } from "./rex"

export default {
  routes: [
    rex`
      // This is rex code that will be compiled to rexc bytecode
      // and interpreted in proxy routing.
      // We can set a custom response header
      res.headers.x-flow-26 = "Hack the planet with style!"

      // We can do arbitrary routing logic
      when req.path == "/hello" do
        name = req.query.name or "world"
        res.headers.x-greeting = "Hello, " + name + "!"
        res.status = 200
        // TODO: implement in proxy
        // res.body = "Hello, " + name + "!"
      end
    `        
  ]
}

function rex([string]: TemplateStringsArray) {
  return { src: `^rex:${compile(string.trim())}$` }
}