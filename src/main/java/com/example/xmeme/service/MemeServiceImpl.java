package com.example.xmeme.service;

import java.util.Comparator;
import java.util.List;

import com.example.xmeme.entity.Meme;
import com.example.xmeme.repository.MemeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MemeServiceImpl implements MemeService {

    private final MemeRepository repository;

    public MemeServiceImpl(MemeRepository repository) {
        this.repository = repository;
    }

    @Override
    public Meme createMeme(Meme meme) {

        repository.findByNameAndCaptionAndUrl(
                meme.getName(), meme.getCaption(), meme.getUrl()
        ).ifPresent(m -> {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Duplicate meme"
            );
        });

        return repository.save(meme);
    }

    @Override
    public List<Meme> getLatestMemes() {
        List<Meme> memes = repository.findAll();
        memes.sort(Comparator.comparing(Meme::getId).reversed());
        return memes.size() > 100 ? memes.subList(0, 100) : memes;
    }

    @Override
    public Meme getMemeById(String id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "Meme not found"
                        )
                );
    }

    @Override
    public void updateMeme(String id, String caption, String url) {

        // ✅ FIX: Meme, not repository
        Meme meme = repository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "Meme not found"
                        )
                );

        if (caption != null && !caption.isBlank()) {
            meme.setCaption(caption);
        }

        if (url != null && !url.isBlank()) {
            meme.setUrl(url);
        }

        repository.save(meme);
    }

    @Override
    public void deleteMeme(String id) {

        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Meme not found"
            );
        }

        repository.deleteById(id);
    }
}
