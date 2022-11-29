import {useState} from 'react';
// import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const LoginForm = () => {
    // let history = useHistory();
    const [formData, setFormData] = useState({email_address: '', password: ''});
    const [error, setError] = useState('');

    const onInputChange = (event) => {
        event.preventDefault();
        const {name, value} = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const result = await response.json();
            if (result.error) {
                setError(result.error);
                return;
            }
            // history.push('/');
            location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section onSubmit={onSubmit}>
            <form className="register" onSubmit={onSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onInputChange}
                    placeholder="Enter email"
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={onInputChange}
                    placeholder="Password"
                    name="password"
                    required
                />
                <button type="submit">Sign In</button>
                {error && <p className="error">{error}</p>}
            </form>
            <Link to="/register">Sign Up</Link>
        </section>
    );


};

export default LoginForm;