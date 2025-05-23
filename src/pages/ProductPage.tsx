import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Product, PaymentSummary } from "../types/types"
import PaymentModal from "../components/PaymentModal"
import CustomSelect from "../components/CustomSelect"

interface ProductPageProps {
  product: Product
  onStockUpdate: (quantity: number) => void
  onTransactionComplete: (transactionId: string, status: "success" | "failed") => void
}

const ProductPage = ({ product, onStockUpdate, onTransactionComplete }: ProductPageProps) => {
  const [quantity, setQuantity] = useState(1)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleQuantityChange = (value: string) => {
    setQuantity(Number(value))
  }

  const openPaymentModal = () => {
    setIsPaymentModalOpen(true)
  }

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false)
  }

  const goBackToCatalog = () => {
    navigate("/")
  }

  const calculatePaymentSummary = (): PaymentSummary => {
    const productTotal = product.price * quantity
    const baseFee = 4.99
    const shippingFee = 7.99

    return {
      productQuantity: quantity,
      productPrice: productTotal,
      baseFee,
      shippingFee,
      total: productTotal + baseFee + shippingFee,
    }
  }

  const handlePaymentComplete = async (success: boolean) => {
    
    const transactionId = `TRX-${Math.floor(Math.random() * 1000000)}`

    if (success) {
      
      onStockUpdate(quantity)
      
      onTransactionComplete(transactionId, "success")
    } else {
      onTransactionComplete(transactionId, "failed")
    }

    closePaymentModal()
  }

  
  const quantityOptions = [...Array(Math.min(product.stock, 10))].map((_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }))

  return (
    <div className="store-container py-8 animate-[fadeIn_0.5s_ease-out]">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button onClick={goBackToCatalog} className="mr-4 text-gray-600 hover:text-gray-900 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
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
        <div className="bg-[#9FE870] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
          Store
        </div>
      </header>

      <main className="card p-6 mb-8 animate-[slideIn_0.5s_ease-out]">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex justify-center items-center">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="max-w-full h-auto rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "https://via.placeholder.com/400x400?text=Producto"
              }}
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h2>
            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
              <span className="ml-4 px-3 py-1 bg-[#e6f7d9] text-[#4CAF50] rounded-full text-sm">
                {product.stock > 0 ? `${product.stock} unidades disponibles` : "Agotado"}
              </span>
            </div>

            <div className="mb-6">
              <label htmlFor="quantity" className="form-label">
                Cantidad:
              </label>
              <CustomSelect
                id="quantity"
                value={quantity.toString()}
                onChange={handleQuantityChange}
                options={quantityOptions}
                disabled={product.stock === 0}
              />
            </div>

            <button onClick={openPaymentModal} disabled={product.stock === 0} className="btn-primary w-full md:w-auto">
              Pagar con tarjeta de crédito
            </button>

            <div className="mt-8 p-4 bg-[#e6f7ff] rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Información de envío</h3>
              <p className="text-gray-600">
                Envío gratuito en pedidos superiores a $200. Entrega estimada: 3-5 días hábiles.
              </p>
            </div>
          </div>
        </div>
      </main>

      {isPaymentModalOpen && (
        <PaymentModal
          onClose={closePaymentModal}
          paymentSummary={calculatePaymentSummary()}
          onPaymentComplete={handlePaymentComplete}
          productName={product.name}
        />
      )}
    </div>
  )
}

export default ProductPage
