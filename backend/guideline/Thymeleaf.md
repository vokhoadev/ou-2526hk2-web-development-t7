# Hướng dẫn Thymeleaf với Spring Boot (server-side HTML)

Tài liệu này giúp sinh viên **hiểu lý thuyết** Thymeleaf và **làm từng bước** để render trang HTML từ Spring MVC, phù hợp với project **`springcode`** (Spring Boot **4.0.x**, Java **25**, Security JWT cho API).

---

## Mục tiêu học tập

Sau khi đọc và làm theo, bạn nắm được:

- **MVC phía server**: Controller trả **tên view** + **model**, Thymeleaf biến model thành HTML.
- **Kiến trúc tích hợp Spring**: `DispatcherServlet`, **ViewResolver**, **TemplateEngine** (vai trò từng thành phần).
- **Cú pháp Thymeleaf**: năm nhóm biểu thức, `${…}`, `*{…}`, `@{…}`, `#{…}`, `~{…}`, **Spring EL**, toán tử, **`#` utilities**.
- **Điều kiện, lặp, fragment** (`th:insert` / `th:replace`), `th:block`, `th:remove`, thứ tự ưu tiên `th:*`.
- **Form HTML**: binding (`th:object`, `th:field`), **select/checkbox/radio**, lỗi validation.
- **Controller nâng cao**: `ModelAndView`, **`redirect:` / `forward:`**, **flash attributes**, `@ModelAttribute` toàn cục.
- **i18n**, cấu hình **`spring.thymeleaf.*`**, static assets, **an toàn XSS**; **JWT + Security** trong `springcode`.
- **Hướng kiểm thử** view với `MockMvc` (tùy chọn).

> **Lưu ý về “đầy đủ tuyệt đối”**: Thymeleaf có tài liệu rất lớn (dialect mở rộng, 3Layout, PDF, reactive…). Tài liệu này **bám chương trình PTHTW / Spring MVC thông thường**; phần cuối có **mục phạm vi** liệt kê chủ đề đã có / nên đọc thêm ở doc chính thức.

---

## Phần 0 — Lý thuyết nền

### 0.1. REST API vs trang HTML (SSR)

| Cách làm | Controller trả gì | Ai render giao diện |
|----------|-------------------|---------------------|
| REST (`@RestController`) | JSON (body) | Client (React, mobile app, Postman) |
| MVC + Thymeleaf (`@Controller`) | Tên template + **Model** | **Server** (Thymeleaf → HTML) |

Trong `springcode`, các API như `/api/auth/**` đang trả JSON. Khi thêm Thymeleaf, bạn có thể **song song**: API vẫn JSON, còn các route như `/`, `/users-page` trả HTML cho trình duyệt.

### 0.2. Luồng request một trang Thymeleaf

1. Trình duyệt gửi `GET /hello` (hoặc POST form).
2. **`@Controller`** xử lý, đưa dữ liệu vào **Model** (`model.addAttribute("key", value)`).
3. Method trả chuỗi `"hello"` → Spring map tới file `src/main/resources/templates/hello.html`.
4. **Thymeleaf Engine** đọc HTML, thay các `th:*` bằng dữ liệu model, trả HTML cho client.

### 0.3. “Natural template” là gì?

File `.html` vẫn là HTML hợp lệ: bạn có thể mở trực tiếp trong trình duyệt (sẽ thấy nội dung “placeholder”). Khi chạy qua Spring, các thuộc tính `th:text`, `th:each`, … được xử lý và thay thế.

Khai báo namespace (đặt trên thẻ `<html>`):

```html
<html xmlns:th="http://www.thymeleaf.org">
```

### 0.4. Standard Dialect & Spring dialect

- **Standard Dialect**: `th:text`, `th:if`, `th:each`, … (dùng mọi project).
- **Spring Security Dialect** (tùy chọn): `sec:authorize`, … — cần thêm dependency `thymeleaf-extras-springsecurity6` khi muốn ẩn/hiện nút theo role trên HTML. Tài liệu này tập trung phần cốt lõi; phần Security dialect có thể bổ sung sau.

### 0.5. Kiến trúc render: Spring MVC + Thymeleaf

