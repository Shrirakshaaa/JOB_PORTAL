package com.smartjobportal.backend.repository;

import com.smartjobportal.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByPostedById(Long recruiterId);
}
