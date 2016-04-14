Meteor.publish 'brandAutocomplete', (selector) ->
#	unless this.userId
#		return this.ready()

	pub = this

	options =
		fields:
			name: 1

		limit: 10
		sort:
			name: 1

	exceptions = selector.exceptions or []

	console.log RocketChat.models
	cursorHandle = RocketChat.models.Brands.findByBrand(selector.name, exceptions, options).observeChanges
		added: (_id, record) ->
			pub.added("autocompleteRecords", _id, record)
		changed: (_id, record) ->
			pub.changed("autocompleteRecords", _id, record)
		removed: (_id, record) ->
			pub.removed("autocompleteRecords", _id, record)
	@ready()
	@onStop ->
		cursorHandle.stop()
	return

