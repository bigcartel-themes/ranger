var Store = {
  init: function(page,options) {
    var path_name = top.location.pathname;
    var admin_path = new RegExp("/admin/design");
    var inPreview = admin_path.test(path_name);
    options = $.extend(this.defaults, options);
    if (options.pattern_style == 'small-triangles' || options.pattern_style == 'large-triangles') {
      var store_name_length = options.store_name.length;
      var pattern_width = screen.width;
      var canvas_element = document.getElementById('repeating-pattern');
      $(canvas_element).width(pattern_width+'px');
      if (inPreview && page == 'home') {
        var pattern_height = 700;
      }
      else { 
        var pattern_height = $('#pattern').height();
      }
      if (options.pattern_style == 'small-triangles') { 
        var cell_size = store_name_length * 5;
      }
      if (options.pattern_style == 'large-triangles') { 
        var cell_size = store_name_length * 35;
      }
      var pattern = Trianglify({
        width: pattern_width,
        height: pattern_height,
        cell_size: cell_size,
        seed: 1,
        variance: 1,
        x_colors: [options.primary_color, options.secondary_color, options.primary_color]
      });
      pattern.canvas(canvas_element);
    }
    $('.category-nav').hover(function() {
      $(this).toggleClass('dropdown-open');
    });
    $('.dropdown-list a').click(function(e) {
      $(this).closest('.category-nav').removeClass('dropdown-open');
    });
    $('.category-nav').bind('touchstart', function(e) {
      if (!$(e.target).closest('a').length) { return false; }
      $(this).toggleClass('dropdown-open');
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
    $('.social-facebook').click(function() { 
      $('.facebook-popup-holder').fadeToggle('fast');
      return false;
    });
    $('body').click(function() { 
      if (!$(event.target).closest('.social-facebook').length) {
        $('.facebook-popup-holder').fadeOut('fast');
      }
    });
    $(window).on("load resize", function() {
      if (window.outerWidth <= '668') { 
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
    });
  }
}