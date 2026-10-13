# Adega Mary

Site responsivo com catálogo ilustrativo de bebidas alcoólicas, refrigerantes e complementos.

As quatro páginas ficam em `docs/`. O projeto usa HTML, CSS e JavaScript, sem instalação ou etapa de build.

- `docs/index.html`: página inicial.
- `docs/bebidas-alcoolicas.html`: cervejas, vinhos e destilados.
- `docs/refrigerantes.html`: refrigerantes, água, sucos e energéticos.
- `docs/complementos.html`: gelo, carvão e petiscos.
- `docs/assets/catalog.js`: dados do catálogo, filtros, detalhes e lista local.
- `docs/assets/premium.css`: layout responsivo e bolhas animadas.

O visitante pode buscar produtos, filtrar categorias, abrir detalhes, adicionar itens à lista e copiar a seleção. A lista é salva apenas no dispositivo; não há checkout ou confirmação de compra.

Produtos, imagens e volumes são demonstrativos. Valores, marcas, estoque, contato e endereço da loja precisam ser informados para transformar o catálogo em uma vitrine comercial real. Para atualizar os produtos, edite os dados no início de `catalog.js` e o HTML inicial das páginas correspondentes.

Imagens ilustrativas criadas com o gerador de imagens integrado, sem marcas comerciais. Assets locais em WebP. A animação das bolhas respeita a preferência do dispositivo por reduzir movimentos.

## Publicação no GitHub Pages

Publicação pela branch `main`, pasta `/docs`. Todos os assets e links internos usam caminhos relativos para funcionar no endereço do projeto.

## Versão com fundo preto

A página inicial inclui uma seleção por categoria, sugestões por ocasião, imagens editoriais e dúvidas frequentes. As páginas do catálogo mantêm filtros, busca, detalhes e lista local. O fundo preto usa bolhas de gás em CSS com movimento lento, sem biblioteca de animação, e respeita a preferência por reduzir movimento.

Para atualizar o catálogo, edite `docs/assets/catalog.js` e rode `python3 tools/build_pages.py` para regenerar o HTML inicial. Todos os dados comerciais permanecem ilustrativos e sob consulta.
