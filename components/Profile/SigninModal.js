import React, { Component } from 'react'
import { Modal } from 'antd';

export class SigninModal extends Component {
    state = { visible: false }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    hideModal = () => {
        this.setState({
            visible: false,
        });
    }
    render() {
        return (
            <div>

                <p>Bla bla ...</p>
                <p>Bla bla ...</p>
                <p>Bla bla ...</p>

            </div>
        )
    }
}

export default SigninModal
