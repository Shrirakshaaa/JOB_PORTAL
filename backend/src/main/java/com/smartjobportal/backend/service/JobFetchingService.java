package com.smartjobportal.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartjobportal.backend.entity.Job;
import com.smartjobportal.backend.entity.User;
import com.smartjobportal.backend.repository.JobRepository;
import com.smartjobportal.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class JobFetchingService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public JobFetchingService(JobRepository jobRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private User getOrCreateSystemRecruiter() {
        Optional<User> systemUserOpt = userRepository.findByEmail("system@smartjobportal.com");
        if (systemUserOpt.isPresent()) {
            return systemUserOpt.get();
        }

        User systemUser = new User();
        systemUser.setName("System API Recruiter");
        systemUser.setEmail("system@smartjobportal.com");
        systemUser.setPhone("0000000000");
        systemUser.setPassword(passwordEncoder.encode("system_generated_pass"));
        systemUser.setRole(User.Role.RECRUITER);
        return userRepository.save(systemUser);
    }

    @PostConstruct
    public void fetchJobsOnStartup() {
        fetchJobs();
    }

    @Scheduled(fixedRate = 86400000) // Runs every 24 hours
    public void fetchJobs() {
        try {
            System.out.println("Starting automated job fetch...");
            String url = "https://www.arbeitnow.com/api/job-board-api";
            String response = restTemplate.getForObject(url, String.class);

            if (response != null) {
                JsonNode rootNode = objectMapper.readTree(response);
                JsonNode dataNode = rootNode.get("data");

                if (dataNode != null && dataNode.isArray()) {
                    User systemRecruiter = getOrCreateSystemRecruiter();
                    int newJobsCount = 0;

                    for (JsonNode jobNode : dataNode) {
                        String title = jobNode.path("title").asText();
                        String company = jobNode.path("company_name").asText();
                        String location = jobNode.path("location").asText();
                        String description = jobNode.path("description").asText();
                        
                        Job job = new Job();
                        job.setTitle(title);
                        // Clean up HTML tags if present
                        String cleanDesc = description.replaceAll("<[^>]*>", "").trim();
                        // Truncate to avoid extremely long descriptions if database column length is limited
                        if (cleanDesc.length() > 2000) {
                            cleanDesc = cleanDesc.substring(0, 1997) + "...";
                        }
                        job.setDescription(cleanDesc);
                        job.setRequirements("Experience preferred. Company: " + company);
                        job.setLocation(location);
                        job.setSalary("Not specified");
                        job.setPostedBy(systemRecruiter);

                        jobRepository.save(job);
                        newJobsCount++;
                        
                        // Limit to 20 jobs per fetch to not overwhelm the database
                        if(newJobsCount >= 20) {
                            break;
                        }
                    }
                    System.out.println("Successfully fetched and added " + newJobsCount + " external jobs.");
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching jobs: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
