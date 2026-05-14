package com.smartjobportal.backend.service;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import java.io.File;

@Service
public class ResumeParserService {

    private final Tika tika;

    public ResumeParserService() {
        this.tika = new Tika();
    }

    public String extractText(String filePath) {
        try {
            File file = new File(filePath);
            return tika.parseToString(file);
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract text from resume: " + e.getMessage(), e);
        }
    }
}
