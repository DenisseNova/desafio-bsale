window.onload = () => {
  getData();  
}

function printData(arr) {
  return arr.map((category) => {
    const cards = printCard(category.Products)
    return `
      <div class="column is-12">
        <h3 class="title is-2 is-uppercase">${category.name}</h3>
        <div class="columns is-multiline is-mobile">
          ${cards}
          <div class="column is-4">
            <div class="card">
              <a href="category.html?id=${category.id}&name=${category.name}">Ver Mas</a>
            </div>
          </div>
        </div>
      </div>
    `
  }).join('')
}

async function getData() {
  try {
    cards.innerHTML = "Cargando...";
    const response = await axios.get(url + '/category/products');

    cards.innerHTML = printData(response.data)
  } catch (error) {
    console.error(error);
  }
}