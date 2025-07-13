package com.example.shop_app.search;

import com.example.shop_app.entity.Product;

import java.util.Collections;
import java.util.List;

public record AggregationResponse(List<FacetValue> tags, List<FacetValue> categories, List<FacetValue> prices,
                                  List<FacetValue> ratings, List<Product> results) {

    public static AggregationResponse empty() {
        return new AggregationResponse(Collections.emptyList(), Collections.emptyList(), Collections.emptyList(), Collections.emptyList(), List.of());
    }
}


