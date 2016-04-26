Meteor.startup ->
	TimeSync.loggingEnabled = false

	UserPresence.awayTime = 300000
	UserPresence.start()
	Meteor.subscribe("activeUsers")

	Session.setDefault('AvatarRandom', 0)

	getParameterByName = (name, url) ->
	  if !url
	    url = window.location.href
	  name = name.replace(/[\[\]]/g, '\\$&')
	  regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
	  results = regex.exec(url)
	  if !results
	    return null
	  if !results[2]
	    return ''
	  decodeURIComponent results[2].replace(/\+/g, ' ')

	window.rememberToken = getParameterByName('remember')
	window.userIdToken = getParameterByName('userId')
	window.brandToken = getParameterByName('brand')

	window.lastMessageWindow = {}
	window.lastMessageWindowHistory = {}

	@defaultAppLanguage = ->
		lng = window.navigator.userLanguage || window.navigator.language || 'en'
		# Fix browsers having all-lowercase language settings eg. pt-br, en-us
		re = /([a-z]{2}-)([a-z]{2})/
		if re.test lng
			lng = lng.replace re, (match, parts...) -> return parts[0] + parts[1].toUpperCase()
		return lng

	@defaultUserLanguage = ->
		return RocketChat.settings.get('Language') || defaultAppLanguage()

	loadedLanguages = []

	@setLanguage = (language) ->
		if !language
			return

		if loadedLanguages.indexOf(language) > -1
			return

		loadedLanguages.push language

		if isRtl language
			$('html').addClass "rtl"
		else
			$('html').removeClass "rtl"

		language = language.split('-').shift()
		TAPi18n.setLanguage(language)

		language = language.toLowerCase()
		if language isnt 'en'
			Meteor.call 'loadLocale', language, (err, localeFn) ->
				Function(localeFn)()
				moment.locale(language)

	Meteor.subscribe("userData", () ->
		userLanguage = Meteor.user()?.language
		userLanguage ?= defaultUserLanguage()

		if localStorage.getItem('userLanguage') isnt userLanguage
			localStorage.setItem('userLanguage', userLanguage)

		setLanguage userLanguage
	)
