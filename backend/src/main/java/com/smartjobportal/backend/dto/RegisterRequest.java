package com.smartjobportal.backend.dto;
import lombok.Data;
import com.smartjobportal.backend.entity.User.Role;
@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private Role role;
}
