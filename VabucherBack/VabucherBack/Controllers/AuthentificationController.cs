using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using VabucherBack;
using VaBucherBack.Data;

namespace VaBucherBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _config;
        private readonly string key ;
        private readonly string issuer;
        private readonly string audience;

        public AuthController(DataContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
             key = _config["Jwt:Key"];
             issuer = _config["Jwt:Issuer"];
             audience = _config["Jwt:Audience"];
        }

        public DataContext Context => _context;

        public IConfiguration Config => _config;
        /**
            * Login
            *  Check l'user dans la base de donnée, si il ne le trouve pas return code 401,
            *  sinon créer un token JWT, le return avec code 200
        */
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]  UserAuthentication userAuth )
        {
       

            var dbUser = await Context.Users.FirstOrDefaultAsync(u => u.Email == userAuth.Email && u.Password == userAuth.Password);
            if (dbUser == null)
            {
                return BadRequest("User not found.");
            }

            // creation du token
            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, dbUser.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
      };

            var jwtKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Config["Jwt:Key"]));
            var creds = new SigningCredentials(jwtKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(Config["Jwt:Issuer"],
              Config["Jwt:Issuer"],
              claims,
              expires: DateTime.Now.AddMinutes(30),
              signingCredentials: creds);

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });
        }
    }
}