Khi request tới một `@Controller` **không** có `@ResponseBody`:

1. **`DispatcherServlet`** nhận request, gọi **handler** (method controller).
2. Method trả về **`String` (tên view)** hoặc **`ModelAndView`** (tên view + model).
3. **`ViewResolver`** (do Spring Boot cấu hình sẵn cho Thymeleaf) map `"hello"` → template thực tế, mặc định `classpath:/templates/hello.html`.
4. **`SpringTemplateEngine`** (Thymeleaf) đọc file HTML, đánh giá các `th:*`, ghi ra **HTML** làm response.

**Khái niệm cần nhớ**: *View* là “cách hiển thị kết quả”; với Thymeleaf, view là **template** + **model** (dữ liệu chỉ tồn tại trong request đó, trừ khi bạn đưa vào session/flash).

### 0.6. Ngôn ngữ biểu thức: Spring EL (SpEL)

Trong ứng dụng **Spring**, Thymeleaf dùng **Spring Expression Language (SpEL)** để đánh giá `${…}` và `*{…}` (không phải OGNL như Thymeleaf thuần ngoài Spring).

Bạn có thể gọi method, truy cập property, toán tử logic:

```text
${user != null and !user.roles.isEmpty()}
${users.size()}
${T(java.time.LocalDate).now()}   // class type expression (dùng cẩn thận)
```

**Gợi ý thực hành**: logic nghiệp vụ nặng vẫn nên ở **Service**; template chỉ **hiển thị** và điều kiện nhẹ.

### 0.7. Năm loại biểu thức (expression types)

| Ký hiệu | Tên tiếng Anh | Ý nghĩa |
|---------|----------------|---------|
| `${…}` | Variable | Đọc biến / bean trong **context** (thường là model) |
| `*{…}` | Selection | Đọc field trên **đối tượng chọn** (`th:object`) |
| `@{…}` | Link (URL) | Tạo URL, query string, path variable |
| `#{…}` | Message | Chuỗi đa ngôn ngữ từ `messages*.properties` |
| `~{…}` | Fragment | Tham chiếu template / fragment (include, replace) |

### 0.8. Escape HTML, XSS và `th:utext`

- **`th:text`**: luôn **escape** ký tự đặc biệt HTML → an toàn hơn khi hiển thị dữ liệu người dùng.
- **`th:utext`**: **không escape** → nếu chèn chuỗi do user kiểm soát (ví dụ `<script>`), dễ **XSS**. Chỉ dùng với nội dung tin cậy (markdown đã sanitize, HTML từ admin đã lọc).

**Lý thuyết bảo mật giao diện**: coi mọi dữ liệu động là **không tin cậy**; mặc định dùng `th:text`, validate input ở server, có thể bổ sung header **Content-Security-Policy** ở tầng ứng dụng (ngoài phạm vi Thymeleaf thuần).

---

## Phần 1 — Chuẩn bị trong project `springcode`

### Bước 1.1. Thêm dependency Thymeleaf

Trong `pom.xml`, thêm (cùng nhóm các `dependency` khác):

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

**Giải thích ngắn**: Starter này kéo Thymeleaf + tích hợp Spring MVC (view resolver, property mặc định). Sau khi sửa `pom.xml`, chạy lại `./mvnw spring-boot:run` (hoặc `mvnw.cmd spring-boot:run` trên Windows).

### Bước 1.2. Thư mục template và static

Tạo (nếu chưa có):

```text
src/main/resources/templates/   ← file .html cho Thymeleaf
src/main/resources/static/      ← css, js, hình (URL gốc /)
```

**Mặc định Spring Boot**: template nằm trong `templates/`, không cần cấu hình thêm trừ khi bạn đổi prefix/suffix trong `application.yaml`.

### Bước 1.3. Lưu ý quan trọng: Spring Security hiện tại

Trong `SecurityConfig`, rule `anyRequest().authenticated()` khiến **hầu hết URL cần JWT** (trừ các `permitAll` đã khai báo). `HomeController` đang có `@GetMapping("/")` trả chuỗi — nếu bạn đổi sang trang Thymeleaf tại `/`, người chưa đăng nhập có thể bị **401** khi mở trình duyệt.

