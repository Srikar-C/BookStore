package com.bookstore.IdentityService.util;

import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.bookstore.IdentityService.DTO.request.RegisterUserDTO;
import com.bookstore.IdentityService.DTO.response.ResponseDTO;
import com.bookstore.IdentityService.DTO.response.SubResponse;
import com.bookstore.IdentityService.model.Users;
import com.bookstore.IdentityService.model.VerifyUser;
import com.bookstore.IdentityService.repository.UserRepository;
import com.bookstore.IdentityService.repository.VerifyRepository;

@Component
public class RegisterUtil {

    @Autowired
    private VerifyRepository verifyRepo;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private Helper helper;

    @Autowired
    private UserRepository userRepo;

    public SubResponse createVerifyUser(RegisterUserDTO request) {
        SubResponse response = new SubResponse();
        VerifyUser user = new VerifyUser();

        try {
            VerifyUser dummy;
            do {
                String token = UUID.randomUUID().toString();
                user.setToken(token);
                dummy = verifyRepo.findByToken(token);
            } while (dummy != null);

            String otp = helper.generateOTP();
            user.setEmail(request.getEmail());
            user.setOtp(otp);
            user.setOTPsession(Instant.now());
            user.setRequestCount(0);
            VerifyUser savedVerifyUser = verifyRepo.save(user);
            response = helper.subSuccess("Verify User Created Successfully", savedVerifyUser, "success");
        } catch (Exception e) {
            System.out.println("Error while registering user: " + e);
            response = helper.subError(e.getMessage(), null, "error");
        }

        return response;

    }

    public SubResponse createUser(RegisterUserDTO request) {
        SubResponse response = new SubResponse();
        try {
            Users user = new Users();
            user.setId(helper.getUserGeneratedId());
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setPassword(encoder.encode(request.getPassword()));
            user.setRole(request.getRole());
            user.setActive(false);
            Users savedUser = userRepo.save(user);
            response = helper.subSuccess("User Created Successfully", savedUser, "success");
        } catch (Exception e) {
            System.out.println("Error while registering user: " + e);
            response = helper.subError(e.getMessage(), null, "error");
        }
        return response;
    }

    public SubResponse registerValidations(RegisterUserDTO request) {
        ResponseDTO response = new ResponseDTO();
        response = helper.areAllFieldsFilled(request, "register");
        if (!response.isSuccess()) {
            return helper.subError(response.getMessage(), response.getObject(), response.getKind());
        }

        response = helper.validateFields(request);
        if (!response.isSuccess()) {
            return helper.subError(response.getMessage(), response.getObject(), response.getKind());
        }

        response = helper.validateExistingValues(request);
        if (!response.isSuccess()) {
            return helper.subError(response.getMessage(), response.getObject(), response.getKind());
        }

        return helper.subSuccess(response.getMessage(), response.getObject(), response.getKind());
    }
}
