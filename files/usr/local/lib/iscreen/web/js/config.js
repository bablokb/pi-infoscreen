// ----------------------------------------------------------------------------
// Configuration of URLs and colors for pi-infoscreen.
//
// Author: Bernhard Bablok
// License: GPL3
//
// Website: https://github.com/bablokb/pi-infoscreen
//
// ----------------------------------------------------------------------------

var UPDATE_INTERVAL = 10;     // in minutes

var PAGES = [
  {"url":
     "http://reiseauskunft.bahn.de/bin/bhftafel.exe/dn?ld=96164&country=DEU&rt=1&input=F%FCrstenfeldbruck%238002141&boardType=dep&time=actual&productsFilter=11111&start=yes",
   "color": "red",
   "text": "Bahn"},

  {"url": "https://www.wetteronline.de/muenchen",
   "color": "green",
   "text": "Wetter M"},

  {"url": 
     "http://www.br.de/wettervorhersage/wetterprognose/82256/F%C3%BCrstenfeldbruck",
   "color": "pink",
   "text": "Wetter F"},

  {"url": "https://raspifeed.com",
   "color": "yellow",
   "text": "Raspifeed"},

  {"url": "https://sz.de",
   "color": "blue",
   "text": "SZ"}
];
