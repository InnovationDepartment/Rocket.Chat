RocketChat.roomTypes.add null, 0,
	template: 'starredRooms'
	icon: 'icon-star'

RocketChat.roomTypes.add 'd', 20,
	template: 'directMessages'
	icon: 'icon-at'
	route:
		name: 'direct'
		path: '/direct/:username'
		action: (params, queryParams) ->
			window.localStorage.setItem('last_conversation', '/direct/' + params.username)
			Session.set 'showUserInfo', params.username
			openRoom 'd', params.username
			RocketChat.TabBar.showGroup 'directmessage'
		link: (sub) ->
			return { username: sub.name }
	condition: ->
		return RocketChat.authz.hasAllPermission 'view-d-room'

RocketChat.roomTypes.add 'p', 30,
	template: 'privateGroups'
	icon: 'icon-lock'
	route:
		name: 'group'
		path: '/group/:name'
		action: (params, queryParams) ->
			Session.set 'showUserInfo'
			openRoom 'p', params.name
			RocketChat.TabBar.showGroup 'privategroup'
		link: (sub) ->
			return { name: sub.name }
	condition: ->
		return RocketChat.authz.hasAllPermission 'view-p-room'
