// ----------------------------------------------------------------------------
// Configuration of URLs and colors for pi-infoscreen.
//
// Author: Bernhard Bablok
// License: GPL3
//
// Website: https://github.com/bablokb/pi-infoscreen
//
// ----------------------------------------------------------------------------

var PAGES = [
  {"url":
     "http://reiseauskunft.bahn.de/bin/bhftafel.exe/dn?ld=96164&country=DEU&rt=1&input=F%FCrstenfeldbruck%238002141&boardType=dep&time=actual&productsFilter=11111&start=yes",
   "color": "red",
   "text": "Bahn",
   "reload": 60,
   "cycle": 20 },

  {"url": "https://www.wetteronline.de/muenchen",
   "color": "green",
   "text": "Wetter M",
   "reload": 300,
   "cycle": 15 },

  {"url": 
     "http://www.br.de/wettervorhersage/wetterprognose/82256/F%C3%BCrstenfeldbruck",
   "color": "pink",
   "text": "Wetter F",
   "reload": 300,
   "cycle": 20 },

  {"url": "https://raspifeed.com",
   "color": "yellow",
   "text": "Raspifeed",
   "reload": 600,
   "cycle": 10 },

  {"url": "https://sueddeutsche.de/news",
   "color": "blue",
   "text": "SZ",
   "reload": 60,
   "cycle": 20 }
];
