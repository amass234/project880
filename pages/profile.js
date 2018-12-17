import React, { Component } from 'react'
import { Skeleton } from 'antd'
import Head from '../components/head'
import HeaderMain from '../components/Main/HeaderMain'
import FooterMain from '../components/Main/FooterMain'
import Profilecard from '../components/Profile/Profilecard'
import Profiletaps from '../components/Profile/Profiletaps'
import Signin from '../components/Profile/Signin'
import Firebase from '../config/Firebase'

export class profile extends Component {
  state = {
    user: null,
    loading: true,
    margin:'10em'
  }
  componentDidMount() {
    Firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({
          user,
          loading: false,
          margin: 0
        });
        localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: null, loading: false, margin: 0 });
        localStorage.removeItem('user');
      }
    })
  }

  render() {
    return (
      <div>
        <Head />
        <HeaderMain />
        <div style={{marginTop: this.state.margin, marginBottom: this.state.margin }}>
        <Skeleton loading={this.state.loading} paragraph={{ rows: 5 }} title={false} active>
          {
            this.state.user ?
              (<div>
                <Profilecard />
                <Profiletaps />
              </div>)
              : (<Signin />)
          }
        </Skeleton>
        </div>
        <FooterMain />
      </div>
    )
  }
}

export default profile
