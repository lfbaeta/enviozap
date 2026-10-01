Continue este repositório EnvioZap, mantendo a interface e funcionalidades existentes. Não reutilize o visual de outro projeto. Execute npm start ou npm run dev no Node.js 22+.

A fonte da interface é worker/page.html; a API Gemini está em worker/api.js. npm start gera worker/index.js automaticamente e inicia server.mjs. Não edite apenas worker/index.js, pois é gerado.

O foco é apresentar a Delivale.com: cinco mensagens prontas e editáveis, oferta O que você quer oferecer?, IA e chave em Configurações. A tela inicial deve permanecer simples. A IA usa a oferta como fonte principal dos fatos. Não invente preço, benefício ou cobertura de entregas.

A aba Envios registra empresa, telefone, data e mensagem quando a conversa é aberta e permite confirmar o envio manualmente. Não afirme que o WhatsApp confirmou automaticamente o envio. O histórico usa armazenamento local do navegador.

A chave Gemini é fornecida no campo oculto, enviada ao backend por HTTPS em produção no cabeçalho X-Gemini-Key e nunca salva no localStorage, histórico, logs ou GitHub. Sem chave, os modelos prontos e links continuam funcionando.

Não incluir fila, Evolution API ou envios automáticos sem nova solicitação. Preserve o fluxo de links com telefone e mensagem completos.

A versão foi testada com Gemini simulado; teste com a chave real fornecida pelo usuário antes de afirmar que a API está ativa. Futuras alterações neste GitHub não são publicadas automaticamente no Site original.
