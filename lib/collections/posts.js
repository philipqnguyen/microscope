// Purposely not use 'var'. In Meteor, var is scoped to a single file.
// We want Posts to be accessible to all of your app, so we leave out var.
Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function (userId, post) { return ownsDocument(userId, post); },
  remove: function (userId, post) { return ownsDocument(userId, post); }
});

Posts.deny({
  update: function (userId, post, fieldNames) {
    // may only edit the following two fields.
    // If other fieldNames, without the url and title field,
    // has a length > 0, then we reject it.
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

Meteor.methods({
  postInsert: function (postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });

    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    var user = Meteor.user();
    // _.extend is part of Underscore library. Extends one object
    // with the properties of another.
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    var postId = Posts.insert(post);
    return {
      _id: postId
    }
  }
});
