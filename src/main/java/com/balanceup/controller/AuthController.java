package com.balanceup.controller;

import com.balanceup.model.Role;
import com.balanceup.model.User;
import com.balanceup.repository.UserRepository;
import com.balanceup.security.JwtUtil;
import com.balanceup.service.RefreshTokenService;
import com.balanceup.security.RefreshToken;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        // Validate if email or username already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(400).body("Username is already taken");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(400).body("Email is already registered");
        }

        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER); // Default role as USER

        // Optionally, you could also track the registration timestamp
        user.setCreatedAt(LocalDateTime.now().toString());

        userRepository.save(user); // Save user to the database

        return ResponseEntity.status(201).body("User registered successfully!");  // Change to 201
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody User user) {
        Optional<User> foundUser = userRepository.findByUsername(user.getUsername());

        if (foundUser.isPresent() && passwordEncoder.matches(user.getPassword(), foundUser.get().getPassword())) {
            String token = jwtUtil.generateToken(foundUser.get().getUsername(), foundUser.get().getRole().name());
            String refreshToken = refreshTokenService.createRefreshToken(user.getUsername()).getToken();

            Map<String, String> response = new HashMap<>();
            response.put("accessToken", token);
            response.put("refreshToken", refreshToken);
            response.put("role", foundUser.get().getRole().name()); // Ensure role is returned as String

            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }




    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        if (refreshTokenService.isValid(refreshToken)) {
            RefreshToken storedToken = refreshTokenService.findByToken(refreshToken);
            String newAccessToken = jwtUtil.generateToken(storedToken.getUser().getUsername(), storedToken.getUser().getRole().name());
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        }
        return ResponseEntity.status(403).body(Map.of("error", "Invalid or expired refresh token"));
    }

    @RestController
    @RequestMapping("/api/user")
    public static class UserController {

        @GetMapping("/profile")
        @PreAuthorize("hasAuthority('ROLE_USER')")  // 🔥 Ensure this is with 'ROLE_' prefix
        public ResponseEntity<String> getProfile(Principal principal) {
            return ResponseEntity.ok("Welcome, " + principal.getName());
        }

        @GetMapping("/dashboard")
        @PreAuthorize("hasAuthority('ROLE_USER')")
        public ResponseEntity<String> userDashboard(Principal principal) {
            return ResponseEntity.ok("Welcome to your dashboard, " + principal.getName());
        }
    }

    @CrossOrigin(origins = "*")
    @RestController
    @RequestMapping("/api/admin")
    public class AdminController {

        // Example of an endpoint for admin-only access
        @GetMapping("/dashboard")
        @PreAuthorize("hasAuthority('ROLE_ADMIN')")  // Ensure only admins can access
        public ResponseEntity<String> getDashboard(Principal principal) {
            return ResponseEntity.ok("Welcome to the admin dashboard, " + principal.getName());
        }

        @PutMapping("/user/{id}/role")
        @PreAuthorize("hasAuthority('ROLE_ADMIN')")
        public ResponseEntity<String> updateUserRole(@PathVariable Long id, @RequestBody String newRole) {
            Optional<User> user = userRepository.findById(id);

            if (user.isPresent()) {
                user.get().setRole(Role.valueOf(newRole));
                userRepository.save(user.get());
                return ResponseEntity.ok("Role updated successfully");
            } else {
                return ResponseEntity.status(404).body("User not found");
            }
        }

        @GetMapping("/users")
        @PreAuthorize("hasAuthority('ROLE_ADMIN')")
        public ResponseEntity<List<User>> getAllUsers() {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        }

    }





}
