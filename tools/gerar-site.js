const fs=require('node:fs'),path=require('node:path');
const ORIGIN='https://o-contraponto.brasilis.workers.dev';
const articles=JSON.parse(fs.readFileSync('articles.json','utf8'));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const safeUrl=u=>/^https:\/\/[^\s]+$/i.test(String(u))?String(u):'';
const slug=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,110);
const fmt=d=>new Date(d).toLocaleDateString('pt-BR',{timeZone:'America/Fortaleza'});
const permalink=a=>'/materias/'+slug(a.id||a.title)+'/';
const xml=s=>esc(s);
const jsonSafe=v=>JSON.stringify(v).replace(/</g,'\\u003c');
const escapeAttr=esc;
if(!Array.isArray(articles))throw Error('articles.json não é lista');
const seen=new Set();
for(const a of articles){
 if(!a.id||!a.title||!a.content||!a.publishedAt||!a.author||!safeUrl(a.sourceUrl)||!safeUrl(a.imageUrl))throw Error('Metadados obrigatórios ausentes '+a.id);
 const p=permalink(a);if(seen.has(p))throw Error('URL duplicada '+p);seen.add(p);
}
function meta(a,url){
 const title=a.title+' | O Contraponto',desc=a.subtitle||a.title,image=safeUrl(a.imageUrl);
 return '<title>'+esc(title)+'</title><meta name="description" content="'+escapeAttr(desc)+'"><link rel="canonical" href="'+url+'"><meta property="og:type" content="article"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="O Contraponto"><meta property="og:title" content="'+escapeAttr(a.title)+'"><meta property="og:description" content="'+escapeAttr(desc)+'"><meta property="og:url" content="'+url+'"><meta property="og:image" content="'+escapeAttr(image)+'"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="'+escapeAttr(a.title)+'"><meta name="twitter:description" content="'+escapeAttr(desc)+'"><meta name="twitter:image" content="'+escapeAttr(image)+'">';
}
const stylesheet='<link rel="stylesheet" href="/style.css">';
const articleBody=a.content.split(/\n\s*\n/).filter(Boolean).map(p=>'<p>'+esc(p)+'</p>').join('\n');
for(const a of articles){
 const url=ORIGIN+permalink(a),dir=path.join('materias',slug(a.id||a.title));fs.mkdirSync(dir,{recursive:true});
 const ld={'@context':'https://schema.org','@type':a.type==='Notícia'?'NewsArticle':'Article',headline:a.title,description:a.subtitle,datePublished:a.publishedAt,dateModified:a.updatedAt||a.publishedAt,inLanguage:'pt-BR',image:[a.imageUrl],author:{'@type':'Person',name:a.author},publisher:{'@type':'Organization',name:'O Contraponto',url:ORIGIN},mainEntityOfPage:{'@type':'WebPage','@id':url}};
 const sources=[{label:a.sourceLabel||'Fonte oficial',url:a.sourceUrl},...(Array.isArray(a.sources)?a.sources:[])].filter(s=>safeUrl(s.url));
 const references=sources.map(s=>'<li><a href="'+escapeAttr(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.label)+'</a></li>').join('');
 const html='<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+meta(a,url)+stylesheet+'<script type="application/ld+json">'+jsonSafe(ld)+'</script></head><body><div class="topline">O CONTRAPONTO · '+esc(a.category)+'</div><header class="wrap navbar"><a class="logo" href="/">O CONTRAPONTO<small>INDEPENDÊNCIA PARA PENSAR</small></a><nav><a href="/#publicacoes">Publicações</a><a href="/#autores">Autores</a></nav></header><main class="wrap article-page"><p class="eyebrow">'+esc(a.category)+' · '+esc(a.type||'Análise')+'</p><h1>'+esc(a.title)+'</h1><p class="article-deck">'+esc(a.subtitle)+'</p><p class="article-byline">'+esc(a.author)+' · <time datetime="'+esc(a.publishedAt)+'">'+esc(fmt(a.publishedAt))+'</time></p><figure><img src="'+escapeAttr(a.imageUrl)+'" alt="'+esc(a.imageAlt||a.title)+'" width="1200" height="675"><figcaption>'+esc(a.imageCredit||'Imagem ilustrativa')+(safeUrl(a.imageCreditUrl)?' · <a href="'+escapeAttr(a.imageCreditUrl)+'">Crédito</a>':'')+(safeUrl(a.imageLicenseUrl)?' · <a href="'+escapeAttr(a.imageLicenseUrl)+'">Licença</a>':'')+'</figcaption></figure><article class="article-content">'+articleBody+'</article><aside class="references"><h2>Documentos e referências</h2><ul>'+references+'</ul></aside><a class="cta" href="/">← Voltar às matérias</a></main><footer><div class="wrap foot">O CONTRAPONTO · Documentos primeiro. Argumentos depois.</div></footer></body></html>';
 fs.writeFileSync(path.join(dir,'index.html'),html);
}
let home=fs.readFileSync('index.html','utf8');
const cards=articles.slice().sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).map(a=>'<a class="story" href="'+permalink(a)+'"><small>'+esc(a.category)+' · '+esc(a.type||'Análise')+'</small><img class="cover" src="'+escapeAttr(a.imageUrl)+'" alt="'+esc(a.imageAlt||'Ilustração')+'" loading="lazy"><h3>'+esc(a.title)+'</h3><p>'+esc(a.subtitle)+'</p><div class="byline">'+esc(a.author)+' · '+esc(fmt(a.publishedAt))+'</div></a>').join('');
const start='<!-- ARTICLES_START -->',end='<!-- ARTICLES_END -->';
if(!home.includes(start)||!home.includes(end))throw Error('Marcadores de publicação ausentes na home');
home=home.slice(0,home.indexOf(start)+start.length)+'\n'+cards+'\n'+home.slice(home.indexOf(end));
home=home.replace(/<div id="empty" class="empty"/,'<div id="empty" class="empty"'+(articles.length?' hidden':''));
fs.writeFileSync('index.html',home);
const updated=new Date().toISOString();
const urls=[{url:ORIGIN+'/',updated},...articles.map(a=>({url:ORIGIN+permalink(a),updated:a.updatedAt||a.publishedAt}))];
fs.writeFileSync('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(x=>'<url><loc>'+xml(x.url)+'</loc><lastmod>'+xml(x.updated)+'</lastmod></url>').join('')+'</urlset>\n');
const feedItems=articles.slice().sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,30).map(a=>'<item><title>'+xml(a.title)+'</title><link>'+xml(ORIGIN+permalink(a))+'</link><guid isPermaLink="true">'+xml(ORIGIN+permalink(a))+'</guid><pubDate>'+new Date(a.publishedAt).toUTCString()+'</pubDate><description>'+xml(a.subtitle)+'</description></item>').join('');
fs.writeFileSync('feed.xml','<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>O Contraponto</title><link>'+ORIGIN+'</link><description>Política, Justiça, Economia e Sociedade</description><language>pt-BR</language>'+feedItems+'</channel></rss>\n');
console.log('Geradas '+articles.length+' matérias, sitemap e RSS');
