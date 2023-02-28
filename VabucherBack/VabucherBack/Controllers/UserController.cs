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
using Mailgun.Api;
using Mailgun.Models;

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
            if (dbUser != null)
            {
                return BadRequest("Un utilisateur avec cet e-mail existe déjà.");
            }

            var salt = BCrypt.Net.BCrypt.GenerateSalt();
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password, salt);
            user.DateCreation = DateTime.Now;

            // Générer un code de confirmation unique
            var confirmationCode = Guid.NewGuid().ToString();

            user.codeValidation = confirmationCode;
            user.isConfirmed = false;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Envoyer un e-mail de confirmation à l'utilisateur
            var confirmationLink = $"{this.Request.Scheme}://{this.Request.Host}/api/user/confirm?code={confirmationCode}";
            var emailBody = $"Cliquez sur ce lien pour confirmer votre compte : {confirmationLink}";

            try
            {
                var emailService = new EmailService("in-v3.mailjet.com", "897578992d20afc47f3c4a01aca28ca6", "f113914ba6f30d5c74a9a0650cc7e104", 587);
                await emailService.SendEmailAsync(user.Email, "Confirmation de compte", emailBody);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur lors de l'envoi de l'e-mail de confirmation : {ex.Message}");
            }

            return Ok(user);
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
        private readonly MailgunApi _mailgunApi;

        public EmailService(string apiKey, string domain)
        {
            _mailgunApi = new MailgunApi(apiKey, domain);
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var message = new SendMessageRequest
            {
                FromEmail = "adam.haouzi31@gmail.com",
                ToEmail = toEmail,
                Subject = subject,
                Text = body
            };

            await _mailgunApi.Messages.SendAsync(message);
        }
    }



}