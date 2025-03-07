import styles from "./styles.module.css";
import { useState ,useEffect} from 'react';
import axios from 'axios';
//import { Link } from "react-router-dom"; // นำเข้า Link จาก react-router-dom


function Home(userDetails) {
	const [action, setAction] = useState(sessionStorage.getItem('action'));
	const user = userDetails.user;
	useEffect(() => {
		//console.log("email = " + user.email)
		if (action === 'login') {
			login();
		}else{
			checkUser();
		}
	}, [action]);
	const checkUser = () =>{
		axios.post('http://localhost:8080/check_user', formData, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			})
			.then(loginResponse  => {
				signup_form();
			})
			.catch(error => {
				//console.error('Error:', error);
				alert(error+' มีผู้ใช้นี้อยู่แล้ว');
				logout();
			});
	}
	const [formData, setFormData] = useState({
        custname: '',
        username: `${user.name}`,
        password: user.sub,
        sex: '',
        address: '',
        tel: '',
        email: `${user.email}`
    });
	const logout = () => {
		sessionStorage.clear();
		window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
	};
	const product = () => {
		// window.open(`${process.env.REACT_APP}/product`, "_self");
		window.open(`http://localhost:3000/product`, "_self");
	};
	const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
	
	const login = () => {
		axios.post('http://localhost:8080/login', formData, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			})
			.then(loginResponse  => {
				//alert('login successful');
				const responseData = loginResponse .data;
				const token = responseData.token;
				
				// เก็บ token ใน sessionStorage
				sessionStorage.removeItem('action');
				sessionStorage.setItem('token', token);

				window.open(`http://localhost:3000/product`, "_self");
			})
			.catch(error => {
				console.error('Error:', error);
				alert('กรุณาลงทะเบียน');
			});
			//window.open(`http://localhost:3000/product`, "_self");
	}
	const signup_insert = () => {
		sessionStorage.removeItem('action');
        axios.post('http://localhost:8080/register', formData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
			console.log('Registration successful:');
            //alert('Registration successful');
			axios.post('http://localhost:8080/login', formData, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			})
			.then(loginResponse  => {
				//alert('login successful');
				const responseData = loginResponse .data;
				const token = responseData.token;
				
				// เก็บ token ใน sessionStorage
				sessionStorage.setItem('token', token);
				window.open(`http://localhost:3000/product`, "_self");
			})
			.catch(error => {
				console.error('Error:', error);
				alert('Failed to login');
			});
			//window.open(`http://localhost:3000/product`, "_self");
			
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to register');
        });
    };
	const signup_form =() =>{
		return (
		<div className={styles.container}>
			<h1 className={styles.heading}>Home</h1>
			<div className={styles.form_container}>
				<div className={styles.left}>
					<img className={styles.img} src="./images/profile.jpg" alt="login" />
				</div>
				<div className={styles.right}>
					<h2 className={styles.from_heading}>Profile</h2>
					<img
						src={user.picture}
						alt="profile"
						className={styles.profile_img}
					/>
					<input
						type="text"
						name="custname"
						className={styles.input}
						placeholder="Custname"
						onChange={handleChange}
					/>
					<input
						type="text"
						name="username"
						value={user.name}
						readOnly
						className={styles.input}
						placeholder="UserName"
					/>
					<input
						type="text"
						name="email"
						value={user.email}
						readOnly
						className={styles.input}
						placeholder="Email"
					/>
					<input
						type="text"
						name="sex"
						className={styles.input}
						placeholder="Sex"
						onChange={handleChange}
					/>
					<input
						type="text"
						name="address"
						className={styles.input}
						placeholder="Address"
						onChange={handleChange}
					/>
					<input
						type="text"
						name="tel"
						className={styles.input}
						placeholder="Tel"
						onChange={handleChange}
					/>
					<button className={styles.btn} onClick={signup_insert}>
						ลงทะเบียน
					</button>
					<button className={styles.btn} onClick={logout}>
						Log Out
					</button>
					{/* <button className={styles.btn} onClick={linkto_home}>
						ยืนยัน
					</button> */}
				</div>
			</div>
		</div>
	);
	}
	
}


export default Home;