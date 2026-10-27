# O Contraponto

Portal editorial estático, hospedável gratuitamente no Cloudflare Pages.

## Publicação na Cloudflare

1. Acesse https://dash.cloudflare.com/ e entre em Workers & Pages → Create application → Pages → Connect to Git.
2. Conecte GitHub e selecione `damtaipu/o-contraponto`.
3. Use **Production branch: main**.
4. **Framework preset: None**.
5. **Build command: exit 0**.
6. **Build output directory: .** (ponto: os arquivos estão na raiz do repositório).
7. Clique em Save and Deploy. A Cloudflare fornecerá um endereço `*.pages.dev`.

Após conectar o repositório, novos commits na main gerarão novas publicações automaticamente.

## Conteúdo

O site lê `articles.json`. O array está inicialmente vazio, para não inventar notícias.
Após revisão humana, insira matérias com `title`, `subtitle`, `category`, `type`, `author`, `publishedAt`, `content`, `sourceUrl`, `sourceLabel`, `disclosure`.

Os autores Vasconcelos Dumont, Humberto Bascot e Augusto Valença são **pseudônimos editoriais fictícios**. As tarefas jornalísticas rodam no ChatGPT e **não estão no código deste site**. A publicação automática ChatGPT → GitHub ainda não foi integrada.

## Desenvolvimento local

Sirva a pasta com um servidor estático local (ex.: `python -m http.server 8000`) e abra http://localhost:8000.

## Segurança e processo editorial

Revise fatos, documentos e links antes de publicar. Não adicione tokens ou credenciais ao repositório público.


## Publicação com revisão — GitHub Issues

1. Abra **Issues → New issue → Nova matéria**.
2. Preencha o formulário de título, subtítulo, categoria, autor, tipo, fonte HTTPS e conteúdo.
3. Revise os documentos oficiais e o texto. Não confie em conteúdo não verificado.
4. Crie o rótulo `publicar` em **Issues → Labels → New label** caso ainda não exista.
5. Um mantenedor do repositório aplica `publicar` à issue aprovada.
6. O GitHub Actions executa o script `tools/publicar-materia.js`, acrescenta o artigo a `articles.json` e faz commit na branch main.
7. Com Git integration habilitada na Cloudflare, a alteração em main inicia uma nova implantação.

**Importante:** o rótulo é a aprovação editorial; não o adicione antes da revisão. Cada issue é publicada no máximo uma vez por ID. O site estático apresenta as matérias em cartões e leitura em modal.

### Testes

Execute `node tests/publicar.test.js`. O GitHub Actions também executa automaticamente em alterações do processador e dos workflows. Os testes validam criação de matéria, idempotência e rejeição de URLs sem HTTPS.

O processamento foi validado automaticamente; a execução real por uma issue rotulada e a implantação resultante na Cloudflare ainda exigem uma verificação ponta a ponta.
