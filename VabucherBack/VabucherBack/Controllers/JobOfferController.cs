using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VaBucherBack.Data;
using VaBucherBack;
using Microsoft.EntityFrameworkCore;

namespace VabucherBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobOfferController : ControllerBase
    {
        private readonly DataContext _context;
        public JobOfferController(DataContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<List<JobOffer>>> GetJobOffers()
        {
            return Ok(await _context.JobOffers.ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult<List<JobOffer>>> CreateJobOffer(JobOffer jobOffer)
        {
            _context.JobOffers.Add(jobOffer);
            await _context.SaveChangesAsync();

            return Ok(await _context.JobOffers.ToListAsync());
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<List<JobOffer>>> DeleteJobOffer(int id)
        {
            var dbJobOffer = await _context.JobOffers.FindAsync(id);
            if (dbJobOffer == null)
                return BadRequest("User not found.");

            _context.JobOffers.Remove(dbJobOffer);
            await _context.SaveChangesAsync();

            return Ok(await _context.JobOffers.ToListAsync());
        }
    }
}
