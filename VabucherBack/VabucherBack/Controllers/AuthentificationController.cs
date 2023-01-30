using System.ComponentModel.DataAnnotations;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OpenQA.Selenium.DevTools.V106.Debugger;
using VabucherBack;
using VaBucherBack.Data;
using static System.Runtime.InteropServices.JavaScript.JSType;
using BCrypt.Net;

namespace VaBucherBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _config;
        private readonly string key;
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
            *  Check l'user dans la base de donn�e, si il ne le trouve pas return code 401,
            *  sinon cr�er un token JWT, le return avec code 200
        */
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserAuthentication userAuth)
        {
            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userAuth.Email);
            var hash = dbUser.Password;
            var pass = userAuth.Password;
            if (dbUser == null)
            {
                return BadRequest("User not found.");
            }
            else if (BCrypt.Net.BCrypt.Verify(userAuth.Password, dbUser.Password))
            {
                // Continue with token creation and return
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
            else
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                currentUser = new
                {
                    id=dbUser.Id,
                    email = dbUser.Email,
                    firstname = dbUser.FirstName,
                    lastname = dbUser.LastName,
                    location = dbUser.Location,
                    search = dbUser.Search,
                    role = dbUser.Role,
                    cv = dbUser.CV,
                    phone = dbUser.Phone,
        }
            });
                return BadRequest("Incorrect password.");
            }
        }

        [AllowAnonymous]
        [HttpPost("verifyToken")]
        public ObjectResult VerifyToken(string token)
        {
            try
            {
                Type isTokenAString = token.GetType();
                if (isTokenAString == typeof(string))
                {
                    bool isTokenEmpty = string.IsNullOrEmpty(token);
                    if (!isTokenEmpty)
                    {
                        var jwtKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Config["Jwt:Key"]));
                        var creds = new SigningCredentials(jwtKey, SecurityAlgorithms.HmacSha256);

                        var tokenHandler = new JwtSecurityTokenHandler();
                        ClaimsPrincipal claimsPrincipal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateIssuerSigningKey = true,
                            ValidIssuer = Config["Jwt:Issuer"],
                            ValidAudience = Config["Jwt:Issuer"],
                            IssuerSigningKey = jwtKey
                        }, out _);
                        var principal = claimsPrincipal;
                        return Ok("Token is valid");
                    }
                    else
                    {
                        return BadRequest("Token is not valid");
                    }
                }
                else
                {
                    return BadRequest("Token is not a string");
                }
            }
            catch (SecurityTokenException)
            {
                return BadRequest("Token is not valid");
            }
        }
    }
}