// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by rocketchat-dojo.js.
import { name as packageName } from "meteor/rocketchat-dojo";

// Write your tests here!
// Here is an example.
Tinytest.add('rocketchat-dojo - example', function (test) {
  test.equal(packageName, "rocketchat-dojo");
});
