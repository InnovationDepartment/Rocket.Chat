Meteor.startup(function() {
  RocketChat.settings.addGroup('DOJO', function() {
    const enableQuery = {_id: 'DOJO_Enable', value: true};
    this.add('DOJO_Enable', false, { type: 'boolean', public: true });
  });
});
