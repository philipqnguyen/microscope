// Purposely not use 'var'. In Meteor, var is scoped to a single file.
// We want Posts to be accessible to all of your app, so we leave out var.
Posts = new Mongo.Collection('posts');

Meteor.methods({
  postInsert: function (postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });
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
