$(function () {
  // モーダル
  $('.modal-btn').on('click', function () {
    $('.modal').fadeIn();
  });
  $('.modal__box__close').on('click', function () {
    $('.modal').fadeOut(300);
  });
  // フィルター
  $('.filter-btn').on('click', function () {
    var checkedMedia = $('input[name="media"]:checked').val();
    var checkedTag = $('input[name="tag"]:checked').val();
    var checkedIndustry = $('input[name="industry"]:checked').val();
    $('.search-txt').find('p').remove();
    $('.search-txt').hide();
    if (checkedMedia == null && checkedTag == null && checkedIndustry == null) {
      $('.list-card__item').fadeIn();
      $('.applied').css('display', 'none');
      $('.no-search').hide();
    } else {
      $('.applied').fadeIn();
      $('.list-card__item').each(function () {
        var txt = $(this).find('li').text();
        if (txt.match(checkedMedia) != null && txt.match(checkedIndustry) != null && txt.match(checkedTag) != null) {
          $(this).fadeIn();
          $(this).addClass('display');
        } else {
          $(this).hide();
          $(this).removeClass('display');
        }
      });
      if(checkedMedia == null) {
        $('#media').hide();
      } else {
        $('#media').fadeIn();
        $('#media').text(checkedMedia);
      }
      if(checkedIndustry == null) {
        $('#industry').hide();
      } else {
        $('#industry').fadeIn();
        $('#industry').text(checkedIndustry);
      }
      if(checkedTag == null) {
        $('#tag').hide();
      } else {
        $('#tag').fadeIn();
        $('#tag').text(checkedTag);
      }
      var displayCount = $('.display').length;
      $('.search-txt').fadeIn();
      $('.search-txt').html(`<p><span>${displayCount}件の検索結果</span></p>`);
      if (displayCount === 0) {
        $('.no-search').fadeIn();
      } else {
        $('.no-search').hide();
      }
    }
    // モーダルを閉じる
    $('.modal').fadeOut();
  });
  // フィルターを解除
  $('.filter-clear').on('click', function () {
    $('.list-card__item').fadeIn();
    $('.applied').hide();
    $('.no-search').hide();
    $('.search-txt').hide();
    $('.filter-list__item').prop('checked', false).change();
  });
  //検索ボックスを表示切り替え
  function openSearchbox() {
    $('.filter__search__bg').fadeIn();
    $(".filter__search").css('width', '96vw');
    $(".filter__search input").css({
      'padding': '0 80px 0 30px',
      'color': '#777'
    });
    $('.filter__search__button').css('right', '32px');
    $('.filter__search__close-button').fadeIn();
    $(".filter__search").removeClass('close');
  };
  function closeSearchbox() {
    $('.filter__search__bg').hide();
    $(".filter__search").css('width', '');
    $(".filter__search input").css({
      'padding': '',
      'color': 'transparent'
    });
    $('.filter__search__button').css('right', '');
    $('.filter__search__close-button').hide();
    $(".filter__search").addClass('close');
  };
  //検索結果表示
  function search() {
    var searchText = $('.filter__search').find('input').val();
    if (searchText !== '') {
      $('.list-card__item').each(function () {
        targetText = $(this).text();
        if (targetText.indexOf(searchText) != -1) {
          $(this).fadeIn();
          $(this).addClass('display');
        } else {
          $(this).hide();
          $(this).removeClass('display');
        }
      });
      var displayCount = $('.display').length;
      console.log(displayCount);
      $('.applied').css('display', 'none');
      $('.applied').find('li').remove();
      $('.search-txt').fadeIn();
      $('.search-txt').html(`<p>${searchText}の検索結果</p><span>${displayCount}件の検索結果</span>`);
      if (displayCount === 0) {
        $('.no-search').fadeIn();
      } else {
        $('.no-search').hide();
      }
    }
    $('.filter-list__item').prop('checked', false).change();
  }
  $('.filter__search__button').on('click', function () {
    var winWidth = window.innerWidth;
    if (winWidth < 670) {
      if ($(".filter__search").hasClass('close')) {
        openSearchbox();
      } else {
        search();
        closeSearchbox();
      }
    } else {
      search();
    }
  });
  $('.filter__search__close-button').on('click', function () {
    closeSearchbox();
  });
  $('.filter__search__bg').on('click', function () {
    closeSearchbox();
  });
});