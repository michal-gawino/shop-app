package com.example.shop_app.controller;

import com.example.shop_app.entity.Cart;
import com.example.shop_app.entity.CartItem;
import com.example.shop_app.entity.Product;
import com.example.shop_app.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public Cart getUserCart(){
        return cartService.getUserCart();
    }

    @PostMapping("add")
    public void addItem(@RequestBody Product product){
        cartService.addItem(product.getId());
    }

    @PutMapping("edit")
    public void addItem(@RequestBody CartItem cartItem){
        cartService.editItem(cartItem);
    }

    @DeleteMapping("remove/{id}")
    public void addItem(@PathVariable("id") Long productId){
        cartService.removeItem(productId);
    }
}
