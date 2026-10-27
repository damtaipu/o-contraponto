const t=document.getElementById('today');if(t)t.textContent=new Intl.DateTimeFormat('pt-BR',{dateStyle:'long',timeZone:'America/Fortaleza'}).format(new Date());
