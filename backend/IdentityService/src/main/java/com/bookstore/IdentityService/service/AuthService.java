package com.bookstore.IdentityService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.bookstore.IdentityService.DTO.response.LoginResponseDTO;
import com.bookstore.IdentityService.DTO.response.ResponseDTO;
import com.bookstore.IdentityService.model.Users;
import com.bookstore.IdentityService.model.VerifyUser;
import com.bookstore.IdentityService.repository.UserRepository;
import com.bookstore.IdentityService.repository.VerifyRepository;
import com.bookstore.IdentityService.util.Helper;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class AuthService {

    @Autowired
    private Helper helper;

    @Autowired
    private VerifyRepository verifyRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JWTService jwt;

    public ResponseEntity<ResponseDTO> getEmailFromToken(String token) {
        ResponseDTO response = new ResponseDTO();
        try {
            VerifyUser verifyUser = verifyRepo.findByToken(token);
            if (verifyUser == null) {
                response = helper.error("No User Exist", null, "error");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            response = helper.success("Email Found", verifyUser, "success");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response = helper.error(e.getMessage(), null, "error");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    public ResponseEntity<ResponseDTO> getCurrentUser(HttpServletRequest request) {
        ResponseDTO response = new ResponseDTO();
        String token = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        if (token == null) {
            response = helper.error("Not Logged In", null, "warning");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        String username = jwt.extractUsername(token);
        Users user = userRepo.findByName(username);
        LoginResponseDTO loginUser = new LoginResponseDTO();
        loginUser.setId(user.getId());
        loginUser.setName(user.getName());
        loginUser.setRole(user.getRole());
        response = helper.success("User Found", loginUser, "success");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