**Hướng xử lý khi học / demo UI:**

- **Cách A (đơn giản cho lab)**: cho phép các route HTML công khai, ví dụ:

  - `.requestMatchers("/", "/css/**", "/js/**", "/images/**").permitAll()`
  - hoặc nhóm UI dưới `/public/**` và `permitAll` khớp prefix đó.

- **Cách B (gần thực tế hơn)**: trang HTML gọi API bằng JavaScript và lưu JWT (localStorage) — phức tạp hơn, thường dùng khi frontend tách riêng.

Tài liệu Thymeleaf cổ điển thường dùng **session + form login**. Project bạn đang **stateless JWT**; khi làm bài Thymeleaf, hãy **chủ động mở quyền** cho các URL demo hoặc tách rõ “trang public” / “trang cần đăng nhập”.

---

## Phần 2 — Bài tập tối thiểu: trang Hello

### Bước 2.1. Tạo `PageController` (hoặc đổi `HomeController`)

Dùng **`@Controller`**, không dùng `@RestController` cho view HTML (vì `@RestController` = `@Controller` + `@ResponseBody`, mọi return đều là body JSON/text chứ không resolve template).

Ví dụ class mới `com.ou.springcode.controller.PageController`:

```java
package com.ou.springcode.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/hello")
    public String hello(Model model) {
        model.addAttribute("title", "Xin chào Thymeleaf");
        model.addAttribute("course", "PTHTW / Spring Boot");
        return "hello"; // -> templates/hello.html
    }
}
```

### Bước 2.2. Tạo `templates/hello.html`

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" lang="vi">
<head>
    <meta charset="UTF-8">
    <title th:text="${title}">Tiêu đề mặc định</title>
</head>
<body>
    <h1 th:text="${title}">Tiêu đề mặc định</h1>
    <p>Môn học: <span th:text="${course}">Tên môn</span></p>
</body>
</html>
```

### Bước 2.3. Chạy và kiểm tra

1. Đảm bảo Security cho phép `GET /hello` (thêm `permitAll` cho `/hello` hoặc prefix bạn chọn).
2. Mở trình duyệt: `http://localhost:8080/hello`.

---

## Phần 3 — Biểu thức & biến (lý thuyết + ví dụ)

### 3.1. `${variable}` — biến trong model

```html
<p th:text="${user.name}">Tên</p>
```

- `user` là attribute trong model: `model.addAttribute("user", userObject)`.
- **Precedence**: nếu có nhiều nguồn (request, session, …), Thymeleaf có thứ tự ưu tiên; trong bài thường chỉ dùng model từ controller.

### 3.2. `*{…}` — chọn thuộc tính trên đối tượng “hiện tại” (`th:object`)

Dùng trong form hoặc khối con của một object:

```html
<div th:object="${user}">
    <span th:text="*{email}">email</span>
</div>
```

`*{email}` tương đương `${user.email}` khi đã có `th:object="${user}"`.

### 3.3. `@{…}` — URL (link, form action)

```html
<a th:href="@{/hello}">Về Hello</a>
<a th:href="@{/users/{id}(id=${user.id})}">Chi tiết</a>
```

Lợi ích: tự động thêm **context path** nếu app deploy dưới sub-path.

### 3.4. `#{…}` — message (i18n)

Định nghĩa file `src/main/resources/messages.properties`:

```properties
app.welcome=Xin chào
```

Trong HTML:

```html
<p th:text="#{app.welcome}">Xin chào</p>
```

Có thể thêm `messages_vi.properties`, `messages_en.properties` và cấu hình `spring.web.locale` nếu môn học yêu cầu đa ngôn ngữ.

### 3.5. Literal và toán tử (ôn nhanh)

- Chuỗi: `'text'`
- Nối: `|Xin chào, ${user.name}!|`
- Điều kiện: `th:if="${user != null}"`

---

## Phần 4 — Thuộc tính `th:*` thường dùng

