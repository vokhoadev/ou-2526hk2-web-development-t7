package com.ou.springcode.exception;

// Không tìm thấy resource (user, ...) trả về 404
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, Object id) {
        super(resource + "không tồn tại với id: " + id);
    }
}
