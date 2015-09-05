Template.header.helpers({
  activeRouteClass: function (/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    // returns a boolean
    var active = _.any(args, function (name) {
      return Router.current() && Router.current().route.getName() === name
    });

    // if active is true, it returns 'active' else it return false.
    return active && 'active';
  }
});
