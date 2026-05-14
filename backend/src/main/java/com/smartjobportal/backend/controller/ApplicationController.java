package com.smartjobportal.backend.controller;

import com.smartjobportal.backend.dto.ApplicationDto;
import com.smartjobportal.backend.entity.Application;
import com.smartjobportal.backend.entity.Job;
import com.smartjobportal.backend.entity.User;
import com.smartjobportal.backend.repository.ApplicationRepository;
import com.smartjobportal.backend.repository.JobRepository;
import com.smartjobportal.backend.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    public ApplicationController(ApplicationRepository applicationRepository, JobRepository jobRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
    }

    @PostMapping
    public ResponseEntity<?> applyForJob(@RequestBody ApplicationDto applicationDto, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User candidate = userDetails.getUser();

        if (candidate.getRole() != User.Role.CANDIDATE) {
            return ResponseEntity.status(403).body("Only candidates can apply for jobs.");
        }

        Job job = jobRepository.findById(applicationDto.getJobId()).orElse(null);
        if (job == null) {
            return ResponseEntity.badRequest().body("Job not found.");
        }

        Application application = new Application();
        application.setCandidate(candidate);
        application.setJob(job);
        application.setResumeUrl(applicationDto.getResumeUrl());
        application.setStatus(Application.ApplicationStatus.PENDING);
        // Note: matchScore will be calculated in Phase 2

        return ResponseEntity.ok(applicationRepository.save(application));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<Application>> getMyApplications(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User candidate = userDetails.getUser();
        return ResponseEntity.ok(applicationRepository.findByCandidateId(candidate.getId()));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getApplicationsForJob(@PathVariable Long jobId, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User recruiter = userDetails.getUser();

        Job job = jobRepository.findById(jobId).orElse(null);
        if (job == null || !job.getPostedBy().getId().equals(recruiter.getId())) {
            return ResponseEntity.status(403).body("You can only view applications for your own jobs.");
        }

        return ResponseEntity.ok(applicationRepository.findByJobId(jobId));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long id, @RequestParam Application.ApplicationStatus status, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User recruiter = userDetails.getUser();
        
        return applicationRepository.findById(id).map(app -> {
            if (!app.getJob().getPostedBy().getId().equals(recruiter.getId())) {
                return ResponseEntity.status(403).body("You can only update applications for your own jobs.");
            }
            app.setStatus(status);
            return ResponseEntity.ok(applicationRepository.save(app));
        }).orElse(ResponseEntity.notFound().build());
    }
}
