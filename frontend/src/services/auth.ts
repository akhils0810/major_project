export interface Token {
    access_token: string;
    token_type: string;
}

export const setToken = (token: string) => {
    localStorage.setItem('access_token', token);
};

export const getToken = () => {
    return localStorage.getItem('access_token');
};

export const removeToken = () => {
    localStorage.removeItem('access_token');
};

export const isAuthenticated = () => {
    return !!getToken();
};
