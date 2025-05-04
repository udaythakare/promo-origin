'use client'

import React, { useState } from 'react'
import { MapPin } from 'lucide-react'

export default function LocationForm({ initialData = {}, onSubmit, dropDownData }) {
    const [formData, setFormData] = useState({
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        area: initialData.area || '',
        postal_code: initialData.postal_code || '',
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const { areaData = [], cityData = [], stateData = [] } = dropDownData || {}

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            // Call the provided onSubmit function
            if (onSubmit) {
                await onSubmit(formData)
                setMessage('Location updated successfully!')
            }
        } catch (error) {
            setMessage('Failed to update location. Please try again.')
            console.error('Error updating location:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white p-4 ">
            <h2 className="text-xl font-black text-black mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                YOUR LOCATION
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="address" className="block text-sm font-bold text-black mb-1 uppercase">
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border-3 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white font-bold"
                        placeholder="Enter your address"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="state" className="block text-sm font-bold text-black mb-1 uppercase">
                            State
                        </label>
                        <select
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border-3 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white font-bold appearance-none"
                            required
                            style={{ backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")", 
                                    backgroundRepeat: "no-repeat", 
                                    backgroundPosition: "right 0.5rem center", 
                                    backgroundSize: "1.5em 1.5em" }}
                        >
                            <option value="">SELECT STATE</option>
                            {stateData?.map((state) => (
                                <option key={state.id} value={state.name}>
                                    {state.name.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="city" className="block text-sm font-bold text-black mb-1 uppercase">
                            City
                        </label>
                        <select
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border-3 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white font-bold appearance-none"
                            required
                            style={{ backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")", 
                                    backgroundRepeat: "no-repeat", 
                                    backgroundPosition: "right 0.5rem center", 
                                    backgroundSize: "1.5em 1.5em" }}
                        >
                            <option value="">SELECT CITY</option>
                            {cityData?.map((city) => (
                                <option key={city.id} value={city.name}>
                                    {city.name.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="area" className="block text-sm font-bold text-black mb-1 uppercase">
                            Area
                        </label>
                        <select
                            id="area"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border-3 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white font-bold appearance-none"
                            required
                            style={{ backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")", 
                                    backgroundRepeat: "no-repeat", 
                                    backgroundPosition: "right 0.5rem center", 
                                    backgroundSize: "1.5em 1.5em" }}
                        >
                            <option value="">SELECT AREA</option>
                            {areaData?.map((area) => (
                                <option key={area.id} value={area.name}>
                                    {area.name.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="postal_code" className="block text-sm font-bold text-black mb-1 uppercase">
                            Postal Code
                        </label>
                        <input
                            type="text"
                            id="postal_code"
                            name="postal_code"
                            value={formData.postal_code}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border-3 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white font-bold"
                            placeholder="Enter postal code"
                            required
                        />
                    </div>
                </div>

                {message && (
                    <div className={`p-3 border-3 border-black font-bold ${message.includes('success') ? 'bg-green-300' : 'bg-red-300'}`}>
                        {message.toUpperCase()}
                    </div>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-green-400 text-black font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'UPDATING...' : 'UPDATE LOCATION'}
                    </button>
                </div>
            </form>
        </div>
    )
}