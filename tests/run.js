var dom = require("dom-lite")

global.document = dom.document
global.HTMLElement = dom.HTMLElement
global.window = global
global.navigator = {language: "en-US"}
global.i18n = require("../i18n.js").i18n

global.document.querySelector = global.document.querySelectorAll = null

require("./run-browser.js")

