package com.example.shop_app.dto;

import com.example.shop_app.search.Facet;

import java.util.List;

public record SearchRequest(String query, List<Facet> facets) {
}
