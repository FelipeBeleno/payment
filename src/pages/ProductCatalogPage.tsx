import type { Product } from "../types/types"

interface ProductCatalogProps {
  products: Product[]
  onProductSelect: (product: Product) => void
}

const ProductCatalogPage = ({ products, onProductSelect }: ProductCatalogProps) => {
  return (
    <div className="store-container py-8 animate-[fadeIn_0.5s_ease-out]">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">Store</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Inicio
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Productos
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Contacto
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="animate-[slideIn_0.5s_ease-out]">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Nuestros Productos</h2>
          <p className="text-gray-600 text-lg">Descubre nuestra selección de productos tecnológicos de alta calidad</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="card p-6 hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 flex flex-col h-full"
              onClick={() => onProductSelect(product)}
            >
              <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "https://via.placeholder.com/300x300?text=Producto"
                  }}
                />
              </div>

              <div className="flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{product.description}</p>

                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${product.stock > 0 ? "bg-[#e6f7d9] text-[#4CAF50]" : "bg-red-100 text-red-600"
                        }`}
                    >
                      {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
                    </span>
                  </div>

                  <button
                    className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-200 ease-in-out ${product.stock > 0
                        ? "bg-[#00D284] text-white hover:bg-[#00b673] hover:shadow-md transform hover:scale-[1.02]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? "Ver Producto" : "Agotado"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default ProductCatalogPage;
