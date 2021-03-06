const url = "https://bsale-api-dnova.herokuapp.com";
const cards = document.getElementById("productos");
const noImage = 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'

//evento click para burger en modo mobile 
document.addEventListener('DOMContentLoaded', () => {
  const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  if (navbarBurgers.length > 0) {
    navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {
        const menuMobile = document.querySelector('.navbar .navbar-menu');
        el.classList.toggle('is-active');
        menuMobile.classList.toggle('is-active');
      });
    });
  }
});

//funcion que imprime tarjeta card y que recorre un arreglo para la impresion dinamica de los datos 
function printCard(arr) {
  return arr.map(element => `
      <div class="column is-4-desktop is-12-mobile">
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img src="${element.urlImage || noImage}" alt="Placeholder image">
            </figure>
          </div>
          <div class="card-content">
            <div class="content">
              <p>${element.name}</p>
              <hr>
              <div class="columns is-mobile is-multiline">
                <div class="column is-6">
                  ${element.price ? '$' + new Intl.NumberFormat("es-CL").format(element.price) : 'S/I'}
                </div>
                <div class="column is-6 has-text-right" id="btn-cart-${element.id}">
                  ${localStorage.getItem('PROD-' + element.id)
                    ? `<button class="button is-danger" type="button" onclick="removeToCart(${element.id}, '${element.name}')"> <i class="fas fa-trash"></i></button>`
                    : `<button class="button is-primary" type="button" onclick="addToCart(${element.id}, '${element.name}')"> <i class="fas fa-shopping-cart"></i></button>`
                  }
                </div>
              </div>
              <p> </p>
            </div>
          </div>
        </div>  
      </div>
    `).join('');
}

//funcion que agrega producto al carrito
async function addToCart(id, name = 'example') {
  const keyProd = `PROD-${id}`;
  const exist = localStorage.getItem(keyProd);
  if (exist) return alert('EL producto ya esta en el carrito');

  localStorage.setItem(keyProd, name);
  document.querySelector(`#btn-cart-${id}`).innerHTML = `<button class="button is-danger" type="button" onclick="removeToCart(${id}, '${name}')"> <i class="fas fa-trash"></i></button>`
}

//funcion que retira producto del carrito
async function removeToCart(id, name = 'example') {
  const keyProd = `PROD-${id}`;
  localStorage.removeItem(keyProd);
  document.querySelector(`#btn-cart-${id}`).innerHTML = `<button class="button is-primary" type="button" onclick="addToCart(${id}, '${name}')"> <i class="fas fa-shopping-cart"></i></button>`
}

//funci??n b??squeda por nombre, si hay resultado imprime los cards y si  no existe coincidencia muestra mensaje que no existe resultado
async function getByName(name) {
  try {
    const response = await axios.get(`${url}/product/name/${name}?limit=200`);
    if (!response.data || response.data.length < 1) cards.innerHTML = `<h3 class="title is-4">No existe resultado para la busqueda por "${name}".</h3>`
    else cards.innerHTML = printCard(response.data)

    const elementPagination = document.querySelector('#pagination');
    if (elementPagination) elementPagination.innerHTML = '';

  } catch (error) {
    console.error(error);
  }
}

//evento click para el boton que busqueda por nombre ingresado en el imput
document.querySelector('#buscar').addEventListener('submit', (e) => {
  e.preventDefault()

  const name = document.getElementById('txtBuscar').value;
  if (!name) return;
  cards.innerHTML = "Cargando...";

  getByName(name)
})

