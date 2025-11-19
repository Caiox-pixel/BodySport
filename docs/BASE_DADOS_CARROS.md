# 🗄️ Base de Dados de Carros

## 📋 Estrutura

A base de dados de carros está localizada em `src/data/carros.json` e contém informações sobre os modelos disponíveis para desenvolvimento de bodykits.

## 📊 Formato dos Dados

Cada carro possui os seguintes campos:

```json
{
  "id": "civic-2022",
  "marca": "Honda",
  "modelo": "Civic",
  "ano": "2022",
  "categoria": "Sedan",
  "imagem": "assets/images/cars/civic-2022.jpg"
}
```

### Campos

- **id**: Identificador único (usado no código)
- **marca**: Marca do veículo
- **modelo**: Modelo específico
- **ano**: Ano do modelo
- **categoria**: Tipo de veículo (Sedan, Hatchback, SUV, etc.)
- **imagem**: Caminho para imagem do carro (opcional)

## 🚗 Modelos Disponíveis

Atualmente a base contém 12 modelos:

### Sedans
- Honda Civic 2022
- Toyota Corolla 2023
- Chevrolet Cruze 2023
- Volkswagen Jetta 2023
- Honda Civic Si 2023

### Hatchbacks
- Volkswagen Golf GTI 2023
- Ford Focus 2022
- Volkswagen Polo 2023
- Chevrolet Onix 2023
- Hyundai HB20 2023

### SUVs
- Toyota Corolla Cross 2023
- Volkswagen T-Cross 2023

## 🔧 Como Adicionar Novos Modelos

1. Abra o arquivo `src/data/carros.json`
2. Adicione um novo objeto no array `carros`:

```json
{
  "id": "novo-modelo",
  "marca": "Marca",
  "modelo": "Modelo",
  "ano": "2024",
  "categoria": "Categoria",
  "imagem": "assets/images/cars/novo-modelo.jpg"
}
```

3. O modelo aparecerá automaticamente no select, agrupado por marca

## 💻 Uso no Código

### Carregar Carros
```javascript
const carros = await carregarCarros();
```

### Popular Select
```javascript
popularSelectCarros(selectElement, carros);
```

### Buscar Carro por ID
```javascript
const carro = buscarCarroPorId('civic-2022');
```

### Filtrar por Categoria
```javascript
const sedans = filtrarCarrosPorCategoria('Sedan');
```

### Filtrar por Marca
```javascript
const hondas = filtrarCarrosPorMarca('Honda');
```

## 📝 Notas

- Os carros são automaticamente agrupados por marca no select
- A ordem é alfabética por marca
- O sistema tem fallback caso o JSON não carregue
- Imagens são opcionais e podem ser adicionadas depois

---

**Última atualização:** 2025-01-27

