'use client'

import { fetchAllCoupons, fetchAreaCoupons } from '@/actions/couponActions';
import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { getAddressDropdowns } from '@/actions/addressActions';
import {
    saveCoupons,
    saveSelectedArea,
    saveLoadingState,
    getSelectedArea,
    clearAllFilters
} from '@/helpers/couponStateManager';

const GlobalFilterSection = () => {
    const [selectedArea, setSelectedArea] = useState('');
    const [loading, setLoading] = useState(false);
    const [areas, setAreas] = useState([]);

    const clearFilters = async () => {
        setSelectedArea('');
        setLoading(true);
        saveLoadingState(true);

        try {
            const response = await fetchAllCoupons();
            if (response?.coupons) {
                // Update localStorage
                saveCoupons(response.coupons);
                // Clear area filter in localStorage
                clearAllFilters();
            }
        } catch (error) {
            console.error('Error clearing filters:', error);
        } finally {
            setLoading(false);
            saveLoadingState(false);
        }
    };

    const handleAreaChange = async (e) => {
        const area = e.target.value;
        setSelectedArea(area);
        saveSelectedArea(area);

        try {
            setLoading(true);
            saveLoadingState(true);

            if (area === '') {
                // If "All Areas" is selected, fetch all coupons
                const response = await fetchAllCoupons();
                if (response?.coupons) {
                    saveCoupons(response.coupons);
                }
            } else {
                // Fetch coupons for selected area
                const response = await fetchAreaCoupons(area);
                if (response?.coupons) {
                    saveCoupons(response.coupons);
                }
            }
        } catch (error) {
            console.error('Error fetching coupons by area:', error);
        } finally {
            setLoading(false);
            saveLoadingState(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                saveLoadingState(true);

                // Get the previously selected area from localStorage
                const storedArea = getSelectedArea();
                if (storedArea) {
                    setSelectedArea(storedArea);
                }

                // Fetch address dropdowns
                const dropdownResponse = await getAddressDropdowns();
                if (dropdownResponse?.areaData) {
                    setAreas(dropdownResponse.areaData);
                }

                // Fetch coupons based on stored area or fetch all
                let couponResponse;
                if (storedArea) {
                    couponResponse = await fetchAreaCoupons(storedArea);
                } else {
                    couponResponse = await fetchAllCoupons();
                }

                if (couponResponse?.coupons) {
                    saveCoupons(couponResponse.coupons);
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoading(false);
                saveLoadingState(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-green-400 sticky top-0 z-10 p-4 border-b-6 border-black">
            <div className="container mx-auto">
                <div className="flex justify-between items-start sm:items-center">
                    <h2 className="text-xl font-black text-black mb-2 sm:mb-0">FIND COUPONS</h2>
                    <button
                        onClick={clearFilters}
                        className={`text-sm font-bold ${selectedArea ? 'bg-red-500 text-white px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all' : 'text-gray-600'}`}
                        disabled={!selectedArea}
                    >
                        {selectedArea ? 'CLEAR FILTER' : 'CLEAR FILTER'}
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="w-full sm:w-64">
                        <label htmlFor="area" className="block text-sm font-black text-black mb-1">
                            FILTER BY AREA
                        </label>
                        <div className="relative">
                            <select
                                id="area"
                                className="w-full p-2 pl-10 border-4 border-black rounded-none bg-white font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] focus:outline-none"
                                value={selectedArea}
                                onChange={handleAreaChange}
                            >
                                <option value="">ALL AREAS</option>
                                {areas.map((area) => (
                                    <option key={area.id} value={area.name}>
                                        {area.name.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            <MapPin size={16} className="absolute left-3 top-3 text-black" />
                        </div>
                    </div>

                    {selectedArea && (
                        <div className="flex items-center mt-2 sm:mt-6">
                            <span className="bg-yellow-300 text-black text-sm font-bold px-3 py-2 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)] flex items-center">
                                <MapPin size={14} className="mr-1" />
                                {selectedArea.toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GlobalFilterSection;