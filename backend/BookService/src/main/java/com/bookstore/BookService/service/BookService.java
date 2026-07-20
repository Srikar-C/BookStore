package com.bookstore.BookService.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.bookstore.BookService.DTO.request.BookCount;
import com.bookstore.BookService.DTO.request.UserBookCount;
import com.bookstore.BookService.DTO.response.BooksDTO;
import com.bookstore.BookService.DTO.response.ResponseDTO;
import com.bookstore.BookService.model.Books;
import com.bookstore.BookService.repository.BookRepository;
import com.bookstore.BookService.util.Helper;

@Service
public class BookService {

    @Autowired
    private Helper helper;

    @Autowired
    private BookRepository repo;

    public ResponseEntity<ResponseDTO> getAllBooks(UserBookCount request) {
        ResponseDTO response = new ResponseDTO();
        try {

            Map<String, BigDecimal> countMap = new HashMap<>();
            for (BookCount bc : request.getBooks()) {
                countMap.put(bc.getBookId(), bc.getCount());
            }

            List<Books> books = repo.findAll();
            List<BooksDTO> userBooks = new ArrayList<>();
            for (Books b : books) {
                BigDecimal count = countMap.getOrDefault(b.getId(), BigDecimal.ZERO);
                BooksDTO book = new BooksDTO(b.getId(), b.getTitle(), b.getAuthor(), b.getDescription(), b.getUrl(),
                        b.getPrice(), b.getQuantity(), count);
                userBooks.add(book);
            }
            response = helper.success("Books Fetched", userBooks, "success");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response = helper.error(e.getMessage(), null, "error");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    public ResponseEntity<ResponseDTO> getParticularBook(String id) {
        ResponseDTO response = new ResponseDTO();
        try {
            Books book = repo.findById(id).orElse(new Books());
            System.out.println("book details: " + book.toString());
            response = helper.success("Book Fetched", book, "success");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response = helper.error(e.getMessage(), null, "error");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

}
