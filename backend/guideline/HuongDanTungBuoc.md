# Hướng dẫn xây dựng dự án SpringCode (Spring Boot + JPA + JWT)

Tài liệu này mô tả **từ bước khởi tạo project** đến **trạng thái codebase hiện tại** của repo `springcode`, kèm **lý thuyết ngắn gọn** và **giải thích code** để sinh viên có thể tự đọc, tự chạy và hiểu sâu luồng hoạt động.

---

## Mục tiêu học tập

Sau khi đọc và làm theo, bạn nắm được:

- Cách tổ chức **ứng dụng web REST** theo lớp (layered architecture): Controller → Service → Repository → Entity.
- **Spring Data JPA**: map entity xuống bảng, viết truy vấn (method name + `@Query`), phân trang.
- **Spring Security**: stateless API, mã hóa mật khẩu (BCrypt), phân quyền theo **role**.
- **JWT (JSON Web Token)**: cấp token khi đăng nhập, gửi token qua header `Authorization`, filter xác thực mỗi request.
- **Validation** đầu vào (Bean Validation), **xử lý lỗi thống nhất** (`@RestControllerAdvice`).
- **OpenAPI / Swagger UI** để thử API trên trình duyệt.

---

## Phần 0 — Kiến thức nền (nên đọc trước)

### REST API

Client gửi **HTTP request** (method + URL + header + body JSON) tới server; server trả **HTTP status** + body JSON. Thường dùng:

| Method  | Ý nghĩa thường gặp   |
|---------|----------------------|
| GET     | Lấy dữ liệu          |
| POST    | Tạo mới / hành động  |
| PUT/PATCH | Cập nhật (ít dùng trong bài này) |

### Dependency Injection (DI) trong Spring

Spring **tạo và nối** các object (bean): bạn khai báo `@Service`, `@Repository`, `@Component`, `@Configuration`… Spring tự **inject** constructor khi có đủ bean. Lợi ích: dễ test, tách trách nhiệm, cấu hình tập trung.

### Transaction (giao dịch) với JPA

`@Transactional` trên service: một nhóm thao tác DB **cùng thành công hoặc cùng rollback**. `readOnly = true` gợi ý cho Hibernate tối ưu đọc.

---

## Phần 1 — Chuẩn bị môi trường

1. **JDK**: project dùng Java **25** (khai báo trong `pom.xml`).
2. **Maven**: build và quản lý thư viện (`pom.xml`).
3. **IDE**: IntelliJ IDEA, VS Code + Extension Pack for Java, hoặc Eclipse.
4. **Công cụ gọi API**: `curl`, Postman, hoặc Swagger UI (đã tích hợp).

Chạy ứng dụng (từ thư mục gốc project):

```bash
./mvnw spring-boot:run
```

Hoặc trên Windows (CMD/PowerShell):

```bash
mvnw.cmd spring-boot:run
```

Ứng dụng lắng nghe cổng **8080** (theo `application.yaml`).

---

## Phần 2 — Khởi tạo project Spring Boot

### Bước 2.1. Tạo project (Spring Initializr)

