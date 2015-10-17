// ==UserScript==
// @id             iitc-plugin-player-frequency
// @name           IITC plugin: Player Frequency
// @category       Info
// @version        0.0.0.@@DATETIMEVERSION@@
// @namespace      https://github.com/mnoeljones/ingress-intel-total-conversion
// @updateURL      @@UPDATEURL@@
// @downloadURL    @@DOWNLOADURL@@
// @description    [@@BUILDNAME@@-@@BUILDDATE@@] Player Frequency Display Layer
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
window.plugin.PlayerFrequency = function() {
};

window.plugin.PlayerFrequency.usercount = 0;

window.plugin.PlayerFrequency.FACTION_COLOURS = {
  ENLIGHTENED: "#00FF00",
  RESISTANCE:  "#0000FF"
};
window.plugin.PlayerFrequency.styles = {
  ENLIGHTENED: { color: plugin.PlayerFrequency.FACTION_COLOURS.ENLIGHTENED },
  RESISTANCE: { color: plugin.PlayerFrequency.FACTION_COLOURS.RESISTANCE }
};

window.plugin.PlayerFrequency.Filter = {
    enabled: false,
    enable: function() {
        self.enabled = true;
    },
    disable: function() {
        self.enabled = false;
    },
};

window.plugin.PlayerFrequency.userfilter = {
  filters: {},
  names: [],
  setfilter: function(nick) {
    console.log("Setting filters[" + nick + "] = 'on'");
    this.filters[nick] = "on";
    this.names[nick] = true;
  },
  unsetfilter: function(nick) {
    console.log("Setting filters[" + nick + "] = 'off'");
    this.filters[nick] = "off";
    this.names[nick] = true;
  },
};

window.plugin.PlayerFrequency.resonator = function(data) {
  portal = data.portals[0];
  //console.log("resonator event @ " + portal.latE6/1E6 + "," + portal.lngE6/1E6);
  lat = portal.latE6/1E6;
  lng = portal.lngE6/1E6;
  style = data.team;
  plugin.PlayerFrequency.addCircle(lat, lng, plugin.PlayerFrequency.styles[style]);
  window.plugin.PlayerFrequency.userfilter.setfilter(data.nick);
};

window.plugin.PlayerFrequency.portal = function(data) {
  portal = data.portals[0];
  //console.log("resonator event @ " + portal.latE6/1E6 + "," + portal.lngE6/1E6);
  lat = portal.latE6/1E6;
  lng = portal.lngE6/1E6;
  style = data.team;
  plugin.PlayerFrequency.addCircle(lat, lng, plugin.PlayerFrequency.styles[style]);
  window.plugin.PlayerFrequency.userfilter.setfilter(data.nick);
};

window.plugin.PlayerFrequency.linked_portal = function(data) {
  portal = data.portals[0];
  str = data.time + ": from " + portal.name + " to " + data.portals[1].name;
  str += " linked by " + data.nick;
  //console.log(str);
  //L.circle(L.latLng(portal.latE6/1E6, portal.lngE6/1E6), 40, fill=true).addTo(plugin.PlayerFrequency.layer)
  lat = portal.latE6/1E6;
  lng = portal.lngE6/1E6;
  style = data.team;
  plugin.PlayerFrequency.addCircle(lat, lng, plugin.PlayerFrequency.styles[style]);
  window.plugin.PlayerFrequency.userfilter.setfilter(data.nick);
};


window.plugin.PlayerFrequency.addCircle = function(lat, lng, style) {
  console.log("Adding circle at " + lat + ", " + lng);

  style.fill = true;

  L.circle(L.latLng(lat, lng), 40, style).addTo(plugin.PlayerFrequency.layer);
  // plugin.PlayerFrequency.showUsers();
};

window.plugin.PlayerFrequency.showUsers = function() {
  var stored = window.plugin.chatHooks.stored;
  if (stored) {
    console.log(Object.keys(stored).length + "<->" + plugin.PlayerFrequency.usercount);
    if (Object.keys(stored).length > plugin.PlayerFrequency.usercount) {
      var names = "";
      var first = true;
      for (var user in stored) {
        if (first) {
          first = false;
        } else {
          names = names + "\n";
        }
        names = names + user;
      }
      console.log(names);
      plugin.PlayerFrequency.usercount = Object.keys(stored).length;
    }
  }
};

window.plugin.PlayerFrequency.filterUsers = function() {
  var userfilter = window.plugin.PlayerFrequency.userfilter.filters;
  var names = window.plugin.PlayerFrequency.userfilter.names;
  var names_checkboxes = "<fieldset>";
  names_checkboxes += "<legend>Players with current frequency data:</legend>";

  console.log("filterUsers 1");
  for (var nick in names) {
    checked = userfilter[nick] === "on" ? "checked" : "";
    setfunction = userfilter[nick] === "on" ? "unsetfilter" : "setfilter";
    var value = 'value="' + nick + '"';
    var checked = checked ? 'checked' : '';
    var onclick = 'onclick="window.plugin.PlayerFrequency.userfilter.' + setfunction + '(\'' + nick + '\')"';
    console.log("value: " + value);
    console.log("checked: " + checked);
    console.log("onclick: " + onclick);
    names_checkboxes += '<input type="checkbox" name="players" ' + value + ' ' + checked + ' ' + onclick + ' />' + nick + '<br/>';
  }
  console.log("filterUsers 2");
  names_checkboxes += "</fieldset>";

  dialog({
    text: names_checkboxes,
    title: 'Names',
    id: 'player-frequecy-userfilter',
    width: 350,
  });
};

var setup =  function() {
  if (!window.plugin.chatHooks) {

  }
  window.plugin.PlayerFrequency.layer = new L.LayerGroup();
  window.addLayerGroup('player-frequency', window.plugin.PlayerFrequency.layer, true);

  window.plugin.chatHooks.addChatHook('CH_PORTAL_LINKED', window.plugin.PlayerFrequency.linked_portal);
  window.plugin.chatHooks.addChatHook('CH_RESO_DESTROYED', window.plugin.PlayerFrequency.resonator); // :     "destroyed a Resonator",
  window.plugin.chatHooks.addChatHook('CH_RESO_DEPLOYED', window.plugin.PlayerFrequency.resonator); // :      "deployed a Resonator",
  window.plugin.chatHooks.addChatHook('CH_PORTAL_CAPTURED', window.plugin.PlayerFrequency.portal); // :    "captured",
  window.plugin.chatHooks.addChatHook('CH_PORTAL_ATTACKED', window.plugin.PlayerFrequency.portal); // :    "is under attack",
  window.plugin.chatHooks.addChatHook('CH_PORTAL_NEUTRALISED', window.plugin.PlayerFrequency.portal); // : "neutralized",
  /*
  CH_LINK_DESTROYED:     "destroyed the Link",
  CH_LINK_DESTROYED_OWN: "Your Link",
  CH_FIELD_CREATED:      "created a Control Field",
  CH_FIELD_DESTROYED:    "destroyed a Control Field"
  */
  //addHook('factionChatDataAvailable', window.plugin.chatHooks.handleFactionData);

  $('#toolbox').append(' <a onclick="window.plugin.PlayerFrequency.filterUsers()" title="Display users recorded for Frequency stats">Frequency player list</a>');
};

// PLUGIN END //////////////////////////////////////////////////////////

@@PLUGINEND@@
