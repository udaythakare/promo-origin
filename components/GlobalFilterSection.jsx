'use client'

import { fetchAllCoupons, fetchAreaCoupons, fetchLocationBasedCoupons } from '@/actions/couponActions';
import React, { useEffect, useState, useRef } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';
import { getAddressDropdowns } from '@/actions/addressActions';
import {
    saveCoupons,
    saveSelectedArea,
    saveLoadingState,
    getSelectedArea,
    clearAllFilters,
    getCoupons,
    saveLocationSource
} from '@/helpers/couponStateManager';

const GlobalFilterSection = () => {
    const [selectedArea, setSelectedArea] = useState('');
    const [loading, setLoading] = useState(false);
    const [areas, setAreas] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const dropdownRef = useRef(null);

    // ── EXACT SAME LOGIC as original ─────────────────────────────────────────

    const clearFilters = async () => {
        setSelectedArea('');
        setLoading(true);
        saveLoadingState(true);

        try {
            let city = null;
            try {
                const geoRes = await fetch('/api/geo');
                const geoData = await geoRes.json();
                if (geoData?.success && geoData?.city) city = geoData.city;
            } catch (e) { /* fallback to all */ }

            const response = await fetchLocationBasedCoupons({ city });
            if (response?.coupons) {
                saveCoupons(response.coupons);
                clearAllFilters();
                if (response.locationSource) {
                    saveLocationSource(response.locationSource, response.locationName);
                }
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
                const response = await fetchAllCoupons();
                if (response?.coupons) {
                    saveCoupons(response.coupons);
                }
            } else {
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
        const initializeComponent = async () => {
            const existingCoupons = getCoupons();
            const storedArea = getSelectedArea();

            if (isInitialized && existingCoupons && existingCoupons.length > 0) {
                if (storedArea) {
                    setSelectedArea(storedArea);
                }
                return;
            }

            try {
                setLoading(true);
                saveLoadingState(true);

                if (areas.length === 0) {
                    const dropdownResponse = await getAddressDropdowns();
                    if (dropdownResponse?.areaData) {
                        setAreas(dropdownResponse.areaData);
                    }
                }

                if (storedArea) {
                    setSelectedArea(storedArea);
                    const couponResponse = await fetchAreaCoupons(storedArea, { sortBy: 'newest' });
                    if (couponResponse?.coupons) {
                        saveCoupons(couponResponse.coupons);
                    }
                } else {
                    let detectedCity = null;
                    try {
                        const geoRes = await fetch('/api/geo');
                        const geoData = await geoRes.json();
                        if (geoData?.success && geoData?.city) {
                            detectedCity = geoData.city;
                        }
                    } catch (e) {
                        console.error('Failed to detect city from IP:', e);
                    }

                    if (!existingCoupons || existingCoupons.length === 0 || !isInitialized) {
                        const couponResponse = await fetchLocationBasedCoupons({
                            city: detectedCity,
                            sortBy: 'newest'
                        });
                        if (couponResponse?.coupons) {
                            saveCoupons(couponResponse.coupons);
                            if (couponResponse.locationSource) {
                                saveLocationSource(couponResponse.locationSource, couponResponse.locationName);
                            }
                        }
                    }
                }

                setIsInitialized(true);
            } catch (error) {
                console.error('Error initializing component:', error);
            } finally {
                setLoading(false);
                saveLoadingState(false);
            }
        };

        initializeComponent();
    }, []);

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

    // ── UPDATED UI only — same logic, new theme ───────────────────────────────

    return (
        <div style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}>

            {/* Header */}
            <div style={{
                padding: '14px 16px 10px',
                borderBottom: '1px solid rgba(55,22,168,0.1)',
                background: 'linear-gradient(135deg, #3716a8 0%, #5a32e0 100%)',
                borderRadius: '14px 14px 0 0',
            }}>
                <p style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: 'rgba(255,255,255,0.7)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                }}>
                    Filter Coupons
                </p>
                <p style={{
                    margin: '2px 0 0',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'white',
                }}>
                    Find by Area
                </p>
            </div>

            {/* Body */}
            <div style={{ padding: '14px 16px 16px' }}>

                {/* Area dropdown */}
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#6b7280',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                    }}>
                        Select Area
                    </label>

                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            border: `1.5px solid ${dropdownOpen ? '#3716a8' : 'rgba(55,22,168,0.2)'}`,
                            borderRadius: '10px',
                            background: dropdownOpen ? 'rgba(55,22,168,0.04)' : 'white',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: dropdownOpen ? '0 0 0 3px rgba(55,22,168,0.08)' : 'none',
                            fontFamily: 'inherit',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPin size={15} color="#3716a8" />
                            <span style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: selectedArea ? '#0f0c1d' : '#9ca3af',
                            }}>
                                {selectedArea || 'All Areas'}
                            </span>
                        </div>
                        <ChevronDown
                            size={15}
                            color="#3716a8"
                            style={{
                                transition: 'transform 0.2s ease',
                                transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                            }}
                        />
                    </button>

                    {/* Dropdown list */}
                    {dropdownOpen && (
                        <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 6px)',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '1.5px solid rgba(55,22,168,0.15)',
                            borderRadius: '12px',
                            boxShadow: '0 16px 40px -8px rgba(55,22,168,0.2)',
                            zIndex: 100,
                            overflow: 'hidden',
                            animation: 'filterDropIn 0.18s ease',
                        }}>
                            <style>{`
                                @keyframes filterDropIn {
                                    from { opacity: 0; transform: translateY(-6px); }
                                    to   { opacity: 1; transform: translateY(0); }
                                }
                                .filter-area-item:hover {
                                    background: rgba(55,22,168,0.06) !important;
                                    color: #3716a8 !important;
                                    padding-left: 20px !important;
                                }
                            `}</style>

                            {/* All Areas option */}
                            <button
                                onClick={() => handleAreaChange('')}
                                className="filter-area-item"
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 14px',
                                    background: selectedArea === '' ? 'rgba(55,22,168,0.07)' : 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid #f3f4f6',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: selectedArea === '' ? 700 : 600,
                                    color: selectedArea === '' ? '#3716a8' : '#374151',
                                    transition: 'all 0.13s ease',
                                    fontFamily: 'inherit',
                                    textAlign: 'left',
                                }}
                            >
                                <MapPin size={14} color={selectedArea === '' ? '#3716a8' : '#9ca3af'} />
                                All Areas
                                {selectedArea === '' && (
                                    <span style={{
                                        marginLeft: 'auto',
                                        width: 6, height: 6,
                                        borderRadius: '50%',
                                        background: '#3716a8',
                                    }} />
                                )}
                            </button>

                            {/* Area list */}
                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {areas.map((area) => (
                                    <button
                                        key={area.id}
                                        onClick={() => handleAreaChange(area.name)}
                                        className="filter-area-item"
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '10px 14px',
                                            background: selectedArea === area.name ? 'rgba(55,22,168,0.07)' : 'transparent',
                                            border: 'none',
                                            borderBottom: '1px solid #f9fafb',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            fontWeight: selectedArea === area.name ? 700 : 500,
                                            color: selectedArea === area.name ? '#3716a8' : '#374151',
                                            transition: 'all 0.13s ease',
                                            fontFamily: 'inherit',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <MapPin size={13} color={selectedArea === area.name ? '#3716a8' : '#d1d5db'} />
                                        {area.name}
                                        {selectedArea === area.name && (
                                            <span style={{
                                                marginLeft: 'auto',
                                                width: 6, height: 6,
                                                borderRadius: '50%',
                                                background: '#3716a8',
                                            }} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Active filter chip */}
                {selectedArea && (
                    <div style={{
                        marginTop: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '5px 10px',
                            background: 'rgba(55,22,168,0.07)',
                            border: '1.5px solid rgba(55,22,168,0.2)',
                            borderRadius: '20px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#3716a8',
                        }}>
                            <MapPin size={12} />
                            {selectedArea}
                        </div>
                        <button
                            onClick={clearFilters}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '5px 10px',
                                background: 'transparent',
                                border: '1.5px solid #fca5a5',
                                borderRadius: '20px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: '#dc2626',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                transition: 'all 0.13s ease',
                            }}
                        >
                            <X size={11} />
                            Clear
                        </button>
                    </div>
                )}

                {/* Loading indicator */}
                {loading && (
                    <div style={{
                        marginTop: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.78rem',
                        color: '#6b7280',
                        fontWeight: 500,
                    }}>
                        <div style={{
                            width: 14, height: 14,
                            border: '2px solid rgba(55,22,168,0.2)',
                            borderTopColor: '#3716a8',
                            borderRadius: '50%',
                            animation: 'spin 0.7s linear infinite',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        Fetching coupons...
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalFilterSection;