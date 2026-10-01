# EnvioZap — Delivale.com

Mesmo código usado no Site Mensagem para WhatsApp e neste repositório, para continuidade no Google AI Studio.

## Executar
Node.js 22 ou superior. Sem dependências externas. Execute `npm start` e abra http://localhost:3000. No AI Studio, use `npm run dev` se o ambiente pedir um comando de desenvolvimento.

## Arquivos principais
- `worker/page.html`: interface Início, Envios e Configurações.
- `worker/api.js`: integração Gemini no servidor.
- `server.mjs`: adaptação para Node.js e AI Studio.
- `scripts/prepare-worker.mjs`: reúne a página, ícone e API em `worker/index.js`.
- `worker/index.js`: arquivo gerado; edite os arquivos acima e execute npm start ou npm run build para atualizar.

## Recursos
Cinco modelos da Delivale: inicial, apresentação, promoção, retorno e convite para teste. Modelos e oferta editáveis em Configurações. A IA usa O que você quer oferecer? como fonte principal. Telefone com DDD, prévia, geração e cópia de link e abertura de conversa no WhatsApp.

## Chave Gemini
Insira a chave oculta em Configurações. Ela fica apenas em memória na página, nunca no histórico ou nas preferências. O site normaliza aspas, espaços invisíveis e prefixos de variável ao colar. Alternativamente configure GEMINI_API_KEY como segredo no servidor; nunca envie uma chave real ao GitHub.

## Histórico
A aba Envios guarda empresa, telefone, data, tipo e mensagem neste navegador. Abrir o WhatsApp registra Conversa aberta; o usuário confirma Enviado depois de enviar manualmente. O link não permite verificar o envio real. Dados não são sincronizados entre computadores ou entre os domínios do Site e AI Studio.

## Continuidade
Use AI_STUDIO_PROMPT.md. A interface e a API são as mesmas do Site; o servidor Node substitui somente o runtime de hospedagem. Alterações futuras no GitHub não atualizam o Site automaticamente.

## Validação
Código e fluxo verificados com resposta Gemini simulada, sem chave real. A chamada real depende de uma chave válida e quota disponível. O servidor apresenta erros separados de chave, permissão, API desativada, modelo e quota.
