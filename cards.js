const url = "http://localhost:3000";
const cards = document.getElementById("productos");
const noImage = 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'

function printCard(arr) {
  return arr.map(element => `
      <div class="column is-4">
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
                <div class="column is-6 has-text-right">
                  ${localStorage.getItem('PROD-' + element.id)
                    ? `<button class="button is-danger" onclick="removeToCart(${element.id})"> <i class="fas fa-trash"></i></button>`
                    : `<button class="button is-primary" onclick="addToCart(${element.id})"> <i class="fas fa-shopping-cart"></i></button>`
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

async function addToCart(id) {
  const keyProd = `PROD-${id}`;
  const exist = localStorage.getItem(keyProd);
  if (exist) return alert('EL producto ya esta en el carrito');

  localStorage.setItem(keyProd, 'example');
  getData();
}

async function removeToCart(id) {
  const keyProd = `PROD-${id}`;
  localStorage.removeItem(keyProd);
  getData();
}

async function getByName(name) {
  try {
    const response = await axios.get(`${url}/product/name/${name}?limit=200`);
    cards.innerHTML = printCard(response.data)

    const elementPagination = document.querySelector('#pagination');
    if (elementPagination) elementPagination.innerHTML = '';

  } catch (error) {
    console.error(error);
  }
}

document.querySelector('#buscar').addEventListener('submit', (e) => {
  e.preventDefault()

  const name = document.getElementById('txtBuscar').value;
  if (!name) return;
  cards.innerHTML = "Cargando...";

  getByName(name)
})

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

async function loadProductsCategory(offset = 0) {
  if (!currentCategoryId) return;
  const select = document.querySelector('#categorias')
  cards.innerHTML = 'Cargando...'
  select.setAttribute('disabled', true);
  const response = await axios.get(`${url}/category/${currentCategoryId}/products?offset=${offset}`).finally(() => select.removeAttribute('disabled'));
  cards.innerHTML = printCard(response.data.rows)
  printPagination(response.data.count, document.querySelector('#pagination'), 6, prodByCategoryCurrentPage, changePageProdByCategory);
}

async function changePageProdByCategory(page) {
  const newOffset = (Number(page) - 1) * defaultLimitProdCategory;
  prodByCategoryCurrentPage = Number(page);
  await loadProductsCategory(newOffset)
}