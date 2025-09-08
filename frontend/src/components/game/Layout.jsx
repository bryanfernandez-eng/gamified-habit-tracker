import React from 'react'

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-white">
      <div className="container mx-auto">{children}</div>
    </div>
  )
}