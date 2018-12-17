import React, { Component } from 'react'
import Link from 'next/link'
import { Icon, Divider, Tooltip, Button } from 'antd'
import LayoutMain from '../Main/LayoutMain'
import NovelList from './NovelList';

export class HomeNovelTwo extends Component {
    render() {
        return (
            <div>
                <LayoutMain>
                    <div>
                        <Tooltip placement="left" title="เริ่มอ่าน">
                            <Button ghost type="default" size={'large'} className="NCardbuttonEdit episodeB">
                                <Icon type="read" theme="filled" />
                            </Button>
                        </Tooltip>
                        <Tooltip placement="top" title="เพิ่มเข้าชั้นหนังสือ">
                            <Button ghost type="default" icon="plus-square" size={'large'} className="NCardbuttonEdit episodeB" />
                        </Tooltip>
                        <Tooltip placement="top" title="เพิ่มเข้าชั้นหนังสือ">
                            <Button ghost type="default" icon="plus-square" size={'large'} className="NCardbuttonEdit episodeB" />
                        </Tooltip>
                        <Tooltip placement="top" title="เพิ่มเข้าชั้นหนังสือ">
                            <Button ghost type="default" icon="plus-square" size={'large'} className="NCardbuttonEdit episodeB" />
                        </Tooltip>
                    </div>
                    <Divider />
                    <NovelList />
                </LayoutMain>
            </div>
        )
    }
}

export default HomeNovelTwo
