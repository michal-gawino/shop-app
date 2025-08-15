package com.example.shop_app.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.List;

@Document(collection = "cart")
public class Cart {

    @MongoId
    private String userId;

    @Field(targetType = FieldType.ARRAY)
    private List<CartItem> items;

    public Cart(String id, List<CartItem> items) {
        this.userId = id;
        this.items = items;
    }

    public Cart() {
    }

    public String getId() {
        return userId;
    }

    public void setId(String id) {
        this.userId = id;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }
}
