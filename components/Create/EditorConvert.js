import React, { Component } from 'react'
import Editor from 'react-medium-editor'
import { inject, observer } from 'mobx-react';

@inject('createStore')
@observer
export class EditorConvert extends Component {
  render() {
    const { disableEditing } = this.props.createStore
    return (
      <div className="app">
        {/* <div>{this.state.text}</div> */}
        <Editor
          text={this.props.body}
          onChange={this.props.handleChange}
          className={"ant-input editorP"}
          options={{ disableEditing: disableEditing, toolbar: true, placeholder: { text: "คำนำ" } }}
        />
      </div>
    );
  }
}

export default EditorConvert
