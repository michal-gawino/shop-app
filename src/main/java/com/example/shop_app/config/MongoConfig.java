package com.example.shop_app.config;

import com.example.shop_app.entity.Product;
import com.example.shop_app.service.ProductService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@EnableMongoRepositories("com.example.shop_app.repository")
@Configuration
public class MongoConfig {

    @Autowired
    private ProductService productService;

    @EventListener(ContextRefreshedEvent.class)
    public void initDbProducts() throws IOException {
        if (productService.count() == 0) {
            File productsFile = new ClassPathResource("products.json").getFile();
            String content = Files.readString(productsFile.toPath());
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.findAndRegisterModules();
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            List<Product> productList = objectMapper.readValue(content, new TypeReference<>() {
            });
            productService.saveAll(productList);
        }
    }
}
