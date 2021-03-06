import $ from 'jquery';
import render from './render';
import store from './store';
import api from './api';

$.fn.extend({
  serializeJson: function (noRating) {
    const formData = new FormData(this[0]);
    noRating ? formData.delete('rating') : void 0;
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return JSON.stringify(o);
  }
});

function handleAddNewBookmark() {
  $('main').on('click', '#add-bookmark', () => {
    store.adding = true;
    render.render();
  });
}

function handleDeleteBookmark() {
  $('main').on('click', '.bookmark-delete', e => {
    e.stopPropagation();
    const id = $(e.target).closest('.bookmark-id').data('id');
    store.deleteBookmark(id);
    api.deleteBookmark(id)
      .then(() => render.render());
  });
  //for accessibilty - does action on enter key press
  $('main').on('keypress', '.bookmark-delete', e => {
    if (e.which === 13) {
      e.stopPropagation();
      const id = $(e.target).closest('.bookmark-id').data('id');
      store.deleteBookmark(id);
      api.deleteBookmark(id)
        .then(() => render.render());
    }
  });
}

function handleCancelAddBookmark() {
  $('main').on('click', '#cancel-add-bookmark', () => {
    store.adding = false;
    render.render();
  });
}

function handleFilterBookmarksOpen() {
  $('main').on('click', '#filter-bookmarks', e => {
    store.filterListOpen = !store.filterListOpen;
    render.render();
    //if navigating by tab set focus to first button in list
    if (e.detail === 0) {
      setTimeout(() => { render.renderFocus('#ratings-choices-container button'); }, 100);
    }
  });
}

function handleFilterBookmarksOverlay() {
  $('body').on('click', '#rating-select-overlay', () => {
    store.filterListOpen = false;
    render.render();
  });
}

function handleFilterBookmarksSelect() {
  $('main').on('click', '.ratings', e => {
    store.filter = Number($(e.target).data('rating'));
    store.filterListOpen = false;
    render.render();
  });
}

function handleExpandBookmark() {
  $('main').on('click', '.bookmark-id', e => {
    const id = $(e.target).closest('.bookmark-id').data('id');
    store.toggleExpanded(id);
    render.render();
  });
  //for accessibilty - does action on enter key press
  $('main').on('keypress', '.bookmark-id', e => {
    if (e.which === 13) {
      const id = $(e.target).closest('.bookmark-id').data('id');
      store.toggleExpanded(id);
      render.render();
      //set focus after render so can continue at same location 
      setTimeout(() => { render.renderFocus(`[data-id="${id}"]`); }, 100);
    }
  });
}

function handleEditBookmarkDescription() {
  $('main').on('click', '.desc-element', e => {
    const id = $(e.target).closest('li').find('.bookmark-id').data('id');
    store.editingDescription = { target: e.target, id };
    render.render();
  });
  //for accessibilty - does action on enter key press
  $('main').on('keypress', '.desc-element', e => {
    if (e.which === 13) {
      const id = $(e.target).closest('li').find('.bookmark-id').data('id');
      store.editingDescription = { target: e.target, id };
      render.render();
    }
  });
}

function handleUpdateBookmarkDescription() {
  $('main').on('submit', '.update-desc-form', e => {
    e.preventDefault();
    let data = $(e.target).serializeJson();
    const id = $(e.target).closest('li').find('.bookmark-id').data('id');
    api.updateBookmark(data, id)
      .then(() => render.render());
  });
}

function handleRatingMouseEnterEffect() {
  $('main').on('mouseover', '.unrated-buttons', e => {
    let rating = Number($(e.target).data('rating'));
    render.renderRatingMouseEnterEffect(rating);
  });
}

function handleRatingMouseLeaveEffect() {
  $('main').on('mouseleave', '.unrated-buttons', () => {
    render.renderRatingMouseLeaveEffect();
  });
}

function handleRatingClickEffect() {
  $('main').on('click', '.unrated-buttons', e => {
    e.preventDefault();
    $('main').off('mouseleave mouseover', '.unrated-buttons');
    let rating = Number($(e.target).data('rating'));
    render.renderRatingClickEffect(rating);
  });
}

function handleAddBookmarkFormSubmit() {
  $('main').on('submit', '#add-bookmark-form', e => {
    e.preventDefault();
    store.adding = false;
    let data = $('#rating-input').val() === '' ? $(e.target).serializeJson(true) : $(e.target).serializeJson();
    api.addBookmark(data)
      .then(() => {
        render.render();
      })
      .catch(error => {
        store.error = error;
        store.adding = true;
        render.render();
      });
  });
}

function bindEventListeners() {
  handleAddNewBookmark();
  handleDeleteBookmark();
  handleFilterBookmarksOpen();
  handleFilterBookmarksOverlay();
  handleFilterBookmarksSelect();
  handleCancelAddBookmark();
  handleExpandBookmark();
  handleEditBookmarkDescription();
  handleUpdateBookmarkDescription();
  handleRatingMouseEnterEffect();
  handleRatingMouseLeaveEffect();
  handleRatingClickEffect();
  handleAddBookmarkFormSubmit();
}

export default {
  bindEventListeners
};