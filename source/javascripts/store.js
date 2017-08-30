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
    $('.option-quantity').blur(function(e) {
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
    $('[name="cart[shipping_country_id]"]').on('change',function() {
      $('.cart-form').submit();
    });
    $('.cancel-discount').click(function(e) {
      $('.cart-form').append('<input name="cart[discount_code]" type="hidden" value="">');
      $('.cart-form').submit();
      return false;
    });
    $('.apply-discount').click(function(e) {
      $(this).closest('.checkout-btn').attr('name','update');
      $('.cart-form').submit();
      return false;
    });
    $('[name="cart[discount_code]"]').on('keyup',function(e) { 
      if (e.keyCode == 13) {
        $(this).closest('.checkout-btn').attr('name','update');
        $('.cart-form').submit();
        return false;
      }
    });
    $('.product-thumbnails li a').click(function(e) {
      $('.primary-image img').attr('src',$(this).attr('href'));
      $('.product-thumbnails li').removeClass('active');
      $(this).parent().addClass('active'); 
      return false;
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