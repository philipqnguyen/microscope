Template.postSubmit.events({
  'submit form': function (e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    Meteor.call('postInsert', post, function (error, result) {
      // display the error to the user and abort
      if (error)
        throwError(error.reason)

      // If post with existing url is found, inform the user and route anways
      if (result.postExists)
        throwError('This link has already been posted');

      Router.go('postPage', {_id: result._id});
    });
  }
});
