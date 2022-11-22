import {useState, useCallback, useEffect} from 'react';

const storageName = 'tu_userData';

export const useAuth = () => {
    const [authData, setAuthData] = useState({});

    const login = useCallback((userData) => {
        setAuthData(userData);
        sessionStorage.setItem(storageName, JSON.stringify(userData));
    }, []);

    const logout = useCallback(() => {
        setAuthData({});
        sessionStorage.removeItem(storageName);
    }, []);

    useEffect(() => {
        if (authData.userId && authData.token) {
            login(authData);
        } else if (sessionStorage.getItem('tu_userData')) {
            login(JSON.parse(sessionStorage.getItem('tu_userData')));
        }
        // eslint-disable-next-line
    }, [login]);

    return { login, logout, authData};
}