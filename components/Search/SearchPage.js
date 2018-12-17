import React, { Component } from 'react'
import { Divider, Icon, Spin, Input, Tooltip, Button, Form, Select, } from 'antd'
import { inject, observer } from 'mobx-react';
import { Row, Col } from 'reactstrap'
import { css } from 'emotion';
import LayoutMain from "../Main/LayoutMain";
import SearchModal from './SearchModal';
import CardList from '../MainCard/CardList'
import CardImage from '../MainCard/CardImage'
import Head from '../head';

const { Option, OptGroup } = Select;
const FormItem = Form.Item;
const Search = Input.Search;
const SpinCostom = <div className="loading-spinner"></div>

@inject('searchStore', 'authStore', 'novelStore')
@observer
export class SearchPage extends Component {

    state = {
        grid: true,
        word: ''
    }

    async componentDidMount() {
        await this.props.authStore.getUser();
        await this.props.searchStore.reset();
        await this.props.searchStore.novelSearchCatalog(this.props.cat);
        await this.props.searchStore.novelSearchEndNovel(this.props.e);
        await this.props.searchStore.novelSearchTage(this.props.tag);
        await this.props.searchStore.novelSearchRating(this.props.rating)

        if (this.props.e) {
            this.setState({ word: this.props.e })
            this.props.e == "finish" ? this.props.searchStore.word = 'จบแล้ว' :
                this.props.e == "notfinish" ? this.props.searchStore.word = 'ยังไม่จบ' :
                    this.props.searchStore.word = ''
        } else if (this.props.cat) {
            this.setState({ word: this.props.cat })
            this.props.searchStore.word = `หมวดหมู่ ${this.props.cat}`
        } else if (this.props.tag) {
            this.setState({ word: this.props.tag })
            this.props.searchStore.word = `แท็ค ${this.props.tag}`
        } else if (this.props.rating) {
            this.setState({ word: this.props.rating })
            this.props.searchStore.word = `เรท ${this.props.rating}`
        } else {
            this.props.searchStore.word = ''
        }

    };

    async componentWillReceiveProps(nextProps) {
        await this.props.searchStore.reset()
        await this.props.searchStore.novelSearchCatalog(nextProps.cat)
        await this.props.searchStore.novelSearchEndNovel(nextProps.e)
        await this.props.searchStore.novelSearchTage(nextProps.tag)
        await this.props.searchStore.novelSearchRating(nextProps.rating)

        if (nextProps.e) {
            this.setState({ word: nextProps.e })
            nextProps.e == "finish" ? this.props.searchStore.word = 'จบแล้ว' :
                nextProps.e == "notfinish" ? this.props.searchStore.word = 'ยังไม่จบ' :
                    this.props.searchStore.word = ''
        } else if (this.props.cat) {
            this.setState({ word: nextProps.cat })
            this.props.searchStore.word = `หมวดหมู่ ${nextProps.cat}`
        } else if (this.props.tag) {
            this.setState({ word: nextProps.tag })
            this.props.searchStore.word = `แท็ค ${nextProps.tag}`
        } else if (nextProps.rating) {
            this.setState({ word: nextProps.rating })
            this.props.searchStore.word = `เรท ${nextProps.rating}`
        } else {
            this.props.searchStore.word = ''
        }

    }

    async componentWillUnmount() {
        await this.props.searchStore.novelSearchCatalog(this.props.cat)
        await this.props.searchStore.novelSearchEndNovel(this.props.e)
        await this.props.searchStore.novelSearchTage(this.props.tag)
        await this.props.searchStore.novelSearchRating(this.props.rating)

    }

