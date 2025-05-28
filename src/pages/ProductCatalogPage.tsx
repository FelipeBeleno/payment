import { useCallback, useEffect, useState } from "react"
import type { Product } from "../types/types"
import api from "../utils/axiosConfig"

interface ProductCatalogProps {

  onProductSelect: (product: Product) => void
}

const ProductCatalogPage = ({ onProductSelect }: ProductCatalogProps) => {


  const [products, setProducts] = useState<Product[]>([])
  const getData = useCallback(
    async () => {
      const resquest = await api.get(`${import.meta.env.VITE_API_URL}/product`)
      setProducts(resquest.data)
    }, [])

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="store-container py-8 animate-[fadeIn_0.5s_ease-out]">
      <header className="flex justify-between items-center mb-8">
     
      </header>

      <main className="animate-[slideIn_0.5s_ease-out]">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Nuestros Productos</h2>
          <p className="text-gray-600 text-lg">Descubre nuestra selección de productos tecnológicos de alta calidad</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="card p-6 hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 flex flex-col h-full"
              onClick={() => onProductSelect(product)}
            >
              <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                <img
                  src={product.imageUrl || "https://placehold.co/300x300?text=Product+Image"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{product.description}</p>

                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-gray-800">${product.price}</span>
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
