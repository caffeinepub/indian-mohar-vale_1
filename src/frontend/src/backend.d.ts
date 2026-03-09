import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    descriptionHindi: string;
    descriptionEnglish: string;
    nameHindi: string;
    nameEnglish: string;
    price: bigint;
    priceLabel: string;
}
export interface ShopInfo {
    ownerName: string;
    phoneNumber1: string;
    phoneNumber2: string;
    address: string;
    shopName: string;
    gstinNumber: string;
}
export interface backendInterface {
    addProduct(id: string, nameEnglish: string, nameHindi: string, descriptionEnglish: string, descriptionHindi: string, price: bigint, priceLabel: string): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getProduct(id: string): Promise<Product | null>;
    getShopInfo(): Promise<ShopInfo>;
}
