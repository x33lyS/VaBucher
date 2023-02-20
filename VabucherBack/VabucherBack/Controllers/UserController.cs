using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VaBucherBack.Data;
using BCrypt.Net;
using System.Net.Mail;
using System.Net;


namespace VaBucherBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;
        public UserController(DataContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<List<User>>> GetUsers()
        {
            return Ok(await _context.Users.ToListAsync());
        }
        [HttpPost]
        public async Task<ActionResult<List<User>>> CreateUser(User user)
        {
            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (dbUser == null)
            {
                var salt = BCrypt.Net.BCrypt.GenerateSalt();
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password, salt);
                user.DateCreation = DateTime.Now;

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Générer un code de confirmation unique
                var confirmationCode = Guid.NewGuid().ToString();

                // Stocker le code de confirmation dans la base de données
                user.codeValidation = confirmationCode;
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Envoyer un e-mail de confirmation à l'utilisateur
                var confirmationLink = $"{this.Request.Scheme}://{this.Request.Host}/api/user/confirm?code={confirmationCode}";
                var emailBody = $"Cliquez sur ce lien pour confirmer votre compte : {confirmationLink}";
                // Remplacez les variables 'email' et 'password' par les vraies informations de votre serveur d'envoi d'email
                // Remplacez les valeurs 'smtpServer', 'smtpPort', 'username' et 'password' par les vraies informations de votre serveur d'envoi d'email
                var emailService = new EmailService("smtp.gmail.com", "swebystudio@gmail.com", "4>$@fAdam", 587);
                await emailService.SendEmailAsync(user.Email, "Confirmation de compte", emailBody);


                return Ok(await _context.Users.ToListAsync());
            }
            else
            {
                return BadRequest("Un utilisateur avec cet e-mail existe déjà.");
            }
        }

        [HttpPut]
        public async Task<ActionResult<List<User>>> UpdateUser(User user)
        {
            var dbUser = await _context.Users.FindAsync(user.Id);
            if (dbUser == null)
                return BadRequest("User not found.");

            dbUser.Firstname = user.Firstname;
            dbUser.Lastname = user.Lastname;
            dbUser.Location = user.Location;
            dbUser.Password = user.Password;
            dbUser.Jobtype = user.Jobtype;
            dbUser.Domain = user.Domain;
            dbUser.Role = user.Role;
            dbUser.CV = user.CV;
            dbUser.Email = user.Email;
            dbUser.Phone = user.Phone;


            await _context.SaveChangesAsync();

            return Ok(await _context.Users.ToListAsync());
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<List<User>>> DeleteUser(int id)
        {
            var dbUser = await _context.Users.FindAsync(id);
            if (dbUser == null)
                return BadRequest("User not found.");

            _context.Users.Remove(dbUser);
            await _context.SaveChangesAsync();

            return Ok(await _context.Users.ToListAsync());
        }


    }


    public class EmailService
    {
        public readonly string _smtpServer;
        public readonly int _smtpPort;
        private readonly string _username;
        private readonly string _password;

        public EmailService(string smtpServer, string username, string password, int smtpPort)
        {
            _smtpServer = "smtp.gmail.com";
            _smtpPort = 587;
            _username = "swebystudio@gmail.com";
            _password = "4>$@fAdam";
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var client = new SmtpClient(_smtpServer, _smtpPort)
            {
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(_username, _password),
                EnableSsl = true
            };

            var message = new MailMessage
            {
                From = new MailAddress(_username),
                Subject = subject,
                Body = body
            };

            message.To.Add(toEmail);

            await client.SendMailAsync(message);
        }
    }


}