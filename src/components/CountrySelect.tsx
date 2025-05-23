
import { useState, useRef, useEffect } from "react"


export interface Country {
  code: string
  name: string
  flag: string
  dialCode: string
}


export const countries: Country[] = [

  { code: "CO", name: "Colombia", flag: "🇨🇴", dialCode: "+57" },
]

interface CountrySelectProps {
  selectedCountry: Country
  onChange: (country: Country) => void
}

const CountrySelect = ({ selectedCountry, onChange }: CountrySelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (country: Country) => {
    onChange(country)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-center px-3 py-2 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-l-md hover:bg-gray-300 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-1 text-lg">{selectedCountry.flag}</span>
        <span className="font-medium">{selectedCountry.dialCode}</span>
        <svg
          className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-64 mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <div className="py-1">
            {countries.map((country) => (
              <button
                key={country.code}
                type="button"
                className={`w-full text-left px-4 py-2 flex items-center hover:bg-gray-100 ${
                  selectedCountry.code === country.code ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSelect(country)}
              >
                <span className="text-lg mr-2">{country.flag}</span>
                <span className="font-medium">{country.name}</span>
                <span className="ml-auto text-gray-500">{country.dialCode}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CountrySelect
