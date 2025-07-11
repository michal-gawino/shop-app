package com.example.shop_app.search;

import org.springframework.data.domain.Page;

public record SearchResponse <T> (Page<T> page, Facet facet) {
}
