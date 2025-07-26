<?php
// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);
date_default_timezone_set('Europe/London');

// Import PHPMailer classes
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Only process POST requests
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: https://meterbolic-website.infy.uk/");
    exit;
}

// Get form data with proper sanitization
$fullName = isset($_POST['fullName']) ? htmlspecialchars(trim($_POST['fullName']), ENT_QUOTES, 'UTF-8') : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$interest = isset($_POST['interest']) ? htmlspecialchars(trim($_POST['interest']), ENT_QUOTES, 'UTF-8') : '';
$consent = isset($_POST['consent']) ? true : false;
$teamEmail = isset($_POST['teamEmail']) ? filter_var(trim($_POST['teamEmail']), FILTER_SANITIZE_EMAIL) : 'uiux@meterbolic.com';

// Validate required fields
$errors = [];
if (empty($fullName)) {
    $errors[] = 'Full name is required';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}
if (empty($interest)) {
    $errors[] = 'Please select an area of interest';
}
if (!$consent) {
    $errors[] = 'You must agree to receive emails';
}

// If validation errors, redirect back with error messages
if (!empty($errors)) {
    $errorString = urlencode(implode('|', $errors));
    header("Location: https://meterbolic-website.infy.uk/contact.html?error=" . $errorString);
    exit;
}

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // Server settings for Gmail
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'uiux@meterbolic.com';
    $mail->Password = 'kmhrgmacjgeojfzi';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->CharSet = 'UTF-8';
    
    // First email - to your team
    $mail->setFrom($email, $fullName);
    $mail->addAddress($teamEmail, 'Meterbolic Team');
    $mail->addReplyTo($email, $fullName);
    
    $mail->isHTML(true);
    $mail->Subject = "New Waitlist Registration: $fullName";
    $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d3748;'>
            <div style='text-align: center; margin-bottom: 20px;'>
                <img src='images/original-logo.png' alt='Meterbolic Logo' style='max-width: 200px;'>
            </div>
            
            <h2 style='color: #2d3748;'>New Waitlist Registration</h2>
            
            <div style='background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                <p style='font-size: 16px;'><strong>Name:</strong> $fullName</p>
                <p style='font-size: 16px;'><strong>Email:</strong> <a href='mailto:$email'>$email</a></p>
                <p style='font-size: 16px;'><strong>Interest:</strong> $interest</p>
                <p style='font-size: 16px;'><strong>Consent:</strong> " . ($consent ? 'Yes' : 'No') . "</p>
                <p style='font-size: 16px;'><strong>Date:</strong> " . date('F j, Y, g:i a') . "</p>
            </div>
            
            <p style='font-size: 16px;'>This person has registered through the website contact form.</p>
        </div>
    ";
    
    $mail->send();
    
    // Reset for the confirmation email to the user
    $mail->clearAddresses();
    $mail->clearReplyTos();
    
    // Second email - confirmation to user
    $mail->setFrom('uiux@meterbolic.com', 'Meterbolic Team');
    $mail->addAddress($email, $fullName);
    $mail->Subject = "Thank you for joining Meterbolic's waitlist";
    
    $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d3748;'>
            <div style='text-align: center; margin-bottom: 20px;'>
                <img src='images/original-logo.png' alt='Meterbolic Logo' style='max-width: 200px;'>
            </div>
            
            <h2 style='color: #2d3748;'>Thank you for joining our waitlist, $fullName!</h2>
            
            <p style='font-size: 16px;'>We're excited to have you on board as we prepare to launch our advanced metabolic testing platform.</p>
            
            <div style='background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                <h3 style='color: #4a5568; margin-top: 0;'>Your registration details:</h3>
                <p style='font-size: 16px;'><strong>Name:</strong> $fullName</p>
                <p style='font-size: 16px;'><strong>Email:</strong> $email</p>
                <p style='font-size: 16px;'><strong>Area of interest:</strong> $interest</p>
                <p style='font-size: 16px;'><strong>Date registered:</strong> " . date('F j, Y, g:i a') . "</p>
            </div>
            
            <p style='font-size: 16px;'>We'll notify you as soon as our platform is ready. In the meantime, feel free to explore our website for more information about our services.</p>
            
            <p style='font-size: 16px;'>Best regards,<br>The Meterbolic Team</p>
        </div>
    ";
    
    $mail->send();
    
    // Redirect to thank you page
    header("Location: https://meterbolic-website.infy.uk/thank-you.html");
    exit;
    
} catch (Exception $e) {
    // Log the error for debugging
    error_log('Mailer Error: ' . $mail->ErrorInfo);
    
    // Redirect with error message
    header("Location: https://meterbolic-website.infy.uk/contact.html?error=send_error");
    exit;
}
?>