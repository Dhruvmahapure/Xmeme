package com.example.xmeme.repository;

import com.example.xmeme.entity.Meme;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MemeRepository extends MongoRepository<Meme, String> {

    Optional<Meme> findByNameAndCaptionAndUrl(String name, String caption, String url);
}