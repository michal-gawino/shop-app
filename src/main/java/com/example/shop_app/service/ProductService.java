package com.example.shop_app.service;

import com.example.shop_app.dto.SearchRequest;
import com.example.shop_app.entity.Product;
import com.example.shop_app.repository.ProductRepository;
import com.example.shop_app.search.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

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

    public List<Product> findTop5BestRated() {
        return productRepository.findTop5ByOrderByRatingDesc();
    }

    public List<String> findAllCategories() {
        Query query = Query.query(Criteria.where("id").exists(true)).with(Sort.by("category"));
        return mongoTemplate.findDistinct(query, "category", Product.class, String.class);

    }

    public SearchResponse<Product> search(SearchRequest searchRequest, Pageable pageable) {
        ProjectionOperation projectionOperation = project().andExclude(Fields.UNDERSCORE_ID).and(Fields.UNDERSCORE_ID).as("value");
        ProjectionOperation rangeProjection = project().and(Fields.UNDERSCORE_ID).as("range").andExclude(Fields.UNDERSCORE_ID).andInclude("count");
        SkipOperation skipOperation = Aggregation.skip(pageable.getOffset());
        LimitOperation limit = limit(pageable.getPageSize());
        Criteria condition = Criteria.where("_id").exists(true);
        Query query = Query.query(condition);
        FacetOperation facetOperation = facet(unwind("tags"), group("tags"), projectionOperation).as("tags")
                .and((group("category")), projectionOperation).as("categories")
                .and(bucketAuto("price", 4), rangeProjection).as("prices")
                .and(bucketAuto("rating", 4), rangeProjection).as("ratings")
                .and(match(condition), sort(Sort.by("_id")), skipOperation, limit).as("results");

        long count = mongoTemplate.exactCount(query, Product.class);
        Aggregation aggregation = newAggregation(facetOperation);
        AggregationResults<AggregationResponse> aggregationResults = mongoTemplate.aggregate(aggregation, Product.class, AggregationResponse.class);
        AggregationResponse aggregationResponse = Optional.ofNullable(aggregationResults.getUniqueMappedResult()).orElse(AggregationResponse.empty());
        PageImpl<Product> page = new PageImpl<>(aggregationResponse.results(), pageable, count);
        Facet facet = new Facet(aggregationResponse.tags(), aggregationResponse.categories(), aggregationResponse.prices(), aggregationResponse.ratings());
        return new SearchResponse<>(page, facet);
    }
}
