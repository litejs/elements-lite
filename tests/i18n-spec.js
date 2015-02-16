var dom = require("dom-lite")
dom.document.documentElement = {}

global.document = dom.document
global.HTMLElement = dom.HTMLElement
global.window = global
global.navigator = {language: "en-US"}
global.Fn = require("functional-lite").Fn

global.Event = global.Event || {}

require("liquid-filters-lite")
require("../")
global.i18n = window.El.i18n

i18n.def({ "et":"Eesti keeles"
	, "en":"In English"
	, "ru":"На русском"
	, "fi":"Suomeksi"
	, "se":"på Svenska"
})

i18n.add("en", {
	date: "%a, %d %b %Y %H:%M:%S %z",
	name: "Name {date|lang}"
})

i18n.add("et", {
	"translated": "tõlgitud",
	"ns:translated": "tõlge",
	date: "%Y %H:%M:%S %z",
	name: "Nimi {date|lang:'et'}"
})

i18n.use("en")

require("testman").
describe("i18n").

it ("should translate").

equal(i18n("not translated"), "not translated").
equal(i18n("not translated", "et"), "not translated").
equal(i18n("ns:not translated"), "not translated").
equal(i18n("ns:not translated", "et"), "not translated").

equal(i18n("translated"), "translated").
equal(i18n("translated", "et"), "tõlgitud").
equal(i18n("ns:translated"), "translated").
equal(i18n("ns:translated", "et"), "tõlge").
equal(i18n("no-ns:translated", "et"), "tõlgitud").


done()



