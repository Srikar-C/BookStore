package com.bookstore.IdentityService.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUserDTO {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String cfnpassword;
    private String role;
}
