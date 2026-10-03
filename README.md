# EnvioZap — Delivale.com

Mesmo código usado no Site Mensagem para WhatsApp e neste repositório, para continuidade no Google AI Studio.

## Executar
Node.js 22.13 ou superior. Execute npm install para as ferramentas de migração. O servidor usa apenas APIs nativas. Execute `npm start` e abra http://localhost:3000. No AI Studio, use `npm run dev` se o ambiente pedir um comando de desenvolvimento.

## Arquivos principais
- `worker/page.html`: interface Início, Envios e Configurações.
- `worker/api.js`: integração Gemini no servidor.
- `server.mjs`: adaptação para Node.js e AI Studio.
- `scripts/prepare-worker.mjs`: reúne a página, ícone e API em `worker/index.js`.
- `worker/index.js`: arquivo gerado; edite os arquivos acima e execute npm start ou npm run build para atualizar.

## Recursos
Cinco modelos da Delivale: inicial, apresentação, promoção, retorno e convite para teste. Modelos e oferta editáveis em Configurações. A IA usa O que você quer oferecer? como fonte principal. Telefone com DDD, prévia, geração e cópia de link e abertura de conversa no WhatsApp.

## Configurações e banco
O Site usa D1 (binding DB), com schema em db/schema.ts e migrações Drizzle em drizzle/. Configurações, oferta, modelos e envios são persistidos no servidor. A chave Gemini é criptografada com AES-GCM; SETTINGS_ENCRYPTION_KEY fica como segredo de produção, nunca no GitHub. A interface só informa se existe uma chave, sem devolvê-la.

Em Configurações, o botão Salvar chave API guarda somente a chave no banco, sem alterar as opções ou modelos. Salvar configurações guarda as opções e também aceita a chave preenchida. Campo de chave vazio mantém a anterior; Remover chave salva marca a exclusão para a próxima gravação.

## Mesmo banco no AI Studio
server.mjs encaminha as rotas /api ao Site definido por SITE_BACKEND_URL. O padrão aponta ao Site EnvioZap já publicado, portanto AI Studio e Site usam o mesmo banco, sem login. O servidor Node não cria um segundo banco local. Não copie SETTINGS_ENCRYPTION_KEY para o AI Studio: somente o Site precisa desse segredo.

## Histórico
Envios guarda empresa, telefone, data, tipo, mensagem e status no banco compartilhado. Abrir o WhatsApp registra Conversa aberta; o usuário confirma Enviado depois de enviar manualmente. Registros antigos do navegador são importados ao abrir a nova versão, sem duplicação por ID.

Qualquer pessoa com acesso ao endereço público pode acessar as configurações e a lista compartilhadas, conforme o acesso sem login solicitado. A chave permanece no servidor.

## Continuidade
Use AI_STUDIO_PROMPT.md. A interface e a API são as mesmas do Site; o servidor Node substitui somente o runtime de hospedagem. Alterações futuras no GitHub não atualizam o Site automaticamente.

## Validação
Banco, criptografia, fluxo entre sessões e histórico verificados com SQLite e resposta Gemini simulada, sem chave real. Execute npm test (Node com node:sqlite). A chamada real depende de uma chave válida e quota disponível. O servidor apresenta erros separados de chave, permissão, API desativada, modelo e quota.

## Fila automática
Em A enviar, prepare e revise as mensagens antes de iniciar. A fila executa chamadas à Evolution API / Evolution GO, respeitando intervalos e repouso de cada instância. Mantenha o sistema aberto; pode navegar entre abas. A contagem regressiva mostra o próximo envio. Falhas pausam a fila e exigem conferência antes de repetir. Aceitação pela API é registrada como enviada, sem afirmar entrega ou leitura.

O histórico preserva o texto exato e o vínculo com o cadastro, cidade, responsável, observações e instância. Após sucesso, a empresa sai da Agenda ativa e de A enviar; seu cadastro continua no banco. Editar abre formulário completo na página (empresa, WhatsApp, cidade, responsável e observações).

Todas as rotas /api no Node são encaminhadas ao mesmo backend SITE_BACKEND_URL. O backend também precisa executar a versão atual do worker; sincronizar somente o frontend no AI Studio não atualiza o backend publicado.

## Atendimento automático da IA
As cinco mensagens e os textos de orientação são preenchidos e salvos automaticamente no banco quando faltarem. Textos personalizados existentes são preservados. Tempo padrão: 5 segundos, ou intervalo aleatório configurável de 0 a 10 segundos; a geração pode acrescentar tempo. A opção digitando usa o endpoint de presença de cada provedor.

A IA responde a novos textos de conversas privadas recebidos via webhook autenticado por instância, usando a oferta, as instruções e o histórico recente. Eventos próprios, grupos, sincronizações antigas e mensagens duplicadas são ignorados. Entradas e respostas ficam salvas no servidor e as respostas aparecem em Enviados. É possível desligar globalmente em Mensagens ou pausar por contato em Enviados. Pedidos explícitos de parar mensagens pausam o contato.

Cadastre a instância e use Ativar atendimento. Na Evolution API, o sistema configura /webhook/set/{instância}; na Evolution GO, /instance/connect com webhookUrl e subscribe MESSAGE. O webhook funciona no servidor mesmo com a página fechada, usando waitUntil. Falhas ficam visíveis em Mensagens; não há reenvio automático após um erro de resultado incerto. É necessária uma chave Gemini válida, com quota, e uma instância conectada.
