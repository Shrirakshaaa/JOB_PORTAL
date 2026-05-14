package com.smartjobportal.backend.controller;

import com.smartjobportal.backend.entity.Job;
import com.smartjobportal.backend.repository.JobRepository;
import com.smartjobportal.backend.service.FileStorageService;
import com.smartjobportal.backend.service.ResumeParserService;
import com.smartjobportal.backend.service.TfIdfService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class RecommendationController {

    private final JobRepository jobRepository;
    private final FileStorageService fileStorageService;
    private final ResumeParserService resumeParserService;
    private final TfIdfService tfIdfService;

    public RecommendationController(JobRepository jobRepository, FileStorageService fileStorageService,
                                    ResumeParserService resumeParserService, TfIdfService tfIdfService) {
        this.jobRepository = jobRepository;
        this.fileStorageService = fileStorageService;
        this.resumeParserService = resumeParserService;
        this.tfIdfService = tfIdfService;
    }

    @PostMapping("/recommended")
    public ResponseEntity<?> getRecommendedJobs(@RequestParam("file") MultipartFile file) {
        String filePath = fileStorageService.storeFile(file);
        String resumeText = resumeParserService.extractText(filePath);
        List<Job> allJobs = jobRepository.findAll();

        List<JobMatchResult> results = new ArrayList<>();
        for (Job job : allJobs) {
            String jobText = job.getTitle() + " " + job.getDescription() + " " + job.getRequirements();
            double score = tfIdfService.calculateSimilarity(resumeText, jobText);
            results.add(new JobMatchResult(job, score));
        }

        results.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));

        return ResponseEntity.ok(results);
    }

    @Data
    public static class JobMatchResult {
        private Job job;
        private double score;

        public JobMatchResult(Job job, double score) {
            this.job = job;
            this.score = score;
        }
    }
}
