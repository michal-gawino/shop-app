package com.example.shop_app.controller;

import com.example.shop_app.dto.SearchRequest;
import com.example.shop_app.entity.Product;
import com.example.shop_app.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping(path = "category")
    public List<String> getAllCategories(){
        return productService.findAllCategories();
    }

    @GetMapping(path = "best-rated")
    public List<Product> getBestRatedProducts(){
        return productService.findTop5BestRated();
    }

    @PostMapping("search")
    public Page<Product> search(@RequestBody SearchRequest searchRequest, Pageable pageable){
        return productService.search(searchRequest, pageable);
    }

}
