Template.notifications.helpers({
  notifications: function () {
    return notifications.find({userId: Meteor.userId(), read: false});
  },
  notificationCount: function () {
    this.notifications.count();
  }
});

Template.notificationItem.helpers({
  notificationPostPath: function () {
    return Router.routes.postPage.path({_id: this.postId});
  }
});

Template.notificationItem.events({
  'click a': function () {
    Notifications.update(this._id, {$set: {read: true}});
  }
});
