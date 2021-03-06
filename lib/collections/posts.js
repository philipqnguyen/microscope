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

Posts.deny({
  update: function (userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

validatePost = function (post) {
  var errors = {};
  if (!post.title)
    errors.title = "Please fill in a headline";
  if (!post.url)
    errors.url = "Please fill in a URL";
  return errors;
};

Meteor.methods({
  postInsert: function (postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });

    var errors = validatePost(postAttributes);
    if (errors.title || errors.url)
      throw new Meteor.Error('invalid-post', 'You must set a title and URL for your post');

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
      submitted: new Date(),
      commentsCount: 0
    });
    var postId = Posts.insert(post);
    return {
      _id: postId
    }
  },

  upvote: function (postId) {
    check(this.userId, String);
    check(postId, String);
    // Find posts with this postId that does not have this userId.
    // Then, update teh votes count by 1 and add this userId to upvoters.
    var affected = Posts.update({
      _id: postId,
      upvoters: {$ne: this.userId}
    }, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });
    if (! affected)
      throw new Meteor.Error('invalid', "You're not able to upvote that post");
  }
});
