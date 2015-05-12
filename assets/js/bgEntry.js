//todo: allow 70-90 entries
$(function() {
/*  $('.width').html('width: ' + $('body').width());
  $('.height').html('height: ' + $('body').height());*/

  var computeEntryValue = function(val) {
    var currentValue = $('.entry-value').html();

    if (val == 'c') {
      return '';
    }

    if (val == 'back') {
      return currentValue.substring(0, currentValue.length - 1);
    }

    if (currentValue.length == 3) {
      return currentValue;
    }

    if (!currentValue.length && (val === 0)) {
      return '';
    }

    return currentValue + '' + val;
  };

  var keypress = function(d,el) {
    var id = $(this).attr('id') || '';

    var newBg = computeEntryValue(id);

    if (newBg > 699) {
      return;// $('.nums').addClass('disabled');
    }

    $('.entry-value').html(newBg);

    var bg = $('.entry-value').html();

    if (bg && bg > 40) {
      $('.confirm').removeClass('disabled');
    } else {
      $('.confirm').addClass('disabled');
    }
    /*
    if (bg && bg > 100) {
      $('.nums').addClass('disabled');
    } else {
      $('.nums').removeClass('disabled');
    }

    if (!bg.length) {
      $('#back,#0,#c').addClass('disabled');
    } else if (bg && bg < 100) {
      $('#back,#0,#c').removeClass('disabled');
    }*/
  };

  $('.keypad-key').click(keypress);
  keypress();

  $('.title-bar-action-back').click(function() {
    if ($(this).html() == 'x') {
      alert('go back home');
    } else {
      setEntryScreen();
    }
  });

  $('.confirm').click(function() {
    var bg = $('.entry-value').html();

    if ($(this).html() == 'Confirm') {
      alert('go back home');
    } else if (bg && bg > 40) {
      setConfirmScreen();
    }
  });

  var setConfirmScreen = function() {
    $('.confirm').html('Confirm');
    $('.entry').addClass('entry-fullscreen');
    $('.keypad').addClass('hide');
    $('.title-bar-action-back').html('<');
  };

  var setEntryScreen = function() {
    $('.confirm').html('Done');
    $('.entry').removeClass('entry-fullscreen');
    $('.keypad').removeClass('hide');
    $('.title-bar-action-back').html('x');
  };

   var pusher = new Pusher('1255c077b0f5444626f9');
   var channel = pusher.subscribe('remote');
   channel.bind('battery', function(data) {
     var batteryHeight = data * 57;
     console.log(batteryHeight, data);
     $('.top-bar-battery .fill').css('height', batteryHeight);
     $('.top-bar-battery .space').css('height', 5 + 57 - batteryHeight);

     if (data == 0) {
       $('.top-bar-battery').css({
         'background-image': 'url("/assets/img/batteryVeryLow.png")',
         'background-size': 34
       });
     } else {
       $('.top-bar-battery').css({
         'background-image': 'url("/assets/img/batteryBig.png")',
         'background-size': 22
       });
     }
   });

   channel.bind('infusion', function(data) {
     console.log('infusion',data);
     if (data > 7) {
       $('.top-bar-infusion').css({
         'background-image': 'url("/assets/img/siteVeryOldBig.png")'
       });
       $('.top-bar-infusion .fill').html('');
     } else {
       $('.top-bar-infusion .fill').html(data);
       $('.top-bar-infusion').css({
         'background-image': 'url("/assets/img/siteWithoutNumberBig.png")'
       });
     }
   });

   channel.bind('insulin', function(data) {
     var height = data * 42;
     console.log('insulin', height, data);
     $('.top-bar-insulin .fill').css('height', height);
     $('.top-bar-insulin .space').css('height', 22 + 42 - height);

     if (data == 0) {
       $('.top-bar-insulin').css({
         'background-image': 'url("/assets/img/insulinEmptyBig.png")',
         'background-size': 33
       });
     } else {
       $('.top-bar-insulin').css({
         'background-image': 'url("/assets/img/insulinBig.png")',
         'background-size': 19
       });
     }
   });

   channel.bind('glucagon', function(data) {
     var height = data * 42;
     console.log('glucagon', height, data);
     $('.top-bar-glucagon .fill').css('height', height);
     $('.top-bar-glucagon .space').css('height', 22 + 42 - height);

     if (data == 0) {
       $('.top-bar-glucagon').css({
         'background-image': 'url("/assets/img/glucagonEmptyBig.png")',
         'background-size': 33
       });
     } else {
       $('.top-bar-glucagon').css({
         'background-image': 'url("/assets/img/glucagonBig.png")',
         'background-size': 19
       });
     }
   });

   /*var main = $('.main').html();

   $('.main').swipe({
     swipe: function(e, direction, distance, duration, fingerCount) {
       console.log(e, direction);
     $('.main').html('');

     setTimeout(function() {
       if(fingerCount > 1) {
         return $('.main').html(main);
       }

       $('.main').html('<div class="col-1-1 text">'+direction+'</div>');
     }, 100);
   },
   fingers:'all'});*/
});
