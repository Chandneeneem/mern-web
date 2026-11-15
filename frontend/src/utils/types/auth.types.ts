
export interface IUser {
    _id: string;
    name: string;
    email: string;
}

export interface ILoginPayload {
    email: string;
    password: string;
}

export interface ISignupPayload {
    name: string;
    email: string;
    password: string;
}

export interface IAuthResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: IUser;
}
