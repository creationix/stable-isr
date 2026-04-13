// import { compile } from "./rex"

export default {
//   routes: [
//     rex`
//       // This is rex code that will be compiled to rexc bytecode
//       // and interpreted in proxy routing.
//       // We can set a custom response header
//       res.headers.x-flow-26 = "Hack the planet with style!"
//     `,
//     rex`
//       // We can do arbitrary routing logic
//       when req.path == "/hello" do
//         name = req.query.name or "world"
//         req.path = "/" // rewrite to homepage
//         res.headers.x-greeting = "Hello, " + name + "!"
//       end
//     `        
//   ]
}

// function rex([string]: TemplateStringsArray) {
//   const route = { src: `^rex:${compile(string.trim())}$` }
//   console.log("Compiled rex route:", route)
//   return route
// }