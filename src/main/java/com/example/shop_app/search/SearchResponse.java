package com.example.shop_app.search;

import org.springframework.data.domain.Page;

import java.util.List;

public record SearchResponse <T> (Page<T> page, List<? extends Facet> facets) {
}
