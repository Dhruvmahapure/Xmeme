package com.example.xmeme.controller;

import com.example.xmeme.entity.Meme;
import com.example.xmeme.service.MemeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/memes")
public class MemeController {

    private final MemeService service;

    public MemeController(MemeService service) {
        this.service = service;
    }

    // CREATE MEME
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Meme meme) {

        if (meme.getName() == null ||
                meme.getCaption() == null ||
                meme.getUrl() == null) {
            return ResponseEntity.badRequest().build();
        }

        Meme saved = service.createMeme(meme);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("id", saved.getId()));
    }

    // GET LATEST 100 MEMES
    @GetMapping
    public List<Meme> getAll() {
        return service.getLatestMemes();
    }

    // GET MEME BY ID
    @GetMapping("/{id}")
    public Meme getById(@PathVariable String id) {
        return service.getMemeById(id);
    }

    // UPDATE MEME (caption & url only)
    @PatchMapping("/{id}")
    public ResponseEntity<Void> updateMeme(
            @PathVariable String id,
            @RequestBody Meme request) {

        service.updateMeme(id, request.getCaption(), request.getUrl());
        return ResponseEntity.ok().build();
    }

    // DELETE MEME
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeme(@PathVariable String id) {
        service.deleteMeme(id);
        return ResponseEntity.noContent().build();
    }
}
