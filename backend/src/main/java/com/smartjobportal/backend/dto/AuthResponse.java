package com.smartjobportal.backend.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import com.smartjobportal.backend.entity.User.Role;
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String name;
    private String email;
    private Role role;
}
