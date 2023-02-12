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
            var dbSearch = await _context.Searches.FirstOrDefaultAsync(u => u.Filter == search.Filter);
            if (dbSearch == null)
            {
                _context.Searches.Add(search);
                await _context.SaveChangesAsync();
                return Ok( await _context.Searches.ToListAsync());
            }
            else
            {
                return BadRequest("Un filtre existe déja");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Search>> UpdateSearch(int id, Search search)
        {
            if (id != search.Id)
                return BadRequest("Id in URL and Id in request body don't match.");

            _context.Entry(search).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SearchExists(id))
                    return NotFound("Search not found.");

                throw;
            }

            return NoContent();
        }

        private bool SearchExists(int id)
        {
            return _context.Searches.Any(e => e.Id == id);
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
