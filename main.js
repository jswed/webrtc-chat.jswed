/** @jsx React.DOM */

(function() {
  "use strict";

  var ChatRoom = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    componentWillMount: function initialize() {
      // emit data channel events on widget
      var channel = this.datachannel = new DataChannel();
      channel.onopen = this.handleEnterRoom.bind(this);
      channel.onmessage = this.handleReceiveMessage.bind(this);
    },
    componentWillUnmount: function() {
      this.datachannel.leave();
    },
    getInitialState: function() {
      return {
        channelName: '',
        hasJoined: false,
        messages: [],
        isJoining: false
      }
    },
    handleEnterRoom: function() {
      this.setState({
        hasJoined: true,
        isJoining: false
      });
    },
    handleReceiveMessage: function(message, userId) {
      var chat_list = this.state.messages;
      chat_list.push({
        user: userId ? userId : "You",
        msg: message
      });
      this.setState({
        messages: chat_list
      });
    },
    // Dom event handler.
    handleCreateJoinRoom: function(isCreate, evt) {
      var room_name = this.state.channelName;
      if (!room_name) {
        alert("No channel name given");
        return;
      }
      this.datachannel[isCreate ? 'open' : 'connect'](room_name);
      this.setState({
        'isJoining': true
      });
    },
    handleSendMessage: function(ev) {
      var $input = this.refs.msgInput.getDOMNode();
      var msg = $input.value;
      if (!msg) {
        alert("type some thing!");
        return;
      }
      this.datachannel.send(msg);
      $input.value = '';
      this.handleReceiveMessage(msg);
    },
    handleEnterKey: function(evt) {
      var me = this;
      if (evt.keyCode === 13) {
        this.refs.sendBtn.getDOMNode().click();
      }
    },
    render: function() {
      var state = this.state;
      return (
        <div>
        {
          state.hasJoined ? (
            <div className="demo-chat">
                <div className="demo-chat-input">
                <input ref="msgInput" name="message" className="demo-chat-message-input form-control" placeholder="Message" onKeyDown={this.handleEnterKey}/>
                <button ref="sendBtn" className="demo-chat-send btn btn-primary" onClick={this.handleSendMessage}>Send</button>
              </div>
              <ul className="demo-chat-messages list-group">
              {
                !state.messages.length
                  ? <li className="list-group-item"><span className="badge">system</span><p>welcome to join <strong>{state.channelName}</strong></p></li>
                  : state.messages.map(function(state) {
                  return (
                    <li className="list-group-item" style={{textAlign: state.user === 'You' ? 'left' : 'right'}}>
                      <span className="badge">{state.user}</span>
                      <p>{state.msg}</p>
                    </li>
                    );
                })
                }
              </ul>
            </div>
            )
            :
            <div className="demo-connect">
              <input type="text" className="demo-chat-channel-input form-control" valueLink={this.linkState('channelName')} placeholder="Channel name" />
              <button className="demo-chat-create btn btn-primary" disabled={state.isJoining}
              onClick={this.handleCreateJoinRoom.bind(this,
                true)}>Create</button>
              <button className="demo-chat-join btn btn-warning" disabled={state.isJoining}
              onClick={this.handleCreateJoinRoom.bind(this,
                false)}>Join</button>
            </div>
          }
        </div>
        );
    }
  });
  React.renderComponent(<ChatRoom />, document.getElementById('app'));
})();