import React, { Component } from 'react'
import Editor from 'react-medium-editor'

export class EditorEpisode extends Component {
 
  render() {
    return (
      <div className="app">
        {/* <div>{this.state.text}</div> */}
        <Editor
          text={this.props.body}
          onChange={this.props.handleChange}
          className="editor"
          options={{
            placeholder: {text: "เนื่อเรื่อง"},
            toolbar: {buttons: ['bold', 'italic', 'underline']},
          }}
        />
      </div>
    );
  }
}

export default EditorEpisode
