import React, { Component } from 'react';
import { Tabs, Icon } from 'antd';
import LayoutMain from '../Main/LayoutMain'


const TabPane = Tabs.TabPane;

class Ntaps extends Component { 
    render() {
        return (
            <LayoutMain>
            <Tabs defaultActiveKey="1">
                <TabPane tab={<span style={{fontSize:20}}><Icon type="file-text" theme="outlined" />งานเขียน</span>} key="1">
                 {/* <Nmain /> */}
                 11111
                </TabPane>
                <TabPane disabled tab={<span style={{fontSize:20}}><Icon type="star" theme="outlined" />ที่ติดตาม</span>} key="2">
                    {/* <Nreview /> */}
                    2222
                </TabPane>
            </Tabs>
            </LayoutMain>
        );
    }
}

export default Ntaps;