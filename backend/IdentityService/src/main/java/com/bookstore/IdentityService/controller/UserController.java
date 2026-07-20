package com.bookstore.IdentityService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookstore.IdentityService.DTO.request.LoginUserDTO;
import com.bookstore.IdentityService.DTO.request.OTPDTO;
import com.bookstore.IdentityService.DTO.request.RegisterUserDTO;
import com.bookstore.IdentityService.DTO.response.ResponseDTO;
import com.bookstore.IdentityService.service.UserService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("register")
    public ResponseEntity<ResponseDTO> registerUser(@RequestBody RegisterUserDTO request) {
        return service.registerUser(request);
    }

    @PostMapping("login")
    public ResponseEntity<ResponseDTO> loginUser(@RequestBody LoginUserDTO request, HttpServletResponse http) {
        return service.loginUser(request, http);
    }

    @PostMapping("verifyOTP")
    public ResponseEntity<ResponseDTO> verifyRegisterOTP(@RequestBody OTPDTO request) {
        return service.verifyOTP(request);
    }

    @PostMapping("resendOTP")
    public ResponseEntity<ResponseDTO> resendOTP(@RequestBody OTPDTO request) {
        return service.resendOTP(request);
    }
}
