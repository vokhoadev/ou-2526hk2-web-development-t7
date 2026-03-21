package com.ou.springcode.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ou.springcode.dto.RegisterRequest;
import com.ou.springcode.dto.UserResponse;
import com.ou.springcode.entity.Role;
import com.ou.springcode.entity.User;
import com.ou.springcode.exception.DuplicateResourceException;
import com.ou.springcode.repository.UserRepository;
import com.ou.springcode.security.JwtService;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserMapper userMapper;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        AuthenticationManager authenticationManager,
        UserDetailsService userDetailsService,
        UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.userMapper = userMapper;
    }

    public UserResponse register(RegisterRequest request) {
        if(userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username đã tồn tại");
        }
        if(userRepository.existsByEmail(request.username())){
            throw new DuplicateResourceException("Email đã tồn tại");
        }

        User user = User.builder()
        .username(request.username())
        .email(request.email())
        .passwordHash(passwordEncoder.encode((request.password())))
        .role(Role.USER)
        .build();

        user = userRepository.save(user);
        log.info("User registered: {}", user.getFullName());
        return userMapper.toResponse(user);

    }
}
