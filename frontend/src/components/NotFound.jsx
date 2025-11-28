import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-600 opacity-20 blur-2xl rounded-full animate-pulse"></div>
            <AlertTriangle size={80} className="text-red-400 relative" />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-7xl font-black text-yellow-400 mb-2 uppercase tracking-widest">
          404
        </h1>

        {/* Subheading */}
        <h2 className="text-2xl font-bold text-gray-100 mb-4 uppercase tracking-wide">
          Quest Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
          The page you're searching for has disappeared into the shadow realm. It either never existed or you don't have access to this quest.
        </p>

        {/* Button Group */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 border-2 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500 transition-all font-bold uppercase"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-700 border-2 border-yellow-600 text-yellow-200 hover:bg-yellow-600 hover:shadow-lg hover:shadow-yellow-600/50 transition-all font-bold uppercase"
          >
            <Home size={16} />
            Return to Home
          </button>
        </div>

        {/* Decorative Footer */}
        <div className="mt-12 pt-8 border-t-2 border-gray-700">
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            ✦ Error Code: 404 Quest Unavailable ✦
          </p>
        </div>
      </div>
    </div>
  )
}