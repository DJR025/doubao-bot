export default async (req) => {
if(req.method!=='POST')return new Response('Method Not Allowed', { status: 405 });

// 取环境变量
const apiKey=Netlify.env.get('ARK_API_KEY');// 在 Netlify 控制台填
const modelId=Netlify.env.get('ARK_MODEL_ID');// ep-2024xxxxxxxx

if (!apiKey || !modelId) {
    return new Response(JSON.stringify({ error: 'Missing ARK_API_KEY or ARK_MODEL_ID' }), { status: 500 });
}

const{user}=await req.json();

const payload = {
    model:modelId,
    messages:[
        {role:'system',content:'你是人工智能助手.'},
        {role:'user',content:user}
    ],
    temperature:0.7,
    stream: false
    };
const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions ', {
method: 'POST',
headers: {
'Authorization': `Bearer ${apiKey}`,
'Content-Type': 'application/json'
},
body: JSON.stringify(payload)
});

if(!response.ok){
const err = await response.text();
return new Response(JSON.stringify({error:err}),{status:500});
}

const data=await response.json();
const reply = data.choices?.[0]?.message?.content ?? '无返回内容';
console.log('=== reply ===>',reply);
 // 添加 CORS 头部配置
return new Response(JSON.stringify({ reply }), {
    status: 200,
    headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
    }
});
};
