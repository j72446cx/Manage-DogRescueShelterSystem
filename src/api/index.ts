import request from '../utils/request';


export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};

export const fetchDogData = () => {
    return request({
        url: '/api/dogpage',
        method: 'get'
    })
}
