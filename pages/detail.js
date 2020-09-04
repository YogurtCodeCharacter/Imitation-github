import { useEffect } from 'react';
import axios from 'axios';

const Detail = () => {
    useEffect(() => {
        axios.get('/github/repositories?since=364').then((data) => {
            console.log('github 数据返回', data);
        });
    }, []);
    return <span>Detail</span>
}
Detail.getInitialProps = () => {
     return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({});
            }, 3000)
     })
}
export default Detail;