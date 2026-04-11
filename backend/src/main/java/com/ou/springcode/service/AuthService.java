package com.ou.springcode.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ou.springcode.config.JwtProperties;
import com.ou.springcode.dto.AuthReponse;
import com.ou.springcode.dto.LoginRequest;
import com.ou.springcode.dto.RegisterRequest;
import com.ou.springcode.dto.UserResponse;
import com.ou.springcode.entity.Role;
import com.ou.springcode.entity.User;
import com.ou.springcode.exception.DuplicateResourceException;
import com.ou.springcode.exception.ResourceNotFoundException;
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
    private final JwtProperties jwtProperties;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        AuthenticationManager authenticationManager,
        UserDetailsService userDetailsService,
        UserMapper userMapper,
        JwtProperties jwtProperties
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.userMapper = userMapper;
        this.jwtProperties = jwtProperties;
    }

    public UserResponse register(RegisterRequest request) {
        if(userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username đã tồn tại");
        }
        if(userRepository.existsByEmail(request.email())){
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

    public AuthReponse login(LoginRequest request) {
        // 1. Tìm user theo username hoặc Email {"usernameOrEmail": "admin", "password": "admin123"}
        User user = userRepository.findByUsername(request.usernameOrEmail())
                    .or(() ->  userRepository.findByEmail(request.usernameOrEmail()))
                    .orElseThrow(() -> new BadCredentialsException("User/Email hoặc mật khẩu không đúng"));

        // 2. Authenticate bằng AuthenticationManager (Kiểm tra password qua Bcrypt)
        //    Nếu sai password -> ném lỗi BadCredentialsException -> GlobalExceptionHandler bắt và -> lỗi 401
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), request.password()));

        // 3. Load userDetails để tạo JWT (có authorities: ROLE_USER, ROLE_ADMIN))
        var userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        
        // 4. Tạo access token + refresh token  
        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        log.info("User logged in: {}", user.getUsername());

        // 5. Trả về AuthResponse
        return AuthReponse.of(
            accessToken,
            refreshToken,
            "Bearer",
            jwtProperties.getAccessTokenExpirationMs(),
            userMapper.toResponse(user)
        );


    }

    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User", username));
        return userMapper.toResponse(user);
    }
}
