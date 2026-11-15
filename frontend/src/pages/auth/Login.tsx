
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { loginUser } from '../../services/authService';
import { loginSchema } from '../../utils/validations/auth.validation';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [serverError, setServerError] = useState('');

    // const handleLogin = async (values: {
    //     email: string;
    //     password: string;
    // }) => {
    //     try {
    //         setServerError('');

    //         const response = await loginUser(values);

    //         if (!response.token || !response.user) {
    //             setServerError('Invalid login response');
    //             return;
    //         }

    //         localStorage.setItem('token', response.token);
    //         localStorage.setItem('user', JSON.stringify(response.user));

    //         navigate('/dashboard', { replace: true });
    //     } catch (error) {
    //         setServerError(
    //             axios.isAxiosError(error)
    //                 ? error.response?.data?.message || 'Invalid credentials'
    //                 : 'Something went wrong'
    //         );
    //     }
    // };


    const handleLogin = async (values: {
    email: string;
    password: string;
}) => {
    try {
        const response = await loginUser(values);

        if (response.success && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem(
                'user',
                JSON.stringify(response.user)
            );

            navigate('/dashboard');
        }
    } catch (error) {
        console.log(error);
    }
};
    return (
        <div className="auth-page">
            <div className="container">
                <div className="row min-vh-100 justify-content-center align-items-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card border-0 shadow auth-card">
                            <div className="card-body p-4 p-md-5">
                                <h2 className="text-center fw-bold mb-2">
                                    Welcome Back
                                </h2>

                                <p className="text-center text-muted mb-4">
                                    Login to your account
                                </p>

                                {location.state?.message && (
                                    <div className="alert alert-success">
                                        {location.state.message}
                                    </div>
                                )}

                                {serverError && (
                                    <div className="alert alert-danger">
                                        {serverError}
                                    </div>
                                )}

                                <Formik
                                    initialValues={{
                                        email: '',
                                        password: ''
                                    }}
                                    validationSchema={loginSchema}
                                    onSubmit={handleLogin}
                                >
                                    {({ isSubmitting }) => (
                                        <Form>
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Email Address
                                                </label>

                                                <Field
                                                    name="email"
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Enter email"
                                                />

                                                <ErrorMessage
                                                    name="email"
                                                    component="div"
                                                    className="text-danger small mt-1"
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Password
                                                </label>

                                                <Field
                                                    name="password"
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Enter password"
                                                />

                                                <ErrorMessage
                                                    name="password"
                                                    component="div"
                                                    className="text-danger small mt-1"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Please wait...' : 'Login'}
                                            </button>
                                        </Form>
                                    )}
                                </Formik>

                                <p className="text-center mt-4 mb-0">
                                    Don't have an account?{' '}
                                    <Link to="/signup">Sign Up</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
