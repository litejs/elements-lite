


/*
* @version    0.2.2
* @date       2014-05-24
* @stability  1 - Experimental
* @author     Lauri Rooden <lauri@rooden.ee>
* @license    MIT License
*/






!function(root) {
	var current;

	function i18n(text, lang) {
		return (i18n[lang ? getLang(lang) : current][text] || text)
	}

	function getLang(lang) {
		if (!lang) return current
		lang = (lang||"").toLowerCase()
		return i18n[lang] ? lang : (lang = lang.split("-")[0]), i18n[lang] ? lang : current
	}

	function setLang(lang) {
		lang = i18n.getLang(lang)
		if (current != (current = lang)) {
			i18n[lang] = i18n[lang] || {}
		}
		return lang
	}

	i18n.getLang = getLang
	i18n.setLang = setLang

//i18n.main = i18n.current = "en"

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
	root.i18n = i18n
}(this)

