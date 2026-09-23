export const getResetPasswordTemplate = ( username, resetUrl ) =>`
    <!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Password Reset - NoteGen</title>
    <style>
      body { margin:0; padding:0; background:#f4f7fb; font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
      .container { max-width:600px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e6eef7; }
      .header { padding:24px; text-align:center; font-size:20px; font-weight:bold; color:#0b5cff; }
      .content { padding:24px 32px; color:#1f2937; font-size:16px; line-height:24px; }
      .btn { display:inline-block; margin:24px 0; padding:12px 24px; background:#0b5cff; color:#ffffff; text-decoration:none; font-weight:bold; border-radius:8px; }
      .muted { font-size:13px; color:#64748b; }
      .footer { padding:16px 32px; font-size:12px; color:#94a3b8; text-align:center; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">NoteGen</div>
      <div class="content">
        <h2 style="margin-top:0;">Reset Your Password</h2>
        <p>Hi ${username},</p>
        <p>You recently requested to reset your password for your NoteGen account. Click the button below to reset it:</p>
        <p>This password reset Only valid for 30 minutes</p>

        <p style="text-align:center;">
          <a href="${resetUrl}" target="_blank" class="btn">Reset Password</a>
        </p>

        <p class="muted">If the button doesn’t work, copy and paste this link into your browser:</p>
        <p class="muted"><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>

        <p class="muted">This link will expire in 30 minutes. If you didn't request a password reset, please ignore this email.</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} NoteGen • <a href="https://note-gen-frontend.vercel.app/" target="_blank">notegen.com</a>
      </div>
    </div>
  </body>
</html>
`;