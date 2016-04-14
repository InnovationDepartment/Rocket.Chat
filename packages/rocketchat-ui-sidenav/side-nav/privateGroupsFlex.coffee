Template.privateGroupsFlex.helpers
	tRoomMembers: ->
		return t('Members')

	selectedUsers: ->
		return Template.instance().selectedUsers.get()

	name: ->
		return Template.instance().selectedUserNames[this.valueOf()]

	brand: ->
		console.log "-----------"
		console.log Template.instance().selectedUserNames
		console.log this.valueOf()
		console.log "-----------"
		return 'test DojoMojo'
	autocompleteSettings: ->
		return {
			limit: 10
			# inputDelay: 300
			rules: [
				{
					# @TODO maybe change this 'collection' and/or template
					collection: 'brands'
					subscription: 'brandAutocomplete'
					field: 'name'
					template: Template.brandSearch
					noMatchTemplate: Template.brandSearchEmpty
					matchAll: true
#					filter:
#						exceptions: [Meteor.user().username].concat(Template.instance().selectedUsers.get())
					selector: (match) ->
						return { name: match }
					sort: 'name'
				}
			]
		}

createCookie = (name, value, days) ->
	`var expires`
	if days
		date = new Date
		date.setTime date.getTime() + days * 24 * 60 * 60 * 1000
		expires = '; expires=' + date.toGMTString()
	else
		expires = ''
	document.cookie = name + '=' + value + expires + '; path=/'
	return

Template.privateGroupsFlex.events
	'autocompleteselect #pvt-group-members': (event, instance, doc) ->
		instance.selectedUsers.set instance.selectedUsers.get().concat doc.username

		instance.selectedUserNames[doc.username] = doc.name

		event.currentTarget.value = ''
		event.currentTarget.focus()

	'click .remove-room-member': (e, instance) ->
		self = @
		users = Template.instance().selectedUsers.get()
		users = _.reject Template.instance().selectedUsers.get(), (_id) ->
			return _id is self.valueOf()

		Template.instance().selectedUsers.set(users)

		$('#pvt-group-members').focus()

	'click .cancel-pvt-group': (e, instance) ->
		SideNav.closeFlex ->
			instance.clearForm()

	'click header': (e, instance) ->
		SideNav.closeFlex ->
			instance.clearForm()

	'mouseenter header': ->
		SideNav.overArrow()

	'mouseleave header': ->
		SideNav.leaveArrow()

	'keydown input[type="text"]': (e, instance) ->
#		debugger
		data = '{\n    "size": 200,\n    "query": {\n        "wildcard": {\n            "accountname":  "*wel*"\n        }\n    }                   \n}\n'
		xhr = new XMLHttpRequest
		xhr.withCredentials = true
		xhr.addEventListener 'readystatechange', ->
		if @readyState == 4
			console.log @responseText
			return

		createCookie('remember', 'MfejvoRMMRVuCegwSMmGTnNzI3NBiMxXMDUoxjbMtAy')
		xhr.open 'POST', 'http://localhost:5000/search/'
		xhr.setRequestHeader 'x-requested-with', 'XMLHttpRequest'
		xhr.setRequestHeader 'accept', '*/*'
		xhr.setRequestHeader 'accept-language', 'en-US,en;q=0.8'
		xhr.setRequestHeader 'content', 'application/json'
		xhr.send data

#		if document.querySelector('.input-line').value() == ''
#			$('.input-line:last').append '<div class="-autocomplete-container"></div>'
#		else
#			$('.input-line:last').append '<div class="-autocomplete-container"></div>'

Template.privateGroupsFlex.onCreated ->
	instance = this
	instance.selectedUsers = new ReactiveVar []
	instance.selectedUserNames = {}
	instance.error = new ReactiveVar []

	instance.clearForm = ->
		instance.error.set([])
		instance.groupName.set('')
		instance.selectedUsers.set([])
		nstance.find('#pvt-group-name').value = ''
		instance.find('#pvt-group-members').value = ''
