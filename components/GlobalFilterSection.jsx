'use client'

import { fetchAllCoupons, fetchAreaCoupons } from '@/actions/couponActions';
import React, { useEffect, useState, useRef } from 'react';
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
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    const handleAreaChange = async (area) => {
        setSelectedArea(area);
        saveSelectedArea(area);
        setDropdownOpen(false);

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
                    couponResponse = await fetchAreaCoupons(storedArea, { sortBy: 'newest' });
                } else {
                    couponResponse = await fetchAllCoupons({ sortBy: 'newest' });
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

    // Handle clicks outside of the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-green-200 sticky top-0 z-10 p-4 border-b-6 border-black">
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
                    <div className="w-full sm:w-64 relative" ref={dropdownRef}>
                        <label htmlFor="area" className="block text-sm font-black text-black mb-1">
                            FILTER BY AREA
                        </label>
                        <div className="relative">
                            <button
                                className="w-full p-2 pl-10 border-4 border-black rounded-none bg-white font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] focus:outline-none flex justify-between items-center"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <div className="flex items-center">
                                    <MapPin size={16} className="absolute left-3 text-black" />
                                    <span>{selectedArea ? selectedArea.toUpperCase() : 'ALL AREAS'}</span>
                                </div>
                                <svg
                                    className={`h-5 w-5 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`}
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

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0)] py-1 z-50">
                                    <div className="px-4 py-3 border-b-2 border-black bg-yellow-400">
                                        <p className="text-sm font-black uppercase">Filter By Area</p>
                                    </div>

                                    <div className="px-3 py-2">
                                        <button
                                            onClick={() => handleAreaChange('')}
                                            className={`w-full text-left px-3 py-2 text-sm font-bold hover:bg-yellow-300 ${selectedArea === '' ? 'bg-yellow-200' : ''}`}
                                        >
                                            ALL AREAS
                                        </button>

                                        {areas.map((area) => (
                                            <button
                                                key={area.id}
                                                onClick={() => handleAreaChange(area.name)}
                                                className={`w-full text-left px-3 py-2 text-sm font-bold hover:bg-yellow-300 flex items-center ${selectedArea === area.name ? 'bg-yellow-200' : ''}`}
                                            >
                                                <MapPin size={14} className="mr-2" />
                                                {area.name.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>

                                    {selectedArea && (
                                        <div className="px-4 py-2 border-t-2 border-black">
                                            <button
                                                onClick={clearFilters}
                                                className="w-full bg-red-400 text-black text-sm font-bold py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase"
                                            >
                                                Clear Filter
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
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