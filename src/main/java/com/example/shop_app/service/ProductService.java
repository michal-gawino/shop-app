package com.example.shop_app.service;

import com.example.shop_app.entity.Product;
import com.example.shop_app.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.CriteriaDefinition;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private ProductRepository productRepository;

    public List<Product> saveAll(List<Product> products) {
        return productRepository.saveAll(products);
    }

    public long count() {
        return productRepository.count();
    }

    public List<Product> findTop5BestRated(){
        return productRepository.findTop5ByOrderByRatingDesc();
    }

    public List<String> findAllCategories() {
        Query query = Query.query(Criteria.where("id").exists(true)).with(Sort.by("category"));
        return mongoTemplate.findDistinct(query, "category", Product.class, String.class);

    }
}
