@ChatMessage = new Meteor.Collection null
@ChatRoom = new Meteor.Collection 'rocketchat_room'
@ChatSubscription = new Meteor.Collection 'rocketchat_subscription'
@RoomModeratorsAndOwners = new Mongo.Collection null
@UserAndRoom = new Meteor.Collection null
@Brands = new Meteor.Collection 'rocketchat_brands'
@CachedChannelList = new Meteor.Collection null

RocketChat.models.Users = _.extend {}, RocketChat.models.Users, Meteor.users
RocketChat.models.Brands = _.extend {}, RocketChat.models.Brands, @brands
RocketChat.models.Subscriptions = _.extend {}, RocketChat.models.Subscriptions, @ChatSubscription
RocketChat.models.Rooms = _.extend {}, RocketChat.models.Rooms, @ChatRoom
RocketChat.models.Messages = _.extend {}, RocketChat.models.Messages, @ChatMessage
