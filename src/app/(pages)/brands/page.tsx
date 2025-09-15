'use client';
import { LoadingSpinner } from '@/components';
import { Brand } from '@/interfaces';
import { apiServices } from '@/services/api';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getBrands() {
    setIsLoading(true);
    const response = await apiServices.getAllBrands();
    setBrands(response.data);
    setIsLoading(false);
  }

  useEffect(() => {
    getBrands();
  }, []);

  return (
    <div className="container mx-auto px-6 py-12">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Our <span className="text-blue-600">Brands</span>
            </h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Discover top brands that bring you quality and trust.
            </p>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <div
                key={brand._id}
                className="group p-6 border rounded-2xl shadow-sm bg-white dark:bg-gray-900 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-center h-24 mb-4 dark:bg-gray-800 rounded-xl">
                  {brand.image ? (
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="max-h-20 object-contain"
                    />
                  ) : (
                    <span className="text-gray-400">No Logo</span>
                  )}
                </div>
                <Link
                  href={`/brands/${brand._id}`}
                  className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-blue-600"
                >
                  {brand.name}
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
