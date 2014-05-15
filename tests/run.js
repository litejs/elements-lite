var dom = require("dom-lite")

global.document = dom.document
global.HTMLElement = dom.HTMLElement
global.window = global

require("./run-browser.js")

