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
            if (dbUser != null)
            {
                return BadRequest("Un utilisateur avec cet e-mail existe déjà.");
            }
            Console.WriteLine(user);

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
            var fromMail = "swebystudio@gmail.com";
            var fromPassword = "vjoopqgghpnlqkfp";

            MailMessage message = new MailMessage();
            message.From = new MailAddress(fromMail);
            message.Subject = "Confirmation de compte";
            message.To.Add(new MailAddress(user.Email));
            message.Body = $"Bonjour {user.Firstname},<br><br>" +
                           $"Cliquez sur ce lien pour confirmer votre compte : <a href='{confirmationLink}'>{confirmationLink}</a>";

            var smtpClient = new SmtpClient("smtp.gmail.com")

            {
                Port = 587,
                Credentials = new NetworkCredential(fromMail, fromPassword),
                EnableSsl= true
            };
            smtpClient.Send(message);

            // Si l'email est envoyé avec succès, renvoyer la réponse OK
            return Ok(user);
        }


        [HttpPut]
        public async Task<ActionResult<List<User>>> UpdateUser(User user)
        {
            var dbUser = await _context.Users.FindAsync(user.Id);
            if (dbUser == null)
                return BadRequest("User not found.");
            if (user.Firstname != dbUser.Firstname) { 
            dbUser.Firstname = user.Firstname;
            }
            if (user.Lastname != dbUser.Lastname)
            {
                dbUser.Lastname = user.Lastname;
            }
            if (user.Location != dbUser.Location)
            {
                dbUser.Location = user.Location;
            }
            if (user.Password != null && user.Password !=  dbUser.Location ) {
                var salt = BCrypt.Net.BCrypt.GenerateSalt();
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password, salt);
                dbUser.Password = user.Password;
            }
            if (user.Jobtype != dbUser.Jobtype) { 
            dbUser.Jobtype = user.Jobtype;
            }
            if (user.Domain != dbUser.Domain)
            {
                dbUser.Domain = user.Domain;
            }
            if (user.Role != dbUser.Role) { 
            dbUser.Role = user.Role;
            }
            if (user.CV != dbUser.CV) {
                dbUser.CV = user.CV;
            }
            if (user.Email != dbUser.Email) { 
            dbUser.Email = user.Email;
            }
            if (user.Phone != dbUser.Phone) { 
            dbUser.Phone = user.Phone;
            }


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
}