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
                windSpeed
            } = nowData;

            const dt = getBeijingTime();

            console.log("obsTime:", obsTime);
            console.log("temp:", temp);
            console.log("feelsLike:", feelsLike);
            console.log("humidity:", humidity);
            console.log("windDir:", windDir);
            console.log("windScale:", windScale);
            console.log("windSpeed:", windSpeed);
            console.log("locationId:", CITY_ID);
            console.log("cityName:", "南京");
            console.log("dt:", dt);
            console.log("datagather:", env.datagather);

            const stmt1 = env.datagather.prepare(
                "INSERT INTO t_data (mp_id, data_def_id, data_value, data_time) VALUES (?, ?, ?, ?)"
            ).bind(1, 1, obsTime, dt);

            const stmt2 = env.datagather.prepare(
                "INSERT INTO t_data (mp_id, data_def_id, data_value, data_time) VALUES (?, ?, ?, ?)"
            ).bind(1, 2, temp, dt);

            const stmt3 = env.datagather.prepare(
                "INSERT INTO t_data (mp_id, data_def_id, data_value, data_time) VALUES (?, ?, ?, ?)"
            ).bind(1, 3, feelsLike, dt);

            const stmt4 = env.datagather.prepare(
                "INSERT INTO t_data (mp_id, data_def_id, data_value, data_time) VALUES (?, ?, ?, ?)"
            ).bind(1, 4, humidity, dt);

            const stmt5 = env.datagather.prepare(
                "INSERT INTO t_data (mp_id, data_def_id, data_value, data_time) VALUES (?, ?, ?, ?)"
            ).bind(1, 5, windDir, dt);

            const stmt6 = env.datagather.prepare(
                "INSERT INTO t_data (mp_id, data_def_id, data_value, data_time) VALUES (?, ?, ?, ?)"
            ).bind(1, 6, windScale, dt);

            const stmt7 = env.datagather.prepare(
                "INSERT INTO t_data (mp_id, data_def_id, data_value, data_time) VALUES (?, ?, ?, ?)"
            ).bind(1, 7, windSpeed, dt);

            const stmt8 = env.datagather.prepare(
                "INSERT INTO t_data (mp_id, data_def_id, data_value, data_time) VALUES (?, ?, ?, ?)"
            ).bind(1, 8, CITY_ID, dt);

            const stmt9 = env.datagather.prepare(
                "INSERT INTO t_data (mp_id, data_def_id, data_value, data_time) VALUES (?, ?, ?, ?)"
            ).bind(1, 9, "南京", dt);

            // 使用 batch() 方法批量执行
            const results = await env.datagather.batch([stmt1, stmt2, stmt3, stmt4, stmt5, stmt6, stmt7, stmt8, stmt9]);

            return new Response(JSON.stringify(results), {
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
    // scheduled 函数，只负责调用 fetch
    async scheduled(event, env) {
        // 创建一个请求
        const dummyRequest = new Request('https://hftq.samuri34.workers.dev/api/hftq', {
            method: 'POST'
        });

        // 直接调用 fetch
        return this.fetch(dummyRequest, env);
    }
};

// 获取东八区时间字符串
function getBeijingTime() {
    const date = new Date();

    // 转换为 UTC 时间
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);

    // 东八区的时间，单位是毫秒
    const beijingTime = new Date(utc + (3600000 * 8));

    // 提取并格式化
    const year = beijingTime.getFullYear();
    const month = (beijingTime.getMonth() + 1).toString().padStart(2, '0');
    const day = beijingTime.getDate().toString().padStart(2, '0');
    const hours = beijingTime.getHours().toString().padStart(2, '0');
    const minutes = beijingTime.getMinutes().toString().padStart(2, '0');
    const seconds = beijingTime.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
