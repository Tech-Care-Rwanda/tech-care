package com.TechCare.TechCare_Rwanda.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class PasswordResetController {

    /**
     * Serve the password reset page
     * @param token Optional reset token parameter
     * @return Password reset page
     */
    @GetMapping("/reset-password")
    public String resetPasswordPage(@RequestParam(required = false) String token) {
        return "redirect:/reset-password.html" + (token != null ? "?token=" + token : "");
    }

    /**
     * Serve forgot password page (optional)
     * @return Forgot password page
     */
    @GetMapping("/forgot-password")
    public String forgotPasswordPage() {
        return "redirect:/forgot-password.html";
    }
}
