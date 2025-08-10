package com.example.shop_app.service;

import com.example.shop_app.entity.Product;
import com.example.shop_app.entity.Review;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private AuthService authService;

    public void add(Long productId, Review review) {
        Criteria criteria = Criteria.where("_id").is(productId);
        Query findByIdQuery = Query.query(criteria);
        Update update = new Update().push("reviews", review);
        mongoTemplate.findAndModify(findByIdQuery, update, Product.class);
    }

    public void remove(Long productId, String email){
        Criteria criteria = Criteria.where("_id").is(productId);
        Query findByIdQuery = Query.query(criteria);
        Update pull = new Update().pull("reviews", new Document("email", email));
        mongoTemplate.findAndModify(findByIdQuery, pull, Product.class);
    }
}