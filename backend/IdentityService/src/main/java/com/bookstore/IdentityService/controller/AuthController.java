package com.bookstore.IdentityService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookstore.IdentityService.DTO.request.SingleRequestDTO;
import com.bookstore.IdentityService.DTO.response.ResponseDTO;
import com.bookstore.IdentityService.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/auths")
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("verifyToken")
    public ResponseEntity<ResponseDTO> verifyToken(@RequestBody SingleRequestDTO request) {
        return service.getEmailFromToken(request.getToken());
    }

    @GetMapping("auth")
    public ResponseEntity<ResponseDTO> getCurrentUser(HttpServletRequest request) {
        return service.getCurrentUser(request);
    }
}
