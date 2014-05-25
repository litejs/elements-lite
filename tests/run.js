var dom = require("dom-lite")

global.document = dom.document
global.HTMLElement = dom.HTMLElement
global.window = global
global.navigator = {language: "en-US"}

global.document.querySelector = global.document.querySelectorAll = null

require("./run-browser.js")

