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
