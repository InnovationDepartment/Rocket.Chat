RocketChat.models.Brands = new class extends RocketChat.models._Base
	constructor: ->
		@model = Meteor.brands

		@tryEnsureIndex { 'name': 1 }

	findByBrand: (brand, exceptions = [], options = {}) ->
		if not _.isArray exceptions
			exceptions = [ exceptions ]

		brandRegex = new RegExp brand, "i"
		query =
			$and: [
				{ brand: { $nin: exceptions } }
				{ brand: brandRegex }
			]

		return @find query, options


