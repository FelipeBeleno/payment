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
          console.error("Error inicializando : ", error)
        }
      })
    }
  }, [])

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const navigate = useNavigate()




  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    navigate(`/product/${product._id}`)
  }




  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<ProductCatalogPage onProductSelect={handleProductSelect} />} />
        <Route
          path="/product/:id"
          element={
            selectedProduct &&
            <ProductPage
              product={selectedProduct}
            />
          }
        />
        <Route
          path="/result"
          element={
            <PaymentResultPage />
          }
        />
        <Route
          path="*"
          element={
            <ProductCatalogPage onProductSelect={handleProductSelect} />
          }
        />
      </Routes>
    </div>
  )
}

export default App
