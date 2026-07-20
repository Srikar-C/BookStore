import axios from "axios";

export default async function useFetch(httpRequest, port, requestmapping, endpoint, payload, withCredentials) {
    try {
        const response = await axios({
            method: httpRequest,
            url: endpoint
                ? `${port}/${requestmapping}/${endpoint}`
                : `${port}/${requestmapping}`,
            data: payload,
            withCredentials: withCredentials
        });
        console.log(`Response got from backend in endpoint ${endpoint}: `, response);
        const result = response.data;
        console.log(`Response send to frontend in endpoint ${endpoint}: `, result);
        return response;
    }
    catch (error) {
        console.log(`Response send to frontend in endpoint ${endpoint}: `, error.response.data);
        return error.response;
    }
}