Trên [https://start.spring.io](https://start.spring.io) chọn:

- **Project**: Maven
- **Language**: Java
- **Spring Boot**: phiên bản tương thích với `pom.xml` hiện tại (ví dụ **4.0.x**)
- **Group**: `com.ou`, **Artifact**: `springcode`
- **Dependencies** (tối thiểu cho project này): Spring Web, Spring Data JPA, H2, Spring Security, Validation, Spring Boot DevTools (tùy chọn)

Sau đó giải nén và mở trong IDE. Cấu trúc chuẩn:

```text
src/main/java/com/ou/springcode/   ← mã nguồn Java
src/main/resources/application.yaml ← cấu hình
pom.xml                              ← dependencies & build
```

### Bước 2.2. Lớp khởi động `SpringcodeApplication`

File `SpringcodeApplication.java` có annotation `@SpringBootApplication`. Đây là **điểm vào**: khi chạy `main`, Spring Boot:

1. Quét component trong package `com.ou.springcode` và con.
2. Nạp cấu hình (`application.yaml`, bean `@Configuration`).
3. Khởi động embedded server (Tomcat) và lắng nghe port.

```1:13:src/main/java/com/ou/springcode/SpringcodeApplication.java
package com.ou.springcode;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringcodeApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringcodeApplication.class, args);
	}

}
```

---

## Phần 3 — Cấu hình Maven (`pom.xml`)

### Lý thuyết

`pom.xml` khai báo **parent** `spring-boot-starter-parent` để đồng bộ phiên bản thư viện; phần `<dependencies>` kéo các **starter** (gói dependency đã được Spring chọn lọc sẵn).

### Các dependency quan trọng trong project

| Dependency | Vai trò |
|------------|---------|
| `spring-boot-starter-webmvc` | REST controller, JSON, Tomcat |
| `spring-boot-starter-data-jpa` | Hibernate + Spring Data JPA |
| `h2` | Cơ sở dữ liệu **in-memory** (phù hợp học tập) |
| `mysql-connector-j` | Driver MySQL (sẵn để sau này đổi DB thật) |
| `spring-boot-starter-security` | Bảo mật, filter chain |
| `spring-boot-starter-validation` | `@Valid`, `@NotBlank`, … |
| `jjwt-*` | Tạo và kiểm tra JWT |
| `springdoc-openapi-starter-webmvc-ui` | Swagger UI + OpenAPI 3 |
| `spring-boot-h2console` | Bật console H2 trên web (theo cấu hình) |

Phiên bản Java trong project: `<java.version>25</java.version>`.

---

## Phần 4 — Cấu hình ứng dụng (`application.yaml`)

```1:30:src/main/resources/application.yaml
spring:
  application:
    name: springcode

  datasource:
    url: jdbc:h2:mem:springcode_db
    driver-class-name: org.h2.Driver
    username: sa
    password: ""

  h2: 
    console:
      enabled: true
      path: /h2-console
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate.format_sql: true
    defer-datasource-initialization: true

  security:
    user:
      name: admin
      password: admin@12345

server:
  port: 8080
```

### Giải thích

- **`jdbc:h2:mem:...`**: H2 chạy **trong RAM**; tắt app là mất dữ liệu (trừ khi cấu hình file-based).
- **`ddl-auto: update`**: Hibernate tạo/cập nhật schema theo entity (học tập được; production thường dùng migration tool như Flyway/Liquibase).
- **`spring.security.user`**: user mặc định của Spring Boot (trong nhiều app chỉ dùng khi bật security mặc định). **Ở project này**, đăng nhập API chủ yếu qua **bảng `users` + JWT**; dòng này có thể gây nhầm lẫn — cần phân biệt **user in-memory mặc định** với **user lưu DB**.

**Gợi ý mở rộng (JWT an toàn hơn):** thêm vào `application.yaml` khóa tùy chỉnh, ví dụ:

```yaml
app:
  jwt:
    secret: "chuỗi-bí-mật-đủ-dài-cho-HS256"
    access-token-expiration-ms: 900000
    refresh-token-expiration-ms: 604800000
```

Class `JwtProperties` (xem dưới) map prefix `app.jwt`. Nếu chưa khai báo trong YAML, code dùng **giá trị mặc định trong class** (chỉ nên dùng khi học).

---

## Phần 5 — Mô hình miền: Entity và Enum

### 5.1. Enum `Role`

```1:6:src/main/java/com/ou/springcode/entity/Role.java
package com.ou.springcode.entity;

public enum Role {
    USER,
    ADMIN
}
```

**Lý thuyết:** Trong Spring Security, quyền thường là chuỗi `ROLE_*`. Code map `Role.ADMIN` → `ROLE_ADMIN` (xem `UserDetailsServiceImpl`).

### 5.2. Entity `User`

Entity là **lớp Java ánh xạ 1 bảng** trong DB.

Các điểm cần hiểu trong `User.java`:

- `@Entity`, `@Table`: JPA biết đây là bảng `users`.
- `@Index(unique = true)` trên `username`, `email`: ràng buộc **duy nhất** ở DB (bổ sung cho validation ở tầng service).
- `@Enumerated(EnumType.STRING)`: lưu `USER`/`ADMIN` dạng chuỗi (dễ đọc hơn số).
- `passwordHash`: **không** lưu mật khẩu thô; chỉ lưu **hash BCrypt**.
- `@PrePersist` / `@PreUpdate`: callback trước khi insert/update — tự gán `createdAt`, `updatedAt`.
- **Builder nội bộ** (`User.builder()`): tạo object tường minh trong `AuthService.register`.

**Lý thuyết bảo mật:** Hash một chiều + salt (BCrypt tự xử lý salt trong chuỗi hash). So sánh mật khẩu khi login do `PasswordEncoder` của Spring thực hiện.

---

## Phần 6 — Tầng truy cập dữ liệu: `UserRepository`

```14:40:src/main/java/com/ou/springcode/repository/UserRepository.java
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Query derivation : phát sinh truy vấn từ tên method
    // ...
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE " + 
        "(:search IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
        "AND (:role IS NULL OR u.role = :role)"
    )
    Page<User> findAllBySearchAndRole(@Param("search") String search, @Param("role") Role role, Pageable pageable);
}
```

### Giải thích

- **`JpaRepository<User, Long>`**: có sẵn `save`, `findById`, `findAll`, … với khóa `Long`.
- **Query derivation:** `findByUsername` → Spring sinh truy vấn theo tên field.
- **`@Query` JPQL:** `u` là alias entity; `LIKE` + `LOWER` hỗ trợ tìm kiếm không phân biệt hoa thường; `(:search IS NULL OR …)` cho phép **bỏ lọc** khi tham số null.
- **`Pageable`**: phân trang + sort — khớp với API `GET /api/users?page=&size=&sort=&order=`.

---

## Phần 7 — DTO (Data Transfer Object) và Validation

**Lý thuyết:** Không trả entity thẳng ra JSON (tránh lộ cấu trúc DB, tránh vòng lặp lazy-loading, kiểm soát field hiển thị). Dùng **record** / class DTO.

### `RegisterRequest`, `LoginRequest`

Ràng buộc bằng Jakarta Validation (`jakarta.validation.constraints.*`). Khi controller dùng `@Valid`, nếu sai → `MethodArgumentNotValidException` → `GlobalExceptionHandler` trả 400 + chi tiết từng field.

### `UserResponse`

Trả về cho client: **không** có `passwordHash`.

### `AuthReponse` (ghi chú: tên class đánh máy `Reponse`)

Chứa `accessToken`, `refreshToken`, `tokenType`, `expiresInSeconds`, và `user`.

### `UserRequest`

Hiện **chưa được controller nào sử dụng** — có thể dự định cho API tạo/sửa user sau này (trùng cấu trúc gần với `RegisterRequest`).

### `ApiError`

Format lỗi JSON thống nhất: `error`, `message`, `details`, `path`, `timestamp`.

---

## Phần 8 — Mapper: `UserMapper`

```8:23:src/main/java/com/ou/springcode/service/UserMapper.java
@Component
public class UserMapper {
    public UserResponse toResponse(User user) {
        if(user == null) return null;

        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getFullName(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
```

**Lý thuyết:** Tách logic “entity → DTO” khỏi service/controller; sau này có thể thay bằng MapStruct nếu project lớn.

---

## Phần 9 — Tầng nghiệp vụ: `UserService` và `AuthService`

### `UserService`

- `findAll(search, role, pageable)`: gọi repository, map sang `Page<UserResponse>`.
- `findById(id)`: không có → ném `ResourceNotFoundException`.

**Lưu ý:** Trong service có comment `create / update / delete` — **chưa triển khai** trong class; `UserController` hiện chỉ expose **danh sách có phân trang** (không có `GET /api/users/{id}` dù service đã có `findById`).

### `AuthService`

**Đăng ký `register`:**

1. Kiểm tra trùng `username` / `email` → `DuplicateResourceException` (409).
2. `passwordEncoder.encode(password)` → hash BCrypt.
3. `User.builder()...role(Role.USER)` → mặc định user thường.
4. `save` và trả `UserResponse`.

**Đăng nhập `login`:**

1. Tìm user theo `usernameOrEmail` (thử username, không có thì email).
2. `authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password))` — Spring so khớp mật khẩu với `passwordHash` trong `UserDetails`.
3. `userDetailsService.loadUserByUsername` để lấy **authorities** (roles).
4. `jwtService.generateAccessToken` / `generateRefreshToken`.
5. Trả `AuthReponse.of(...)`.

**Lý thuyết `AuthenticationManager`:** Điểm chuẩn của Spring Security để xác thực “principal + credentials”. Nếu sai mật khẩu → `BadCredentialsException` → handler trả 401.

**`getCurrentUser(username)`:** Dùng sau khi request đã được gắn user từ JWT (xem filter).

---

## Phần 10 — Controller REST

### `HomeController`

`GET /` trả chuỗi chào — kiểm tra nhanh server sống.

### `AuthController` — `/api/auth`

| Method + path | Chức năng |
|---------------|-----------|
| `POST /api/auth/register` | Đăng ký |
| `POST /api/auth/login` | Đăng nhập, nhận JWT |
| `POST /api/auth/me` | Thông tin user hiện tại — **cần JWT**; dùng `@AuthenticationPrincipal UserDetails` |

**Lưu ý:** `/me` dùng **POST** (có thể đổi thành GET cho đúng chuẩn “lấy thông tin” nếu muốn).

### `UserController` — `/api/users`

- `GET /api/users` với query: `search`, `role`, `page`, `size`, `sort`, `order`.
- Giới hạn `size` tối đa 100 bằng `Math.min(size, 100)`.
- Annotation `@SecurityRequirement(name = "bearerAuth")` phục vụ Swagger (khai báo trong `OpenApiConfig`).

---

## Phần 11 — JWT: cấu hình, tạo token, filter

### 11.1. `JwtProperties`

Prefix `app.jwt`: `secret`, `accessTokenExpirationMs`, `refreshTokenExpirationMs`. **HS256** cần secret đủ dài (class có comment “tối thiểu 256 bit” cho production).

### 11.2. `JwtService`

- `buildToken`: `subject` = username, `issuedAt`, `expiration`, ký HMAC bằng secret.
- `extractUsername`, `validateToken`: parser verify chữ ký và hạn dùng.

**Lý thuyết JWT:** Gồm 3 phần Base64Url (header.payload.signature). Server **tin payload** nếu chữ ký hợp lệ và chưa hết hạn. **Không** lưu session server-side → phù hợp **stateless API**.

**Hạn chế hiện tại:** Project tạo **refresh token** nhưng **chưa có endpoint** đổi refresh → access token mới; sinh viên có thể bổ sung sau.

### 11.3. `UserDetailsServiceImpl`

Load user từ DB; trả `org.springframework.security.core.userdetails.User` với:

- `username`
- `passwordHash` (để encoder so khớp khi authenticate)
- `GrantedAuthority`: `ROLE_USER` hoặc `ROLE_ADMIN`

**Quan trọng:** `hasRole("ADMIN")` trong cấu hình security khớp với prefix `ROLE_` — tức authority phải là `ROLE_ADMIN`.

### 11.4. `JwtAuthenticationFilter` (`OncePerRequestFilter`)

Luồng mỗi request:

1. Đọc header `Authorization: Bearer <token>`.
2. Parse JWT → lấy username.
3. `loadUserByUsername` + `validateToken`.
4. Tạo `UsernamePasswordAuthenticationToken` có **authorities**, set vào `SecurityContextHolder`.

Nếu token lỗi → log debug, **không** chặn request tại đây; request tiếp tục, sau đó rule `authorizeHttpRequests` có thể trả 401 qua `JwtAuthenticationEntryPoint`.

### 11.5. Phân biệt 401 và 403

- **`JwtAuthenticationEntryPoint`:** Chưa xác thực hoặc token không hợp lệ → **401 Unauthorized**.
- **`CustomAccessDeniedHandler`:** Đã xác thực nhưng **không đủ quyền** (ví dụ USER gọi API chỉ ADMIN) → **403 Forbidden**.

---

## Phần 12 — `SecurityConfig` — “bức tường” bảo mật

```32:56:src/main/java/com/ou/springcode/security/SecurityConfig.java
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/public/**").permitAll()
            .requestMatchers("/h2-console/**").permitAll()
            .requestMatchers("/swagger-ui/**", "/swagger-ui.html").permitAll()
            .requestMatchers("/v3/api-docs/**").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/users/**").hasAnyRole("USER", "ADMIN")
            .anyRequest().authenticated()
        )
        .exceptionHandling(ex -> ex
            .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            .accessDeniedHandler(accessDeniedHandler)
        )
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        http.headers(headers -> headers.frameOptions(f -> f.sameOrigin()));
        return http.build();
```

### Giải thích từng lựa chọn

- **`csrf().disable()`:** API JWT thường tắt CSRF (cookie session không dùng theo cách classic).
- **`STATELESS`:** Không tạo session HTTP; mỗi request mang JWT.
- **`permitAll`:** Đăng ký/đăng nhập, Swagger, H2 console (chỉ nên mở H2/Swagger trong môi trường dev).
- **`hasRole` / `hasAnyRole`:** Kiểm tra authority sau khi filter đã set `SecurityContext`.
- **`frameOptions sameOrigin`:** Cho phép H2 Console embed frame **cùng origin** (tránh clickjacking nhưng vẫn dùng được console).

**Lưu ý đọc comment trong file:** Đoạn comment có chỗ ghi `hasAllRoles` — **code thực tế dùng `hasAnyRole("USER", "ADMIN")`** cho `/api/users/**` (đúng với hành vi mong muốn: user đã đăng nhập là USER hoặc ADMIN đều xem được danh sách theo rule hiện tại).

---

## Phần 13 — Xử lý ngoại lệ toàn cục: `GlobalExceptionHandler`

`@RestControllerAdvice` bắt exception từ controller layer và trả JSON `ApiError`:

| Exception | HTTP |
|-----------|------|
| `MethodArgumentNotValidException` | 400 |
| `ResourceNotFoundException` | 404 |
| `DuplicateResourceException` | 409 |
| `BadCredentialsException` / `AuthenticationException` | 401 |
| `AccessDeniedException` | 403 |
| `Exception` (còn lại) | 500 |

**Lý thuyết:** Một định dạng lỗi giúp client (web/mobile) xử lý thống nhất.

---

## Phần 14 — OpenAPI / Swagger (`OpenApiConfig`)

Bean `OpenAPI` định nghĩa tiêu đề API và security scheme **`bearerAuth`** (JWT). Sau khi chạy app, mở (theo starter thường dùng):

- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) (hoặc đường dẫn mà Springdoc redirect)

