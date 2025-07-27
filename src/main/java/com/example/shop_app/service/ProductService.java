package com.example.shop_app.service;

import com.example.shop_app.dto.SearchRequest;
import com.example.shop_app.entity.Product;
import com.example.shop_app.repository.ProductRepository;
import com.example.shop_app.search.*;
import com.example.shop_app.search.Range;
import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.util.RegexFlags;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

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
        SkipOperation skip = Aggregation.skip(pageable.getOffset());
        LimitOperation limit = limit(pageable.getPageSize());
        Criteria filers = createFilters(searchRequest);
        Query query = Query.query(filers);
        MatchOperation match = Aggregation.match(filers);
        FacetOperation facetOperation = facet(unwind("tags"), group("tags"), projectionOperation).as("tags")
                .and((group("category")), projectionOperation).as("categories")
                .and(bucketAuto("price", 4), rangeProjection).as("prices")
                .and(bucketAuto("rating", 4), rangeProjection).as("ratings")
                .and(match, sort(Sort.by("_id")), skip, limit).as("results");

        long count = mongoTemplate.exactCount(query, Product.class);
        Aggregation aggregation = newAggregation(facetOperation);
        AggregationResults<AggregationResponse> aggregationResults = mongoTemplate.aggregate(aggregation, Product.class, AggregationResponse.class);
        AggregationResponse aggregationResponse = Optional.ofNullable(aggregationResults.getUniqueMappedResult()).orElse(AggregationResponse.empty());
        PageImpl<Product> page = new PageImpl<>(aggregationResponse.results(), pageable, count);
        List<Facet> facets = List.of(new Facet("Tag", aggregationResponse.tags()), new Facet("Category", aggregationResponse.categories()),
                new Facet("Price", aggregationResponse.prices()), new Facet("Rating", aggregationResponse.ratings()));
        return new SearchResponse<>(page, facets);
    }

    private Criteria createFilters(SearchRequest searchRequest) {
        List<Criteria> mainFilters = new LinkedList<>();
        String[] textFields = {"title", "description"};
        List<Facet> facets = searchRequest.facets();
        String query = searchRequest.query();
        facets.forEach(f -> {
            if (!f.values().isEmpty()) {
                if (f.name().equalsIgnoreCase("category") || f.name().equalsIgnoreCase("tag")) {
                    Set<String> values = f.values().stream().map(FacetValue::value).collect(Collectors.toSet());
                    String fieldName = f.name().equalsIgnoreCase("tag") ? "tags" : "category";
                    mainFilters.add(Criteria.where(fieldName).in(values));
                }
                if (f.name().equalsIgnoreCase("price") || f.name().equalsIgnoreCase("rating")) {
                    List<Criteria> criteriaList = new LinkedList<>();
                    Set<Range> values = f.values().stream().map(FacetValue::range).collect(Collectors.toSet());
                    String fieldName = f.name().equalsIgnoreCase("price") ? "price" : "rating";
                    values.forEach(r -> {
                        criteriaList.add(Criteria.where(fieldName).gte(r.min()).lte(r.max()));
                    });
                    if (criteriaList.size() > 1) {
                        Criteria criteria = Criteria.where("").orOperator(criteriaList);
                        mainFilters.add(criteria);
                    } else {
                        mainFilters.add(criteriaList.getFirst());
                    }

                }
            }

        });
        if (query != null && !query.isEmpty()) {
            Set<Criteria> criteriaSet = Arrays.stream(textFields).map(f -> Criteria.where(f).regex(query, "i")).collect(Collectors.toSet());
            Criteria textCriteria = Criteria.where("").orOperator(criteriaSet);
            mainFilters.add(textCriteria);
        }
        if (mainFilters.isEmpty()) {
            mainFilters.add(Criteria.where("_id").exists(true));
        }
        Criteria mainFilter = Criteria.where("").andOperator(mainFilters);
        return mainFilter;
    }
}
