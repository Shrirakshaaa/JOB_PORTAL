package com.smartjobportal.backend.dto;

import lombok.Data;

@Data
public class JobDto {
    private String title;
    private String description;
    private String requirements;
    private String location;
    private String salary;
}