Trong UI, bấm **Authorize**, dán `accessToken` (không cần tiền tố `Bearer` nếu UI đã cấu hình scheme HTTP bearer).

---

## Phần 15 — Thử nghiệm end-to-end

### 15.1. H2 Console

URL: [http://localhost:8080/h2-console/](http://localhost:8080/h2-console/)

- JDBC URL: `jdbc:h2:mem:springcode_db` (khớp `application.yaml`)
- User: `sa`, password để trống nếu cấu hình như file.

Xem bảng `users` sau khi đăng ký.

### 15.2. Gọi API (tham khảo `api.md`)

Đăng ký:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"abcd","email":"abcd@gmail.com","password":"password123"}'
```

Đăng nhập:

```bash
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"abcd","password":"password123"}'
```

Lấy `accessToken` từ JSON trả về, gọi API có bảo vệ:

```bash
curl -s http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

Gọi `/api/auth/me`:

```bash
curl -s -X POST http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## Phần 16 — Sơ đồ luồng request (tóm tắt)

```text
HTTP Request
    │
    ▼
JwtAuthenticationFilter  ──► (có Bearer?) ──► validate JWT ──► set SecurityContext (roles)
    │
    ▼
SecurityFilterChain      ──► permitAll / hasRole / authenticated?
    │
    ▼
