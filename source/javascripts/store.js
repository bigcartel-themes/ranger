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

function draw_pattern() {
  pattern_style = themeOptions.pattern_style;
  store_name_length = themeOptions.store_name.length;
  canvas_element = document.getElementById('repeating-pattern');
  primary_color = themeColors.accentBackgroundColor.toLowerCase();
  secondary_color = themeColors.accentPatternColor.toLowerCase();
  pattern_width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

  if (themeOptions.page == 'home') {
    if (pattern_width < 668 || $('#pattern').hasClass('hide-featured')) {
      announce_height = ($('.announcement-message.visible').outerHeight() > 0) ? $('.announcement-message.visible').outerHeight() : 0;
      pattern_calc = announce_height + $('.header').outerHeight();
      $('#pattern').css('height','calc(100vh - ' + pattern_calc + 'px)')
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