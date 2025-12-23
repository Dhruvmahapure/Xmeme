package com.example.xmeme.service;

import com.example.xmeme.entity.Meme;

import java.util.List;

public interface MemeService {

    Meme createMeme(Meme meme);

    List<Meme> getLatestMemes();

    Meme getMemeById(String id);

    void updateMeme(String id, String caption, String url);

    void deleteMeme(String id);
}