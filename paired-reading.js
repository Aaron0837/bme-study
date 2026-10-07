// English and Chinese stay adjacent within each teaching unit.
window.pairText=function(en,zh,tag='span'){
  return `<${tag} class="reading-en" lang="en">${esc(en)}</${tag}><${tag} class="reading-zh" lang="zh-CN">${esc(zh)}</${tag}>`;
};
window.pairedLesson=function(l){
  const zh=document.createElement('template'),en=document.createElement('template');
  zh.innerHTML=l.html;en.innerHTML=l.englishHtml;
  const english=[...en.content.children],chinese=[...zh.content.children];
  if(english.length!==chinese.length)throw new Error(`Translation blocks differ: ${l.id}`);
  const wrap=(e,c)=>`<div class="reading-pair"><div class="reading-en" lang="en">${e.outerHTML}</div><div class="reading-zh" lang="zh-CN">${c.outerHTML}</div></div>`;
  return chinese.map((c,i)=>{
    const e=english[i];
    if(e.tagName!==c.tagName)throw new Error(`Translation alignment differs: ${l.id}, ${i}`);
    if(c.tagName.toLowerCase()==='svg')return c.outerHTML;
    if(c.classList.contains('terms'))return `<div class="terms">${[...c.children].map((card,j)=>{
      const other=e.children[j];return `<div class="term">${wrap(other.querySelector('h3'),card.querySelector('h3'))}${wrap(other.querySelector('p'),card.querySelector('p'))}</div>`;
    }).join('')}</div>`;
    if(c.classList.contains('flow'))return `<div class="flow paired-flow">${[...c.children].map((item,j)=>`<span>${pairText(e.children[j].textContent,item.textContent)}</span>`).join('<span class="flow-arrow" aria-hidden="true">→</span>')}</div>`;
    if(c.tagName==='TABLE')return `<div class="table-scroll"><table>${[...c.rows].map((row,j)=>`<tr>${[...row.cells].map((cell,k)=>`<${cell.tagName.toLowerCase()}>${pairText(e.rows[j].cells[k].textContent,cell.textContent)}</${cell.tagName.toLowerCase()}>`).join('')}</tr>`).join('')}</table></div>`;
    if(c.classList.contains('teacher')||c.classList.contains('callout'))return `<div class="${c.className} reading-pair"><div class="reading-en" lang="en">${e.innerHTML}</div><div class="reading-zh" lang="zh-CN">${c.innerHTML}</div></div>`;
    return wrap(e,c);
  }).join('');
};
