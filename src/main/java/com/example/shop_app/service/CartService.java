package com.example.shop_app.service;

import com.example.shop_app.dto.User;
import com.example.shop_app.entity.Cart;
import com.example.shop_app.entity.CartItem;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private UserService userService;

    public Cart getUserCart() {
        String id = userService.getCurrentUser().id();
        Criteria criteria = Criteria.where("userId").is(id);
        Query query = Query.query(criteria);
        return mongoTemplate.findOne(query, Cart.class);
    }

    public void addItem(Long id) {
        String currentUserId = userService.getCurrentUser().id();
        Criteria criteria = Criteria.where("userId").is(currentUserId);
        Update update = new Update().push("items", new Document("quantity", 1).append("product", id));
        Query query = Query.query(criteria);
        mongoTemplate.upsert(query, update, Cart.class);
    }

    public void removeItem(Long id) {
        String currentUserId = userService.getCurrentUser().id();
        Criteria criteria = Criteria.where("userId").is(currentUserId);
        Criteria pullQuery = Criteria.where("product").is(id);
        Update update = new Update().pull("items", Query.query(pullQuery));
        Query query = Query.query(criteria);
        mongoTemplate.findAndModify(query, update, Cart.class);
    }

    public void editItem(CartItem cartItem) {
        String currentUserId = userService.getCurrentUser().id();
        Criteria criteria = Criteria.where("userId").is(currentUserId).and("items.product").is(cartItem.getProduct().getId());
        Update update = new Update().set("items.$.quantity", cartItem.getQuantity());
        Query query = Query.query(criteria);
        mongoTemplate.findAndModify(query, update, Cart.class);
    }

    public void clear() {
        User currentUser = userService.getCurrentUser();
        if (currentUser != null) {
            Criteria criteria = Criteria.where("userId").is(currentUser.id());
            Query query = Query.query(criteria);
            mongoTemplate.findAndRemove(query, Cart.class);
        }
    }

    boolean productExistsInCart(String userId, Long productId) {
        Criteria criteria = Criteria.where("userId").is(userId).and("items.product").is(productId);
        Query query = Query.query(criteria);
        return mongoTemplate.exists(query, Cart.class);
    }
}
