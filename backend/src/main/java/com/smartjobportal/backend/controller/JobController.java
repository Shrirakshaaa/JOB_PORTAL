package com.smartjobportal.backend.controller;

import com.smartjobportal.backend.dto.JobDto;
import com.smartjobportal.backend.entity.Job;
import com.smartjobportal.backend.entity.User;
import com.smartjobportal.backend.repository.JobRepository;
import com.smartjobportal.backend.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;

    public JobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody JobDto jobDto, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();

        if (user.getRole() != User.Role.RECRUITER) {
            return ResponseEntity.status(403).body("Only recruiters can post jobs.");
        }

        Job job = new Job();
        job.setTitle(jobDto.getTitle());
        job.setDescription(jobDto.getDescription());
        job.setRequirements(jobDto.getRequirements());
        job.setLocation(jobDto.getLocation());
        job.setSalary(jobDto.getSalary());
        job.setPostedBy(user);

        return ResponseEntity.ok(jobRepository.save(job));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody JobDto jobDto, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();

        return jobRepository.findById(id).map(job -> {
            if (!job.getPostedBy().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("You can only edit your own job postings.");
            }
            job.setTitle(jobDto.getTitle());
            job.setDescription(jobDto.getDescription());
            job.setRequirements(jobDto.getRequirements());
            job.setLocation(jobDto.getLocation());
            job.setSalary(jobDto.getSalary());
            return ResponseEntity.ok(jobRepository.save(job));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();

        return jobRepository.findById(id).map(job -> {
            if (!job.getPostedBy().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("You can only delete your own job postings.");
            }
            jobRepository.delete(job);
            return ResponseEntity.ok("Job deleted successfully.");
        }).orElse(ResponseEntity.notFound().build());
    }
}
