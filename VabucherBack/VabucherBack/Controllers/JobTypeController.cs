using Microsoft.AspNetCore.Mvc;
using VaBucherBack.Data;
using VabucherBack;
using Microsoft.EntityFrameworkCore;

namespace VabucherBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobTypeController : Controller
    {
        private readonly DataContext _context;
        public JobTypeController(DataContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<List<JobType>>> GetJobType()
        {
            return Ok(await _context.JobTypes.ToListAsync());
        }
        [HttpPost]
        public async Task<ActionResult<List<JobType>>> CreateJobType(JobType jobType)
        {
            var dbUser = await _context.JobTypes.FirstOrDefaultAsync(u => u.Jobs == jobType.Jobs);
            if (dbUser == null)
            {
                _context.JobTypes.Add(jobType);
                await _context.SaveChangesAsync();
                return Ok(await _context.JobTypes.ToListAsync());
            }
            else
            {
                return BadRequest("Un Job Type existe déja");
            }
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<List<JobType>>> DeleteJobType(int id)
        {
            var dbJob = await _context.JobTypes.FindAsync(id);
            if (dbJob == null)
                return BadRequest("Searches not found.");

            _context.JobTypes.Remove(dbJob);
            await _context.SaveChangesAsync();

            return Ok(await _context.JobTypes.ToListAsync());
        }
    }
}