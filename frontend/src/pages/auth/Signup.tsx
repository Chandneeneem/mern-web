
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';

import { signupUser } from '../../services/authService';
import { signupSchema } from '../../utils/validations/auth.validation';

interface SignupValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Signup = () => {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const handleSignup = async (values: SignupValues) => {
        try {
            setServerError('');

            await signupUser({
                name: values.name.trim(),
                email: values.email.trim(),
                password: values.password
            });

            navigate('/login', {
                replace: true,
                state: {
                    message: 'Registration successful. Please login.'
                }
            });
        } catch (error) {
            setServerError(
                axios.isAxiosError(error)
                    ? error.response?.data?.message || 'Signup failed'
                    : 'Something went wrong'
            );
        }
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="row min-vh-100 justify-content-center align-items-center">
                    <div className="col-md-7 col-lg-5">
                        <div className="card border-0 shadow auth-card">
                            <div className="card-body p-4 p-md-5">
                                <h2 className="text-center fw-bold mb-2">
                                    Create Account
                                </h2>

                                <p className="text-center text-muted mb-4">
                                    Register to get started
                                </p>

                                {serverError && (
                                    <div className="alert alert-danger">
                                        {serverError}
                                    </div>
                                )}

                                <Formik
                                    initialValues={{
                                        name: '',
                                        email: '',
                                        password: '',
                                        confirmPassword: ''
                                    }}
                                    validationSchema={signupSchema}
                                    onSubmit={handleSignup}
                                >
                                    {({ isSubmitting }) => (
                                        <Form>
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Full Name
                                                </label>

                                                <Field
                                                    name="name"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter name"
                                                />

                                                <ErrorMessage
                                                    name="name"
                                                    component="div"
                                                    className="text-danger small mt-1"
                                                />
                                            </div>

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

                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Confirm Password
                                                </label>

                                                <Field
                                                    name="confirmPassword"
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Confirm password"
                                                />

                                                <ErrorMessage
                                                    name="confirmPassword"
                                                    component="div"
                                                    className="text-danger small mt-1"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Please wait...' : 'Sign Up'}
                                            </button>
                                        </Form>
                                    )}
                                </Formik>

                                <p className="text-center mt-4 mb-0">
                                    Already have an account?{' '}
                                    <Link to="/login">Login</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
