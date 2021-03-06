const defaultLimit = 6;
let productCurrentPage = 1;

window.onload = () => {
  getAllData();  
  loadCategories();
}

//funcion que trae todos los productos de la BD
async function getAllData(offset = 0, limit = defaultLimit) {
  try {
    cards.innerHTML = "Cargando...";
    const response = await axios.get(`${url}/products?limit=${limit}&offset=${offset}`);
    
    cards.innerHTML = printCard(response.data.rows)

    printPagination(response.data.count, document.querySelector('#pagination'), 6, productCurrentPage, changePage);

  } catch (error) {
    console.error(error);
  }
}

//funcion que crea el nuevo offset para la paginacion y lo envia a la api
async function changePage(page) {
  const newOffset = (Number(page) - 1) * defaultLimit;
  productCurrentPage = Number(page);
  await getAllData(newOffset)
}