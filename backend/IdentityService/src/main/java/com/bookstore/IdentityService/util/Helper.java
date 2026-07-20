package com.bookstore.IdentityService.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import com.bookstore.IdentityService.DTO.request.LoginUserDTO;
import com.bookstore.IdentityService.DTO.request.RegisterUserDTO;
import com.bookstore.IdentityService.DTO.response.ResponseDTO;
import com.bookstore.IdentityService.DTO.response.SubResponse;
import com.bookstore.IdentityService.model.Users;
import com.bookstore.IdentityService.repository.UserRepository;

@Component
public class Helper {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private JdbcTemplate jdbc;

    public ResponseDTO areAllFieldsFilled(Object request, String type) {
        Map<String, String> errors = new HashMap<>();
        if (type.equals("register")) {
            RegisterUserDTO register = (RegisterUserDTO) request;
            if (!isSpecified(register.getName())) {
                errors.put("name", "Fill Username");
            }
            if (!isSpecified(register.getEmail())) {
                errors.put("email", "Fill Email");
            }
            if (!isSpecified(register.getPhone())) {
                errors.put("phone", "Fill Phone");
            }
            if (!isSpecified(register.getPassword())) {
                errors.put("password", "Fill Password");
            }
            if (!isSpecified(register.getCfnpassword())) {
                errors.put("cfnpassword", "Fill Confirm Password");
            }
        } else if (type.equals("login")) {
            LoginUserDTO login = (LoginUserDTO) request;
            if (!isSpecified(login.getName())) {
                errors.put("name", "Fill Username");
            }
            if (!isSpecified(login.getPassword())) {
                errors.put("password", "Fill Password");
            }
        }
        if (errors.size() > 0)
            return error("Validation failed", errors, "validation");
        return success("Validation successful", null, "validation");
    }

    public ResponseDTO success(String message, Object object, String kind) {
        return new ResponseDTO(true, message, object, kind);
    }

    public ResponseDTO error(String message, Object object, String kind) {
        return new ResponseDTO(false, message, object, kind);
    }

    public SubResponse subSuccess(String message, Object object, String kind) {
        return new SubResponse(true, message, object, kind);
    }

    public SubResponse subError(String message, Object object, String kind) {
        return new SubResponse(false, message, object, kind);
    }

    public boolean isSpecified(String data) {
        return data != null && !data.trim().isEmpty();
    }

    public ResponseDTO validateFields(RegisterUserDTO request) {
        Map<String, String> errors = new HashMap<>();

        if (!request.getPassword().equals(request.getCfnpassword())) {
            errors.put("cfnpassword", "Passwords do not match");
        }
        if (!validEmail(request.getEmail())) {
            errors.put("email", "Invalid email format");
        }
        if (request.getPhone().length() != 10) {
            errors.put("phone", "Phone number must be 10 digits");
        }
        if (request.getPhone().length() == 10) {
            try {
                Long.parseLong(request.getPhone());
            } catch (NumberFormatException e) {
                errors.put("phone", "Phone number must be numeric");
            }
        }
        if (errors.size() > 0) {
            return error("Field validation failed", errors, "validation");
        }
        return success("Field validation successful", null, "validation");
    }

    private boolean validEmail(String email) {
        Pattern pattern = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    public ResponseDTO validateExistingValues(RegisterUserDTO request) {
        Map<String, String> errors = new HashMap<>();
        Users user = userRepo.findByName(request.getName());
        if (user != null) {
            errors.put("name", "Username already Exists");
        }
        user = userRepo.findByEmail(request.getEmail());
        if (user != null) {
            errors.put("email", "Email already Exists");
        }
        user = userRepo.findByPhone(request.getPhone());
        if (user != null) {
            errors.put("phone", "Phone already Exists");
        }
        if (errors.size() > 0) {
            return error("Existing Values", errors, "exists");
        }
        return success("No Existing Values", null, "exists");
    }

    public String getUserGeneratedId() {
        String query = "select 'USR' || lpad(nextval('userid')::TEXT,13,'0')";
        try {
            return jdbc.queryForObject(query, String.class);
        } catch (Exception e) {
            throw new UnsupportedOperationException("Error in generating User Id");
        }
    }

    public String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public SubResponse sendingOTPToEmail(String email, String name, String otp) {
        SubResponse response = new SubResponse();

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your OTP Code");
            message.setText("Hello " + name + "\nFollowing is your OTP: " + otp + "\nOTP expires in 5 minutes");
            mailSender.send(message);
            System.out.println("Mail sent");
            response = subSuccess("OTP send to Mail successfully", otp, "success");
        } catch (Exception e) {
            System.out.println("Exception in mail sending: " + e);
            response = subError(e.getMessage(), e, "error");
        }
        return response;
    }

}