| Thuộc tính | Tác dụng |
|------------|----------|
| `th:text` | Thay **nội dung text** của thẻ (escape HTML) |
| `th:utext` | Giống `th:text` nhưng **không escape** — chỉ dùng khi tin tưởng nguồn (tránh XSS) |
| `th:attr` / `th:*` cụ thể | Gán `href`, `src`, `value`, `class`, … |
| `th:if` / `th:unless` | Hiển thị có điều kiện |
| `th:switch` / `th:case` | Nhánh giống switch |
| `th:each` | Lặp collection |
| `th:with` | Định biến cục bộ trong phạm vi thẻ con |
| `th:insert` | Chèn **nội dung** fragment **bên trong** thẻ hiện tại |
| `th:replace` | Thay **cả thẻ** hiện tại bằng fragment |
| `th:classappend` | **Nối thêm** class CSS (không ghi đè hết `class`) |
| `th:attrappend` / `th:attrprepend` | Nối thêm giá trị thuộc tính tùy ý |
| `th:remove` | `all`, `body`, `tag`, `all-but-first` — xóa phần tử khỏi output |
| `th:fragment` | Đặt tên khối tái sử dụng |
| `th:assert` | Kiểm tra điều kiện khi render (debug / fail nhanh) |

### 4.1. `th:insert` vs `th:replace`

- **`th:insert`**: giữ thẻ host, **chèn** fragment vào bên trong → còn wrapper HTML của host.
- **`th:replace`**: **thay thế hoàn toàn** thẻ host bằng fragment → bố cục “đúng như file fragment”.

Ví dụ:

```html
<!-- Sau render, vẫn còn thẻ div bọc ngoài -->
<div th:insert="~{fragments/layout :: header}"></div>

<!-- Sau render, chỉ còn nội dung fragment (thẻ div gốc biến mất) -->
<div th:replace="~{fragments/layout :: header}"></div>
```

### 4.2. `th:block` — thẻ vô hình

`th:block` không xuất ra HTML; dùng khi cần `th:each` / `th:if` mà **không muốn thêm** `div`/`span` thừa.

```html
<th:block th:each="u : ${users}">
    <span th:text="${u.name}">...</span>
</th:block>
```

### 4.3. Thứ tự xử lý nhiều `th:*` trên cùng thẻ (precedence)

Khi một thẻ có nhiều `th:*`, Thymeleaf có **bảng thứ tự ưu tiên** cố định (ví dụ `th:insert`/`th:replace` xử lý trước `th:each` trong một số trường hợp). Nếu kết quả lạ, hãy **tách thẻ** hoặc dùng `th:block`.

