import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, withRouter, Redirect } from 'react-router-dom';

import fire from '../fire.js'
import Coin from './coin/coin'
import Exp from './exp/exp'
import ExpMob from './exp-mob/exp-mob'
import Export from './export/export'
import Pomodoro from './pomodoro/pomodoro'
import Portfolio from './portfolio/portfolio'
import Trading from './trading/trading'
import InvenDash from './inventory/inven-dash'

import { Layout, Menu, Button, Row, Col, Tooltip, Avatar } from 'antd'
import {
	AppstoreOutlined,
	DollarCircleOutlined,
	DownloadOutlined,
	HourglassOutlined,
	LogoutOutlined,
	PieChartOutlined,
	MobileOutlined,
	StockOutlined,
	WalletTwoTone,
	DesktopOutlined
} from '@ant-design/icons';

import 'antd/dist/antd.css';
import '../k.css'
import logo from '../assets/images/shark.png'
// import logo from '../assets/images/iService - Logo - v6.png'

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu


const Main = () => {

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [collapsed, SetCollapsed] = useState(false);

	fire.auth().onAuthStateChanged((user) => {
		return user ? setIsLoggedIn(true) : setIsLoggedIn(false);
	});

	const signOut = () => {
		fire.auth().signOut()
	};

	// console.log(isLoggedIn);

	// const state = {
	//   collapsed: true
	// };
  
	// const onCollapse = state
	// const onCollapse = collapsed => {
	//   console.log(collapsed);
	//   this.setState({ collapsed });
	// };
  
	// const { collapsed } = state;

	return (
		<Layout>
			<Router>
				<Sider theme="dark"
					collapsible 
					collapsed={collapsed}
					// onCollapse={onCollapse}
					breakpoint="lg"
					collapsedWidth="0"
					onBreakpoint={broken => {
						// console.log(broken);
					}}
					onCollapse={(collapsed, type) => {
						{ collapsed ? SetCollapsed(true) : SetCollapsed(false) }
						// console.log(collapsed, type);

					}}
					style={{ position: 'fixed', zIndex: 2, width: '80%', height: '100%' }}
				>
					<div>
						<Tooltip title="iService version 6">
							<img src={logo} className="logo" />
						</Tooltip>
					</div>

					<Menu theme="dark"
						defaultSelectedKeys={['1']}
						mode="inline"
						onClick={() => {
							{ collapsed ? SetCollapsed(false) : SetCollapsed(true) }
						}}
					>
						{/* <Menu.Item key="2" icon={<FileProtectOutlined />}>
							<Link to="/cert/0">Service Certificate</Link>
						</Menu.Item>
						 */}
						<Menu.Item key="5" icon={<HourglassOutlined />}>
							<Link to="/Pomodoro/0">Pomodoro</Link>
						</Menu.Item>

						<Menu.Item key="1" icon={<PieChartOutlined />}>
							{/* <Link to="/ListAllNumbers">List</Link> */}
							<Link to="/InvenDash">Summary</Link>
						</Menu.Item>

						<SubMenu key="3" icon={<DollarCircleOutlined />} title="Coins">
							<Menu.Item key="3" icon={<DollarCircleOutlined />}>
								<Link to="/Coin/0">Coins</Link>
							</Menu.Item>
							<Menu.Item key="7" icon={<DollarCircleOutlined />}>
								<Link to="/Coin/0">Coins INVESTMENT</Link>
							</Menu.Item>
						</SubMenu>

						<SubMenu key="6" icon={<WalletTwoTone />} title="Expenses">
							<Menu.Item key="61" icon={<DesktopOutlined />}>
								<Link to="/Exp/0">Web</Link>
							</Menu.Item>

							<Menu.Item key="62" icon={<MobileOutlined />}>
								<Link to="/exp-mob/0">Mobile</Link>
							</Menu.Item>
						</SubMenu>

						<Menu.Item key="10" icon={<AppstoreOutlined />}>
							<Link to="/Portfolio/0">Portfolio</Link>
						</Menu.Item>

						<Menu.Item key="4" icon={<StockOutlined />}>
							<Link to="/Trading/0">Trading</Link>
						</Menu.Item>

						{/* <Menu.Item key="11" icon={<NodeExpandOutlined />}>
							<Link to="/Timeline/0">Timeline</Link>
						</Menu.Item> */}

						<Menu.Item key="8" icon={<DownloadOutlined />}>
							<Link to="/Export/0">Export SQL</Link>
						</Menu.Item>

					</Menu>
				</Sider>

				<Layout className="site-layout"
					style={{ height: '700px'}}
				>
					<Header className="site-layout-background"
						// style={{ marginTop: '-5px',  width: '100%' }}
						// style={{ position: 'fixed', marginTop: '-5px', zIndex: 1, width: '100%' }}
					>

						<Row 
							gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
						>
							<Col span={1}>
								<Tooltip title="iService version 6">
									<img src={logo} style={{ height: '12%', marginLeft: '-30px'}} />
								</Tooltip>
							</Col>
							<Col span={11}></Col>
							<Col span={12} style={{ textAlign: 'right'}}>
								<Tooltip title="Demo Ja~~">
									<Avatar
										size={38}
										style={{
											color: 'white',
											backgroundColor: '#87d068'
										}}
									>
										Demo
									</Avatar>
								</Tooltip>
								<Tooltip title="Logout">
									<Button type="dash"
										shape="circle"
										icon={<LogoutOutlined />}
										size={38}
										onClick={signOut}
										style={{ marginLeft: 10 }}
									/>
								</Tooltip>
							</Col>
						</Row>
					</Header>

					<Content 
						style={{ marginTop: -7, overflow: 'scroll' }}
					>
						<div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
							<Switch>
								<Route exact path="/InvenDash" component={InvenDash} />
								<Route path="/Coin/:keyword" component={Coin} />
								<Route path="/Trading/:keyword" component={Trading} />
								<Route path="/pomodoro/:keyword" component={Pomodoro} />
								<Route path="/portfolio/:keyword" component={Portfolio} />
								<Route path="/exp/:keyword" component={Exp} />
								<Route path="/exp-mob/:keyword" component={ExpMob} />
								<Route path="/export/:keyword" component={Export} />
							</Switch>
						</div>
					</Content>
				</Layout>
			</Router>
		</Layout>
	)
}

// ReactDOM.render(<App />, mountNode);

export default Main;

// function App() {

//   const [isLoggedIn, setIsLoggedIn] = useState(false);
  
// 	fire.auth().onAuthStateChanged((user) => {
// 	  return user ? setIsLoggedIn(true) : setIsLoggedIn(false);
//   });
  
//   const signOut = () => {
// 	fire.auth().signOut()
//   };
  
//   console.log(isLoggedIn);

//   return (
// 	// <div className="App">
// 	<Layout>
// 	  <Content style={{ backgroundColor: '#fff', padding: 24, margin: 0 }}>
// 	  <Router>
// 		{!isLoggedIn
// 		? (
// 			<>
// 			<Switch>
// 			  <Route path="/">
// 				<Login />
// 			  </Route>
// 			</Switch>
// 			</>
// 		  ) 
// 		  : (
// 			<>
// 			<span onClick={signOut}>
// 			  <a href="#">Sign out</a>
// 			</span>
// 			<Switch>
// 			  <Route path="/add-number">
// 				<AddNumber />
// 			  </Route>
// 			  <Route path="/">
// 				<ListAllNumbers />
// 			  </Route>
// 			</Switch>
// 			</>
// 		  )}
// 	  </Router>
// 	</Content>
// 	</Layout>
// 	// </div>
//   );
// }

// export default App;
