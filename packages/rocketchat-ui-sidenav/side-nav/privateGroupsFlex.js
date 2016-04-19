var createCookie;

Template.privateGroupsFlex.helpers({
  tRoomMembers: function() {
    return t('Members');
  },
  selectedUsers: function() {
    return Template.instance().selectedUsers.get();
  },
  selectedBrands: function() {
    return Template.instance().selectedBrands.get();
  },
  groupName: function() {
    return Template.instance().groupName.get();
  },
  name: function() {
    return Template.instance().selectedUserNames[this.valueOf()];
  },
  brand: function() {
    console.log("-----------");
    console.log(Template.instance().selectedUserNames);
    console.log(this.valueOf());
    console.log("-----------");
    // need to get the brand name from the brandid (this.valueof)
    return this.valueOf();
  },
  autocompleteSettings: function() {
    return {
      limit: 10,
      rules: [
        {
          collection: 'brands',
          subscription: 'brandAutocomplete',
          field: 'name',
          template: Template.brandSearch,
          noMatchTemplate: Template.brandSearchEmpty,
          matchAll: true,
          selector: function(match) {
            return {
              name: match
            };
          },
          sort: 'name'
        }
      ]
    };
  }
});

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i=0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ')
      c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }

  return null;
}

createCookie = function(name, value, days) {
  var expires;
  var date, expires;
  if (days) {
    date = new Date;
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toGMTString();
  } else {
    expires = '';
  }
  document.cookie = name + '=' + value + expires + '; path=/';
};

getUsersForBrand = function(brandid, callback) {
    var xhr = new XMLHttpRequest;
    xhr.addEventListener('load', callback);
    xhr.open('GET', 'http://localhost:5000/brands/' + brandid + '/users');
    xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
    xhr.setRequestHeader('accept', '*/*');
    xhr.setRequestHeader('accept-language', 'en-US,en;q=0.8');
    xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
    xhr.setRequestHeader('authtoken', readCookie('remember'));
    xhr.setRequestHeader('content', 'application/json');
    xhr.send();
};

Template.privateGroupsFlex.events({
  'autocompleteselect #pvt-group-members': function(event, instance, doc) {
    instance.selectedUsers.set(instance.selectedUsers.get().concat(doc.username));
    instance.selectedUserNames[doc.username] = doc.name;
    event.currentTarget.value = '';
    return event.currentTarget.focus();
  },
  'click .save-pvt-group': function(e, instance) {
    var err = SideNav.validate();
     // set group name
     // stub
    var name = instance.selectedBrands.reduce(function(acc, current) {
      return arr + current;
    }, '');

    instance.groupName.set(name);

    getUsersForBrand(selectedBrandId, function(response) {
         var usersInBrand = JSON.parse(response.target.response);
       // stub until auth working
       var fakeUsersInBrand = ['tony', 'tony test'];
       for (var i = 0; /* i < usersInBrand */ i < fakeUsersInBrand.length; i++) {
         instance.selectedUsers.set(instance.selectedUsers.get().concat(/* usersInBrand[i] */ fakeUsersInBrand[i]));
         instance.selectedUserNames[fakeUsersInBrand[i]] = fakeUsersInBrand[i];
       }

       console.log(usersInBrand);
    });

    if (!err) {
     Meteor.call('createPrivateGroup', name, instance.selectedUsers.get(), function(err, result) {
       SideNav.closeFlex();
       instance.clearForm();
     });
    }
  },
  'click .remove-room-member': function(e, instance) {
    var self, users, brands;
    self = this;
    /*
    users = Template.instance().selectedUsers.get();
    users = _.reject(Template.instance().selectedUsers.get(), function(_id) {
      return _id === self.valueOf();
    });
    */

    brands = Template.instance().selectedBrands.get();
    brands = _.reject(template.instance().selectedBrands.get(), function(_id) {
      return _id === self.value.Of();
    });
    Template.instance().selectedBrands.set(brands);
    return $('#pvt-group-members').focus();
  },
  'click .cancel-pvt-group': function(e, instance) {
    return SideNav.closeFlex(function() {
      return instance.clearForm();
    });
  },
  'click header': function(e, instance) {
    return SideNav.closeFlex(function() {
      return instance.clearForm();
    });
  },
  'mouseenter header': function() {
    return SideNav.overArrow();
  },
  'mouseleave header': function() {
    return SideNav.leaveArrow();
  },
  'keyup input[type="text"]': function(e, instance) {
    var data, xhr;
    if (document.querySelector('.input-line .search').value === '') {
      document.getElementById('brandsearchlist').innerHTML = '';
      return;
    }
    data = {
      size: 200,
      query: {
        wildcard: {
          accountname:  "*" + document.querySelector('.input-line .search').value + "*"
        }
      }
    };
    xhr = new XMLHttpRequest;
    xhr.addEventListener('load', function(e) {
      var hits = JSON.parse(e.target.response).hits.hits;
      if (hits.length > 0) {
        var resultslist = document.createElement('ul');
        resultslist.id = 'resultslist';
        for (var i = 0; i < hits.length && i < 10; i++) {
          var result = document.createElement('li');
          result.innerHTML = hits[i]._source.accountname;
          result.className = 'result';
          result.onclick = function(e) {
            var selectedBrandId = e.target.dataset.brandid;
            instance.selectedBrands.set(instance.selectedBrands.get().concat(selectedBrandId));
            debugger;
            // now remove list display
            document.getElementById('brandsearchlist').innerHTML = '';
          };
          result.setAttribute('data-brandid', hits[i]._id);
          resultslist.appendChild(result);
        }
        document.getElementById('brandsearchlist').innerHTML = '';
        document.getElementById('brandsearchlist').style = 'background-color: #fff; color: #000;';
        document.getElementById('brandsearchlist').appendChild(resultslist);
      }
      else {
        document.getElementById('resultslist').innerHTML = '';
      }
    });
    xhr.open('POST', 'http://localhost:5000/search');
    xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
    xhr.setRequestHeader('accept', '*/*');
    xhr.setRequestHeader('accept-language', 'en-US,en;q=0.8');
    xhr.setRequestHeader('authtoken', readCookie('remember'));
    xhr.setRequestHeader('content', 'application/json');
    return xhr.send(JSON.stringify(data));
  }
});

Template.privateGroupsFlex.onCreated(function() {
  var instance;
  instance = this;
  instance.selectedUsers = new ReactiveVar([]);
  instance.selectedBrands = new ReactiveVar([]);
  instance.selectedUserNames = {};
  instance.error = new ReactiveVar([]);
  instance.groupName = new ReactiveVar([]);

  return instance.clearForm = function() {
    instance.error.set([]);
    instance.groupName.set('');
    instance.selectedUsers.set([]);
    instance.find('#pvt-group-name').value = '';
    return instance.find('#pvt-group-members').value = '';
  };
});

// ---
// generated by coffee-script 1.9.2
