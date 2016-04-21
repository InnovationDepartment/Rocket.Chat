var createCookie;

var emptyList = function () {
  document.getElementById('brandsearchlist').innerHTML = '';
};

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
    console.log ("-----------");
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

Template.privateGroupsFlex.events({
  'autocompleteselect #pvt-group-members': function(event, instance, doc) {
    instance.selectedUsers.set(instance.selectedUsers.get().concat(doc.username));
    instance.selectedUserNames[doc.username] = doc.name;
    event.currentTarget.value = '';
    return event.currentTarget.focus();
  },
  'click .remove-room-member': function(e, instance) {
    var self, users, brands;
    self = this;
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
        filtered: {
          query: {
            wildcard: {
              accountnameSearch:  "*" + document.querySelector('.input-line .search').value + "*"
            }
          }
        }
      }
    };
    xhr = new XMLHttpRequest;
    xhr.addEventListener('load', Template.instance().loadedResults);
    xhr.open('POST', process.env.DOJOMOJO_URL + '/search');
    xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
    xhr.setRequestHeader('accept', '*/*');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('accept-language', 'en-US,en;q=0.8');
    xhr.setRequestHeader('authtoken', readCookie('remember'));
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
  instance.myBrandId = readCookie('brand');
  instance.myBrandName = readCookie('brand');
  instance.newResultItem = function (brand) {
    var accountname = brand._source.accountname;
    var id = brand._id;
    var result = document.createElement('li');

    result.innerHTML = accountname;
    result.className = 'result';
    result.style = 'color: #9ec8c4; font-weight: bold; font-size: 12px; padding: 10px;';
    result.onclick = function(e) {
       // add brandId to group chat
      instance.selectedBrands.set({ id: id, name: accountname });
      instance.createChat();
       // now remove list display
       emptyList();
    };

    return result;
  };

  instance.getUsersForBrand = function(brandId, callback) {
      var xhr = new XMLHttpRequest;
      xhr.addEventListener('load', callback);
      xhr.open('POST', process.env.DOJOMOJO_URL + '/brands-users');
      xhr.setRequestHeader('brandid', instance.myBrandId);
      xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
      xhr.setRequestHeader('accept', '*/*');
      xhr.setRequestHeader('accept-language', 'en-US,en;q=0.8');
      xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
      xhr.setRequestHeader('authtoken', readCookie('remember'));
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({ brandId: brandId}));
  };

  instance.loadedResults = function(e) {
    var hits = JSON.parse(e.target.response).hits.hits;
    if (hits.length > 0) {
      var resultslist = document.createElement('ul');
      resultslist.id = 'resultslist';
      for (var i = 0; i < hits.length && i < 10; i++) {
        resultslist.appendChild(instance.newResultItem(hits[i]));
      }
      document.getElementById('brandsearchlist').innerHTML = '';
      document.getElementById('brandsearchlist').style = 'border-color: #d5ecdb; border-style: solid; border-width: 1px; background-color: #fff; color: #000;';
      document.getElementById('brandsearchlist').appendChild(resultslist);
    }
    else {
      //document.getElementById('resultslist').innerHTML = '';
    }
  };

  instance.createChat = function() {
    var err = SideNav.validate();

    instance.groupName.set(name);

    var response, chatUserIds;
    instance.getUsersForBrand(instance.selectedBrands.get().id, function(response) {
      response = JSON.parse(response.target.response);
      chatUserIds = response.chatuserids;
      var name = response.accountname + ' and ' +  instance.selectedBrands.get().name;
      for (var i = 0; i < chatUserIds.length; i++) {
        instance.selectedUsers.set(instance.selectedUsers.get().concat(chatUserIds[i]));
      }

      name = name.replace(/\s/g, '-');

      if (!err) {
        Meteor.call('createPrivateGroup', name, chatUserIds, function(err, result) {
          FlowRouter.go('group', { name: name })
          SideNav.closeFlex();
          instance.clearForm();
        });
      }
    });
  };

  return instance.clearForm = function() {
    instance.error.set([]);
    instance.groupName.set('');
    instance.selectedUsers.set([]);
    instance.find('#pvt-group-name').value = '';
    return instance.find('#pvt-group-members').value = '';
  };
});


