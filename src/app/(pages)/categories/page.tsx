'use client';
import { LoadingSpinner } from '@/components';
import { Category } from '@/interfaces';
import { apiServices } from '@/services/api';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  async function getAllCategories() {
    setLoading(true);
    const response = await apiServices.getAllCategories();
    setCategories(response.data);
    setLoading(false);
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Our <span className="text-blue-600">Categories</span>
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Explore a variety of product categories.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        /* Categories Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group p-6 border rounded-2xl shadow-sm bg-white dark:bg-gray-900 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-center h-52 mb-4  dark:bg-gray-800 rounded-xl overflow-hidden">
                {cat.image ? (
                  <Image
                    width={500}
                    height={500}
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-blue-600">
                <Link href={`categories/${cat._id}}`}>{cat.name}</Link>
              </h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
