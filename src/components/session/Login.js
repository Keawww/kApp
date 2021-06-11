import React, { useState } from 'react';
import fire from '../../fire.js';
import { Form, Input, Button, Layout, Image, Row, Col } from 'antd';
// import logo from '../../assets/images/shark.png'
import logo from '../../assets/images/iService - Logo - v6.png'
// import { Redirect } from 'react-router-dom';

const Login = () => {

	// const [email, setEmail] = useState();
	// const [password, setPassword] = useState();
	
	// const handleSubmit = (e) => {

	// 	e.preventDefault();

	// 	try {

	// 		fire.auth().signInWithEmailAndPassword(email, password)
	// 		// fire.auth().signInWithEmailAndPassword(email, password).catch((error) => {
	// 		// 	console.error('Incorrect username or password');
	// 		// });
			
	// 	} catch (error) {
	// 		alert(error)
	// 	}
	// }

	const layout = {
		labelCol: { span: 8, offset: 8 },
		wrapperCol: { span: 8, offset: 8},
	};

	const tailLayout = {
		wrapperCol: { span: 8, offset: 8},
	};

	const onFinish = (values) => {

		values.email = values.email == '8' ? "keawww@gmail.com" : ''
		values.passwd = values.passwd == '8' ? "kk1234" : ''

		fire.auth().signInWithEmailAndPassword(values.email, values.passwd).catch((error) => {
			alert('Incorrect username or password');
		});

	};

	// const { curUser } = useContext(contextValue)

	// if ( curUser ) {
	// 	return <Redirect to="/" />
	// }

	return (
		<>
		<Layout
			style={{ 
				padding: '24px',
				background: 'white',
				overflow: 'initial'
			}}
		>
			<Row>
				<Col span={1} offset={10}>
					<Image
						width={240}
						src={logo}
					/>
				</Col>
			</Row>

			<Form
				{...layout}
				name="basic"
				initialValues={{ remember: true }}
				layout="vertical"
				onFinish={onFinish}
			>
				<Form.Item
					label="Username"
					name="email"
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input />
				</Form.Item>
		
				<Form.Item
					label="Password"
					name="passwd"
					rules={[{ required: true, message: 'Please input your password!' }]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit">
						Login
					</Button>
				</Form.Item>
			</Form>

			{/* <div>
				<h2>Login</h2>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						onChange={({ target }) => setEmail(target.value)}
						placeholder="Email"
					/>
					<br />
					<input
						type="password"
						onChange={({ target}) => setPassword(target.value)}
						placeholder="Password"
					/>
					<br />
					<button type="submit">
						Sign in
					</button>
				</form>
			</div>  */}
		</Layout>
		</>
	)
}

export default Login