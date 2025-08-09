package com.example.shop_app.controller;

import com.example.shop_app.dto.SearchRequest;
import com.example.shop_app.entity.Product;
import com.example.shop_app.search.SearchResponse;
import com.example.shop_app.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(path = "product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public Page<Product> getAll(Pageable pageable) {
        return productService.findAll(pageable);
    }

    @GetMapping(path = "category")
    public List<String> getAllCategories() {
        return productService.findAllCategories();
    }

    @GetMapping(path = "best-rated")
    public List<Product> getBestRatedProducts() {
        return productService.findTop5BestRated();
    }

    @PostMapping("search")
    public SearchResponse<Product> search(@RequestBody SearchRequest searchRequest, Pageable pageable) throws IOException, InterruptedException {
        return productService.search(searchRequest, pageable);
    }

}