Chi tiết đầy đủ: mục *Attribute Precedence* trong [tài liệu Thymeleaf](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#attribute-precedence).

Ví dụ lặp:

```html
<ul>
    <li th:each="u : ${users}" th:text="${u.name}">Tên</li>
</ul>
```

Trạng thái lặp (index, odd/even):

```html
<tr th:each="u, iter : ${users}"
    th:class="${iter.odd} ? 'odd' : 'even'">
    <td th:text="${iter.count}">1</td>
    <td th:text="${u.name}">...</td>
</tr>
```

---

## Phần 5 — Form, binding và validation (rất quan trọng)

### 5.1. GET hiển thị form, POST gửi dữ liệu

Controller (minh họa):

```java
@GetMapping("/register-form")
public String showForm(Model model) {
    model.addAttribute("userRequest", new UserRequest());
    return "register";
}

@PostMapping("/register-form")
public String submit(@Valid @ModelAttribute("userRequest") UserRequest req,
                     BindingResult bindingResult,
                     Model model) {
    if (bindingResult.hasErrors()) {
        return "register";
    }
    // gọi service lưu user...
    return "redirect:/hello";
}
```

Template `register.html` (rút gọn):

```html
<form th:action="@{/register-form}" th:object="${userRequest}" method="post">
    <label>Username</label>
    <input type="text" th:field="*{username}" />
    <p th:if="${#fields.hasErrors('username')}" th:errors="*{username}"></p>

    <label>Password</label>
    <input type="password" th:field="*{password}" />
    <p th:if="${#fields.hasErrors('password')}" th:errors="*{password}"></p>

    <button type="submit">Đăng ký</button>
</form>
```

**Lý thuyết**:

- `th:object` trỏ tới bean trong model.
- `th:field="*{prop}"` sinh `name`/`id` đúng chuẩn Spring MVC và giữ giá trị cũ khi form lỗi.
- `@Valid` + `BindingResult` để hiển thị lỗi Bean Validation trên lại trang.

### 5.2. CSRF và Spring Security

Khi bật **CSRF** (mặc định với form session-based), Thymeleaf tích hợp token qua:

```html
<input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}" />
```

Project `springcode` hiện **tắt CSRF** (`csrf.disable()`) vì API JWT — nếu sau này bạn bật lại CSRF cho form HTML, cần nhớ thêm token như trên.

---

## Phần 6 — Fragment & tái sử dụng layout

### 6.1. Định nghĩa fragment

File `templates/fragments/layout.html`:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<body>
    <header th:fragment="header">
        <nav>Menu chung</nav>
    </header>
</body>
</html>
```

### 6.2. Gọi fragment từ trang khác

```html
<header th:replace="~{fragments/layout :: header}"></header>
```

Cú pháp `~{… :: …}` là **fragment expression** (Thymeleaf 3+).

### 6.3. Truyền tham số vào fragment

```html
<footer th:fragment="footer(year)">
    <small>&copy; <span th:text="${year}">2026</span></small>
</footer>
```

Gọi:

```html
<footer th:replace="~{fragments/layout :: footer(${2026})}"></footer>
```

### 6.4. Layout “decoration” (tùy chọn nâng cao)

Muốn bố cục kiểu “1 file layout bọc nội dung”, có thể dùng thư viện **Thymeleaf Layout Dialect**. Đây là bước **không bắt buộc**; với bài lab, `th:replace` + fragment thường đủ.

---

## Phần 7 — Static assets & cache khi dev

- CSS/JS đặt trong `src/main/resources/static/css/...` → URL `/css/...`.
- Trong HTML:

```html
<link rel="stylesheet" th:href="@{/css/app.css}" />
```

- **DevTools**: khi có `spring-boot-devtools`, chỉnh template/static có thể reload nhanh; nếu thấy cache template, trong `application.yaml` có thể tạm thêm:

```yaml
spring:
  thymeleaf:
    cache: false
```

(chỉ nên tắt cache trong môi trường dev).

---

## Phần 8 — Gợi ý bài tập theo cấp độ

1. **Cơ bản**: trang danh sách user đọc từ service (giống API nhưng trả HTML), bảng `th:each`.
2. **Form**: form tạo user với validation, hiển thị lỗi bằng `th:errors`.
3. **Fragment**: header/footer dùng chung cho mọi trang.
4. **Nâng cao (tùy chọn)**: thêm Spring Security dialect để ẩn menu theo role; hoặc trang admin chỉ `ROLE_ADMIN`.

---

## Phần 9 — Lỗi thường gặp & cách xử lý

| Hiện tượng | Nguyên nhân thường gặp | Hướng xử lý |
|------------|------------------------|-------------|
| 401 khi mở trang | `SecurityFilterChain` yêu cầu authenticated | Thêm `permitAll` cho URL trang demo |
| Trả về tên file thay vì HTML | Dùng `@RestController` hoặc `@ResponseBody` | Dùng `@Controller`, return tên template |
| Template không tìm thấy | Sai tên hoặc sai thư mục | Kiểm tra `templates/<tên>.html` khớp `return "tên"` |
| `th:field` lỗi | Thiếu `th:object` | Bọc form bằng `th:object="${...}"` |
| Link sai context | Hard-code `/app/...` | Dùng `@{/path}` |
| XSS | Dùng `th:utext` với dữ liệu user | Ưu tiên `th:text`; sanitize nếu thật sự cần HTML |

---

## Tài liệu tham khảo chính thức

- [Thymeleaf documentation](https://www.thymeleaf.org/documentation.html)
- [Spring Boot — Thymeleaf](https://docs.spring.io/spring-boot/reference/web/servlet.html#web.servlet.spring-mvc.template-engines)

---

*Tài liệu này bổ sung cho `HuongDanTungBuoc.md`: phần hướng dẫn chính của repo vẫn xoay quanh REST + JWT; phần Thymeleaf dùng khi môn học yêu cầu giao diện server-side hoặc khi bạn muốn minh họa MVC song song với API.*
