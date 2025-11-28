// frontend/src/contexts/AuthContext.jsx
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { api } from '../services/apiClient'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.user, token: action.token, isAuthenticated: true }
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.error, isAuthenticated: false }
    case 'LOGOUT':
      return { ...state, user: null, token: null, isAuthenticated: false, loading: false }
    case 'REGISTER_START':
      return { ...state, loading: true, error: null }
    case 'REGISTER_SUCCESS':
      return { ...state, loading: false, user: action.user, token: action.token, isAuthenticated: true }
    case 'REGISTER_FAILURE':
      return { ...state, loading: false, error: action.error }
    case 'SET_USER':
      return { ...state, user: action.user, isAuthenticated: !!action.user, loading: false }
    case 'SET_LOADING':
      return { ...state, loading: action.loading }
    default:
      return state
  }
}

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'), // Set to true if token exists
  loading: true,
  error: null
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Set auth header when token changes
  useEffect(() => {
    if (state.token) {
      api.defaults.headers.common['Authorization'] = `Token ${state.token}`
      localStorage.setItem('token', state.token)
    } else {
      delete api.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
    }
  }, [state.token])

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Token ${token}`
          const response = await api.get('/auth/user/')
          dispatch({ type: 'SET_USER', user: response.data })
        } catch (error) {
          console.error('Error fetching user data:', error)
          localStorage.removeItem('token')
          delete api.defaults.headers.common['Authorization']
          dispatch({ type: 'LOGOUT' })
        }
      } else {
        dispatch({ type: 'SET_LOADING', loading: false })
      }
    }
    checkAuth()
  }, [])

  const parseErrorResponse = (error) => {
    const errorData = error.response?.data || {}
    
    // Check for field-specific errors
    const fieldErrors = {}
    const generalErrors = []

    Object.keys(errorData).forEach(key => {
      const errorValue = errorData[key]
      
      if (Array.isArray(errorValue)) {
        if (key === 'non_field_errors') {
          generalErrors.push(...errorValue)
        } else {
          fieldErrors[key] = errorValue[0] // Take first error for each field
        }
      } else if (typeof errorValue === 'string') {
        if (key === 'non_field_errors') {
          generalErrors.push(errorValue)
        } else {
          fieldErrors[key] = errorValue
        }
      }
    })

    const generalError = generalErrors.length > 0 
      ? generalErrors.join(' ') 
      : (Object.keys(fieldErrors).length === 0 ? 'An error occurred. Please try again.' : null)

    return {
      generalError,
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : null
    }
  }

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const response = await api.post('/auth/login/', credentials)
      const { key: token, user } = response.data

      // If user data is included in response, use it directly
      if (user) {
        dispatch({ type: 'LOGIN_SUCCESS', user, token })
      } else {
        // Fallback: fetch user data separately if not included in response
        api.defaults.headers.common['Authorization'] = `Token ${token}`
        const userResponse = await api.get('/auth/user/')
        dispatch({ type: 'LOGIN_SUCCESS', user: userResponse.data, token })
      }

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      const { generalError, fieldErrors } = parseErrorResponse(error)
      dispatch({ type: 'LOGIN_FAILURE', error: generalError })
      return { success: false, error: generalError, fieldErrors }
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' })
    try {
      const response = await api.post('/auth/registration/', userData)
      const { key: token, user } = response.data
      
      // If user data is included in response, use it directly
      if (user) {
        dispatch({ type: 'REGISTER_SUCCESS', user, token })
      } else {
        // Fallback: fetch user data separately if not included in response
        api.defaults.headers.common['Authorization'] = `Token ${token}`
        const userResponse = await api.get('/auth/user/')
        dispatch({ type: 'REGISTER_SUCCESS', user: userResponse.data, token })
      }
      
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error response:', error.response?.data)
      const { generalError, fieldErrors } = parseErrorResponse(error)
      console.log('Parsed errors:', { generalError, fieldErrors })
      dispatch({ type: 'REGISTER_FAILURE', error: generalError })
      return { success: false, error: generalError, fieldErrors }
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout/')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch({ type: 'LOGOUT' })
      // Redirect to home after logout
      window.location.href = '/'
    }
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}