window.onload = () => {
  getData();  
  loadCategories()
}

//funcion que imprime la pagina principal, que trae el nombre de la categoria con dos productos cada uno
function printData(arr) {
  return arr.map((category) => {
    const cards = printCard(category.Products)
    return `
      <div class="column is-12">
        <h3 class="title is-2 is-uppercase">${category.name}</h3>
        <div class="columns is-multiline is-mobile">
          ${cards}
          <div class="column is-4-desktop is-12-mobile is-flex is-justify-content-center is-align-items-center">
            <div class="">
              <button class="button is-primary is-light is-large p-6 is-uppercase has-text-weight-semibold">
                <a href="category.html?id=${category.id}&name=${category.name}">Ver Mas</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  }).join('')
}

//funcion que trae los datos de  de los productos segun su categoria y los carga en la funcion printData
async function getData() {
  try {
    cards.innerHTML = "Cargando...";
    const response = await axios.get(url + '/category/products');

    cards.innerHTML = printData(response.data)
  } catch (error) {
    console.error(error);
  }
}