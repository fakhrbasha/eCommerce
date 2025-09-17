import {
    AddToCartResponse,
    GetUserCartResponse,
} from "@/interfaces";
import {
    BrandsResponse,
    CategoriesResponse,
    ProductsResponse,
    SingleBrandResponse,
    SingleCategoryResponse,
    SingleProductResponse,
} from "@/types";

class ApiServices {
    #baseURL = "https://ecommerce.routemisr.com";

    // dynamic headers
    #getHeader(token?: string) {
        return {
            "Content-Type": "application/json",
            token: token || "",
        };
    }

    // --------- Products ---------
    async getAllProducts(): Promise<ProductsResponse> {
        return await fetch(this.#baseURL + "/api/v1/products", {
            next: {
                revalidate: 60, // ISR caching
            },
            cache: "no-cache",
        }).then((res) => res.json());
    }

    async getSingleProduct(
        id: string | string[]
    ): Promise<SingleProductResponse> {
        return await fetch(this.#baseURL + `/api/v1/products/${id}`).then((res) =>
            res.json()
        );
    }

    // --------- Cart ---------
    async addProductToCart(
        id: string,
        token: string
    ): Promise<AddToCartResponse> {
        return await fetch(this.#baseURL + "/api/v1/cart", {
            method: "POST",
            body: JSON.stringify({ productId: id }),
            headers: this.#getHeader(token),
        }).then((res) => res.json());
    }

    async getUserCart(token: string): Promise<GetUserCartResponse> {
        return await fetch(this.#baseURL + "/api/v1/cart", {
            headers: this.#getHeader(token),
        }).then((res) => res.json());
    }

    async removeSpecificItem(
        id: string | string[],
        token: string
    ): Promise<any> {
        return await fetch(this.#baseURL + `/api/v1/cart/${id}`, {
            method: "DELETE",
            headers: this.#getHeader(token),
        }).then((res) => res.json());
    }

    async updateCartCount(id: string, count: number, token: string): Promise<any> {
        return await fetch(this.#baseURL + `/api/v1/cart/${id}`, {
            method: "PUT",
            body: JSON.stringify({ count }),
            headers: this.#getHeader(token),
        }).then((res) => res.json());
    }

    async clearCart(token: string): Promise<any> {
        return await fetch(this.#baseURL + `/api/v1/cart`, {
            method: "DELETE",
            headers: this.#getHeader(token),
        }).then((res) => res.json());
    }

    async checkout(cartId: string, token: string) {
        return await fetch(
            this.#baseURL +
            "/api/v1/orders/checkout-session/" +
            cartId +
            "?url=http://localhost:3000",
            {
                method: "POST",
                body: JSON.stringify({
                    shippingAddress: {
                        details: "details",
                        phone: "01010700999",
                        city: "Cairo",
                    },
                }),
                headers: this.#getHeader(token),
            }
        ).then((res) => res.json());
    }

    // --------- Brands & Categories ---------
    async getAllBrands(): Promise<BrandsResponse> {
        return await fetch(this.#baseURL + "/api/v1/brands").then((res) =>
            res.json()
        );
    }

    async getSpecificBrand(
        brandId: string | string[]
    ): Promise<SingleBrandResponse> {
        return await fetch(this.#baseURL + "/api/v1/brands/" + brandId).then((res) =>
            res.json()
        );
    }

    async getAllCategories(): Promise<CategoriesResponse> {
        return await fetch(this.#baseURL + "/api/v1/categories").then((res) =>
            res.json()
        );
    }

    async getSpecificCategory(
        catId: string | string[]
    ): Promise<SingleCategoryResponse> {
        return await fetch(this.#baseURL + "/api/v1/categories/" + catId).then(
            (res) => res.json()
        );
    }

    // --------- Auth ---------
    async login(email: string, password: string) {
        return await fetch(this.#baseURL + "/api/v1/auth/signin", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" }, // login doesn't need token
        }).then((res) => res.json());
    }

    async register(name: string, email: string, password: string, rePassword: string, phone: number) {
        return await fetch(this.#baseURL + '/api/v1/auth/signup', {
            method: 'post',
            body: JSON.stringify({ name, email, password, rePassword, phone }),
            headers: { "Content-Type": "application/json" },

        }).then(res => res.json())
    }
    async addToWishList(productId: string, token: string) {
        return await fetch(this.#baseURL + '/api/v1/wishlist', {
            method: 'post',
            headers: this.#getHeader(token),
            body: JSON.stringify({ productId })
        })
    }
    async getAllWishList(token: string) {
        return await fetch(this.#baseURL + '/api/v1/wishlist', {
            headers: this.#getHeader(token),
        }).then(res => res.json())
    }
    async removeItemFormWishList(token: string, productId: string) {
        return await fetch(this.#baseURL + '/api/v1/wishlist/' + productId, {
            headers: this.#getHeader(token),
            method: 'delete'
        }).then(res => res.json())
    }
    async getUserAllOrder() {

    }
    // Address //
    async addUserAddress(name: string, details: string, phone: string, city: string, token: string) {
        return await fetch(this.#baseURL + '/api/v1/addresses', {
            body: JSON.stringify({ name, details, phone, city }),
            headers: this.#getHeader(token),
            method: 'post'
        }).then(res => res.json())
    }
}



export const apiServices = new ApiServices();
