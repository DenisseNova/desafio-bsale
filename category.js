const defaultLimit = 6;
let productCurrentPage = 1;

window.onload = () => {
  getCategoryId();
  loadCategories();
}

async function getCategoryId(offset = 0, limit = defaultLimit) {
  try {
    cards.innerHTML = "Cargando...";

    const searchParams = new URLSearchParams(location.search);
    if (!searchParams) location.replace('index.html')
    const categoryId = Number(searchParams.get('id'));
    if (!categoryId) location.replace('index.html')
    const categoryName = searchParams.get('name') || '';   

    const response = await axios.get(`${url}/product/category/${categoryId}?limit=${limit}&offset=${offset}`);


    document.querySelector('#categoryTitle').innerHTML = categoryName.toUpperCase();

    cards.innerHTML = printCard(response.data.rows)

    printPagination(response.data.count, document.querySelector('#pagination'), 6, productCurrentPage, changePage);

  } catch (error) {
    console.error(error);
  }
}
async function changePage(page) {
  const newOffset = (Number(page) - 1) * defaultLimit;
  productCurrentPage = Number(page);
  await getCategoryId(newOffset)
}