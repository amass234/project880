import React, { Component } from 'react'
import { Modal, Button, Input, List, Select, Tooltip, Icon } from 'antd';
import { Row, Col } from 'reactstrap'
import { css } from 'emotion';
import Link from 'next/link'
import { inject, observer } from 'mobx-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Search = Input.Search;
const { Option, OptGroup } = Select;

@inject('searchStore')
@observer
export class SearchModal extends Component {
    state = { visible: false }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    render() {
        const { novelListChid, loading2, keyword } = this.props.searchStore
        const output = [...new Map(novelListChid.map(o => [o.id, o])).values()]

        return (
            <div style={{ display: 'inherit' }}>
                <Button onClick={this.showModal}>ค้นหาแบบเร็ว</Button>
                <Modal
                    style={{ top: 20, maxHeight: 500 }}
                    visible={this.state.visible}
                    title={[keyword == '' ? 'ค้นหานิยายแบบเร็ว' : `ค้นหา "${keyword}"`, output.length == 0 ? ' ' : ` พบ ${output.length} รายการ`]}
                    footer={null}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Search
                        size="large"
                        placeholder="ค้นหา"
                        onSearch={value => this.props.searchStore.novelSearchChid(value)}
                        className={css({
                            marginBottom: 15
                        })} />
                    <Row>
                        <Col>
                            <Select
                                placeholder='เลือกหมวด'
                                style={{ width: '100%', marginBottom: 15 }}
                                onChange={value => this.props.searchStore.novelSearchCatalogChid(value)}
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
                        </Col>
                        <Col>
                            <Select
                                placeholder='เลือกหมวดจบ'
                                style={{ width: '100%' }}
                                onChange={value => this.props.searchStore.novelSearchEndNovelChid(value)}
                            >
                                <OptGroup label="นิยาย">
                                    <Option value={'true'}>จบแล้ว</Option>
                                    <Option value={'false'}>ยังไม่จบ</Option>
                                </OptGroup>
                            </Select>
                        </Col>
                        <Col>
                            <Select
                                placeholder='เรท'
                                style={{ width: '80%' }}
                                onChange={value => this.props.searchStore.novelSearchRatingChid(value)}
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
                        </Col>
                    </Row>
                    <List
                        locale={{ emptyText: loading2 ? 'กำลังค้นหา... รอสักครู่' : 'ไม่พบข้อมูลที่ค้นหา' }}
                        header={null}
                        footer={null}
                        loading={loading2}
                        bordered
                        dataSource={output}
                        pagination={{
                            onChange: (page) => {
                                console.log(page);
                            },
                            size: 'small',
                            pageSize: 15,
                        }}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<LazyLoadImage
                                        alt={item.title}
                                        effect="blur"
                                        height="40"
                                        placeholderSrc={item.cover}
                                        src={item.cover} />}
                                    title={
                                        <Link href={`/novel?id=${item.id}`} as={`/novel-${item.id}`}>
                                            <a>{item.title}</a>
                                        </Link>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Modal>
            </div>
        );
    }
}
export default SearchModal
