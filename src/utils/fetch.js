const URL = import.meta.env.VITE_API_URL;

export default function makeFetch(token, method, route, body) {
    try {
        let options = {
            method: method,
            headers: getHeaders(token)
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        return fetch(`${URL}${route}`, options);
    } catch (error) {
        console.error(error)
    }
}

function getHeaders(token) {
    return {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`
    };
}