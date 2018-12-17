import React, { Component } from 'react'
import Link from 'next/link'
import { Icon, Divider } from 'antd'
import { Icon as IconsKit } from 'react-icons-kit'
import { inject, observer } from 'mobx-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { bug } from 'react-icons-kit/fa/bug'
import { ic_account_balance_wallet } from 'react-icons-kit/md/ic_account_balance_wallet'
import { css } from 'emotion';

@inject('authStore')
@observer
export class Dropdow extends Component {
  componentDidMount() {
    this.props.authStore.getUser()
  }
  logout = () => this.props.authStore.logOut()

  render() {
    const { username, avatar, email } = this.props.authStore
    return (
      <div>
        <div className="NCardmain">
          <div className="text-monospace" style={{ fontSize: '1rem' }}>
            <h5 style={{ right: 20, position: 'absolute' }}><IconsKit icon={ic_account_balance_wallet} /> 300 E</h5>
            <Divider orientation="left">
              <LazyLoadImage
                className="borderRadius50"
                placeholderSrc={avatar}
                alt={username}
                effect="blur"
                width="60"
                src={avatar} />
            </Divider>
            <p style={{ marginBottom: 0 }}>@ <Link href="/profile">{username}</Link></p>
            <span style={{
              fontSize: 14,
              marginLeft: 32,
              borderLeft: '2px solid #e8e8e8',
              paddingLeft: '1em'
            }}>
              <Icon type="mail" theme="outlined" /> {email}
            </span>

            <Divider orientation="right"><Icon style={{ fontSize: 25, color: '#a5a5a5' }} type="environment" theme="outlined" /></Divider>

            <p><Icon type="book" theme="outlined" style={{ marginRight: 10 }} /><Link href="/bookmark"><a>บุ๊คมาร์ค</a></Link></p>
            <p><Icon type="read" theme="outlined" style={{ marginRight: 10 }} /><Link href="/history"><a>ประวัติการอ่าน</a></Link></p>

            <Divider orientation="right"><Icon style={{ fontSize: 25, color: '#a5a5a5' }} type="tool" theme="outlined" /></Divider>

            <p><Icon type="skin" theme="outlined" style={{ marginRight: 10 }} /><Link href="/setting?id=1"><a>จัดการโปรไฟล์</a></Link></p>
            <p><Icon type="setting" theme="outlined" style={{ marginRight: 10 }} /><Link href="/setting?id=2"><a>จัดการบัญชี</a></Link></p>
            <p><Icon type="book" theme="outlined" style={{ marginRight: 10 }} /><Link href="/setting?id=3"><a>จัดการหนังสือ</a></Link></p>

            <Divider orientation="right">& report <IconsKit size={25} icon={bug} style={{ color: '#a5a5a5' }} /></Divider>

            <p><Icon type="logout" theme="outlined" style={{ marginRight: 10 }} /><a href="#" onClick={this.logout}>Logout</a></p>
          </div>
        </div>
      </div>
    )
  }
}

export default Dropdow
