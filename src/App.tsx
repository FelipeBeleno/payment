import { useEffect, useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import ProductPage from "./pages/ProductPage"
import type { Product } from "./types/types"
import ProductCatalogPage from "./pages/ProductCatalogPage"
import PaymentResultPage from "./pages/PaymentResultPage"
import { useDispatch } from "react-redux"
import { setPaymentData } from "./slices/payment"

declare global {
  interface Window {
    $wompi?: {
      initialize: (callback: (data: any, error: any) => void) => void
      [key: string]: any
    }
  }
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Auriculares Bluetooth Premium",
    description:
      "Auriculares inalámbricos con cancelación de ruido, 30 horas de batería y sonido de alta fidelidad. Perfectos para trabajo, viajes y ejercicio.",
    price: 129.99,
    stock: 15,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    name: "Smartphone Galaxy Pro",
    description:
      "Teléfono inteligente de última generación con cámara de 108MP, pantalla AMOLED de 6.7 pulgadas y procesador de alto rendimiento.",
    price: 899.99,
    stock: 8,
    image: "https://images.unsplash.com/photo-1738830234395-a351829a1c7b?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    name: "Laptop Gaming RGB",
    description:
      "Laptop para gaming con procesador Intel i7, 16GB RAM, RTX 4060, SSD 1TB y teclado RGB mecánico. Ideal para gamers profesionales.",
    price: 1299.99,
    stock: 5,
    image: "https://images.unsplash.com/photo-1605134513573-384dcf99a44c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    name: "Smartwatch Deportivo",
    description:
      "Reloj inteligente resistente al agua con GPS, monitor de frecuencia cardíaca y más de 100 modos deportivos. Batería de 14 días.",
    price: 249.99,
    stock: 12,
    image: "https://images.unsplash.com/photo-1617625802912-cde586faf331?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
]

function App() {

  const dispatch = useDispatch();

  useEffect(() => {

    if (window.$wompi && typeof window.$wompi.initialize === "function") {
      window.$wompi.initialize(function (data: any, error: any) {
        if (error === null) {
          const sessionId = data.sessionId
          const deviceId = data.deviceData.deviceID

          dispatch(setPaymentData({
            deviceId: deviceId,
            sesionId: sessionId,
          }))
        } else {
          console.error("Error inicializando Wompi:", error)
        }
      })
    }
  }, [])



  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [transactionStatus, setTransactionStatus] = useState<"success" | "failed" | null>(null)
  const navigate = useNavigate()


  const updateStock = (productId: number, quantity: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, stock: Math.max(0, product.stock - quantity) } : product,
      ),
    )
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    navigate(`/product/${product.id}`)
  }

  const handleTransactionComplete = (id: string, status: "success" | "failed") => {
    setTransactionId(id)
    setTransactionStatus(status)
    navigate(`/result/${status}`)
  }

  const resetTransaction = () => {
    setTransactionId(null)
    setTransactionStatus(null)
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<ProductCatalogPage products={products} onProductSelect={handleProductSelect} />} />
        <Route
          path="/product/:id"
          element={
            selectedProduct ? (
              <ProductPage
                product={selectedProduct}
                onStockUpdate={(quantity) => updateStock(selectedProduct.id, quantity)}
                onTransactionComplete={handleTransactionComplete}
              />
            ) : (
              <ProductCatalogPage products={products} onProductSelect={handleProductSelect} />
            )
          }
        />
        <Route
          path="/result/:status"
          element={
            <PaymentResultPage
              status={transactionStatus || "failed"}
              transactionId={transactionId || ""}
              onBackToProduct={resetTransaction}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
