(() => {
  'use strict';
  const I = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
  const PRODUCTS = [
    {id:'pilsen',name:'Cerveja Pilsen',volume:'Garrafa · 600 ml',group:'alcoolicos',filter:'Cervejas',image:'pilsen.webp',description:'Uma opção clássica para compartilhar à mesa, no churrasco ou no encontro com os amigos.'},
    {id:'premium',name:'Cerveja Premium',volume:'Long neck · 330 ml',group:'alcoolicos',filter:'Cervejas',image:'premium.webp',description:'A praticidade da long neck para acompanhar os seus bons momentos.'},
    {id:'whisky',name:'Whisky',volume:'Garrafa · 1 litro',group:'alcoolicos',filter:'Destilados',image:'whisky.webp',description:'Para preparar o seu drink ou servir com gelo. Consulte as opções disponíveis na loja.'},
    {id:'gin',name:'Gin',volume:'Garrafa · 750 ml',group:'alcoolicos',filter:'Destilados',image:'gin.webp',description:'Uma base versátil para drinks com tônica, frutas e um toque de criatividade.'},
    {id:'vodka',name:'Vodka',volume:'Garrafa · 1 litro',group:'alcoolicos',filter:'Destilados',image:'vodka.webp',description:'Uma escolha para combinar com sucos, energéticos e diferentes receitas de drinks.'},
    {id:'vinho',name:'Vinho tinto',volume:'Garrafa · 750 ml',group:'alcoolicos',filter:'Vinhos',image:'vinho.webp',description:'Para o jantar, a conversa e aquele momento que merece uma pausa.'},
    {id:'espumante',name:'Espumante',volume:'Garrafa · 750 ml',group:'alcoolicos',filter:'Vinhos',image:'espumante.webp',description:'Para celebrar as pequenas e grandes ocasiões. Consulte os estilos disponíveis.'},
    {id:'rum',name:'Rum',volume:'Garrafa · 1 litro',group:'alcoolicos',filter:'Destilados',image:'rum.webp',description:'Uma opção para explorar combinações com cola, cítricos e outros ingredientes.'},
    {id:'cola',name:'Refrigerante de cola',volume:'Garrafa · 2 litros',group:'refrigerantes',filter:'Refrigerantes',image:'cola.webp',description:'O clássico que acompanha o almoço, os petiscos e a reunião em família.'},
    {id:'guarana',name:'Refrigerante de guaraná',volume:'Garrafa · 2 litros',group:'refrigerantes',filter:'Refrigerantes',image:'guarana.webp',description:'Para servir bem gelado e dividir com todo mundo.'},
    {id:'laranja',name:'Refrigerante de laranja',volume:'Garrafa · 2 litros',group:'refrigerantes',filter:'Refrigerantes',image:'laranja.webp',description:'Sabor de laranja para dar um toque leve e colorido aos seus encontros.'},
    {id:'limao',name:'Refrigerante de limão',volume:'Garrafa · 2 litros',group:'refrigerantes',filter:'Refrigerantes',image:'limao.webp',description:'Uma opção cítrica para servir gelada, com gelo e uma fatia de limão.'},
    {id:'agua',name:'Água mineral',volume:'Garrafa · 500 ml',group:'refrigerantes',filter:'Águas e sucos',image:'agua.webp',description:'Uma escolha simples para ter sempre por perto. Consulte as opções com e sem gás.'},
    {id:'energetico',name:'Energético',volume:'Lata · 473 ml',group:'refrigerantes',filter:'Energéticos',image:'energetico.webp',description:'A praticidade da lata para a sua seleção. Sabores e marcas sob consulta.'},
    {id:'suco',name:'Suco de laranja',volume:'Garrafa · 1 litro',group:'refrigerantes',filter:'Águas e sucos',image:'suco.webp',description:'Sabor de fruta para completar a mesa. Consulte os sabores disponíveis.'},
    {id:'cola-menor',name:'Refrigerante de cola',volume:'Garrafa · 1 litro',group:'refrigerantes',filter:'Refrigerantes',image:'cola-menor.webp',description:'O sabor clássico em uma garrafa menor, para encontros e refeições do dia a dia.'},
    {id:'gelo',name:'Gelo em cubos',volume:'Saco · 3 kg',group:'complementos',filter:'Essenciais',image:'gelo.webp',description:'Para manter as bebidas frias e completar os seus drinks.'},
    {id:'carvao',name:'Carvão vegetal',volume:'Saco · 3 kg',group:'complementos',filter:'Churrasco',image:'carvao.webp',description:'Um complemento para o seu churrasco. Consulte os tamanhos disponíveis.'},
    {id:'amendoim',name:'Amendoim torrado',volume:'Pacote · 150 g',group:'complementos',filter:'Petiscos',image:'amendoim.webp',description:'Um petisco prático para acompanhar a conversa e a sua bebida preferida.'},
    {id:'salgadinho',name:'Batata chips',volume:'Pacote · 100 g',group:'complementos',filter:'Petiscos',image:'salgadinho.webp',description:'Uma opção crocante para compartilhar ou completar a mesa de petiscos.'}
  ];
  const GROUP_LABELS = {alcoolicos:'Bebidas alcoólicas',refrigerantes:'Sem álcool',complementos:'Complementos'};
  const storageKey = 'adega-mary-selecao-v1';
  let selection = {};
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      for (const p of PRODUCTS) {
        if (Number.isInteger(saved[p.id]) && saved[p.id] > 0) selection[p.id] = Math.min(saved[p.id],99);
      }
    }
  } catch (_) {}
  let activeFilter = 'Todos';
  let toastTimer;
  let lastFocus = null;
  let activeDialog = null;
  const overlay = document.querySelector('[data-overlay]');
  const quickDialog = document.querySelector('[data-quickview]');
  const drawer = document.querySelector('[data-drawer]');
  const grid = document.querySelector('[data-product-grid]');
  const search = document.querySelector('[data-search]');
  const pageGroup = document.body.dataset.catalog;
  const imagePath = (p) => `assets/products/${p.image}`;
  const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const card = (p) => `<article class="product-card">
    <button class="product-photo" type="button" data-detail="${p.id}" aria-label="Ver detalhes de ${p.name}">
      <span class="product-tag">${p.filter}</span><img src="${imagePath(p)}" alt="Imagem ilustrativa de ${p.name}" loading="lazy" decoding="async" width="480" height="480">
    </button><div class="product-details"><h3 class="product-name"><button type="button" data-detail="${p.id}">${p.name}</button></h3>
    <p class="product-volume">${p.volume}</p><div class="product-card-bottom"><span class="product-price">Sob consulta</span>
    <button class="add-product${selection[p.id] ? ' added' : ''}" type="button" data-add="${p.id}" aria-label="Adicionar ${p.name} à minha lista">${I(selection[p.id] ? 'check' : 'plus')}</button></div></div></article>`;
  function renderCatalog() {
    if (!grid) return;
    const query = normalize(search?.value || '');
    let products = pageGroup ? PRODUCTS.filter(p => p.group === pageGroup) : ['pilsen','guarana','vinho','gelo'].map(id => PRODUCTS.find(p => p.id === id));
    products = products.filter(p => (activeFilter === 'Todos' || p.filter === activeFilter) && normalize(`${p.name} ${p.filter} ${p.volume}`).includes(query));
    grid.innerHTML = products.map(card).join('');
    const count = document.querySelector('[data-results-count]');
    if (count) count.textContent = `${products.length} ${products.length === 1 ? 'opção' : 'opções'} no catálogo`;
    const empty = document.querySelector('[data-empty]');
    if (empty) empty.hidden = products.length > 0;
  }
  function showToast(message) {
    const toast = document.querySelector('[data-toast]');
    if (!toast) return;
    clearTimeout(toastTimer);toast.textContent=message;toast.hidden=false;
    toastTimer=setTimeout(() => {toast.hidden=true;},2800);
  }
  function persist() {
    try { localStorage.setItem(storageKey,JSON.stringify(selection)); } catch (_) {}
    updateCount();
    document.querySelectorAll('[data-add]').forEach(button => {
      if (button.classList.contains('add-product')) {
        const added = Boolean(selection[button.dataset.add]);
        button.classList.toggle('added',added);button.innerHTML=I(added?'check':'plus');
      }
    });
    if (!drawer.hidden) renderSelection();
  }
  function updateCount() {
    const total=Object.values(selection).reduce((a,b)=>a+b,0);
    document.querySelectorAll('[data-list-count]').forEach(el => {el.textContent=total;});
    document.querySelectorAll('[data-open-list]').forEach(el => {el.setAttribute('aria-label',`Abrir minha lista, ${total} ${total===1?'item':'itens'}`);});
  }
  function addProduct(id) {
    const product=PRODUCTS.find(p=>p.id===id);
    if (!product) return;
    if ((selection[id]||0)>=99) {showToast('Limite de 99 unidades por item.');return;}
    selection[id]=(selection[id]||0)+1;persist();showToast(`${product.name} na sua lista ✓`);
  }
  function openDialog(dialog) {
    if (!activeDialog) lastFocus=document.activeElement;
    quickDialog.hidden=true;drawer.hidden=true;
    activeDialog=dialog;dialog.hidden=false;overlay.hidden=false;
    document.body.classList.add('modal-open');
    dialog.querySelector('button, a, input')?.focus();
  }
  function closeDialog() {
    if (!activeDialog) return;
    quickDialog.hidden=true;drawer.hidden=true;overlay.hidden=true;
    document.body.classList.remove('modal-open');activeDialog=null;
    lastFocus?.focus();
  }
  function showProduct(id) {
    const p=PRODUCTS.find(p=>p.id===id);if (!p) return;
    quickDialog.querySelector('[data-quick-content]').innerHTML=`<div class="quickview">
      <img class="quickview-image" src="${imagePath(p)}" alt="Imagem ilustrativa de ${p.name}" width="480" height="480">
      <div><p class="eyebrow">${GROUP_LABELS[p.group]}</p><h2 id="quickview-title">${p.name}</h2><p class="quickview-volume">${p.volume}</p>
      <p class="quickview-description">${p.description}</p><p class="quickview-price">Sob consulta</p>
      <button class="button" data-add="${p.id}" type="button">${I('plus')} Adicionar à minha lista</button><p class="quickview-note">Imagem ilustrativa. Valores e disponibilidade sob consulta.</p></div></div>`;
    openDialog(quickDialog);
  }
  function renderSelection() {
    const items=PRODUCTS.filter(p=>selection[p.id]);
    const container=drawer.querySelector('[data-selection-items]');
    container.innerHTML=items.length ? items.map(p=>`<article class="selection-item"><img src="${imagePath(p)}" alt="${p.name}" width="68" height="90"><div><h3>${p.name}</h3><p>${p.volume}</p><div class="quantity-row"><div class="quantity-controls"><button type="button" data-quantity="${p.id}" data-change="-1" aria-label="Diminuir quantidade de ${p.name}">${I('minus')}</button><span aria-label="Quantidade: ${selection[p.id]}">${selection[p.id]}</span><button type="button" data-quantity="${p.id}" data-change="1" aria-label="Aumentar quantidade de ${p.name}">${I('plus')}</button></div><button class="remove-item" type="button" data-remove="${p.id}" aria-label="Remover ${p.name} da lista">${I('trash')}</button></div></div></article>`).join('') : `<div class="drawer-empty">${I('bag')}<h3>O próximo brinde<br>começa por aqui.</h3><p>Escolha seus itens no catálogo<br>e monte a sua lista.</p></div>`;
    const total=Object.values(selection).reduce((a,b)=>a+b,0);
    drawer.querySelector('[data-selected-total]').textContent=`${total} ${total===1?'item':'itens'}`;
    drawer.querySelector('[data-copy-list]').disabled=total===0;
    drawer.querySelector('[data-copy-list]').style.opacity=total===0?'.5':'1';
    drawer.querySelector('[data-copy-fallback]').hidden=true;
  }
  async function copySelection() {
    const items=PRODUCTS.filter(p=>selection[p.id]);if (!items.length) return;
    const text=`Olá, Adega Mary! Gostaria de consultar os valores e a disponibilidade dos seguintes itens:\n\n${items.map(p=>`• ${selection[p.id]} × ${p.name} (${p.volume})`).join('\n')}\n\nObrigado!`;
    try { await navigator.clipboard.writeText(text);showToast('Lista copiada! Envie para a loja.'); }
    catch (_) {
      const fallback=drawer.querySelector('[data-copy-fallback]');fallback.hidden=false;
      const textarea=fallback.querySelector('textarea');textarea.value=text;textarea.focus();textarea.select();
      showToast('Sua lista está pronta para selecionar e copiar.');
    }
  }
  function resetFilters() {
    activeFilter='Todos';if (search) search.value='';
    document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='Todos')));
    renderCatalog();
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');
    if (event.target === overlay) {closeDialog();return;}
    if (!button) return;
    if (button.dataset.detail) showProduct(button.dataset.detail);
    else if (button.dataset.add) addProduct(button.dataset.add);
    else if (button.hasAttribute('data-open-list')) {renderSelection();openDialog(drawer);}
    else if (button.hasAttribute('data-close-dialog')) closeDialog();
    else if (button.hasAttribute('data-copy-list')) copySelection();
    else if (button.hasAttribute('data-remove')) {
      delete selection[button.dataset.remove];persist();drawer.querySelector('[data-close-dialog]').focus();
    } else if (button.hasAttribute('data-quantity')) {
      const id=button.dataset.quantity;const value=(selection[id]||0)+Number(button.dataset.change);
      if (value>99) {showToast('Limite de 99 unidades por item.');return;}
      if (value<=0) delete selection[id];else selection[id]=value;
      persist();const replacement=drawer.querySelector(`[data-quantity="${id}"][data-change="${button.dataset.change}"]`);
      (replacement||drawer.querySelector('[data-close-dialog]')).focus();
    } else if (button.hasAttribute('data-filter')) {
      activeFilter=button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderCatalog();
    } else if (button.hasAttribute('data-reset-filters')) resetFilters();
    else if (button.hasAttribute('data-menu-toggle')) {
      const menu=document.querySelector('[data-mobile-menu]');menu.hidden=!menu.hidden;
      button.setAttribute('aria-expanded',String(!menu.hidden));button.setAttribute('aria-label',menu.hidden?'Abrir menu':'Fechar menu');
    }
  });
  document.addEventListener('keydown',event=>{
    if (event.key==='Escape') {
      if (activeDialog) closeDialog();
      const menu=document.querySelector('[data-mobile-menu]');
      if(menu&&!menu.hidden){menu.hidden=true;const trigger=document.querySelector('[data-menu-toggle]');trigger?.setAttribute('aria-expanded','false');trigger?.setAttribute('aria-label','Abrir menu');trigger?.focus();}
    }
    if (event.key==='Tab'&&activeDialog) {
      const focusable=[...activeDialog.querySelectorAll('button:not(:disabled),a[href],input,textarea')].filter(el=>!el.closest('[hidden]'));
      if (!focusable.length) return;
      const first=focusable[0],last=focusable.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  search?.addEventListener('input',renderCatalog);
  window.addEventListener('storage',event=>{if(event.key===storageKey){try{const fresh=JSON.parse(event.newValue||'{}');selection={};for(const p of PRODUCTS){if(Number.isInteger(fresh?.[p.id])&&fresh[p.id]>0) selection[p.id]=Math.min(99,fresh[p.id]);}persist();}catch(_){}}});
  renderCatalog();updateCount();
})();
