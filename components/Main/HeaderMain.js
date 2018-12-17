import React, { Component } from 'react'
import ReactGA from 'react-ga';
import Link from 'next/link'
import { inject, observer } from 'mobx-react';
import { Tooltip, Layout, Col, Row, Drawer, Button, Icon, Skeleton, Divider, Popover, Tag } from 'antd';
import LayoutMain from '../Main/LayoutMain'
import Dropdown from '../Profile/Dropdow'
import Cdnav from './Cdnav';
import { css } from 'emotion';

const { Header } = Layout;

@inject('authStore')
@observer
class HeaderMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dropdownOpen: false,
    };
  }
  componentWillMount() {
    this.props.authStore.loading = true
  }

  async componentDidMount() {
    await this.props.authStore.getUser()
    ReactGA.initialize('UA-50512327-1');
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    const { loading, user } = this.props.authStore
    return (
      <Header id="nprogress header" className=" clearfix bar" style={{ padding: loading ? '1.5em' : 0 }}>
        <LayoutMain>
          <Skeleton loading={loading} paragraph={{ rows: 2 }} title={false} active>
            <Row>
              <Col xs={5} sm={3} md={3} lg={2} xl={2}>
                <div onClick={this.showDrawer} className='buttons'>
                  <ul>
                    <li>
                      <button className='menu-toggle'>Menu</button>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col xs={5} sm={3} md={3} lg={3} xl={2}>
                <div className='logoTop'>
                  <span className='logo_bata'>beta</span>
                  {/* <Tag style={{ borderRadius: 0 }} className='logo_bata' color="#2db7f5" >beta</Tag> */}

                  <Link href="/"><a className="logo">EPISODE2</a></Link></div>
              </Col>
              <Col xs={14} sm={18} md={18} lg={19} xl={20}>
                <div className="NavRight">
                  {user ? (
                    <Login dropdownOpen={this.state.dropdownOpen} toggle={this.toggle} />
                  ) :
                    (
                      <Logout dropdownOpen={this.state.dropdownOpen} toggle={this.toggle} />
                    )}
                  <Tooltip placement="bottom" title="เขียนนิยาย">
                    {user ?
                      <Button type='default' className=" create-novel episodeB-2 episodeB">
                        <Link href="/create-novel"><a ><Icon type="edit" /></a></Link>
                      </Button>
                      :
                      <Button type='default' className=" create-novel episodeB-2 episodeB" >
                        <Link href="/sign-in"><a><Icon type="edit" /></a></Link>
                      </Button>
                    }
                  </Tooltip>
                  <div>
                    {/* <div className="input-group">
                      <input className="search" type="text" placeholder="" />
                      <span className="bar">
                      </span>
                    </div> */}
                    <Link href='/search'>
                      <a style={{ float: 'right', lineHeight: 1 }} className="ant-dropdown-link">
                        <Icon type="search" theme="outlined" style={{ fontSize: 35, color: '#87badd' }} />
                      </a>
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Skeleton>
        </LayoutMain>
        <Drawer
          title={null}
          placement={this.state.placement}
          maskClosable={true}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          className="DrawerHeader"
        >
          <Cdnav />
        </Drawer>
      </Header>
    );
  }
}

const Login = () => {
  const menu = (
    <div className='cardUser'>
      <Dropdown />
    </div>
  )
  return (
    <Popover content={menu} placement="bottomRight" trigger="click">
      <a style={{ float: 'right', lineHeight: 1, cursor: 'pointer' }} className="ant-dropdown-link">
        <Icon type="user" theme="outlined" style={{ fontSize: 30, color: '#87badd' }} />
      </a>
    </Popover>
  )
}

const Logout = () => {
  return (
    <div style={{ float: 'right', lineHeight: 1 }}>
      <Link href="/sign-in">
        <a className="Asignout">
          <Tooltip placement="left" title="ล็อคอิน">
            <Icon type="user" theme="outlined" />
          </Tooltip>
        </a>
      </Link>
      <Divider type="vertical" />
      <Link href="/sign-up">
        <a className="Asignout">
          <Tooltip placement="right" title="ลงทะเบียน">
            <Icon type="login" theme="outlined" />
          </Tooltip>
        </a>
      </Link>
    </div>
  )
}
export default HeaderMain
