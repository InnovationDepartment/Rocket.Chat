const logger = new Logger('LDAPSync', {});

RocketChat.settings.get('LDAP_Sync_User_Data', function(key, value) {
  Meteor.clearInterval(interval);
  Meteor.clearTimeout(timeout);

  if (value === true) {
    logger.info('Enabling LDAP user sync');
    interval = Meteor.setInterval(sync, 1000 * 60 * 60);
    timeout = Meteor.setTimeout(function() {
      sync();
    }, 1000 * 30);
  } else {
    logger.info('Disabling LDAP user sync');
  } 
});
