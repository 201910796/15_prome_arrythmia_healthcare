import BASE_URL from '../config/config';
import axios from 'axios';

export const totalMap = async () => {
    try {

        const res = await axios.get(
            `${BASE_URL}/map/total`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        );

        return res.data;
    } catch (e) {
        console.error('전체 병원 조회 에러:', e);
        throw e;
    }
};

export const heartMap = async () => {
    try {

        const res = await axios.get(
            `${BASE_URL}/map/heart`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        );

        return res.data;
    } catch (e) {
        console.error('심장 병원 조회 에러:', e);
        throw e;
    }
};
