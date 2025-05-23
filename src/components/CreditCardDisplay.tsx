import type { CreditCard, CardType } from "../types/types"

interface CreditCardDisplayProps {
  cardData: CreditCard
  cardType: CardType
  isFlipped: boolean
}

const CreditCardDisplay = ({ cardData, cardType, isFlipped }: CreditCardDisplayProps) => {
  const { number, name, expiry, cvc } = cardData

  

  const formatDisplayNumber = () => {
    const numberString = number || "•••• •••• •••• ••••"
    return numberString
  }

  

  const formatDisplayName = () => {
    return name || "NOMBRE APELLIDO"
  }

  

  const formatDisplayExpiry = () => {
    return expiry || "MM/YY"
  }

  

  const getCardClasses = () => {
    let baseClasses = "credit-card"
    if (isFlipped) {
      baseClasses += " flipped"
    }
    if (cardType === "visa") {
      baseClasses += " credit-card-visa"
    } else if (cardType === "mastercard") {
      baseClasses += " credit-card-mastercard"
    }
    return baseClasses
  }

  return (
    <div className={getCardClasses()}>
      <div className="credit-card-inner">
        <div className="credit-card-front">
          <div className="credit-card-logo">
            {cardType === "visa" && (
              <svg width="80" height="26" viewBox="0 0 750 471" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="750" height="471" fill="white" rx="8" />
                <path d="M278.197 334.228L311.353 136.81H366.56L333.396 334.228H278.197Z" fill="#1A1F71" />
                <path
                  d="M524.306 142.687C511.997 137.85 492.783 132.62 469.104 132.62C413.15 132.62 373.311 161.298 373.066 202.934C372.83 233.193 401.523 249.909 422.884 259.819C444.74 269.973 451.952 276.52 451.952 285.422C451.698 299.333 434.444 305.634 418.445 305.634C396.097 305.634 384.028 302.199 364.07 293.032L356.365 289.35L348.415 334.476C363.333 341.515 391.782 347.736 421.401 348.001C481.207 348.001 520.3 319.813 520.791 275.511C521.036 251.427 506.06 232.928 471.832 216.954C451.706 206.8 439.392 199.761 439.392 189.116C439.637 179.453 450.714 169.789 473.807 169.789C492.783 169.789 506.551 173.962 517.138 178.381L522.602 180.844L530.552 137.095L524.306 142.687Z"
                  fill="#1A1F71"
                />
                <path
                  d="M661.615 136.81H620.283C607.974 136.81 598.869 140.491 593.897 154.402L508.231 334.228H568.037C568.037 334.228 578.624 306.532 580.842 300.977C587.314 300.977 646.384 300.977 654.579 300.977C656.306 308.261 662.106 334.228 662.106 334.228H715.333L661.615 136.81ZM597.851 264.238C602.333 252.929 622.291 200.252 622.291 200.252C621.8 201.261 626.772 188.107 629.726 179.944L633.662 198.443C633.662 198.443 645.731 254.138 647.949 264.238H597.851Z"
                  fill="#1A1F71"
                />
                <path
                  d="M233.302 136.81L177.857 270.284L172.394 244.317C162.789 213.088 135.077 179.453 104.166 162.47L154.755 334.228H215.307L301.748 136.81H233.302Z"
                  fill="#1A1F71"
                />
                <path
                  d="M131.141 136.81H39.1741L38.1924 142.195C113.147 159.178 162.298 197.544 183.32 244.317L166.066 154.402C162.789 140.491 148.305 137.095 131.141 136.81Z"
                  fill="#F7B600"
                />
              </svg>
            )}
            {cardType === "mastercard" && (
              <svg width="80" height="48" viewBox="0 0 750 471" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M434.008 235.5C434.008 323.874 362.382 395.5 274.008 395.5C185.634 395.5 114.008 323.874 114.008 235.5C114.008 147.126 185.634 75.5 274.008 75.5C362.382 75.5 434.008 147.126 434.008 235.5Z"
                  fill="#EB001B"
                />
                <path
                  d="M636.008 235.5C636.008 323.874 564.382 395.5 476.008 395.5C387.634 395.5 316.008 323.874 316.008 235.5C316.008 147.126 387.634 75.5 476.008 75.5C564.382 75.5 636.008 147.126 636.008 235.5Z"
                  fill="#F79E1B"
                />
                <path
                  d="M375.008 142.304C342.124 173.958 322.008 203.304 322.008 235.5C322.008 267.696 342.124 297.042 375.008 328.696C407.892 297.042 428.008 267.696 428.008 235.5C428.008 203.304 407.892 173.958 375.008 142.304Z"
                  fill="#FF5F00"
                />
              </svg>
            )}
            {cardType === "unknown" && <div className="text-white font-bold text-sm">CARD</div>}
          </div>
          <div className="credit-card-chip"></div>
          <div className="credit-card-number">{formatDisplayNumber()}</div>
          <div className="credit-card-details">
            <div className="credit-card-holder">
              <div className="text-xs opacity-70">Titular</div>
              <div>{formatDisplayName()}</div>
            </div>
            <div className="credit-card-expiry">
              <div className="text-xs opacity-70">Expira</div>
              <div>{formatDisplayExpiry()}</div>
            </div>
          </div>
        </div>
        <div className="credit-card-back">
          <div className="credit-card-stripe"></div>
          <div className="credit-card-signature">
            <div className="credit-card-cvc">{cvc || "***"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditCardDisplay
