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
  // loop over PAGES and add direct-links
  nav_direct = $('#nav_direct');
  var arrayLength = PAGES.length;
  for (var i = 0; i < arrayLength; i++) {
   var page = PAGES[i];
   var direction = 'w3-right';
   if (navTypeVert) {
     direction = 'w3-center w3-bar-item w3-margin-bottom';
   }
   nav_direct.append('<a class="w3-button w3-small ' + direction +
              ' w3-padding-large w3-round-xxlarge w3-'+page.color+'"\
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
