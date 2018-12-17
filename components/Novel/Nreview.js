import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { List, Avatar, Button, Skeleton } from 'antd';
import LayoutMain from '../LayoutMain'
import reqwest from 'reqwest';


const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;

class Nreview extends Component {
    state = {
        initLoading: true,
        loading: false,
        data: [],
        list: [],
    }

    componentDidMount() {
        this.getData((res) => {
            this.setState({
                initLoading: false,
                data: res.results,
                list: res.results,
            });
        });
    }

    getData = (callback) => {
        reqwest({
            url: fakeDataUrl,
            type: 'json',
            method: 'get',
            contentType: 'application/json',
            success: (res) => {
                callback(res);
            },
        });
    }

    onLoadMore = () => {
        this.setState({
            loading: true,
            list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
        });
        this.getData((res) => {
            const data = this.state.data.concat(res.results);
            this.setState({
                data,
                list: data,
                loading: false,
            }, () => {
                // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
                // In real scene, you can using public method of react-virtualized:
                // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    render() {
        const { initLoading, loading, list } = this.state;
        const loadMore = !initLoading && !loading ? (
            <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
                <Button onClick={this.onLoadMore}>loading more</Button>
            </div>
        ) : null;
        const { classes } = this.props
        return (
            <div>
                <LayoutMain>
                    <List
                        className="demo-loadmore-list"
                        loading={initLoading}
                        itemLayout="horizontal"
                        loadMore={loadMore}
                        dataSource={list}
                        renderItem={item => (
                            <List.Item actions={[edit, more]}>
                                <Skeleton avatar title={false} loading={item.loading} active>
                                    <List.Item.Meta
                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title={<div>{item.name.last}</div>}
                                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                    />
                                    <div>content</div>
                                </Skeleton>
                            </List.Item>
                        )}
                    />
                </LayoutMain>
            </div>
        );
    }
}
const styles = (theme) => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1050 + theme.spacing.unit * 3 * 2)]: {
            width: 1050,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
});


Nreview.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Nreview)