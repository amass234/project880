import React, { Component } from 'react'
import Link from 'next/link'
import { inject, observer } from 'mobx-react';
import { Icon, Layout, Col, Row, Button, Skeleton, Tooltip } from 'antd';
import LayoutMain from '../Main/LayoutMain'
import Head from '../head';

const { Header } = Layout;

@inject('novelStore', 'authStore', 'createEpisode')
@observer
class HeaderNew extends Component {

  componentDidMount() {
    this.props.authStore.getUser()
    this.props.novelStore.novelView(this.props.id)
  }

  render() {
    const { cover, title, author, loading } = this.props.novelStore
    return (
      <div>
        <Head title={`${this.props.createEpisode.title || 'New'} - ${title} by ${author} - Episode2`} />
        <Header style={{ height: '7em' }} id="headerEpisodeEdit" className="clearfix">
          <LayoutMain>
            <Row>
              {/* <Col xs={3} sm={3} md={3} lg={1} xl={1}>
              <div className="logo" style={{ lineHeight: 4 }}><Button href="/" icon="home" /></div>
            </Col> */}
              <Col xs={16} sm={19} md={20} lg={21} xl={21}>
                <div style={{ display: 'flex', flex: '1 2 auto', paddingTop: '0.5em' }}>
                  <Skeleton loading={loading} avatar={{ shape: 'square', size: 'small' }} title={false} paragraph={{ row: 1 }} active>
                    {/* <Icon type="left" theme="outlined" /> */}
                    <div style={{ display: 'flex', maxWidth: '100%' }}>
                      <div>
                        <img src={cover} className="coverEpidode" />
                      </div>
                      <div style={Styles.FlexBar}>
                        <div className="coverh6">
                          <Link href={`/novel?id=${this.props.id}`} as={`/novel-${this.props.id}`}><a>{title}</a></Link>
                        </div>
                        <div className="coverSpan">
                          <Icon type="edit" theme="filled" style={{ marginRight: 10 }} />
                          <Link href='#'><a>{author}</a></Link>
                        </div>
                      </div>
                    </div>
                  </Skeleton>
                </div>
              </Col>
              <Col xs={8} sm={5} md={4} lg={3} xl={3}>
                <div style={{ marginTop: '1em' }}>
                  <Tooltip placement="left" title="พยายามใส่หมายเลขตอน เพื่อให้ได้เรียงลำดับตอนได้อย่างถูกต้อง">
                    <Icon type="question-circle" theme="outlined" />
                  </Tooltip>
                  <Button
                    size="large"
                    htmlType="submit"
                    disabled={this.props.disabled}
                    loading={this.props.loading}
                  >
                    เผยแพร่
              </Button>
                </div>
              </Col>
            </Row>
            {/* <Divider/> */}
          </LayoutMain>
        </Header>
      </div>
    );
  }
}

const Styles = {
  FlexBar: { display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'center' }
}

export default HeaderNew
