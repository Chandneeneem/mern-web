
import * as Yup from 'yup';

export const loginSchema = Yup.object({
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Email is required'),

    password: Yup.string()
        .required('Password is required')
});

export const signupSchema = Yup.object({
    name: Yup.string()
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .required('Name is required'),

    email: Yup.string()
        .email('Please enter a valid email')
        .required('Email is required'),

    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),

    confirmPassword: Yup.string()
        .oneOf(
            [Yup.ref('password')],
            'Passwords do not match'
        )
        .required('Confirm password is required')
});
