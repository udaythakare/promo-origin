'use client'
import React, { useState, useEffect } from 'react'
import { Globe, Phone, Mail, MapPin, Tag } from 'lucide-react'

const StoresPage = () => {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {

    const fetchBusinesses = async()=>{
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/all-business')
            if (!response.ok) {
            throw new Error('Failed to fetch businesses')
            }
            const data = await response.json()
            setBusinesses(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }
    
    fetchBusinesses()
  }, [])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setTimeout(() => {
      setBusinesses(sampleBusinesses)
      setLoading(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading stores...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
            <button 
              onClick={handleRetry}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Stores</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing businesses and stores in our marketplace
          </p>
          <div className="mt-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-full inline-block">
            {businesses.length} {businesses.length === 1 ? 'Store' : 'Stores'} Available
          </div>
        </div>

        {/* Stores Grid */}
        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Tag size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600">Be the first to add your business!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{business.name}</h3>
                  <div className="flex items-center text-sm opacity-90">
                    <MapPin size={16} className="mr-1" />
                    <span>{business.city}, {business.state}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {business.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {business.description}
                    </p>
                  )}

                  {/* Contact Information */}
                  <div className="space-y-3">
                    {business.website && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe size={16} className="mr-2 text-blue-500" />
                        <a
                          href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {business.website}
                        </a>
                      </div>
                    )}

                    {business.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone size={16} className="mr-2 text-green-500" />
                        <a
                          href={`tel:${business.phone}`}
                          className="text-green-600 hover:underline"
                        >
                          {business.phone}
                        </a>
                      </div>
                    )}

                    {business.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail size={16} className="mr-2 text-red-500" />
                        <a
                          href={`mailto:${business.email}`}
                          className="text-red-600 hover:underline truncate"
                        >
                          {business.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-4">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    View Store Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StoresPage