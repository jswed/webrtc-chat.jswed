/*
 * Troop Widget for the chat room
 */
define([
  "troopjs-dom/component/widget", "stache!./main", "stache!./message", "jquery"
], function(Widget, ChatRoom, Message, $) {
  "use strict";

  return Widget.extend({
    'sig/start': function initialize() {
      var me = this;
      // emit data channel events on widget
      var channel = me.datachannel = new DataChannel();
      channel.onopen = function() {
        me.emit('open');
      };
      channel.onmessage = function(msg, userId) {
        me.emit('message', msg, userId);
      };
      return me.signal("render");
    },
    "sig/render": function(data) {
      var me = this;
      return me.html(ChatRoom()).then(function() {
        me.$input = $('.demo-chat-message-input');
        me.$channel_input = $('.demo-chat-channel-input');
        me.$connect = $('.demo-connect');
        me.$list = $('.demo-chat-messages');
        me.$chat = $('.demo-chat');
      });
    },
    "on/open": function() {
      var me = this;
      me.$connect.addClass("inactive");
      me.$chat.removeClass("inactive");
      me.$input.focus();
    },
    "on/message": function(message, userId) {
      this.$list.find(".list-group-item[data-remove='true']").remove();

      $(Message({
        nick: userId ? userId : "You",
        msg: message
      })).appendTo(this.$list);
    },
    // Dom event handler.
    "dom:.demo-connect > button/click": function(evt) {
      var me = this;
      var channel = me.$channel_input.val();
      if (!channel) {
        alert("No channel name given");
        return;
      }
      me.lockConnect();
      me.datachannel[$(evt.target).is('.demo-chat-create')
      ? 'open'
      : 'connect'](channel);
    },
    "dom:.demo-chat-send/click": function() {
      var me = this;
      var msg = me.$input.val();
      if (!msg) {
        alert("type some thing!");
        return;
      }
      me.datachannel.send(msg);
      me.$input.val('').focus();
      me.emit('message', msg)
    },
    "dom:.demo-chat-message-input/keydown": function(evt) {
      var me = this;
      if (evt.keyCode === 13) {
        $('.demo-chat-send').click();
      }
    },
    lockConnect: function(isUnlock) {
      this.$connect.find('input, button').prop('disabled', true);
    },
    "sig/stop": function() {
      this.datachannel.leave();
    }
  });
});
