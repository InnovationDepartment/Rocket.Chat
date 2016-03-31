# Show notifications and play a sound for new messages.
# We trust the server to only send notifications for interesting messages, e.g. direct messages or
# group messages in which the user is mentioned.

Meteor.startup ->

  Tracker.autorun ->

    if Meteor.userId()

      RocketChat.Notifications.onUser 'notification', (notification) ->
        console.log notification
        request = new XMLHttpRequest()
        url = "http://localhost:8003/message"
        request.open 'POST', url, true
        request.setRequestHeader "Content-type", "application/json"
        request.send JSON.stringify { message: notification }

        openedRoomId = undefined
        if FlowRouter.getRouteName() in ['channel', 'group', 'direct']
          openedRoomId = Session.get 'openedRoom'
          # This logic is duplicated in /client/startup/unread.coffee.
          hasFocus = readMessage.isEnable()
          messageIsInOpenedRoom = openedRoomId is notification.payload.rid
          if !(hasFocus and messageIsInOpenedRoom)
            # Play a sound.
            KonchatNotification.newMessage()
            # Show a notification.
            KonchatNotification.showDesktop notification
