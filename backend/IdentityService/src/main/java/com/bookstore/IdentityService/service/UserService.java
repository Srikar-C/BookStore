package com.bookstore.IdentityService.service;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookstore.IdentityService.DTO.request.LoginUserDTO;
import com.bookstore.IdentityService.DTO.request.OTPDTO;
import com.bookstore.IdentityService.DTO.request.RegisterUserDTO;
import com.bookstore.IdentityService.DTO.response.ResponseDTO;
import com.bookstore.IdentityService.DTO.response.SubResponse;
import com.bookstore.IdentityService.model.Users;
import com.bookstore.IdentityService.model.VerifyUser;
import com.bookstore.IdentityService.repository.UserRepository;
import com.bookstore.IdentityService.repository.VerifyRepository;
import com.bookstore.IdentityService.util.Helper;
import com.bookstore.IdentityService.util.RegisterUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class UserService {

    @Autowired
    private Helper helper;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private VerifyRepository verifyRepo;

    @Autowired
    private RegisterUtil registerUtil;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private JWTService jwt;

    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<ResponseDTO> registerUser(RegisterUserDTO request) {
        ResponseDTO response = new ResponseDTO();
        try {
            SubResponse validation = registerUtil.registerValidations(request);
            if (!validation.isSuccess()) {
                response = helper.error(validation.getMessage(), validation.getObject(), validation.getKind());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            SubResponse creation = registerUtil.createUser(request);
            if (!creation.isSuccess()) {
                response = helper.error(creation.getMessage(), creation.getObject(), "error");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

            SubResponse emailVerify = registerUtil.createVerifyUser(request);
            if (!emailVerify.isSuccess()) {
                response = helper.error(creation.getMessage(), creation.getObject(), "error");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

            VerifyUser user = (VerifyUser) emailVerify.getObject();

            SubResponse emailSent = helper.sendingOTPToEmail(user.getEmail(), request.getName(), user.getOtp());
            if (!emailSent.isSuccess()) {
                response = helper.error(emailSent.getMessage(), emailSent.getObject(), "error");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

            response = helper.success("User Registered Successfully, Please Verify Your Email", user, "success");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response = helper.error(e.getMessage(), null, "error");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    public ResponseEntity<ResponseDTO> verifyOTP(OTPDTO request) {
        ResponseDTO response = new ResponseDTO();
        try {
            VerifyUser verifyUser = verifyRepo.findByEmail(request.getEmail());
            if (verifyUser == null) {
                response = helper.error("No User exist with this Email", null, "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            Duration time = calculateDuration(verifyUser.getOTPsession());
            if (time.getSeconds() >= 901) {
                response = helper.error("OTP Expired, Click Resend OTP", null, "info");
                return ResponseEntity.status(HttpStatus.GONE).body(response);
            }
            if (verifyUser.getRequestCount() > 5) {
                response = helper.error("OTP Limit Exceeded, Try after 15 minutes", null, "warning");
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
            }
            if (!request.getOtp().toString().equals(verifyUser.getOtp())) {
                response = helper.error("Invalid OTP", null, "error");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            Users user = userRepo.findByEmail(request.getEmail());
            if (user == null) {
                response = helper.error("User Not Found", null, "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            user.setActive(true);
            user = userRepo.save(user);
            response = helper.success("OTP Verified", verifyUser, "success");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response = helper.error(e.getMessage(), null, "error");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    private Duration calculateDuration(Instant otPsession) {
        Instant storedTime = Instant.parse(otPsession.toString());
        Instant now = Instant.now();
        Duration duration = Duration.between(storedTime, now);
        return duration;
    }

    public ResponseEntity<ResponseDTO> resendOTP(OTPDTO request) {
        ResponseDTO response = new ResponseDTO();
        try {
            Users user = userRepo.findByEmail(request.getEmail());
            if (user == null) {
                response = helper.error("User Not Found", null, "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            VerifyUser verifyUser = verifyRepo.findByEmail(request.getEmail());
            if (verifyUser == null) {
                response = helper.error("User Not Found with this Email", null, "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            Duration time = calculateDuration(verifyUser.getOTPsession());
            verifyUser.setRequestCount(verifyUser.getRequestCount() + 1);
            if (verifyUser.getRequestCount() > 5 && time.getSeconds() < 901) {
                response = helper.error("OTP Limit Exceeded, Try after 15 minutes", null, "error");
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
            }

            String otp = helper.generateOTP();
            SubResponse emailSent = helper.sendingOTPToEmail(user.getEmail(), user.getName(), otp);
            if (!emailSent.isSuccess()) {
                response = helper.error(emailSent.getMessage(), emailSent.getObject(), "error");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
            verifyUser.setOtp(otp);
            verifyUser.setOTPsession(Instant.now());

            if (verifyUser.getRequestCount() > 5) {
                verifyUser.setRequestCount(1);
            }
            verifyUser = verifyRepo.save(verifyUser);
            response = helper.success("OTP sent, Please Verify", verifyUser, "success");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response = helper.error(e.getMessage(), null, "error");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    public ResponseEntity<ResponseDTO> loginUser(LoginUserDTO request, HttpServletResponse http) {
        ResponseDTO response = new ResponseDTO();
        try {
            response = helper.areAllFieldsFilled(request, "login");
            if (!response.isSuccess()) {
                response = helper.error(response.getMessage(), response.getObject(), response.getKind());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            Users user = userRepo.findByNameOrEmail(request.getName(), request.getName());
            if (user == null) {
                response = helper.error("User Not Found", null, "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            VerifyUser verifyUser = verifyRepo.findByEmail(user.getEmail());
            String otp = helper.generateOTP();
            if (verifyUser == null) {
                verifyUser = new VerifyUser();
                verifyUser.setOtp(otp);
                verifyUser.setOTPsession(Instant.now());
                verifyUser.setEmail(user.getEmail());
                verifyUser.setRequestCount(1);
                VerifyUser dummy;
                do {
                    String token = UUID.randomUUID().toString();
                    verifyUser.setToken(token);
                    dummy = verifyRepo.findByToken(token);
                } while (dummy != null);
            } else {
                verifyUser.setOtp(otp);
                verifyUser.setOTPsession(Instant.now());
                verifyUser.setRequestCount(verifyUser.getRequestCount() + 1);
            }

            VerifyUser savedverifyUser = verifyRepo.save(verifyUser);
            if (user.isActive()) {
                if (!encoder.matches(request.getPassword(), user.getPassword())) {
                    response = helper.error("Incorrect Password", null, "warning");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                }
                String token = jwt.generateToken(user);
                Cookie cookie = new Cookie("token", token);
                cookie.setHttpOnly(true);
                cookie.setSecure(false); // true in production (HTTPS)
                cookie.setPath("/");
                cookie.setMaxAge(60 * 60);
                http.addCookie(cookie);
                response = helper.success("User Found", savedverifyUser, "success");
                return ResponseEntity.status(HttpStatus.OK).body(response);
            } else {
                SubResponse emailSent = helper.sendingOTPToEmail(user.getEmail(), user.getName(), otp);
                if (!emailSent.isSuccess()) {
                    response = helper.error(emailSent.getMessage(), emailSent.getObject(), "error");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
                response = helper.success("User Not Verified, Please Verify", savedverifyUser, "info");
                return ResponseEntity.status(HttpStatus.OK).body(response);
            }

        } catch (Exception e) {
            response = helper.error(e.getMessage(), null, "error");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

}
