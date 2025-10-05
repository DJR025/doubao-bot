export default async (req) => {
if(req.method!=='POST')return new Response('Method Not Allowed', { status: 405 });

// 取环境变量
const apiKey=Netlify.env.get('ab8cab6f-7e31-47ef-bbdd-e335bf3cee7e');// 在 Netlify 控制台填
const epId=Netlify.env.get('ep-20251005161732-89dgd');// ep-2024xxxxxxxx

const{user}=await req.json();

const payload = {
    model: epId,
    messages:[
        {role:'system',content:'你是星际理工大学的招生助手，回答简洁友好，字数不超过150字。'},
        {role:'user',content:user}
    ],
    temperature:0.7,
    stream: false
    };

const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
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
const reply=data.choices[0].message.content;
return Response.json({reply });
};