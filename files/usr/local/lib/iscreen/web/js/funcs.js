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
var pageTimer = null;

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
  if (autoUpdate) {
    $('#auto').removeClass('fa-play-circle');
    $('#auto').addClass('fa-pause-circle');
  } else {
    // cancel timer
    clearTimeout(pageTimer);
    $('#auto').removeClass('fa-pause-circle');
    $('#auto').addClass('fa-play-circle');
  }
};

// --- show next page if autoupdate is set, otherwise noop   ------------------

function update() {
  var page = this.PAGES[this.pageIndex];
  if (autoUpdate) {
    // load next page and schedule next update
    next(true);
    pageTimer = setTimeout(update,1000*page.cycle);
  } else {
    // reload current page and schedule next reload
    $('#main_iframe').attr('src', page.url);
    pageTimer = setTimeout(update,1000*page.reload);
  }
};

function setDirectLink(index) {
  toggleAutoUpdate(false);
  pageIndex = index;
  update();
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
         id="page'+ i + '" href="' + page.url +'"\
         target="main_iframe">' + page.text + '</a>');
    that = window;
    $('#page'+i).click($.proxy(function(event) {
      var index = event.target.id.slice(4);  // remove "page"
      setDirectLink(index);
    },that));
  }
  toggleAutoUpdate(autoUpdate);
  pageIndex = PAGES.length - 1;
  update();
}
