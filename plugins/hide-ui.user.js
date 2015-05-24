// ==UserScript==
// @id             iitc-plugin-hide-ui@insane210
// @name           IITC plugin: Hide UI
// @category       Misc
// @version        0.1.0.@@DATETIMEVERSION@@
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      @@UPDATEURL@@
// @downloadURL    @@DOWNLOADURL@@
// @description    [@@BUILDNAME@@-@@BUILDDATE@@] Hide user interface elements
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

@@PLUGINSTART@@

// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.hideUI = function() {};

// store current state of screenshot mode
window.plugin.hideUI.ScreenshotMode = false;

window.plugin.hideUI.options = {};


// write settings to local storage
window.plugin.hideUI.saveSettings = function () {
  localStorage.setItem('hideUI', JSON.stringify(window.plugin.hideUI.options));
};


// load settings from local storage
window.plugin.hideUI.loadSettings = function () {
  // if settings not available, create new object with default values
  if (localStorage.getItem('hideUI') === null) {
    var options = {
      // id: [boolean hidden, boolean changeable, boolean nested, string name],
      chatwrapper:              [false, true,   false,  'Chat'],
      chatinput:                [false, true,   true,   'Chat input'],
      sidebarwrapper:           [false, false,  false,  'Sidebar'],
      playerstat:               [false, true,   true,   'Playerinfo'],
      gamestat:                 [false, true,   true,   'Global score'],
      searchwrapper:            [false, true,   true,   'Search bar'],
      portaldetails:            [false, true,   true,   'Portal details'],
      redeem:                   [false, true,   true,   'Passcode redeem'],
      updatestatus:             [false, true,   false,  'Status bar'],
      leafletcontrols:          [false, true,   false,  'Map controls'],
      layer:                    [false, true,   true,   'Map layer'],
      zoom:                     [false, true,   true,   'Zoom buttons'],
      drawtools:                [false, true,   true,   'Drawtools'],
      portal_highlight_select:  [false, true,   false,  'Portal highlighter'],
      bookmarkswrapper:         [false, true,   false,  'Bookmarks'],
    };

    localStorage.setItem('hideUI', JSON.stringify(options));
  };

  window.plugin.hideUI.options = JSON.parse(localStorage.getItem('hideUI'));
};


// reset settings back to default values
window.plugin.hideUI.resetSettings = function () {
  localStorage.removeItem('hideUI');

  window.plugin.hideUI.loadSettings();
  window.plugin.hideUI.applySettings();
};



// hide or show UI elements depending on settings
window.plugin.hideUI.applySettings = function () {
  for (var id in window.plugin.hideUI.options) {
    if (window.plugin.hideUI.options.hasOwnProperty(id)) {
      var option = window.plugin.hideUI.options[id];

      if (option.hasOwnProperty('0')) {
        if (option[0] === true) {
          $('#' + id).hide();

          // if chatinput is hidden, move the chat down to the bottom
          if (option[3] === 'Chat input') {
            $('#chatwrapper').addClass('noinput');
          };

          // move leaflet controls, when highlighter is hidden
          if (option[3] === 'Portal highlighter') {
            $(".leaflet-top.leaflet-left").css('padding-top', '0px');
            $(".leaflet-control-scale-line").css('margin-top','0px');
          };

        } else {
          $('#' + id).show();

          // if chat is activated, make sure there are messages to display
          if (option[3] === 'Chat') {
            window.chat.needMoreMessages();
          };

          // if chatinput is shown, move the chat back up
          if (option[3] === 'Chat input') {
            $('#chatwrapper').removeClass('noinput');
          };

          // move leaflet controls, when highlighter is hidden
          if (option[3] === 'Portal highlighter') {
            $(".leaflet-top.leaflet-left").css('padding-top', '20px');
            $(".leaflet-control-scale-line").css('margin-top','25px');
          };

        };
      }
    }
  }
};



