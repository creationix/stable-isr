import { compile } from "./rex"

export default {
  routes: [
    {
      middlewareRawSource: [compile(`
        headers.x-flow-26 = "Hack the planet with style!"
      `)],
    }
  ]
}