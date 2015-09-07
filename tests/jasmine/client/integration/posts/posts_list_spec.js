describe('Posts list', function () {
  beforeEach(function (done) {
    Router.go('/');
    Tracker.afterFlush(done);
  });

  beforeEach(waitForRouter);

  it('should display the first post, Test post #0', function () {
    expect($('h3').find('a')[0].innerText).toEqual('Test post #0');
  });

  it('should get the correct title, Microscope', function () {
    expect($('title').text()).toEqual('Microscope');
  });
});
