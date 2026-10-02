# EnvioZap — Central de Convites Delivale

Continue este repositório mantendo tudo que já funciona e implemente os recursos abaixo de forma modular. Não redesenhe nem remova a tela atual de preparação de mensagens, IA, modelos, chave Gemini ou histórico. A fonte da interface é `worker/page.html`; API em `worker/api.js`; persistência em D1/Drizzle. `worker/index.js` é gerado: não edite somente esse arquivo.

## Objetivo
Transformar o EnvioZap em uma Central de Convites da Delivale, inspirada na lógica de Conexão/Instâncias/Agenda/Fila do Agenda Confirmada.

Menu principal:
Dashboard | Agenda | A Enviar | Enviados | Interessados | Instâncias | Configurações

## Agenda e importação
Adicionar importação de contatos com campo obrigatório CIDADE antes de escolher o arquivo. Todos os registros importados naquele arquivo recebem a cidade informada, mesmo sem coluna Cidade na planilha. Persistir cidade no banco.

Contato: id, estabelecimento, responsável opcional, WhatsApp, cidade, observação, status, data de cadastro/importação, último envio, instância usada e interessado.

Permitir editar estabelecimento, responsável, WhatsApp, cidade e observações.

Filtros: cidade dinâmica, não enviados, na fila, enviados, interessados e não interessados. Busca por estabelecimento, WhatsApp ou cidade.

Na Agenda criar campo "Quantidade de estabelecimentos para enviar" e botão "Adicionar à fila de envio". A quantidade deve respeitar todos os filtros ativos.

## Fluxo
AGENDA -> A ENVIAR -> ENVIADOS.

O contato só sai de A Enviar após confirmação real de sucesso pelo mecanismo de envio. Em erro, manter/rastrear como ERROR e permitir nova tentativa.

Antes de adicionar/enviar verificar WhatsApp, fila atual e histórico. Não duplicar automaticamente. Se já enviado anteriormente, avisar e exigir confirmação manual para novo envio.

Lista A Enviar: estabelecimento, WhatsApp, cidade, posição, status, instância, horário aproximado e ações. Permitir retirar da fila antes do envio.

Enviados: estabelecimento, WhatsApp, cidade, data/hora, instância, mensagem efetivamente usada, status e interesse.

Criar "↩ Voltar para Agenda". Isso muda o estado do contato, mas NUNCA apaga histórico. Se for reenviado, alertar que já possui envio anterior.

## Interessado
Em Enviados, criar ícone/botão "⭐ Interessado". Ao clicar, persistir `interessado=true`, status Interessado e destacar TODA a linha em verde-claro discreto. O destaque deve continuar após recarregar e em qualquer máquina. Clicar novamente pode remover a marcação.

Criar também aba Interessados.

## Cards do Dashboard
Mostrar contadores persistentes e atualizados:
- Agenda
- A enviar
- Enviados
- Interessados
- Erros

## Instâncias / conexão WhatsApp
Criar seção Instâncias preparada para a integração de WhatsApp usada no projeto/ambiente. Cada instância: nome, status conectada/desconectada, indicador, conectar, desconectar, atualizar status, QR Code quando aplicável, última verificação e configurações individuais.

Permitir várias instâncias e revezamento. Antes de usar uma instância, validar conexão. Se desconectada, pular para outra disponível sem perder o item da fila.

Não invente endpoints/credenciais. Se a integração Evolution/API ainda não estiver configurada neste repositório, implemente a camada de configuração e o adaptador de forma segura, deixando URL/token/instância configuráveis no servidor/banco e sem expor segredos no frontend.

## Regras de envio
Persistir:
- tempo mínimo entre mensagens
- tempo máximo entre mensagens
- quantidade de mensagens antes do descanso
- tempo de descanso da instância (minutos/horas)
- quantidade antes de trocar de instância

O intervalo entre envios deve ser sorteado entre mínimo e máximo configurados.

Exemplo: mínimo 60s, máximo 180s, ciclo 10, descanso 20 min. Após 10 sucessos, a instância descansa 20 min e depois volta à rotação.

Mostrar "Instância em descanso" e contador aproximado de retorno.

Revezamento exemplo: Instância 01 envia N -> Instância 02 envia N -> Instância 03 envia N -> volta à 01, respeitando descanso/conexão.

## Controle da fila
Botões:
▶ Iniciar envios
⏸ Pausar
▶ Continuar
⏹ Parar

Pausar não apaga a fila. Continuar retoma do ponto persistido. Parar pede confirmação.

Estados mínimos:
QUEUED, PROCESSING, SENT, ERROR, PAUSED/CANCELLED quando aplicável.

Impedir dois workers de processarem o mesmo contato. Fazer claim/transação/lock atômico no banco antes do envio.

## Processamento em background
A fila NÃO pode depender da página aberta. Fechar/minimizar/trocar de tela/atualizar navegador não pode apagar nem ser o motor da fila.

O processamento deve ficar no backend/worker/infra compatível com o ambiente de implantação. Ao voltar, a interface consulta o banco e mostra o estado real: aguardando, enviando, descanso, pausado, concluído ou erro.

Não simular background com setInterval no navegador.

## Histórico
Preservar histórico de eventos do contato:
- importado
- editado
- adicionado à fila
- processamento iniciado
- mensagem enviada
- erro/tentativa
- instância usada
- marcado/desmarcado como interessado
- voltou para Agenda

Nunca apagar histórico automaticamente.

## Banco
Continuar usando o banco compartilhado existente, não localStorage. Criar migrações Drizzle/D1 para as entidades necessárias, sem destruir tabelas atuais. Preservar `settings` e `sends` e dados existentes.

Adicionar de forma compatível tabelas/colunas para contatos, importações/cidades, instâncias, fila/jobs, histórico/eventos e configurações de envio.

Segredos de Gemini e WhatsApp/API ficam somente no backend/banco de forma segura. Nunca retornar tokens ao frontend.

## Compatibilidade
O fluxo atual de mensagem individual deve continuar funcionando. Não quebrar os cinco modelos Delivale, Gemini, configuração de oferta, histórico existente ou compartilhamento entre máquinas.

A Delivale é marketplace da cidade e portal de pedidos; não descrevê-la como empresa de entrega regional.

## Implementação
Faça por etapas e teste cada etapa:
1. migração do banco
2. CRUD/importação/edição da Agenda e filtros
3. fila A Enviar e movimentações
4. Enviados/Interessados/histórico
5. configurações de tempo e instâncias
6. adaptador de conexão WhatsApp
7. worker/backend persistente da fila
8. dashboard e estados
9. testes de duplicidade, pausa/retomada, lock, descanso, revezamento e falhas

Não apenas desenhe telas: botões e estados devem funcionar e persistir. Não apague nem substitua funcionalidades existentes para simplificar a implementação.
