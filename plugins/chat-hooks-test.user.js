// ==UserScript==
// @id             iitc-plugin-chat-hook-test
// @name           IITC plugin: chat hook test
// @category       Info
// @version        0.0.0.@@DATETIMEVERSION@@
// @namespace      https://github.com/mnoeljones/ingress-intel-total-conversion
// @updateURL      @@UPDATEURL@@
// @downloadURL    @@DOWNLOADURL@@
// @description    [@@BUILDNAME@@-@@BUILDDATE@@] Tests for chat hooks
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @include        https://www.ingress.com/mission/*
// @include        http://www.ingress.com/mission/*
// @match          https://www.ingress.com/mission/*
// @match          http://www.ingress.com/mission/*
// @grant          none
// ==/UserScript==


@@PLUGINSTART@@

// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.chatHooksTest = function() {
};


window.plugin.chatHooksTest.usercount = 0;

window.plugin.chatHooksTest.resonator = function(data) {
  portal = data.portals[0];
  //console.log("resonator event @ " + portal.latE6/1E6 + "," + portal.lngE6/1E6);
  lat = portal.latE6/1E6;
  lng = portal.lngE6/1E6;
  plugin.chatHooksTest.addCircle(lat, lng);
};

window.plugin.chatHooksTest.linked_portal = function(data) {
  portal = data.portals[0];
  str = data.time + ": from " + portal.name + " to " + data.portals[1].name;
  str += " linked by " + data.nick;
  //console.log(str);
  //L.circle(L.latLng(portal.latE6/1E6, portal.lngE6/1E6), 40, fill=true).addTo(plugin.chatHooksTest.layer)
  lat = portal.latE6/1E6;
  lng = portal.lngE6/1E6;
  plugin.chatHooksTest.addCircle(lat, lng);
};

window.plugin.chatHooksTest.addCircle = function(lat, lng) {
  console.log("Adding circle at " + lat + ", " + lng);
  L.circle(L.latLng(lat, lng), 40, fill=true).addTo(plugin.chatHooksTest.layer);
  plugin.chatHooksTest.showUsers();
};

window.plugin.chatHooksTest.showUsers = function() {
  var names;
  var first = true;
  for (var user in window.plugin.chatHooks.stored) {
    if (first) {
      first = false;
    } else {
      names = names + "\n";
    }
    names = names + user;
  }
  console.log(names.length + "<->" + plugin.chatHooksTest.usercount);
  if (names.length > plugin.chatHooksTest.usercount) {
    console.log(names);
    plugin.chatHooksTest.usercount = names.length;
  }
};

var setup =  function() {
  if (!window.plugin.chatHooks) {

  }
  window.plugin.chatHooksTest.layer = new L.LayerGroup();
  window.addLayerGroup('chathookstest', window.plugin.chatHooksTest.layer, true);

  window.plugin.chatHooks.addChatHook('CH_PORTAL_LINKED', window.plugin.chatHooksTest.linked_portal);
  window.plugin.chatHooks.addChatHook('CH_RESO_DEPLOYED', window.plugin.chatHooksTest.resonator);
  window.plugin.chatHooks.addChatHook('CH_RESO_DESTROYED', window.plugin.chatHooksTest.resonator);
  window.plugin.chatHooks.addChatHook('CH_RESO_DESTROYED', window.plugin.chatHooksTest.resonator); // :     "destroyed a Resonator",
  window.plugin.chatHooks.addChatHook('CH_RESO_DEPLOYED', window.plugin.chatHooksTest.resonator); // :      "deployed a Resonator",
  window.plugin.chatHooks.addChatHook('CH_PORTAL_LINKED', window.plugin.chatHooksTest.resonator); // :      "linked",
  window.plugin.chatHooks.addChatHook('CH_PORTAL_CAPTURED', window.plugin.chatHooksTest.resonator); // :    "captured",
  window.plugin.chatHooks.addChatHook('CH_PORTAL_ATTACKED', window.plugin.chatHooksTest.resonator); // :    "is under attack",
  window.plugin.chatHooks.addChatHook('CH_PORTAL_NEUTRALISED', window.plugin.chatHooksTest.resonator); // : "neutralized",
  /*
  CH_LINK_DESTROYED:     "destroyed the Link",
  CH_LINK_DESTROYED_OWN: "Your Link",
  CH_FIELD_CREATED:      "created a Control Field",
  CH_FIELD_DESTROYED:    "destroyed a Control Field"
  */
  //addHook('factionChatDataAvailable', window.plugin.chatHooks.handleFactionData);
};

// PLUGIN END //////////////////////////////////////////////////////////

@@PLUGINEND@@
