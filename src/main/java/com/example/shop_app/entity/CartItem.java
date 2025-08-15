package com.example.shop_app.entity;

import org.springframework.data.mongodb.core.mapping.DocumentReference;

public class CartItem {

    @DocumentReference(lazy = true)
    private Product product;
    private int quantity;

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
