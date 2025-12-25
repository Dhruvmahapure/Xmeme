package com.example.xmeme.controller;

import com.example.xmeme.config.JwtUtils;
import com.example.xmeme.entity.User;
import com.example.xmeme.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public AuthController(AuthenticationManager authManager,
                          JwtUtils jwtUtils,
                          UserRepository userRepo,
                          PasswordEncoder encoder) {
        this.authManager = authManager;
        this.jwtUtils = jwtUtils;
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {

        User user = new User();
        user.setUsername(req.get("username"));
        user.setPassword(encoder.encode(req.get("password")));
        user.getRoles().add("ROLE_USER");

        userRepo.save(user);
        return ResponseEntity.ok("User registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {

        Authentication authentication =
                authManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                req.get("username"),
                                req.get("password"))
                );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String token = jwtUtils.generateToken(userDetails);

        return ResponseEntity.ok(Map.of("token", token));
    }

    @PutMapping("/make-admin/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> promote(@PathVariable String username) {

        User user = userRepo.findByUsername(username).orElseThrow();

        if (!user.getRoles().contains("ROLE_ADMIN")) {
            user.getRoles().add("ROLE_ADMIN");
            userRepo.save(user);
        }

        return ResponseEntity.ok("User promoted to ADMIN");
    }
}
