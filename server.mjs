import { createServer } from 'node:http';
import worker from './worker/index.js';
const server=createServer(async(req,res)=>{
 try{
  const host=req.headers.host||'localhost';let origin='http://'+host;
  if(req.headers.origin&&new URL(req.headers.origin).host===host)origin=req.headers.origin;
  const headers=new Headers();for(const [key,value]of Object.entries(req.headers))if(value)headers.set(key,Array.isArray(value)?value.join(','):value);
  let body='';for await(const chunk of req){body+=chunk.toString();if(body.length>75000){res.writeHead(413,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Reduza o tamanho das informações.'}));return}}
  const request=new Request(new URL(req.url,origin),{method:req.method,headers,...(['GET','HEAD'].includes(req.method)?{}:{body})});
  let response;
  if(new URL(request.url).pathname.startsWith('/api/')){
   const backend=process.env.SITE_BACKEND_URL||'https://mensagem-whatsapp-editavel.lfbaeta132673.chatgpt.site';const target=new URL(req.url,backend);const proxyHeaders=new Headers({'Content-Type':'application/json','Origin':new URL(backend).origin});if(headers.has('X-Gemini-Key'))proxyHeaders.set('X-Gemini-Key',headers.get('X-Gemini-Key'));
   response=await fetch(target,{method:req.method,headers:proxyHeaders,...(['GET','HEAD'].includes(req.method)?{}:{body}),signal:AbortSignal.timeout(45000)});
  }else response=await worker.fetch(request,process.env,{});
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Não foi possível processar a solicitação.'}))}
});
server.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('EnvioZap iniciado na porta '+(process.env.PORT||3000)));
