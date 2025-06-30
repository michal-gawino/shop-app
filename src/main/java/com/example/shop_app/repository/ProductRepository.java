package com.example.shop_app.repository;

import com.example.shop_app.entity.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, Long> {


    List<Product> findTop5ByOrderByRatingDesc();
}
