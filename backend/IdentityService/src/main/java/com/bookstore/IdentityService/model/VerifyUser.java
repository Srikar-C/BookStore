package com.bookstore.IdentityService.model;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class VerifyUser {

    @Id
    private String email;
    private String token;
    private String otp;
    private Instant OTPsession;
    private Integer requestCount;
}
