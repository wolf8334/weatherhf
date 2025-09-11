export default {
    // fetch 函数接收 request 和 env 参数
    async fetch(request, env) {

        const API_HOST = env.HFTQ_API_HOST;
        const API_KEY = env.HFTQ_API_KEY;
        const CITY_ID = '101190101'; // 示例城市ID
        const API_URL = `${API_HOST}/v7/weather/now?key=${API_KEY}&location=${CITY_ID}`;

        const HFTQURL = await env.HFTQURL.get();
        console.log(`Fetching HFTQURL from ${HFTQURL}`);
        try {
            console.log('完整的 env 对象: ', JSON.stringify(env));
            console.log('API_HOST: ', API_HOST);
            console.log('API_KEY: ', API_KEY);

            // 1. 发起网络请求
            const response = await fetch(API_URL);

            // 2. 检查响应是否成功
            if (!response.ok) {
                console.log(`Failed to fetch data from ${API_URL}. Status: ${response.status}`);
                return new Response(`Failed to fetch data. Status: ${response.status}`, { status: response.status });
            }

            // 3. 解析 JSON 数据
            const data = await response.json();

            // 4. 解析JSON并存库
            const nowData = data.now;

            // 观测时间 obsTime 1、温度 temp 2、体感温度 feelsLike 3、湿度 humidity 4、风向 windDir 5、风力 windScale 6
            // 风速 windSpeed 7、城市编码 locationId 8 城市名称 cityName 9
            const {
                obsTime,
                temp,
                feelsLike,
                humidity,
                windDir,
                windScale,
                windSpeed,
                locationId,
                cityName
            } = nowData;
            console.log(`obsTime ${obsTime}`);
            console.log(`temp: ${temp}`);
            return new Response(JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

        } catch (error) {
            // 5. 捕获并处理任何错误
            console.error(error);
            return new Response(`An error occurred: ${error.message},${JSON.stringify(env)}`, { status: 500 });
        }
    },
};
