'use client';
import { Category } from '@/interfaces';
import { apiServices } from '@/services/api';
import { CategoriesResponse, SingleCategoryResponse } from '@/types';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function SpasCategory() {
  const { id } = useParams();
  console.log(id);
  const [Category, setCategory] = useState<Category | null>(null);
  async function getSpasCategory() {
    const response: SingleCategoryResponse =
      await apiServices.getSpecificCategory(id ?? '');
    // setCategory();
    console.log(response);
  }
  useEffect(() => {
    getSpasCategory();
  }, [id]);
  return <div>h1</div>;
}
