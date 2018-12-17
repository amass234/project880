import React, { Component } from 'react';
import { Tabs, Icon, Skeleton } from 'antd';
import LayoutMain from '../Main/LayoutMain'
import ShowMore from 'react-show-more';
import Editor from 'react-medium-editor'

const TabPane = Tabs.TabPane;

class Ntaps extends Component {
    componentWillUnmount() {
        <ShowMore />
    }
    render() {
        return (
            <LayoutMain>
                <Tabs defaultActiveKey="1">
                    <TabPane style={{ padding: '0 0 2em 0' }} tab={<span style={{ fontSize: 20 }}><Icon type="file-text" theme="outlined" />บทนำ</span>} key="1">
                        <Skeleton loading={this.props.loading} title={false} paragraph={{ rows: 4 }} active>
                            {/* <ShowMore
                                lines={3}
                                more='อ่านเพิ่มเติม'
                                less='...แสดงน้อยลง'
                                anchorClass='moreText'
                            > */}
                                <Editor
                                    style={{ border: 'none', padding: 0 }}
                                    text={this.props.body}
                                    options={{ disableEditing: true, toolbar: false, placeholder: { text: "" } }}
                                />
                            {/* </ShowMore> */}

                        </Skeleton>
                    </TabPane>
                    <TabPane disabled tab={<span style={{ fontSize: 20 }}><Icon type="star" theme="outlined" />รีวิว</span>} key="2">
                        {/* <Nreview /> */}
                        2222
                </TabPane>
                </Tabs>
            </LayoutMain>
        );
    }
}

export default Ntaps;