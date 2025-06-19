import { lazy, Suspense, useEffect, useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import type { Product } from "./types/types"
import { setPaymentData } from "./slices/payment"
import { WompiInitData, WompiError } from "./types/wompi"
import { ErrorBoundary } from "./components/ErrorBoundary"
import LoadingSpinner from "./components/LoadingSpinner"
import { useAppDispatch } from "./store/store"

// Lazy loading para optimizar la carga inicial
const ProductPage = lazy(() => import("./pages/ProductPage"))
const ProductCatalogPage = lazy(() => import("./pages/ProductCatalogPage"))
const PaymentResultPage = lazy(() => import("./pages/PaymentResultPage"))

declare global {
  interface Window {
    $wompi?: {
      initialize: (callback: (data: WompiInitData, error: WompiError | null) => void) => void
      [key: string]: any
    }
  }
}

function App() {
  const dispatch = useAppDispatch();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (window.$wompi && typeof window.$wompi.initialize === "function") {
      window.$wompi.initialize((data: WompiInitData, error: WompiError | null) => {
        if (error === null) {
          const sessionId = data.sessionId
          const deviceId = data.deviceData.deviceID

          dispatch(setPaymentData({
            deviceId,
            sesionId: sessionId,
          }))
        } else {
          console.error("Error inicializando Wompi:", error)
        }
      })
    }
  }, [dispatch])

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    navigate(`/product/${product._id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<ProductCatalogPage onProductSelect={handleProductSelect} />} />
            <Route
              path="/product/:id"
              element={
                <ProductPage
                  product={selectedProduct || undefined}
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
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default App