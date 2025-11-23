// src/components/ConnectionStatus.jsx
import React from 'react'
import { pingApi } from '../services/apiClient'

export default function ConnectionStatus() {
  const [state, setState] = React.useState('loading') // 'loading' | 'ok' | 'fail'

  React.useEffect(() => {
    let mounted = true
    pingApi().then(ok => mounted && setState(ok ? 'ok' : 'fail'))
    return () => { mounted = false }
  }, [])

  const badge = {
    loading: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    ok: 'bg-green-100 text-green-800 border-green-300',
    fail: 'bg-red-100 text-red-800 border-red-300',
  }[state]

  const text = {
    loading: 'Checking connection…',
    ok: 'Connection successful',
    fail: 'Connection failed',
  }[state]

  if (state !== 'fail') return null

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg ${badge}`}>
      <span className={`h-2.5 w-2.5 rounded-full bg-red-500`}/>
      <span className="font-medium">{text}</span>
    </div>
  )
}
