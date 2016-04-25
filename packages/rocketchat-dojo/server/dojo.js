var Future = Npm.require( 'fibers/future' );
var Fiber = Npm.require('fibers');

var cookies = new Cookies();

var self = this

var makeid = function (){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 5; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

var randomPassword = function () {
  return Accounts._hashPassword(makeid()).digest.substr(10,40)
}

// ServiceConfiguration.configurations.upsert(
//   { service: "dojo" },
//   {
//     $set: {
//       clientId: "1292962797",
//       loginStyle: "popup",
//       secret: "75a730b58f5691de5522789070c319bc"
//     }
//   }
// );
Accounts.registerLoginHandler("customLoginHandler", function (options) {
    console.log("customLoginHandler()");
});

RocketChat.API.v1.addRoute('test', {
  get: function () {
    return 'heelo';
  }
});
RocketChat.API.v1.addRoute('register-user', {
  post: function () {
    var user = Accounts.findUserByEmail(this.request.body.email)._id;
    if (!user) {
      var user = Accounts.createUser(this.request.body);
    }
    return user;
  }
});

Meteor.methods({
  dojoAuth: function (cookie) {
console.log('auth');   
 var self = this
    // var cookie =  this.request.cookies['remember']
    console.log(process.env);

    var future = new Future();
    pg.connect(process.env.PG_DOJO, function(err, client, done) {
      var select;
      select = client.query({
        name: "db:select",
        text: "SELECT * FROM users where \"cookieToken\" = '" + cookie + "'"
      });
      select.on('row', function(row, result) {

        if (!row) {
          return null;
        }

        Fiber(function() {
    
          var stampedLoginToken = Accounts._generateStampedLoginToken();
          var hashStampedToken = Accounts._hashStampedToken(stampedLoginToken);
          var user = Accounts.users.findOne({ 'emails.address' : row.email });
          if( !user ) {
            user = Accounts.createUser({
              username: row.firstName + ' ' + row.lastName,
              email: row.email,
              password: randomPassword()
            }, function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log('success!');
              }
            })
          }

          Accounts._insertHashedLoginToken(user._id, hashStampedToken);
          future.return({
            token: stampedLoginToken,
            userId: user._id
          });
        }).run();
      });
      select.on('error', function(err) {
        console.log("select:error");
        future.return( err )
      });
      select.on('end', function(result) {
        console.log("select:end");
      });
      return done();
    });
    return future.wait();
  }, post: function(){
    console.log( req, res, next )
  }
});

