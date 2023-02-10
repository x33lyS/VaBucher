using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VaBucherBack.Data;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using VabucherBack;

namespace VaBucherBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly DataContext _context;
        public SearchController(DataContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<List<Search>>> GetSearch()
        { 
            return Ok(await _context.Searches.ToListAsync());
        }
        [HttpPost]
        public async Task<ActionResult<List<Search>>> CreateSearch(Search search)
        {
            var dbUser = await _context.Searches.FirstOrDefaultAsync(u => u.Filter == search.Filter);
            if (dbUser == null)
            {
                _context.Searches.Add(search);
                await _context.SaveChangesAsync();
                return Ok(await _context.Users.ToListAsync());
            }
            else
            {
                return BadRequest("Un filtre existe déja");
            }
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<List<Search>>> DeleteSearch(int id)
        {
            var dbSearch = await _context.Searches.FindAsync(id);
            if (dbSearch == null)
                return BadRequest("Searches not found.");

            _context.Searches.Remove(dbSearch);
            await _context.SaveChangesAsync();

            return Ok(await _context.Searches.ToListAsync());
        }

    }
}
