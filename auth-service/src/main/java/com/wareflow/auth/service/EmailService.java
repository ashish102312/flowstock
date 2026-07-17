package com.wareflow.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendEmailVerification(String toEmail, String fullName, String verificationLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("WareFlow — Verify Your Email Address");
            message.setText("""
                    Hello %s,

                    Welcome to WareFlow! Please verify your email address by clicking the link below:

                    %s

                    This link expires in 24 hours.

                    If you did not create an account, please ignore this email.

                    — The WareFlow Team
                    """.formatted(fullName, verificationLink));
            mailSender.send(message);
            log.info("Verification email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String fullName, String resetLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("WareFlow — Password Reset Request");
            message.setText("""
                    Hello %s,

                    We received a request to reset the password for your WareFlow account.

                    Click the link below to reset your password (expires in 15 minutes):

                    %s

                    If you did not request this, please ignore this email. Your account is safe.

                    — The WareFlow Team
                    """.formatted(fullName, resetLink));
            mailSender.send(message);
            log.info("Password reset email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendPasswordChangedAlert(String toEmail, String fullName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("WareFlow — Your Password Was Changed");
            message.setText("""
                    Hello %s,

                    Your WareFlow account password was successfully changed.

                    If you did not make this change, please contact support immediately.

                    — The WareFlow Team
                    """.formatted(fullName));
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send password change alert to {}: {}", toEmail, e.getMessage());
        }
    }
}
