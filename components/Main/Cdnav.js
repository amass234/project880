import React, { Component } from 'react'
import { Tabs, Icon, Timeline, Spin, Tag } from 'antd';
import Link from 'next/link'
import { css } from 'react-emotion';
import moment from 'moment'
import { inject, observer } from 'mobx-react';
import { Icon as IconKit } from 'react-icons-kit'
import { clock } from 'react-icons-kit/icomoon/clock'
import { history } from 'react-icons-kit/icomoon/history'
import { bookmarks } from 'react-icons-kit/icomoon/bookmarks'
import { compass } from 'react-icons-kit/icomoon/compass'

import CardImage from '../MainCard/CardImage'


const TabPane = Tabs.TabPane;

@inject('novelStore', 'authStore', 'searchStore')
@observer
export class Cdnav extends Component {

	componentWillMount(){
		this.props.authStore.loading = true
		this.props.novelStore.loading = true
		this.props.searchStore.loading = true
	}

	async componentDidMount() {
		await this.props.authStore.getUser()
		await this.props.novelStore.read()
		await this.props.searchStore.novelSearchHome()
		await this.props.novelStore.bookmark()
	}

	render() {
		const { readStore, loading, bookmarkStore } = this.props.novelStore
		const { novelListNew } = this.props.searchStore
		const { user, uid } = this.props.authStore
		const outputRead = [...new Map(readStore.map(o => [o.id, o])).values()]
		const outputNovelList = [...new Map(novelListNew.map(o => [o.id, o])).values()]
		const outputBookmarkStore = [...new Map(bookmarkStore.map(o => [o.id, o])).values()]
		return (
			<div>
				<Tabs defaultActiveKey="1">
					<TabPane disabled tab={<span><IconKit size={20} icon={compass} /></span>} key="0" />
					<TabPane tab={<span><IconKit size={20} icon={clock} /></span>} key="1">
						<div className={css({ padding: '10px 1em' })}>
							{
								outputNovelList != 0 ?
									<Spin spinning={this.props.searchStore.loading}>
										<Timeline>
											{
												outputNovelList.map((item, i) => {
													return (
														<Timeline.Item
															dot={i === 0 && <Icon type="clock-circle-o" style={{ fontSize: '16px' }} className="jackpots" />}
															color={item.rating == 'ทั่วไป' ? '#6acc39' : item.rating == 'NC-18' ? "#f92200" : "#fbb937"}
															key={item.id}>
															<div>
																<span>เรื่อง : </span><Link href={`/novel?id=${item.id}`} as={`/novel-${item.id}`}><a>{item.title}</a></Link>
																<Tag color={item.rating == 'ทั่วไป' ? '#6acc39' : item.rating == 'NC-18' ? "#f92200" : "#fbb937"}
																	style={{ marginLeft: 10 }}>
																	<Icon type="star" theme="outlined" /> {item.rating}
																</Tag>
															</div>
															<div><span>โดย : </span><Link href={`/author?id=${item.authorId}`}><a>{item.author}</a></Link></div>
															<span className={css({ color: '#bbb' })}>{moment(`${item.createDate}`).locale('th').fromNow()}</span>
														</Timeline.Item>
													)
												})
											}
										</Timeline>
									</Spin> : <h6>ไม่มีข้อมูล</h6>
							}
						</div>
					</TabPane>
					<TabPane disabled={user ? false : true} tab={<span><IconKit size={20} icon={history} /></span>} key="2">
						<div className={css({ padding: '10px 1em' })}>
							{
								outputRead != 0 ?
									<Spin spinning={loading}>
										<Timeline>
											{
												outputRead.map((item, i) => {
													return (
														<Timeline.Item
															dot={i === 0 && <Icon type="clock-circle-o" style={{ fontSize: '16px' }} className="jackpots" />}
															key={item.id}>
															<span>เรื่อง : </span><Link href={`/novel?id=${item.id}`} as={`/novel-${item.id}`}><a>{item.title}</a></Link>
															<div><span>อ่านต่อ : </span><Link href={item.href} as={item.as}><a>{item.episode}</a></Link></div>
															<span className={css({ color: '#bbb' })}>{moment(`${item.time}`).locale("th").fromNow()}</span>
														</Timeline.Item>
													)
												})
											}
										</Timeline>
									</Spin> : <h6>{user ? 'ไม่มีประวัติ คุณอาจยังไม่ได้อ่าน' : 'ดูเหมือนว่าคุณยังไม่ได้เข้าสู่ระบบ '}</h6>
							}
						</div>
					</TabPane>
					<TabPane disabled={user ? false : true} tab={<span><IconKit size={20} icon={bookmarks} /></span>} key="3">
						<div className={css({ padding: '10px 1em' })}>
							<CardImage output={outputBookmarkStore} loading={loading} uid={uid} user={user} img />
						</div>
					</TabPane>
				</Tabs>
			</div>
		)
	}
}
export default Cdnav