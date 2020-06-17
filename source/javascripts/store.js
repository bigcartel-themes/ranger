var Store = {
  init: function(page,options) {
    var path_name = top.location.pathname;
    var admin_path = new RegExp("/admin/design");
    var inPreview = admin_path.test(path_name);
    var options = $.extend(this.defaults, options);
    $('.category-nav').hover(function() {
      $(this).toggleClass('dropdown-open');
    });
    $('.dropdown-list a').click(function(e) {
      $(this).closest('.category-nav').removeClass('dropdown-open');
    });
    $('.category-nav > a').bind('touchstart', function(e) {
      if ($('.category-dropdown').length) {
        $(this).parent().toggleClass('dropdown-open');
        if ($(this).parent().hasClass('dropdown-open')) {
          e.preventDefault();
        }
      }
    });
    $('.option-quantity').change(function(e) {
      $(this).closest('form').submit();
      return false;
    });
    $('.open-dropdown').click(function() {
      $(this).toggleClass('dropdown-visible');
      if ($('.hide-header').length) {
        if ($('.hide-header').css('display') == 'block') {
          $('.hide-header').fadeOut(200, function() {
            $('.mobile-navigation').fadeToggle(200);
            $('.store-link').fadeIn(200);
          });
        }
        else {
          $('.store-link').fadeOut(200, function() {
            $('.mobile-navigation').fadeToggle(200);
            $('.hide-header').fadeIn(200);
          });
        }
      }
      else {
        $('.mobile-navigation').fadeToggle(200);
      }
      return false;
    });
    $('.item-delete').click(function(e) {
      $(this).closest('li').find('input.option-quantity').val(0).closest('form').submit();
      return false;
    });
    $('.product-thumbnails li a').click(function(e) {

      var data_url = $(this).attr('href')
      var data_srcset = $(this).data('srcset');

      $('.primary-product-image').attr('src',data_url);
      $('.primary-product-image').attr('data-srcset',data_srcset);

      $('.product-thumbnails li').removeClass('active');
      $(this).parent().addClass('active');
      return false;
    });
    $('.product_option_select').on('change',function() {
      var option_price = $(this).find("option:selected").attr("data-price");
      enableAddButton(option_price);
    });
    $(window).on("load resize", function() {
      if ($(window).width() <= '668') {
        if ($('.footer-cart').is(":visible")) {
          var footer_padding = 76;
        }
        else {
          var footer_padding = 0;
        }
      }
      else {
        var footer_padding = $('footer').outerHeight();
      }
      $('body').css('padding-bottom', footer_padding);
      if (options.pattern_style == 'small-triangles' || options.pattern_style == 'large-triangles') {
        var pattern_style = options.pattern_style;
        var store_name_length = options.store_name.length;
        var pattern_width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var canvas_element = document.getElementById('repeating-pattern');
        var primary_color = options.primary_color.toLowerCase();
        var secondary_color = options.secondary_color.toLowerCase();
        if (inPreview && page == 'home') {
          var pattern_height = 700;
        }
        else {
          var pattern_height = $('#pattern').height();
        }
        Store.draw_pattern(pattern_style, store_name_length, pattern_width, canvas_element, primary_color, secondary_color, pattern_height);
      }
    });
  },
  draw_pattern: function(pattern_style, store_name_length, pattern_width, canvas_element, primary_color, secondary_color, pattern_height) {
    if (primary_color != 'transparent' && secondary_color != 'transparent') {
      $(canvas_element).width(pattern_width+'px');
      if (pattern_style == 'small-triangles') {
        var cell_size = store_name_length * 5;
      }
      if (pattern_style == 'large-triangles') {
        var cell_size = store_name_length * 35;
      }
      var pattern = Trianglify({
        width: pattern_width,
        height: pattern_height,
        cell_size: cell_size,
        seed: 1,
        variance: 1,
        x_colors: [primary_color, secondary_color, primary_color]
      });
      pattern.canvas(canvas_element);
    }
  }
}
var isGreaterThanZero = function(currentValue) {
  return currentValue > 0;
}

function arrayContainsArray(superset, subset) {
  if (0 === subset.length) {
    return false;
  }
  return subset.every(function (value) {
    return (superset.indexOf(value) >= 0);
  });
}

function unique(item, index, array) {
  return array.indexOf(item) == index;
}

function cartesianProduct(a) {
  var i, j, l, m, a1, o = [];
  if (!a || a.length == 0) return a;
  a1 = a.splice(0, 1)[0];
  a = cartesianProduct(a);
  for (i = 0, l = a1.length; i < l; i++) {
    if (a && a.length) for (j = 0, m = a.length; j < m; j++)
      o.push([a1[i]].concat(a[j]));
    else
      o.push([a1[i]]);
  }
  return o;
}

Array.prototype.equals = function (array) {
  if (!array)
    return false;
  if (this.length != array.length)
    return false;
  for (var i = 0, l=this.length; i < l; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i]))
        return false;
    }
    else if (this[i] != array[i]) {
      return false;
    }
  }
  return true;
}

// From https://github.com/kevlatus/polyfill-array-includes/blob/master/array-includes.js
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function (searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return false;
      }
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }
      while (k < len) {
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        k++;
      }
      return false;
    }
  });
}

Array.prototype.count = function(filterMethod) {
  return this.reduce((count, item) => filterMethod(item)? count + 1 : count, 0);
}

function enableAddButton(updated_price) {
  var addButton = $('.add-to-cart-button');
  var addButtonTitle = addButton.attr('data-add-title');
  addButton.attr("disabled",false);
  if (updated_price) {
    priceTitle = ' - ' + Format.money(updated_price, true, true);
  }
  else {
    priceTitle = '';
  }
  addButton.html(addButtonTitle + priceTitle);
}

function disableAddButton(type) {
  var addButton = $('.add-to-cart-button');
  var addButtonTitle = addButton.attr('data-add-title');
  if (type == "sold-out") {
    var addButtonTitle = addButton.attr('data-sold-title');
  }
  if (!addButton.is(":disabled")) {
    addButton.attr("disabled","disabled");
  }
  addButton.html(addButtonTitle);
}

function enableSelectOption(select_option) {
  select_option.removeAttr("disabled");
  select_option.text(select_option.attr("data-name"));
  select_option.removeAttr("disabled-type");
  if ((select_option.parent().is('span'))) {
    select_option.unwrap();
  }
}
function disableSelectOption(select_option, type) {
  if (type === "sold-out") {
    disabled_text = select_option.parent().attr("data-sold-text");
    disabled_type = "sold-out";
    if (show_sold_out_product_options === 'false') {
      hide_option = true;
    }
    else {
      hide_option = false;
    }
  }
  if (type === "unavailable") {
    disabled_text = select_option.parent().attr("data-unavailable-text");
    disabled_type = "unavailable";
    hide_option = true;
  }
  if (select_option.val() > 0) {
    var name = select_option.attr("data-name");
    select_option.attr("disabled",true);
    select_option.text(name + ' ' + disabled_text);
    select_option.attr("disabled-type",disabled_type);
    if (hide_option === true) {
      if (!(select_option.parent().is('span'))) {
        select_option.wrap('<span>');
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      }, {
        rootMargin: "0px 0px 256px 0px"
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
});