// switch screenshot mode on or off
window.plugin.hideUI.toggleScreenshotMode = function () {
  if (window.plugin.hideUI.ScreenshotMode) {
    $('#chatwrapper').show();
    $('#sidebarwrapper').show();
    $('#updatestatus').show();
    $('#bookmarkswrapper').show();
    $('#portal_highlight_select').show();
    $('#leafletcontrols').show();

    // show dialogs
    for (var id in window.DIALOGS) {
      if (window.DIALOGS.hasOwnProperty(id)) {
        $('#' + id).parent().show();
      }
    }

    $('*').css({'cursor': ''});

    window.plugin.hideUI.applySettings();

    window.plugin.hideUI.ScreenshotMode = false;
  } else {
    $('#chatwrapper').hide();
    $('#sidebarwrapper').hide();
    $('#updatestatus').hide();
    $('#bookmarkswrapper').hide();
    $('#portal_highlight_select').hide();
    $('#leafletcontrols').hide();

    // hide dialogs
    for (var id in window.DIALOGS) {
      if (window.DIALOGS.hasOwnProperty(id)) {
        $('#' + id).parent().hide();
      }
    }

    $('*').css({'cursor': 'none'});

    window.plugin.hideUI.ScreenshotMode = true;
  }
};



window.plugin.hideUI.showOptions = function() {

  var html = '<a onclick="window.plugin.hideUI.resetSettings(); return false;">Reset Settings</a>' +
             '<hr>' +
             '<div class="bold">Always hide:</div>';

  for (var key in window.plugin.hideUI.options) {
    if (window.plugin.hideUI.options.hasOwnProperty(key)) {
      var option = window.plugin.hideUI.options[key];

      if (option.hasOwnProperty('0')) {
        html += '<label for="hideUI-'+key+'"';

        if (option[2] === true) {
          html += ' class="nested"';
        };

        html += '>' +
                '<input type="checkbox" id="hideUI-'+key+'" ' +
                'onclick="window.plugin.hideUI.options.'+key+'[0]=this.checked; ' +
                'window.plugin.hideUI.saveSettings(); ' +
                'window.plugin.hideUI.applySettings();"';

        if (option[0] === true) {
          html += ' checked';
        };

        if (option[1] === false) {
          html += ' disabled';
        };

        html += '> '+option[3]+'</label>';
      }
    }
  };

  html += '<hr>' +
          '<div class="bold">Screenshot mode:</div>' +
          '<div>Screenshot mode hides the user interface and the mouse pointer. You can toggle it by pressing Alt + H</div>';

  dialog({
    html: html,
    id: 'plugin-hideUI-options',
    dialogClass: 'ui-dialog',
    title: 'Hide UI Options'
  });
};



var setup =  function() {
  $('head').append('<style>' +
    '#dialog-plugin-hideUI-options a {display: block; color: #ffce00; border: 1px solid #ffce00; padding: 3px 0; margin: 10px auto; width: 80%; text-align: center; background: rgba(8,48,78,.9); }' +
    '#dialog-plugin-hideUI-options label { display: block; }' +
    '#dialog-plugin-hideUI-options input { vertical-align: middle; }' +
    '.bold { font-weight: bold; }' +
    '.nested { margin-left: 20px; }' +
    '.noinput > #chatcontrols { bottom: 59px; }' +
    '.noinput > #chat { bottom: 0px; }' +
    '</style>');

  // wrap multiple divs that belong together in one div
  $('#sidebartoggle, #scrollwrapper').wrapAll('<div id="sidebarwrapper"></div>');
  $('#chatcontrols, #chat, #chatinput').wrapAll('<div id="chatwrapper"></div>');
  $('#bkmrksTrigger, #bookmarksBox').wrapAll('<div id="bookmarkswrapper"></div>');

  // add an id to make it easier to hide
  $('.leaflet-control-container').attr('id', 'leafletcontrols');
  $('.leaflet-control-zoom.leaflet-bar.leaflet-control').attr('id', 'zoom');
  $('.leaflet-draw.leaflet-control').attr('id', 'drawtools');
  $('.leaflet-control-layers.leaflet-control').attr('id', 'layer');

  window.plugin.hideUI.loadSettings();
  window.plugin.hideUI.applySettings();

  document.addEventListener('keydown', function(e) {
    // pressed alt+h
    if (e.keyCode == 72 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
      window.plugin.hideUI.toggleScreenshotMode();
    }
  }, false);

  $('#toolbox').append(' <a onclick="window.plugin.hideUI.showOptions()" title="Show hide UI settings">Hide UI Opt</a>');
};

// PLUGIN END //////////////////////////////////////////////////////////

@@PLUGINEND@@