    render() {
        const { novelList, loading, word } = this.props.searchStore
        // const { userBookmark } = this.props.novelStore
        const { grid } = this.state
        const { user, uid } = this.props.authStore
        const output = [...new Map(novelList.map(o => [o.id, o])).values()]
        return (
            <div style={{ flex: 1 }} className={css({
                marginBottom: '3em',
            })}>
                <Head title={`Search ${this.props.cat || this.props.e || this.props.tag || this.props.rating || word} | Episode2`} />
                <div>
                    <LayoutMain>
                        <Divider />
                        <Row>
                            <Col>
                                <Form className={css({
                                    marginTop: '2em'
                                })} layout="inline">
                                    <FormItem>
                                        <Search
                                            style={{ borderRadius: '1.5em' }}
                                            size="large"
                                            placeholder="ค้นหา"
                                            onSearch={value => this.props.searchStore.novelSearch(value)}
                                            className={css({
                                                marginBottom: 15
                                            })} />
                                    </FormItem>
                                    <FormItem>
                                        <Tooltip title='หากไม่ใส่ข้อความหมายถึงการค้นหาทั้งหมดกดที่ปุ่มค้นหาได้เลย'>
                                            <Icon style={{ marginLeft: 10 }} type="question-circle" />
                                        </Tooltip>
                                    </FormItem>
                                    <FormItem>
                                        <Select
                                            defaultValue={this.props.cat}
                                            size='large'
                                            placeholder='เลือกหมวด'
                                            style={{ width: 150, marginBottom: 15, borderRadius: '1.5em' }}
                                            onChange={value => this.props.searchStore.novelSearchCatalog(value)}
                                        >
                                            <OptGroup label="หมวดหมู่">
                                                <Option value={'กำลังภายใน'}>กำลังภายใน</Option>
                                                <Option value={'แฟนตาซี'}>แฟนตาซี</Option>
                                                <Option value={'รักโรเมนติก'}>รักโรเมนติก</Option>
                                                <Option value={'ผจญภัย'}>ผจญภัย</Option>
                                                <Option value={'เกมออนไลน์'}>เกมออนไลน์</Option>
                                                <Option value={'สืบสวน'}>สืบสวน</Option>
                                                <Option value={'ระทึกขวัญ'}>ระทึกขวัญ</Option>
                                                <Option value={'คอมมาดี้'}>คอมมาดี้</Option>
                                                <Option value={'ดราม่า'}>ดราม่า</Option>
                                                <Option value={'เหนือธรรมาชาติ'}>เหนือธรรมาชาติ</Option>
                                                <Option value={'ฮาเร็ม'}>ฮาเร็ม</Option>
                                                <Option value={'รักเดียว'}>รักเดียว</Option>
                                            </OptGroup>
                                        </Select>
                                    </FormItem>
                                    <FormItem>
                                        <Select
                                            defaultValue={this.props.e}
                                            size='large'
                                            placeholder='เลือกหมวดจบ'
                                            style={{ width: 150, borderRadius: '1.5em' }}
                                            onChange={value => this.props.searchStore.novelSearchEndNovel(value)}
                                        >
                                            <OptGroup label="นิยาย">
                                                <Option value='finish'>จบแล้ว</Option>
                                                <Option value='notfinish'>ยังไม่จบ</Option>
                                            </OptGroup>
                                        </Select>
                                    </FormItem>
                                    <FormItem>
                                        <Select
                                            defaultValue={this.props.rating}
                                            size='large'
                                            placeholder='เรท'
                                            style={{ width: 150, borderRadius: '1.5em' }}
                                            onChange={value => this.props.searchStore.novelSearchRating(value)}
                                        >
                                            <OptGroup label="เรทนิยาย">
                                                <Option value='ทั่วไป'>ทั่วไป</Option>
                                                <Option value='PG-13'>PG-13</Option>
                                                <Option value='PG-15'>PG-15</Option>
                                                <Option value='NC-18'>NC-18</Option>
                                            </OptGroup>
                                        </Select>
                                        <Tooltip title='ตอนนี้การค้นหาจะแยกกันโดยชัดเจนไม่สามารถค้นหาแบบหลายอย่างพร้อมกันได้ อนาคตอาจทำได้'>
                                            <Icon style={{ marginLeft: 10 }} type="question-circle" />
                                        </Tooltip>
                                    </FormItem>
                                    <FormItem style={{ float: 'right' }}>
                                        <Divider type='vertical' /> <SearchModal />
                                    </FormItem>
                                </Form>
                            </Col>
                        </Row>

                        <div
                            className="NCardread"
                            style={{
                                justifyContent: 'space-between',
                                margin: '1.5em 0',
                                flexDirection: 'row'
                            }}>
                            <h6
                                className={css({
                                    display: 'flex',
                                    alignItems: 'flex-end'
                                })}>
                                {word == '' ? `${this.props.cat || this.props.e || this.props.rating || ''}` : `ค้นหา "${word}"`} {output.length == 0 ? '' : `พบ ${output.length} รายการ`}
                            </h6>
                            <Tooltip title={grid ? 'แบบรายการ' : 'แบบเรียงรูป'}>
                                <Button ghost
                                    type="default" icon={grid ? 'bars' : 'appstore'}
                                    size={'large'}
                                    className="episodeB"
                                    onClick={() => this.setState({ grid: !grid })}
                                    style={{ margin: 0 }}
                                />
                            </Tooltip>
                        </div>

                        <Spin indicator={SpinCostom} size="large" spinning={loading} >
                            {grid ?
                                <CardImage output={output} loading={loading} uid={uid} user={user} follow description />
                                :
                                <CardList output={output} loading={loading} uid={uid} user={user} />
                            }
                        </Spin>

                    </LayoutMain>
                </div>
            </div>
        )
    }
}

const Styles = {
    FonstPT: {
        marginTop: '1em',
        fontFamily: '"PraJad", "PraJaditalic", "PraJad-bold", "PraJad-boldItalic"',
        fontSize: 25,
    },
}

export default SearchPage
