package com.bookstore.IdentityService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bookstore.IdentityService.model.VerifyUser;

@Repository
public interface VerifyRepository extends JpaRepository<VerifyUser, String> {

    VerifyUser findByToken(String token);

    VerifyUser findByEmail(String email);

}
