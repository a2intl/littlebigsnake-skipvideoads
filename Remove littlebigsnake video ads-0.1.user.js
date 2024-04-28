// ==UserScript==
// @name         Remove littlebigsnake video ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove video ads
// @author       Andrew Allen https://github.com/a2intl
// @match        https://littlebigsnake.com/
// @grant        all
// ==/UserScript==

var lastskip = null;

function skipVideo(v) {
  if(v != lastskip)
  {
    v.addEventListener('canplay', (event) => { skipVideo(event.target) });
    v.addEventListener('playing', (event) => { skipVideo(event.target) });
    lastskip=v;
  }

  console.log('skipping video!');
  v.playbackRate=15;
  v.play();
  try {
    if(v.currentTime<v.duration-1) v.currentTime=v.duration;
  } catch(e) {
  }
  var c = document.getElementById('adsContainer');
  if(c) c.style.display='none';
}

function mutCallback(mutationList, observer) {
  for(const m of mutationList) {
    for(const n of m.addedNodes) {
      var tag = n.tagName && n.tagName.toLowerCase();
      if(tag === 'video') {
	    skipVideo(n);
      }
      if(tag === 'lima-video' && n.shadowRoot) {
	    for(const v of n.shadowRoot.querySelectorAll('video')) {
	      skipVideo(v);
	    }
      }
    }
  }
}

var mutObs = new MutationObserver(mutCallback);

mutObs.observe(document, {childList:true, subtree:true});
