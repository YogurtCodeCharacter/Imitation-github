import { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router'
import axios from 'axios';
import Link from 'next/link'
import { Button, Layout, Input, Avatar, Tooltip, Dropdown, Menu } from 'antd';
import getConfig from 'next/config';
import { GithubOutlined, UserOutlined } from '@ant-design/icons';
import Container from '../Container.jsx';
import { logout } from '../../store/store.js'

const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { publicRuntimeConfig } = getConfig();

const githubIconStyle = {
    color: 'white',
    fontSize: 40,
    display: 'block',
    paddingTop: 10,
    marginRight: 20
};

const LayoutComponent = ({ children, userInfo, logout, router }) => {

    const [search, setSearch] = useState(router.query && router.query.query || '');


    const handeSearchChange = useCallback((event) => {
        setSearch(event.target.value);
    }, [setSearch]);

    const handeOnSearch = useCallback(() => { 
        router.push(`/search?query=${search}`);
    }, [search]);

    const handleLogout = useCallback((e) => {
        e.preventDefault();
        logout()
    }, [logout]);

    const handleGoToOauth = useCallback((e) => {
        e.preventDefault();
        const {  asPath } = router;
        axios.get(`/prepare-auth?url=${asPath}`).then(({status}) => {
                if (status === 200) {
                    location.href = publicRuntimeConfig.OAUTH_URL
                } else {
                    console.log('fail');
                }
        }).catch((error) => console.log(error))
    }, []);
    const userDropDown = () => {
        return <Menu>
            <Menu.Item>
                <a onClick={handleLogout}>登出</a>
            </Menu.Item>
        </Menu>
    }

    return (<>
        <Layout>
            <Header>
                <Container renderer={<div className="header-inner" />}>
                    <div className="header-left">
                        <Link href="/">
                        <div className="logo">
                            <GithubOutlined style={githubIconStyle} />
                        </div>
                        </Link>
                        <div>
                            <Search
                                placeholder="请输入需要检索的内容"
                                value={search}
                                onSearch={handeOnSearch}
                                onChange={handeSearchChange}
                                style={{ width: 200 }}
                            />
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="user">
                            {
                                userInfo && userInfo.id ? <Dropdown overlay={userDropDown}>
                                    <a href="/">
                                       <Avatar size={40} src={userInfo.avatar_url} />
                                    </a>
                                </Dropdown> : <Tooltip title="点击进行登录"><a href={publicRuntimeConfig.OAUTH_URL} onClick={handleGoToOauth}>
                                        <Avatar size={40} icon={<UserOutlined />} />
                                    </a>
                                    </Tooltip>
                            }
                        </div>
                    </div>
                </Container>
            </Header>
            <Content><Container>{children}</Container></Content>
            <Footer>
                <div className="header-footer">
                    Develop by zongxiaobai@@163.com<a href="mailto:xxxxxxxx@163.com"></a>
                </div>
            </Footer>
            <style jsx>{`
                        .header-inner{
                            display: flex;
                            justify-content: space-between;
                        }
                        .header-left{
                            display: flex;
                            justify-content: flex-start;
                        }
                        .header-footer{
                            text-align: center
                        }
            `}</style>
            <style jsx global>
                {`
                            #__next{
                                height: 100%
                            }
                            .ant-layout{
                                min-height: 100%;
                            }
                            .ant-layout-header{
                                padding-left: 0;
                                padding-right: 0
                            }
                            .ant-layout-content{
                                background: #FFF
                            }
                        `}
            </style>
        </Layout>
    </>)
}

function mapStateToProps(state) {
    return {
        userInfo: state.userInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LayoutComponent));