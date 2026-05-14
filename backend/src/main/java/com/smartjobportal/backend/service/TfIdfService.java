package com.smartjobportal.backend.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TfIdfService {

    public double calculateSimilarity(String resumeText, String jobDescription) {
        List<String> resumeTokens = tokenize(resumeText);
        List<String> jobTokens = tokenize(jobDescription);

        Set<String> allTokens = new HashSet<>();
        allTokens.addAll(resumeTokens);
        allTokens.addAll(jobTokens);

        Map<String, Double> resumeVector = new HashMap<>();
        Map<String, Double> jobVector = new HashMap<>();

        for (String token : allTokens) {
            double tfResume = getTermFrequency(token, resumeTokens);
            double tfJob = getTermFrequency(token, jobTokens);

            resumeVector.put(token, tfResume);
            jobVector.put(token, tfJob);
        }

        return cosineSimilarity(resumeVector, jobVector) * 100.0; // Percentage
    }

    private List<String> tokenize(String text) {
        if (text == null) return Collections.emptyList();
        String cleaned = text.replaceAll("[^a-zA-Z0-9 ]", " ").toLowerCase();
        return Arrays.stream(cleaned.split("\\s+"))
                .filter(w -> w.length() > 2)
                .filter(w -> !isStopWord(w))
                .collect(Collectors.toList());
    }

    private double getTermFrequency(String term, List<String> document) {
        long count = document.stream().filter(t -> t.equals(term)).count();
        return document.isEmpty() ? 0 : (double) count / document.size();
    }

    private double cosineSimilarity(Map<String, Double> v1, Map<String, Double> v2) {
        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;

        for (String key : v1.keySet()) {
            dotProduct += v1.get(key) * v2.get(key);
            norm1 += Math.pow(v1.get(key), 2);
            norm2 += Math.pow(v2.get(key), 2);
        }

        if (norm1 == 0.0 || norm2 == 0.0) return 0.0;
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    private boolean isStopWord(String word) {
        Set<String> stopWords = new HashSet<>(Arrays.asList("the", "and", "a", "an", "of", "in", "to", "for", "with", "on", "at", "from", "by", "about", "as", "into", "like", "through", "after", "over", "between", "out", "against", "during", "without", "before", "under", "around", "among", "this", "that", "it", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "but", "or", "so", "because", "if", "when", "where", "how", "why"));
        return stopWords.contains(word);
    }
}
