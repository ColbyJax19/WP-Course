import $ from 'jquery';

class Search {
  //create/initiate object
  constructor() {
    this.resultsDiv = $('#search-overlay__results');
    this.openButton = $('.js-search-trigger');
    this.closeButton = $('.search-overlay__close');
    this.searchOverlay = $('.search-overlay');
    this.searchTerm = $('#search-term');
    // this.searchTerm = document.querySelector('.search-term');
    this.events();
    this.isOverlayOpen = false;
    this.isSpinnerVisible = false;
    this.previousValue;
  }
  // events
  events() {
    this.openButton.on('click', this.openOverlay.bind(this));
    this.closeButton.on('click', this.closeOverlay.bind(this));
    $(document).on('keydown', this.keyPressDispatcher.bind(this));
    this.searchTerm.on('keyup', this.searchInput.bind(this));
  }
  //methods

  searchInput() {
    if (this.searchTerm.val() != this.previousValue) {
      clearTimeout(this.typingTimer);
      if (this.searchTerm.val()) {
        if (!this.isSpinnerVisible) {
          this.resultsDiv.html('<div class="spinner-loader"></div>');
          this.isSpinnerVisible = true;
        }

        this.typingTimer = setTimeout(this.getResults.bind(this), 1000);
      } else {
        this.resultsDiv.html('');
        this.isSpinnerVisible = false;
      }
    }
    this.previousValue = this.searchTerm.val();
  }

  getResults() {
    $.getJSON(
      'http://localhost:10011/wp-json/wp/v2/posts?search=' +
        this.searchTerm.val(),
      (posts) => {
        this.resultsDiv.html(`
          <h2 class="search-overlay__section-title">General Information</h2>
          <ul class="link-list min-list">
            ${posts.map(
              (item) =>
                `<li><a href=${item.link}>${item.title.rendered}</a></li>`
            )}
          </ul>
        `);
      }
    );
  }

  keyPressDispatcher(e) {
    // e.keyCode();
    if (
      e.keyCode == 83 &&
      this.isOverlayOpen == false &&
      !$('input, textarea').is(':focus')
    ) {
      this.openOverlay();
    }

    if (e.keyCode == 27 && this.isOverlayOpen == true) {
      this.closeOverlay();
    }
  }

  openOverlay() {
    this.searchOverlay.addClass('search-overlay--active');
    $('body').addClass('body-no-scroll');
    this.isOverlayOpen = true;
  }
  closeOverlay() {
    this.searchOverlay.removeClass('search-overlay--active');
    $('body').removeClass('body-no-scroll');
    this.isOverlayOpen = false;
  }
}

console.log('search');

export default Search;
