/*
 * Troop Widget for the chat room
 */
define([
  "troopjs-dom/component/widget", "stache!./main", "jquery"
], function(Widget, ChatRoom, $) {
  "use strict";

  return Widget.extend({
    'sig/start': function initialize() {
      var me = this;
      return me.signal("render");
    },
    "sig/render": function(data) {
      var me = this;
      return me.html(ChatRoom()).then(function() {
        me.$channel_input = $('.demo-chat-channel-input');
        me.$connect = $('.demo-connect');
        me.$chat = $('.demo-chat');
      });
    }
  });
});
