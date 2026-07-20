package com.bookstore.BookService.DTO.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BooksDTO {
    private String id;
    private String title;
    private String author;
    private String description;
    private String url;
    private BigDecimal price;
    private BigDecimal quantity;
    private BigDecimal count;
}