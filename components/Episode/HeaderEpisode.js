import React, { Component } from 'react'
import Link from 'next/link'
import { inject, observer } from 'mobx-react';
import { Icon, Layout, Col, Row, Menu, Dropdown, Skeleton, Tooltip  } from 'antd';
import Headroom from 'react-headroom'
import ReactGA from 'react-ga';
import { css } from 'emotion';

import Head from '../head'

import LayoutMain from '../Main/LayoutMain'

const { Header } = Layout;

@inject('novelStore', 'episodeStore', 'authStore')
@observer
class HeaderEpisode extends Component {

  componentDidMount() {
    this.props.episodeStore.reset()
    const id = this.props.idNovel
    const idpi = this.props.idEpisode
    this.props.authStore.getUser()
    ReactGA.pageview(`/novel-${id}-${idpi}`)
    this.props.novelStore.novelView(id)
    this.props.episodeStore.episodeList(id)
    this.props.episodeStore.episode(id, idpi)
    // document.onselectstart = new Function("return false")
    // if (window.sidebar) {
    //   document.onmousedown = false
    //   document.onclick = true
    // }
    this.props.episodeStore.modeKey = '1'
  }

  componentWillReceiveProps(nextProps) {
    const id = this.props.idNovel
    this.props.episodeStore.episode(id, nextProps.idEpisode)
  }

  onModeChage = ({ key }) => {
    this.props.episodeStore.onModeChage(key)
  }

  componentWillUnmount() {
    this.onModeChage
  }

  render() {
    const { cover, title } = this.props.novelStore
    const { user } = this.props.authStore
    const { data, loading, titleEpisode, modeKey, background } = this.props.episodeStore
    const menu = (
      <Menu style={{ height: 'auto' }} selectedKeys={[`${modeKey}`]} onClick={this.onModeChage}>
        <Menu.Item key="1">
          <Icon type="read" style={{ color: '#4e4e4e', fontSize: '3em', marginRight: 0 }} />
        </Menu.Item>
        <Menu.Item key="2"> 
          <Icon type="read" theme="filled" style={{ color: '#373d49', fontSize: '3em', marginRight: 0 }} />
        </Menu.Item>
        <Menu.Item key="3">
          <Icon type="read" theme="filled" style={{ color: '#000710', fontSize: '3em', marginRight: 0 }} />
        </Menu.Item>
        <Menu.Item key="4">
          <Icon type="read" theme="filled" style={{ color: '#183369', fontSize: '3em', marginRight: 0 }} />
        </Menu.Item>
      </Menu>
    );
    const output = [...new Map(data.map(o => [o.id, o])).values()]
    const epiosdeList = (
      <Menu 
      style={{
        border: '1px solid #ccc',
        boxShadow: 'none',
        borderRadius: 0,
      }}
      selectedKeys={[`${this.props.idEpisode}`]}>
        {
          output.map((item) =>
            <Menu.Item key={`${item.id}`}>
              <Link href={`/episode?e=${this.props.idNovel}&id=${item.id}`} as={`/novel-${this.props.idNovel}-${item.id}`}><a className='menu_a'>{item.title}</a></Link>
            </Menu.Item>
          )
        }
      </Menu>
    );
    return (
      <Headroom
        style={{
          position: 'fixed',
          borderBottom: '2px solid #e8e8e8',
          background: 'rgb(255, 255, 255)'
        }}>
        <Head title={`${titleEpisode} - ${title} | Episode2`}/>
        <Header color="dark" id='headerEpisode' className="headerEpisode clearfix">
          <LayoutMain>
            <Row className={css({ paddingTop: 10 })}>
              <Skeleton avatar={{ shape: 'square', size: 'small' }} loading={loading} title={false} paragraph={{ rows: 2 }} active>
                <Col xs={21} sm={21} md={21} lg={23} xl={23}>
                  <div className={css({ display: 'flex', flex: '1 2 auto' })}>
                    <div className={css({ display: 'flex', maxWidth: '100%' })}>
                      <div>
                        <img src={cover} className="coverEpidode" />
                      </div>
                      <div className={css(Styles.FlexBar)}>
                        <div className="coverh6">
                          <Link href={`/novel?id=${this.props.idNovel}`} as={`/novel-${this.props.idNovel}`}><a>{title}</a></Link>
                        </div>
                        <div className="coverSpan">
                          <Dropdown overlay={epiosdeList} trigger={['click']} placement="bottomCenter">
                            <a href="javascript:;"><Icon type="down" /> {titleEpisode}</a>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={3} sm={3} md={3} lg={1} xl={1}>
                  {user ? <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
                    <a className="ant-dropdown-link" href="javascript:;">
                      <div className="coverMenu">
                        <Icon type="bg-colors" style={{ float: 'right', color: `${background === '#fff' ? '#4e4e4e' : background}`, fontSize: '3em' }} />
                      </div>
                    </a>
                  </Dropdown> :
                    <Tooltip placement="left" title="สมาชิกสามารถเปลี่ยนธีมอ่านได้">
                      <Icon style={{ fontSize: 20 }} type="question-circle" theme="outlined" />
                    </Tooltip>
                  }
                </Col>
              </Skeleton>
            </Row>
            {/* <Divider/> */}
          </LayoutMain>
        </Header>
      </Headroom>
    );
  }
}

const Styles = {
  FlexBar: { display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'center' }
}

export default HeaderEpisode
