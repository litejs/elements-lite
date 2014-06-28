


/*
* @version    0.2.2
* @date       2014-05-24
* @stability  1 - Experimental
* @author     Lauri Rooden <lauri@rooden.ee>
* @license    MIT License
*/



/*
 * In IE6, most of the choices in the Language Preference list specified a locale-neutral two letter code.
 * For instance fr was sent for French (France), and ja sent for Japanese.
 * Longer codes were only used when a language is commonly spoken in another country or locale-- for instance fr-CA was available for French-speaking Canadians.
 *
 * For Internet Explorer 7, a change was made such that Internet Explorer will send the full language/locale pair for each locale.
 * IE7 will send fr-FR for French (France) and de-DE for German (Germany).
 * This change enables web servers to more easily target content for a specific language and locale.
 * If a given server is only interested in the user’s language and not the locale, it can ignore the locale portion by simply truncating the code at the first dash.
 *
 * Anyway, it's always more user-friendly to use Accept-Language than IP-address-based Geo-Location.
 *
 * Accept-Language: eo;q=0
 * the q stands for "quality" and denotes a preference where 1 is highest and 0 means "not acceptable".
 * means "I can't read or understand Esperanto and no, please do not provide any content in that language."
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
	return this.format( i18n("date", lang) )
}

String.prototype.lang = function(lang) {
	return i18n(this, lang)
}
	root.i18n = i18n
}(this)