Controller               ──► @Valid DTO
    │
    ▼
Service                  ──► @Transactional, nghiệp vụ
    │
    ▼
Repository / JPA         ──► SQL (Hibernate)
    │
    ▼
JSON Response (hoặc ApiError)
```

---

## Phần 17 — Những gì codebase **đã có** và **chưa có** (định hướng bài tập mở rộng)

**Đã có:**

- Đăng ký, đăng nhập JWT, `/me`, danh sách user có lọc + phân trang.
- Phân quyền cơ bản theo role; endpoint `/api/admin/**` đã khai báo nhưng **chưa thấy controller** trong repo — có thể thêm CRUD admin sau.
- Refresh token được **sinh** nhưng **chưa có API refresh**.

**Có thể mở rộng (gợi ý cho SV):**

1. `POST /api/auth/refresh` — đổi refresh token lấy access token mới (lưu blacklist/revoke nếu cần).
2. `GET /api/users/{id}`, `PUT`, `DELETE` — dùng sẵn một phần logic ở `UserService` / thêm mới.
3. Gán `Role.ADMIN` cho user cụ thể (SQL/script hoặc API seed) để thử `/api/admin/**`.
4. Đổi H2 → MySQL: chỉnh `spring.datasource.*` và tạo database.
5. Test tích hợp với `@SpringBootTest` + `@AutoConfigureMockMvc`.

---

## Phần 18 — Tổng kết

Project **springcode** minh họa một **REST API Spring Boot** điển hình: tách lớp rõ ràng, JPA với H2, bảo mật stateless bằng JWT, validation và xử lý lỗi thống nhất, tài liệu OpenAPI. Nắm vững **luồng từ HTTP → Filter → Security → Controller → Service → Repository** là chìa khóa để đọc mọi dự án Spring tương tự.

Chúc bạn học tập hiệu quả.
