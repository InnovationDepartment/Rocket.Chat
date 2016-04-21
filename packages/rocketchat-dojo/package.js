// Package.describe({
//   name: 'dojo:rocketchat-dojo',
//   version: '0.0.1',
//   // Brief, one-line summary of the package.
//   summary: '',
//   // URL to the Git repository containing the source code for this package.
//   git: '',
//   // By default, Meteor will default to using README.md for documentation.
//   // To avoid submitting documentation, set this field to null.
//   documentation: 'README.md'
// });

// Package.onUse(function(api) {

//   api.versionsFrom('1.3.1');
//   api.use('ecmascript@0.1.6');

//   api.use('mongo@1.1.3', ['client', 'server']);
//   api.use('rocketchat:lib');
//   api.use('rocketchat:logger');

//   api.use([
//     // 'coffeescript@1.0.11',
//     // 'underscore@1.0.4',
//     // 'rocketchat:lib',
//     'accounts-password@1.1.4',
//     'accounts-base@1.2.2'
//   ]);

//   api.addFiles('server/startup.js', ['server']);
//   api.addFiles('server/settings.js', ['server']);
//   api.addFiles('server/sync.js', ['server']);
//   api.addFiles('server/dojo.js', ['server']);

//   api.export( 'DOJO', 'server');

// });

// Package.onTest(function(api) {
//   api.use('ecmascript');
//   api.use('tinytest');
//   api.use('dojo:rocketchat-dojo');
// });

Package.describe({
  name: 'dojo:rocketchat-dojo',
  version: '0.0.1',
  summary: 'Rest API',
  git: ''
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use([
    // 'coffeescript',
    // 'underscore',
    'ostrio:cookies',
    'rocketchat:lib',
    'accounts-password',
    'austinrivas:postgresql'
    // 'nimble:restivus'
  ]);

  api.addFiles('server/dojo.js', 'server');
  api.addFiles('server/sync.js', 'server');
});

Package.onTest(function(api) {

});
