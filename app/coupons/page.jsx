"use client";

import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";
import {
  Loader2,
  Filter,
  MapPin,
  Percent,
  Tag,
  ChevronRight,
  Search,
  ShoppingBag,
  Locate,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import MobileFilters from "@/components/layout/MobileFilters";
import SelectedFilters from "@/components/layout/SelectedFilters";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CouponsPage() {
  const [session, setSession] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [radius, setRadius] = useState(5);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArea, setSelectedArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const itemsPerPage = 10;

  // Fetch user session on mount
  useEffect(() => {
    async function loadSession() {
      try {
        const userSession = await getSession();
        setSession(userSession);
      } catch (err) {
        console.error("Error fetching session:", err);
      }
    }
    loadSession();
  }, []);

  // Fetch areas and business categories on mount
  useEffect(() => {
    async function fetchAreasAndCategories() {
      try {
        // Fetch categories
        const { data: categoryData, error: categoryError } = await supabase
          .from("business_categories")
          .select("id, name");

        if (categoryError) throw categoryError;
        setCategories(categoryData || []);

        // Fetch areas - assuming you have an areas table
        // If you don't have one, you could use city/state data from your businesses table
        // const { data: areaData, error: areaError } = await supabase
        //   .from("areas") // Replace with your actual table name
        //   .select("id, name");

        // if (areaError) throw areaError;
        // setAreas(areaData || []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    }

    fetchAreasAndCategories();
  }, []);

  // Get user's location when requested
  const getUserLocation = () => {
    setInitialLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setInitialLoading(false);
          // We'll call fetchCoupons directly here but pass the location explicitly
          fetchCoupons({ latitude, longitude });
        },
        (err) => {
          console.error("Error getting location:", err);
          setError(
            "Unable to access your location. Please enable location services."
          );
          setInitialLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setInitialLoading(false);
    }
  };

  // This effect will refetch coupons when radius changes
  useEffect(() => {
    // Only fetch if location exists and a search has been performed already
    if (location && searchPerformed) {
      fetchCoupons();
    }
  }, [radius]);

  async function fetchCoupons(explicitLocation = null) {
    // Use explicitly provided location if available, otherwise use the state
    const locationToUse = explicitLocation || location;

    if (!locationToUse) return;

    setLoading(true);
    setSearchPerformed(true);

    try {
      // Call the updated stored function to find nearest coupons
      const { data, error } = await supabase.rpc("find_nearest_coupons2", {
        user_lat: locationToUse.latitude,
        user_long: locationToUse.longitude,
        radius_km: radius,
        filter_category_id: selectedCategory,
        limit_count: itemsPerPage * page,
      });

      console.log(data, 'this is data');

      if (error) throw error;

      // Save search history if user is logged in
      if (session?.user?.id) {
        try {
          // Make sure we're sending all required fields according to your schema
          const searchHistoryData = {
            user_id: session.user.id,
            latitude: locationToUse.latitude,
            longitude: locationToUse.longitude,
            search_radius_km: radius,
            // Only include category_filter if it has a value
            ...(selectedCategory && { category_filter: selectedCategory }),
          };

          const { error: historyError } = await supabase
            .from("coupon_search_history")
            .insert(searchHistoryData);

          if (historyError) {
            console.error("Error saving search history:", historyError);
          }
        } catch (historyError) {
          // Just log the error but don't fail the main operation
          console.error("Error saving search history:", historyError);
        }
      }

      setCoupons(data || []);
      setHasMore(data && data.length === itemsPerPage * page);
      setLoading(false);
      setInitialLoading(false);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setError("Failed to load coupons. Please try again.");
      setLoading(false);
      setInitialLoading(false);
    }
  }

  // async function fetchCategoryCoupons(categoryId) {
  //   setLoading(true);
  //   console.log('calling')
  //   try {
  //     // Use a PostgreSQL function that you'll need to create in your database
  //     const { data, error } = await supabase
  //       .rpc('get_category_coupons', {
  //         p_category_id: categoryId
  //       });

  //     console.log(data, 'this is data from category coupons')

  //     if (error) throw error;

  //     setCoupons(data || []);
  //     setHasMore(false);

  //   } catch (err) {
  //     console.error("Error fetching coupons:", err);
  //     setError("Failed to load coupons. Please try again.");
  //   }
  //   setLoading(false);
  // }
  async function fetchCategoryCoupons(categoryId) {
    setLoading(true);
    setSearchPerformed(true);
    // Clear any previous location so that the UI knows we're in "category" mode
    setLocation(null);

    try {
      const { data, error } = await supabase
        .rpc('get_category_coupons', { p_category_id: categoryId });

      if (error) throw error;

      // Ensure each coupon has a distance_km field (null) so the UI's toFixed check won't crash
      const normalized = (data || []).map(item => ({
        ...item,
        distance_km: null
      }));

      setCoupons(normalized);
      setHasMore(false);
    } catch (err) {
      console.error("Error fetching coupons by category:", err);
      setError("Failed to load coupons. Please try again.");
    } finally {
      setLoading(false);
    }
  }


  console.log(coupons, 'this is current coupons')


  function loadMore() {
    setPage((prev) => prev + 1);
  }

  function handleRadiusChange(e) {
    setRadius(Number(e.target.value));
  }

  function handleCategoryChange(e) {
    setSelectedCategory(e.target.value === "" ? null : e.target.value);
    fetchCategoryCoupons(e.target.value);
  }

  function handleAreaChange(e) {
    setSelectedArea(e.target.value);
  }

  function handleSearch() {
    setPage(1);
    fetchCoupons();
  }

  function clearFilters() {
    setSelectedCategory(null);
    setSelectedArea("");
    setRadius(5);
    setLocation(null);
    setSearchPerformed(false);
    setCoupons([]);
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Filters Section */}
      <div className="bg-white shadow-md sticky top-0 z-10 p-4">
        <div className="container mx-auto">
          <h2 className="text-lg font-semibold mb-3">Find Coupons</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Area Selection */}
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Area
              </label>
              <select
                id="area"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={selectedArea}
                onChange={handleAreaChange}
                disabled={location !== null}
              >
                <option value="">Select an area</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory || ""}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Radius (only shown when location is used) */}
            <div className={location ? "" : "hidden md:block"}>
              <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
                Radius (km)
              </label>
              <select
                id="radius"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={radius}
                onChange={handleRadiusChange}
                disabled={!location}
              >
                <option value="1">1 km</option>
                <option value="2">2 km</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="20">20 km</option>
                <option value="50">50 km</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex flex-col justify-end space-y-2">
              <button
                onClick={getUserLocation}
                disabled={loading || initialLoading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md flex items-center justify-center"
              >
                <Locate size={16} className="mr-2" />
                {location ? "Update My Location" : "Use My Location"}
              </button>

              <button
                onClick={handleSearch}
                disabled={loading || initialLoading || (!location && !selectedArea)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin mr-2" />
                ) : (
                  <Search size={16} className="mr-2" />
                )}
                Search Coupons
              </button>
            </div>
          </div>

          {/* Applied Filters Section */}
          {(selectedCategory || location || selectedArea) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Filters:</span>

              {location && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <MapPin size={12} className="mr-1" />
                  Current Location (within {radius} km)
                </span>
              )}

              {selectedArea && !location && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <MapPin size={12} className="mr-1" />
                  {areas.find(a => a.id == selectedArea)?.name || "Selected Area"}
                </span>
              )}

              {selectedCategory && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <Tag size={12} className="mr-1" />
                  {categories.find(c => c.id == selectedCategory)?.name || "Selected Category"}
                </span>
              )}

              <button
                onClick={clearFilters}
                className="text-xs text-gray-600 hover:text-gray-800 underline"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mt-4 text-center">
            {error}
          </div>
        ) : initialLoading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <p className="mt-4 text-gray-600">Finding coupons...</p>
          </div>
        ) : !searchPerformed ? (
          <div className="bg-blue-50 text-blue-600 p-8 rounded-lg mt-4 text-center">
            <Search className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-medium">Find Coupons Near You</h3>
            <p className="mt-2">
              Select an area or use your current location to discover available coupons
            </p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="bg-blue-50 text-blue-600 p-8 rounded-lg mt-4 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-medium">No coupons found</h3>
            <p className="mt-2">
              Try changing your filters or selecting a different area
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((coupon, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="bg-blue-500 text-white p-3">
                    <h3 className="font-bold truncate">
                      {coupon.business_name}
                    </h3>
                  </div>
                  <div className="relative h-48 w-full">
                    <Image
                      src={coupon.image_url || "/placeholder-coupon.jpg"}
                      alt={coupon.coupon_title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-lg mb-2">
                      {coupon.coupon_title}
                    </h4>
                    <div className="flex items-center mb-2">
                      <Percent size={16} className="text-blue-500 mr-2" />
                      <span className="font-bold">
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}% off`
                          : coupon.discount_type === "fixed_amount"
                            ? `$${coupon.discount_value} off`
                            : coupon.discount_type === "buy_one_get_one"
                              ? "Buy One Get One"
                              : "Free Item"}
                      </span>
                    </div>
                    <div className="flex items-start mb-3">
                      <MapPin
                        size={16}
                        className="text-gray-500 mr-2 mt-1 flex-shrink-0"
                      />
                      <span className="text-gray-600 text-sm">
                        {coupon.location_address}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
                      {coupon.distance_km !== null ? (
                        <span className="text-sm text-gray-500">
                          {coupon.distance_km.toFixed(1)} km away
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">
                          &nbsp;
                        </span>
                      )}
                      <Link
                        href={`/coupons/${coupon.coupon_id}`}
                        className="flex items-center text-blue-600 font-medium text-sm"
                      >
                        View details
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Loading...
                    </span>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}