var dom = require("dom-lite")
dom.document.querySelector = dom.document.querySelectorAll = null
dom.document.documentElement = {}

global.document = dom.document
global.HTMLElement = dom.HTMLElement
global.window = global
global.navigator = {language: "en-US"}
global.Fn = require("functional-lite").Fn


require("./run-browser.js")

