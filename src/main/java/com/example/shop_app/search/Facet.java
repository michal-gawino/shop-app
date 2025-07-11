package com.example.shop_app.search;

import java.util.List;

public record Facet (List<SingleValue> tags, List<SingleValue> categories, List<RangeValue> prices, List<RangeValue> ratings) {
}
