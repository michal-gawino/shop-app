package com.example.shop_app.search;

import java.util.List;


public record Facet (String name, List<FacetValue> values){
}
