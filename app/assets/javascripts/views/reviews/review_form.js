Yup.Views.ReviewForm = Backbone.View.extend({
  className: "review-form",
  template: JST['reviews/form'],
  events: {
    "submit form": "save",
    "click button.close": "close"
  },

  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
    $('.backdrop').click(this.close.bind(this));
  },

  close: function (event) {
    if ($(event.target).attr('class') === 'backdrop' ||
        $(event.target).attr('class') === 'close') {
      event.preventDefault();
      $('.backdrop').remove();
      this.remove();
    }
  },

  displayRating: function () {
    this.$("#input-id").rating();
  },

  parseErrors: function(model, response) {
    var errors = response.responseJSON;
    var $errors = this.$('ul').empty();
    for (var prop in errors) {
      errors[prop].forEach( function (errorMsg) {
        var $error = $('<li>').addClass('begin');
        $error.text(prop + " " + errorMsg);
        $errors.append($error);

        setTimeout(function () {
          $error.removeClass('begin');
        }, 0);
      });
    }
  },

  render: function () {
    var content = this.template({ business: this.model });
    this.$el.html(content);
    this.$('#input-id').on('rating.change', function (e, v, c) {
      this.rating = parseFloat(v);
    }.bind(this));

    this.displayRating();
    return this;
  },

  save: function (event) {
    event.preventDefault();
    var review = new Yup.Models.Review({ rating: this.rating });
    review.set('content', this.$('textarea').val());
    review.set('business_id', this.model.get('id'));

    var that = this;
    review.save({}, {
      success: function () {
        that.model.fetch();
        that.remove();
        Backbone.history.navigate("#redirecting...");
        Backbone.history.navigate(
          "businesses/" + that.model.get('id'),
          { trigger: true }
        );
      },

      error: function (model, response) {
        this.parseErrors(model, response);
      }.bind(this)
    });
  }
});
