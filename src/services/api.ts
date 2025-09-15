import { AddToCartResponse, GetUserCartResponse } from "@/interfaces";
import { BrandsResponse, CategoriesResponse, ProductsResponse, SingleBrandResponse, SingleCategoryResponse, SingleProductResponse } from "@/types";
import { useSession } from "next-auth/react";

class ApiServices {
    #baseURL = 'https://ecommerce.routemisr.com';
    async getAllProducts(): Promise<ProductsResponse> {
        return await fetch(this.#baseURL + '/api/v1/products', {
            next: {
                revalidate: 60, // ISR Caching
            },
            cache: 'no-cache', // get data from cache if not modified
        }).then((res) => res.json());
    }
    async getSingleProduct(
        id: string | string[]
    ): Promise<SingleProductResponse> {
        return await fetch(this.#baseURL + `/api/v1/products/${id}`).then((res) =>
            res.json()
        );
    }
    #getHeader() {
        return {
            'Content-Type': 'application/json', // must
            token:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZDZhZWYxZDU5NjA0YTlhMWJhZjU1NSIsIm5hbWUiOiJBaG1lZCBBYmQgQWwtTXV0aSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU3OTQ3NDQ3LCJleHAiOjE3NjU3MjM0NDd9.0H_KazMhwEtm2MWDahpUAcyBhUCwJOyPSc21MFQKpkc',
        };
    }
    async addProductToCart(id: String): Promise<AddToCartResponse> {
        return await fetch(this.#baseURL + '/api/v1/cart', {
            method: 'POST',
            body: JSON.stringify({
                // must json stringify
                productId: id,
            }),
            headers: this.#getHeader(),
        }).then((res) => res.json());
    }

    async getUserCart(): Promise<GetUserCartResponse> {
        return await fetch(this.#baseURL + '/api/v1/cart', {
            headers: this.#getHeader(),
        }).then((res) => res.json());
    }
    async removeSpecificItem(id: string | string[]): Promise<any> {
        return await fetch(this.#baseURL + `/api/v1/cart/${id}`, {
            method: 'DELETE',
            headers: this.#getHeader(),
        }).then((res) => res.json());
    }

    async UpdateCartCount(id: string, count: number): Promise<any> {
        return await fetch(this.#baseURL + `/api/v1/cart/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                count
            }),
            headers: this.#getHeader(),
        }).then((res) => res.json());
    }

    async ClearCart(): Promise<any> {
        return await fetch(this.#baseURL + `/api/v1/cart`, {
            method: 'DELETE',
            headers: this.#getHeader(),
        }).then((res) => res.json());
    }

    async checkout(cartId: string) {
        return await fetch(this.#baseURL + "/api/v1/orders/checkout-session/" + cartId + "?url=http://localhost:3000", {
            body: JSON.stringify({
                "shippingAddress": {
                    "details": "details",
                    "phone": "01010700999",
                    "city": "Cairo"
                }
            }
            ),
            headers: this.#getHeader(),
            method: 'post'
        }).then(res => res.json())
    }

    async getAllBrands(): Promise<BrandsResponse> {
        return await fetch(this.#baseURL + "/api/v1/brands").then(res => res.json())
    }


    async getSpecificBrand(BrandId: string | string[]): Promise<SingleBrandResponse> {
        return await fetch(this.#baseURL + '/api/v1/brands/' + BrandId).then(res => res.json())
    }
    async getAllCategories(): Promise<CategoriesResponse> {
        return await fetch(this.#baseURL + '/api/v1/categories').then(res => res.json())
    }
    async getSpecificCategory(catId: string | string[]): Promise<SingleCategoryResponse> {
        return await fetch(this.#baseURL + '/api/v1/categories/' + catId).then(res => res.json())
    }

    async login(email: string, password: string) {
        return await fetch(this.#baseURL + "/api/v1/auth/signin", {
            body: JSON.stringify({
                email, password
            }),
            headers: this.#getHeader(),
            method: 'post'
        }).then(res => res.json())
    }
}
// first take instance of the class

export const apiServices = new ApiServices();