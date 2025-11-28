import React from 'react'

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-rulebook-paper pt-20 sm:pt-24 pb-12 px-4 md:px-8 text-rulebook-ink">
      <div className="container mx-auto">{children}</div>
    </div>
  )
}