//Funcion que recibe 5 parametros para la paginacion
function printPagination(allRecords, element, rowsPerPage = 6, currentPage = 1, callbackChangePage) {
  const pages = Math.ceil(allRecords / rowsPerPage);
  let numbersLargePage = [];
  if (pages > 5) {
    if (currentPage <= 3) numbersLargePage = [2, 3, 4];
    else if (currentPage >= pages - 3) numbersLargePage = [pages - 3, pages - 2, pages - 1];
    else numbersLargePage = [currentPage - 1, currentPage, currentPage + 1];
  }

  const getClassCurrentPage = (numberPage) => currentPage === numberPage ? ' is-current' : '';
  const getAttributeCurrentPage = (numberPage) => currentPage === numberPage ? 'aria-current="page"' : '';

  const html = `
    <nav class="pagination is-centered" role="navigation" aria-label="pagination">
      <a data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled': ''} class="paginationNewPage pagination-previous">Anterior</a>
      <a data-page="${currentPage + 1}" ${currentPage === pages ? 'disabled': ''} class="paginationNewPage pagination-next">Siguiente</a>
      <ul class="pagination-list">
        <li><a data-page="${1}" class="paginationNewPage pagination-link ${getClassCurrentPage(1)}" ${getAttributeCurrentPage(1)} aria-label="Ir a 1">1</a></li>
        ${
          pages > 5 ? (
            (numbersLargePage.includes(2) ? '' : `<li><span class="pagination-ellipsis">&hellip;</span></li>`) + 
            numbersLargePage.map((el, i) => `<li><a data-page="${el}" class="paginationNewPage pagination-link ${getClassCurrentPage(el)}" ${getAttributeCurrentPage(el)} aria-label="Ir a ${el}">${el}</a></li>`).join('') +
            (numbersLargePage.includes(pages - 1) ? '' : `<li><span class="pagination-ellipsis">&hellip;</span></li>`)
          ) : (
            (pages - 2) > 0 ? (
              [...Array(pages - 2).keys()].map((el, i) => `<li><a data-page="${i + 2}" class="paginationNewPage pagination-link ${getClassCurrentPage(i + 2)}" ${getAttributeCurrentPage(i + 2)} aria-label="Ir a ${i + 2}">${i + 2}</a></li>`).join('')
            ) : ''
          )
        }
        ${
          pages > 1 ? (
            `<li><a data-page="${pages}" class="paginationNewPage pagination-link ${currentPage === pages ? 'is-current' : ''}" ${currentPage === pages ? 'aria-current="page"' : ''} aria-label="Ir a ${pages}">${pages}</a></li>`
          ) : ''
        }
      </ul>
    </nav>
  `;
  
  element.innerHTML = '';
  element.insertAdjacentHTML('beforeend', html);

  document.querySelectorAll('.paginationNewPage').forEach((el) => {
    el.addEventListener('click', (e) => {
      const cPage = e.target.dataset.page || 1;
      if (callbackChangePage && cPage <= pages && cPage >= 1) callbackChangePage(cPage)
    })
  })
}

let currentCategoryId = null;
let prodByCategoryCurrentPage = 1;
const defaultLimitProdCategory = 6;

//funcion que trae el nombre de la categoria y lo imprime en la lista de las opciones de categoria 
async function loadCategories() {
  try {
    const select = document.querySelector('#categorias')
    const response = await axios.get(url + '/category');
    select.insertAdjacentHTML( 'beforeend', response.data.map( (el) => `<option id="optionCategory" value="${el.id}">${el.name}</option>`).join(''))

    select.addEventListener('change', async (e) => {
      currentCategoryId = e.target.value;
      prodByCategoryCurrentPage = 1;
      document.querySelector('#pagination').innerHTML = '';
      await loadProductsCategory()
    })
  } catch (error) {
    console.error(error);
  }
}

//funcion que trae todos los productos segun la categoria elegida e imprime con el titutlo de la categoria
async function loadProductsCategory(offset = 0) {
  if (!currentCategoryId) return;
  const select = document.querySelector('#categorias')
  cards.innerHTML = 'Cargando...'
  select.setAttribute('disabled', true);
  const response = await axios.get(`${url}/category/${currentCategoryId}/products?offset=${offset}`).finally(() => select.removeAttribute('disabled'));
  const htmlCards = printCard(response.data.rows);
  cards.innerHTML = `
    <div class="column is-12">
      <h3 class="title is-4 is-uppercase">${select.options[select.selectedIndex].text}</h3>
    </div>
    ${htmlCards}
  `
  const categoryPage = document.querySelector('#categoryTitle');
  if (categoryPage) categoryPage.innerHTML = '';
  printPagination(response.data.count, document.querySelector('#pagination'), 6, prodByCategoryCurrentPage, changePageProdByCategory);
}

//funcion que crea el nuevo offset para la paginacion y lo envia a la api
async function changePageProdByCategory(page) {
  const newOffset = (Number(page) - 1) * defaultLimitProdCategory;
  prodByCategoryCurrentPage = Number(page);
  await loadProductsCategory(newOffset)
}

//evento click que muestra el nombre del producto agregado en el carrito el cual lo muestra en un alert
document.querySelector('#btn-cart').addEventListener('click', (e) => {
  e.preventDefault();
  const prods = Object.keys(localStorage)
    .filter((name) => name.includes('PROD-'))
    .map((n) => localStorage.getItem(n))
    .join('\n');

  const message = "Carrito de Compras \n" + (prods || 'Sin productos')
  alert(message)
})