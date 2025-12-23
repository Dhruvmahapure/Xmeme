package com.example.xmeme.entity;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Data
@Document(collection = "memes")
public class Meme {

    @Id
    private String id;
    private String name;
    private String caption;
    private String url;

    public Meme() {}

    public Meme(String name, String caption, String url) {
        this.name = name;
        this.caption = caption;
        this.url = url;
    }

    // getters & setters
}
