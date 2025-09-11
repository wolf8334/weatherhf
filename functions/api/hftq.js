export default {
    // fetch 函数接收 request 和 env 参数
    async fetch(request, env) {

        const API_HOST = env.HFTQ_API_HOST;
        const API_KEY = env.HFTQ_API_KEY;
        const CITY_ID = '101190101'; // 示例城市ID
        const API_URL = `${API_HOST}/v7/weather/now?key=28bcc385aa4d4f1ab90b2d3963039d37&location=${CITY_ID}`;

        try {
            // 1. 发起网络请求
            const response = await fetch(API_URL);

            // 2. 检查响应是否成功
            if (!response.ok) {
                console.log(`Failed to fetch data from ${API_URL}. Status: ${response.status}`);
                return new Response(`Failed to fetch data. Status: ${response.status}`, { status: response.status });
            }

            // 3. 解析 JSON 数据
            const data = await response.json();

            // 4. 将解析后的数据转换回 JSON 字符串并返回

            console.log(data);

            
            // return new Response(JSON.stringify(data), {
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            // });

        } catch (error) {
            // 5. 捕获并处理任何错误
            console.error(error);
            return new Response(`An error occurred: ${error.message}`, { status: 500 });
        }
    },
};
