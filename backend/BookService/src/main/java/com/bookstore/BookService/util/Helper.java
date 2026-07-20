package com.bookstore.BookService.util;

import org.springframework.stereotype.Component;

import com.bookstore.BookService.DTO.response.ResponseDTO;

@Component
public class Helper {

    public ResponseDTO success(String message, Object object, String kind) {
        return new ResponseDTO(true, message, object, kind);
    }

    public ResponseDTO error(String message, Object object, String kind) {
        return new ResponseDTO(false, message, object, kind);
    }
}
