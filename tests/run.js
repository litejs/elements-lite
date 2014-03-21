global.document = global.document || require("../lib/min-document.js")
global.HTMLElement = global.HTMLElement || document.HTMLElement
global.window = global.window || global

require("./run-browser.js")

