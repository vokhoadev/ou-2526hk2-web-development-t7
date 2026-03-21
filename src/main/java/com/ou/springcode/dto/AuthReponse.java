package com.ou.springcode.dto;

/*
* Reponse sau đăng nhập / refresh
*/
public record AuthReponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    Long expiresInSeconds,
    UserResponse user
) {
    public AuthReponse {
        if (tokenType == null || tokenType.isBlank()) {
            tokenType = "Bearer";
        }
    }

    public static AuthReponse of(
        String accessToken,
        String refreshToken,
        String tokenType,
        Long expiresInSeconds,
        UserResponse user
    ) {
        return new AuthReponse(accessToken, refreshToken, tokenType, expiresInSeconds, user);
    }
}
