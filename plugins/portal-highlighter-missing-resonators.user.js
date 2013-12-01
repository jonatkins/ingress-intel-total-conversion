// ==UserScript==
// @id             iitc-plugin-highlight-portals-missing-resonators@vita10gy
// @name           IITC plugin: highlight portals missing resonators
// @category       Highlighter
// @version        0.1.1.@@DATETIMEVERSION@@
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      @@UPDATEURL@@
// @downloadURL    @@DOWNLOADURL@@
// @description    [@@BUILDNAME@@-@@BUILDDATE@@] Uses the fill color of the portals to denote if the portal is missing resonators. 
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

@@PLUGINSTART@@

// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.portalsMissingResonators = function() {};

window.plugin.portalsMissingResonators.highlight = function(data) {
  var d = data.portal.options.data;
  if(getTeam(d) === TEAM_NONE)
    return;

  var resCount = d.resCount;
  var portal_weakness = 1 - resCount/8.0;

  if(portal_weakness > 0) {
    var fill_opacity = portal_weakness*.85 + .15;
    var color = 'red';
    fill_opacity = Math.round(fill_opacity*100)/100;
    var params = {fillColor: color, fillOpacity: fill_opacity};
    if(resCount < 8) {
      // Hole per missing resonator
      var dash = new Array(8-resCount + 1).join("1,4,") + "100,0"
      params["dashArray"] = dash;
    }
    data.portal.setStyle(params);
  }
}

var setup =  function() {
  window.addPortalHighlighter('Portals Missing Resonators', window.plugin.portalsMissingResonators.highlight);
}

// PLUGIN END //////////////////////////////////////////////////////////

@@PLUGINEND@@
