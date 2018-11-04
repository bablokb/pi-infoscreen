// ----------------------------------------------------------------------------
// Helper-functins for pi-infoscreen.
//
// Author: Bernhard Bablok
// License: GPL3
//
// Website: https://github.com/bablokb/pi-infoscreen
//
// ----------------------------------------------------------------------------

// global variables
var pageIndex = 0;
var autoUpdate = true;
var UPDATE_INTERVAL = 20;

// --- show next URL   --------------------------------------------------------

function next(bAuto) {
  if (!bAuto) {
    toggleAutoUpdate(false);
  }
  pageIndex = (pageIndex+1) % PAGES.length;
  $('#main_iframe').attr('src', PAGES[pageIndex].url);
};

// --- show previous URL   ----------------------------------------------------

function prev(bAuto) {
  if (!bAuto) {
    toggleAutoUpdate(false);
  }
  if (!pageIndex) {
    pageIndex = PAGES.length - 1;
  } else {
    pageIndex = (pageIndex-1) % PAGES.length;
  }
  $('#main_iframe').attr('src', PAGES[pageIndex].url);
};

// --- flip auto-update state   -----------------------------------------------

function toggleAutoUpdate(bMode) {
  if (bMode === undefined) {
    autoUpdate = ! autoUpdate;
  } else {
    autoUpdate = bMode;
  }
  console.error("setting autoUpdate to: " + autoUpdate);
  if (autoUpdate) {
    $('#auto').removeClass('fa-play-circle');
    $('#auto').addClass('fa-pause-circle');
  } else {
    $('#auto').removeClass('fa-pause-circle');
    $('#auto').addClass('fa-play-circle');
  }
};

// --- show next page if autoupdate is set, otherwise noop   ------------------

function update() {
  if (autoUpdate) {
    next(true);
  }
};

// --- function executing at document_ready   ---------------------------------

function docReady() {
  // support some variants
  var dir_classes = {
    'vertical': "w3-center w3-bar-item w3-margin-bottom w3-padding-large w3-round-xxlarge",
    'horizontal': "w3-right w3-padding-large w3-round-xxlarge",
    'float': "w3-padding-large w3-round-xxlarge w3-margin-right"
  };

  nav_direct = $('#nav_direct');
  var arrayLength = PAGES.length;

  // loop over PAGES and add direct-links
  for (var i = 0; i < arrayLength; i++) {
   var page = PAGES[i];
   var direction = 'w3-right';
   nav_direct.append('<a class="w3-button w3-small ' + dir_classes[navType] +
              '  w3-'+page.color+'"\
         href="' + page.url +'"\
         target="main_iframe">' + page.text + '</a>');
  }
  $('#nav_direct a').click(function() {
    console.error("setting autoUpdate to false (direct link)");
    autoUpdate = false;
  });
  toggleAutoUpdate(autoUpdate);
  setInterval(update,1000*UPDATE_INTERVAL);
}
