﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VaBucherBack.Data;
using BCrypt.Net;

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

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
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
}