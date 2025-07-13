package com.example.shop_app.search;

import jakarta.annotation.Nullable;

public record FacetValue (String value, Range range, @Nullable Integer count) {

}
