
function i18n(text, lang) {
	lang = i18n.getLang(lang)
	return (i18n[lang][text] || text)
}


i18n.getLang = function(lang) {
	lang = (lang||"").toLowerCase()
	return i18n[lang] || ((lang = lang.split("-")[0]) && i18n[lang]) ? lang : i18n.current
}

i18n.setLang = function(lang) {
	lang = i18n.getLang(lang)
	if (i18n.current != lang) {
		i18n.current = lang
	}
	i18n[lang] = i18n[lang] || {}
	return lang
}

i18n.main = i18n.current = "en"

i18n.en = {
	date: "%a, %d %b %Y %H:%M:%S %z",
	name: "Name {date|lang}"
}

i18n.et = {
	date: "%Y %H:%M:%S %z",
	name: "Nimi {date|lang:'et'}"
}

//i18n.setLang(navigator.language || navigator.userLanguage)

Date.prototype.lang = function(lang) {
	return this.format( i18n("date") )
}

String.prototype.lang = function(lang) {
	return i18n(this, lang)
}
