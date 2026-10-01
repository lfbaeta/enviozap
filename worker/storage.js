function database(env){if(!env.DB)throw new Error('DB_UNAVAILABLE');return env.DB}
function statement(env,sql,...values){return database(env).prepare(sql).bind(...values)}
async function savedSettings(env){return statement(env,'SELECT config_json,key_cipher FROM settings WHERE id = ?',1).first()}
async function encryptionKey(env){if(!env.SETTINGS_ENCRYPTION_KEY)throw new Error('KEY_CONFIG_UNAVAILABLE');return crypto.subtle.importKey('raw',Uint8Array.from(env.SETTINGS_ENCRYPTION_KEY.match(/.{2}/g).map(v=>parseInt(v,16))),{name:'AES-GCM'},false,['encrypt','decrypt'])}
function base64(bytes){return btoa(String.fromCharCode(...new Uint8Array(bytes)))}
function fromBase64(s){return Uint8Array.from(atob(s),c=>c.charCodeAt(0))}
async function encryptSecret(secret,env){const iv=crypto.getRandomValues(new Uint8Array(12));const data=await crypto.subtle.encrypt({name:'AES-GCM',iv},await encryptionKey(env),new TextEncoder().encode(secret));return base64(iv)+'.'+base64(data)}
async function decryptSecret(cipher,env){const [iv,data]=cipher.split('.');return new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:fromBase64(iv)},await encryptionKey(env),fromBase64(data)))}
async function configuredApiKey(env){const row=await savedSettings(env);return row?.key_cipher?decryptSecret(row.key_cipher,env):env.GEMINI_API_KEY||''}
const TEMPLATE_KEYS=['initial','presentation','promotion','followup','trial'];
function validConfig(config){return config&&typeof config.offer==='string'&&config.offer.trim()&&config.offer.length<=4000&&typeof config.tone==='string'&&config.tone.length<=100&&typeof config.length==='string'&&config.length.length<=50&&typeof config.emojis==='boolean'&&TEMPLATE_KEYS.every(k=>typeof config.templates?.[k]==='string'&&config.templates[k].length<=10000)}
async function requestData(request,max=75000){const raw=await request.text();if(raw.length>max)throw new Error('INPUT_TOO_LARGE');return JSON.parse(raw)}
async function handleStorage(request,env,url){
 if(!['/api/settings','/api/history'].includes(url.pathname)&&!url.pathname.startsWith('/api/history/'))return null;
 if(request.method!=='GET'&&request.headers.get('Origin')!==url.origin)return json({error:'Origem não autorizada.'},403);
 try{
  if(url.pathname==='/api/settings'){
   if(request.method==='GET'){const row=await savedSettings(env);return json({config:row?JSON.parse(row.config_json):null,hasApiKey:!!(row?.key_cipher||env.GEMINI_API_KEY)})}
   if(request.method!=='PUT')return json({error:'Método não permitido.'},405);
   const data=await requestData(request);if(!validConfig(data.config))return json({error:'Confira a oferta, opções e os cinco modelos de mensagem.'},400);
   const row=await savedSettings(env);if(data.initializeOnly&&row)return json({config:JSON.parse(row.config_json),hasApiKey:!!(row.key_cipher||env.GEMINI_API_KEY)});
   let cipher=row?.key_cipher||null;if(data.removeApiKey===true)cipher=null;else if(data.apiKey){const key=normalizeApiKey(data.apiKey);if(!key||key.length>512)return json({error:'Confira a chave Gemini inserida.'},400);cipher=await encryptSecret(key,env)}
   const operation=data.initializeOnly?'INSERT OR IGNORE INTO settings (id,config_json,key_cipher,updated_at) VALUES (?,?,?,?)':'INSERT INTO settings (id,config_json,key_cipher,updated_at) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET config_json=excluded.config_json,key_cipher=excluded.key_cipher,updated_at=excluded.updated_at';
   await statement(env,operation,1,JSON.stringify(data.config),cipher,new Date().toISOString()).run();const updated=await savedSettings(env);return json({config:JSON.parse(updated.config_json),hasApiKey:!!(updated.key_cipher||env.GEMINI_API_KEY)})
  }
  if(url.pathname==='/api/history'&&request.method==='GET'){const result=await statement(env,'SELECT id,company,phone,message,type,opened_at AS date,status,confirmed_at AS confirmedAt FROM sends ORDER BY opened_at DESC').all();return json({entries:result.results||[]})}
  if(url.pathname==='/api/history'&&request.method==='POST'){const data=await requestData(request,20000);if(!data||typeof data.id!=='string'||!data.id||data.id.length>100||typeof data.company!=='string'||!data.company.trim()||data.company.length>150||typeof data.phone!=='string'||!/^\d{10,15}$/.test(data.phone)||typeof data.message!=='string'||data.message.length>10000||typeof data.type!=='string'||data.type.length>100)return json({error:'Confira os dados do envio.'},400);
   const date=typeof data.date==='string'&&!isNaN(Date.parse(data.date))?new Date(data.date).toISOString():new Date().toISOString();const status=data.imported&&data.status==='sent'?'sent':'opened';
   await statement(env,'INSERT OR IGNORE INTO sends (id,company,phone,message,type,opened_at,status,confirmed_at) VALUES (?,?,?,?,?,?,?,?)',data.id,data.company,data.phone,data.message,data.type,date,status,status==='sent'?date:null).run();return json({success:true})
  }
  if(url.pathname.startsWith('/api/history/')&&request.method==='PATCH'){const id=decodeURIComponent(url.pathname.slice('/api/history/'.length));const result=await statement(env,'UPDATE sends SET status = ?,confirmed_at = ? WHERE id = ?','sent',new Date().toISOString(),id).run();return result.meta?.changes?json({success:true}):json({error:'Registro não encontrado.'},404)}
  return json({error:'Método não permitido.'},405)
 }catch(error){return json({error:error.message==='INPUT_TOO_LARGE'?'Reduza o tamanho das informações.':'O banco de dados está indisponível. Seus campos foram preservados; tente novamente.'},503)}
}
