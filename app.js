console.log('linked!');
var app = app || {};

$(document).ready( () => {
  app.Book.fetchAll(app.bookView.initIndexPage);
});

(function setUpPage(app) {
  const IS_PRODUCTION = location.host.includes('github.io');
  const bookView = {};
  bookView.initIndexPage = () => {
    bookView.elt = bookView.elt || $('#book-list');
    $('.container').hide();
    $('.book-view').show();
    console.log(bookView.elt);
    app.Book.all.forEach( book => bookView.elt.append(book.toHtml()));
  }
  app.ENVIRONMENT = {};
  app.ENVIRONMENT.apiUrl = (IS_PRODUCTION ? 'https://bookapp-backend.herokuapp.com' : 'http://localhost:3000');

  app.showOnly = (className) => {
    $('section').hide();
    $(`.${className}`).show();
  };

  app.render = (data) => {
    if (!app.template) {
      app.template = Handlebars.compile($('#book-template').html());
    }
    return app.template(data);
  };

  app.Book = function(data) {
    Object.assign(this, data);
  }

  app.Book.prototype.toHtml = function() {
    return app.render(this);
  }

  app.Book.all = [];

  app.Book.loadAll = (rows) => {
    console.log(rows);
    app.Book.all = rows.sort((a, b) => a.title - b.title).map(x => new app.Book(x));
  }

  app.errorCallback = (data) => {
    console.log(data);
    app.errorView.initErrorPage();
  }

  app.Book.fetchAll = (callback) => {
    $.ajax({
      method: 'GET',
      url: `${app.ENVIRONMENT.apiUrl}/books`,
      success: (responseData) => {
        app.Book.loadAll(responseData);
        if(callback) callback();
      },
      fail: error => {
        console.log(error);
        app.errorCallback();
      }
    })
  }

  app.bookView = bookView;
})(app);


