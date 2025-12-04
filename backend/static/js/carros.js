// Gerenciador de Base de Dados de Carros

let carrosData = null;

// Carregar dados dos carros
async function carregarCarros() {
  try {
    const response = await fetch('../src/data/carros.json');
    if (!response.ok) {
      throw new Error('Erro ao carregar dados de carros');
    }
    const data = await response.json();
    carrosData = data.carros;
    return carrosData;
  } catch (error) {
    console.error('Erro ao carregar carros:', error);
    // Fallback para dados locais
    return getCarrosFallback();
  }
}

// Dados de fallback caso o JSON não carregue
function getCarrosFallback() {
  return [
    { id: "civic-2022", marca: "Honda", modelo: "Civic", ano: "2022", categoria: "Sedan" },
    { id: "golf-gti", marca: "Volkswagen", modelo: "Golf GTI", ano: "2023", categoria: "Hatchback" },
    { id: "corolla", marca: "Toyota", modelo: "Corolla", ano: "2023", categoria: "Sedan" },
    { id: "focus", marca: "Ford", modelo: "Focus", ano: "2022", categoria: "Hatchback" },
    { id: "cruze", marca: "Chevrolet", modelo: "Cruze", ano: "2023", categoria: "Sedan" },
    { id: "jetta", marca: "Volkswagen", modelo: "Jetta", ano: "2023", categoria: "Sedan" }
  ];
}

// Popular select com carros
function popularSelectCarros(selectElement, carros) {
  if (!selectElement || !carros) return;

  // Limpar opções existentes (exceto a primeira)
  while (selectElement.options.length > 1) {
    selectElement.remove(1);
  }

  // Agrupar por marca
  const carrosPorMarca = {};
  carros.forEach(carro => {
    if (!carrosPorMarca[carro.marca]) {
      carrosPorMarca[carro.marca] = [];
    }
    carrosPorMarca[carro.marca].push(carro);
  });

  // Adicionar opções agrupadas
  Object.keys(carrosPorMarca).sort().forEach(marca => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = marca;
    
    carrosPorMarca[marca].forEach(carro => {
      const option = document.createElement('option');
      option.value = carro.id;
      option.textContent = `${carro.modelo} ${carro.ano} (${carro.categoria})`;
      optgroup.appendChild(option);
    });
    
    selectElement.appendChild(optgroup);
  });
}

// Buscar carro por ID
function buscarCarroPorId(id) {
  if (!carrosData) return null;
  return carrosData.find(carro => carro.id === id);
}

// Obter todos os carros
function obterTodosCarros() {
  return carrosData || getCarrosFallback();
}

// Filtrar carros por categoria
function filtrarCarrosPorCategoria(categoria) {
  if (!carrosData) return [];
  return carrosData.filter(carro => carro.categoria === categoria);
}

// Filtrar carros por marca
function filtrarCarrosPorMarca(marca) {
  if (!carrosData) return [];
  return carrosData.filter(carro => carro.marca === marca);
}

