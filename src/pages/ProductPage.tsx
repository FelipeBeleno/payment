import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { Product } from "../types/types"
import PaymentModal from "../components/PaymentModal"
import CustomSelect from "../components/CustomSelect"
import api from "../utils/axiosConfig"

interface ProductPageProps {
  product: Product | undefined
}

const ProductPage = ({ product }: ProductPageProps) => {


  const [productState, setProductState] = useState<Product>(product || {
    _id: 0,
    description: '',
    imageUrl: '',
    name: '',
    price: 0,
    stock: 0
  })


  const params = useParams();

  const getProduct = useCallback(async () => {

    const response = await api.get(`/product/${params.id}`)

    setProductState(response.data)

  }, [params.id])

  useEffect(() => {

    if (product) {
      return;
    }
    getProduct()

  }, [product])

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

  const calculatePaymentSummary = () => {
    const productTotal = productState.price * quantity


    return {
      productQuantity: quantity,
      productPrice: productTotal,
      total: productTotal + 8500,
    }
  }

  const handlePaymentComplete = async () => {

    navigate('/result')

    closePaymentModal()
  }


  const quantityOptions = [...Array(Math.min(productState.stock))].map((_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }))

  return (
    <div className="store-container py-8 animate-[fadeIn_0.5s_ease-out]">
      <header className="flex justify-between items-center mb-8">

      </header>

      <main className="card p-6 mb-8 animate-[slideIn_0.5s_ease-out]">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex justify-center items-center">
            <img
              src={productState.imageUrl || "https://placehold.co/300x300?text=Product+Image"}
              alt={productState.name}
              className="max-w-full h-auto rounded-lg"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{productState.name}</h2>
            <p className="text-gray-600 mb-6">{productState.description}</p>

            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-gray-800">${productState.price}</span>
              <span className="ml-4 px-3 py-1 bg-[#e6f7d9] text-[#4CAF50] rounded-full text-sm">
                {productState.stock > 0 ? `${productState.stock} unidades disponibles` : "Agotado"}
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
                disabled={productState.stock === 0}
              />
            </div>

            <button onClick={openPaymentModal} disabled={productState.stock === 0} className="btn-primary w-full md:w-auto">
              Pagar con tarjeta de crédito
            </button>

            <div className="mt-8 p-4 bg-[#e6f7ff] rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Información de envío</h3>
              <p className="text-gray-600">
                El costo de envío es de $8500. Por favor, asegúrate de que la dirección de envío sea correcta antes de
                proceder al pago.
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

          product={productState}
        />
      )}
    </div>
  )
}

export default ProductPage
