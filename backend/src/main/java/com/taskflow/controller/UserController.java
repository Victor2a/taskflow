package com.taskflow.controller;

import com.taskflow.dto.response.UserResponse;
import com.taskflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> search(@RequestParam String q) {
        return ResponseEntity.ok(userService.searchUsers(q));
    }
}
