import React, { Component } from 'react';
import { List,Menu } from 'antd';
import Router from 'next/router'

export class EpisodeList extends Component {
    onClick = (id, href) => {
        const hrefs = `/episode?e=${id}&id=${href}`
        const as = `/e/${id}/${href}`
        Router.push(hrefs, as)
        console.log(hrefs,as)
    }
    render() {
        const output = [...new Map(this.props.data.map(o => [o.id, o])).values()]
        return (
            <div style={{ marginTop: '2em' }}>
                <List
                    itemLayout="vertical"
                    style={{ marginBottom: 30 }}
                    dataSource={output}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={<a href='javascript:;' onClick={() => this.onClick(this.props.id, item.href)}>{item.title}</a>}
                            />
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}

//extra={[`${item.createDate} |`, ` ${item.createTime}`]}

export default EpisodeList