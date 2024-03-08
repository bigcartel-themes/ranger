"use strict";

document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.remove("preloader");
  let contactFields = document.querySelectorAll(".contact-form input, .contact-form textarea");
  contactFields.forEach(function (contactField) {
    contactField.removeAttribute("tabindex");
  });
  const numShades = 5;

  let cssProperties = [];

  for (const themeColor in themeColors) {
    const hexValue = themeColors[themeColor];
    var hsl = tinycolor(hexValue).toHsl();
    for (var i = numShades - 1; i >= 0; i -= 1) {
      hsl.l = (i + 0.5) / numShades;
      cssProperties.push(`--${camelCaseToDash(themeColor)}-${((i * 100) / 1000) * 200}: ${tinycolor(hsl).toRgbString()};`);
    }
    numColor = tinycolor(hexValue).toRgb();
    cssProperties.push(`--${camelCaseToDash(themeColor)}-rgb: ${numColor["r"]}, ${numColor["g"]}, ${numColor["b"]};`);
  }

  const headTag = document.getElementsByTagName("head")[0];
  const styleTag = document.createElement("style");

  styleTag.innerHTML = `
    :root {
      ${cssProperties.join("\n")}
    }
  `;
  headTag.appendChild(styleTag);
});

window.addEventListener("load", () => {
  document.body.classList.remove("transition-preloader");
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

$( ".search-container .search-button" ).click(
  function() {
    $('#desktop-search').addClass('active').focus();
  }
);
$('html').click(function(event) {
    if ($(event.target).closest('.search-container').length === 0) {
      $('#desktop-search').removeClass('active').blur();
    }
});
$('.open-dropdown').click(function() {
  $(this).toggleClass('dropdown-visible');
  $('body').toggleClass('no-scroll');
  $('.mobile-navigation').toggleClass('visible');


  if ($('.hide-header').length) {
    if ($('.hide-header').css('display') == 'block') {
      $('.hide-header').fadeOut(100, function() {
        $('.store-link').fadeIn(100);
      });
    }
    else {
      $('.store-link').fadeToggle(100, function() {
        $('.hide-header').fadeToggle(100);
      });
    }
  }
});
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
function draw_pattern() {
  pattern_style = themeOptions.pattern_style;
  store_name_length = themeOptions.store_name.length;
  canvas_element = document.getElementById('repeating-pattern');
  primary_color = themeOptions.primary_color.toLowerCase();
  secondary_color = themeOptions.secondary_color.toLowerCase();
  pattern_width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

  if (themeOptions.page == 'home') {
    if (themeOptions.in_preview) {
      $('#pattern').css('height','700px')
    }
    else {
      if (pattern_width < 668 || $('#pattern').hasClass('hide-featured')) {
        announce_height = ($('.announcement-message.visible').outerHeight() > 0) ? $('.announcement-message.visible').outerHeight() : 0;
        pattern_calc = announce_height + $('.header').outerHeight();
        $('#pattern').css('height','calc(100vh - ' + pattern_calc + 'px)')
      }
    }
  }

  if (pattern_style == 'small-triangles' || pattern_style == 'large-triangles') {
    pattern_height = $('#pattern').height();
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

$('.announcement-message-close').click(function(e) {
  $('.announcement-message').slideUp('fast', function() {
    $('.announcement-message').removeClass('visible');
    setCookie('hide-announcement-message',hashedMessage,7);
    $('.header').css('top',0);
  });
})

document.addEventListener('DOMContentLoaded', function() {
  draw_pattern();
  var mn = $('.header'),
  core = $('#main').eq(0),
  fix = core.attr('style') || '',
  mns = 'page-head-scrolled',
  bit, hdr;
  $(window).resize(function() {
    draw_pattern();
    bit = mn.outerHeight();
    hdr = ($('.announcement-message.visible').outerHeight() > 0) ? $('.announcement-message.visible').outerHeight() : 0;
  })
  .resize().scroll(function() {
    if ($(this).scrollTop() > hdr) {
      mn.addClass(mns);
      bit = mn.outerHeight();
      core.css('margin-top', bit);
    } else {
      mn.removeClass(mns);
      core.attr('style', fix);
    }
  })
  .on('load', function() {
    $(this).scroll();
  });
});