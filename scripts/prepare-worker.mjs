import { readFileSync,writeFileSync } from 'node:fs';
const page=readFileSync('worker/page.html','utf8'),icon=readFileSync('worker/favicon.svg','utf8'),api=readFileSync('worker/bot.js','utf8')+'\n'+readFileSync('worker/storage.js','utf8')+'\n'+readFileSync('worker/api.js','utf8');
writeFileSync('worker/index.js','const page='+JSON.stringify(page)+';\nconst icon='+JSON.stringify(icon)+';\n'+api);
