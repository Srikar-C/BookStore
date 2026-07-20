package com.bookstore.BookService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookstore.BookService.DTO.request.UserBookCount;
import com.bookstore.BookService.DTO.response.ResponseDTO;
import com.bookstore.BookService.service.BookService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService service;

    @PostMapping
    public ResponseEntity<ResponseDTO> getAllBooks(@RequestBody UserBookCount request) {
        return service.getAllBooks(request);
    }

    @GetMapping("{id}")
    public ResponseEntity<ResponseDTO> getParticularBook(@PathVariable String id) {
        return service.getParticularBook(id);
    }

}
