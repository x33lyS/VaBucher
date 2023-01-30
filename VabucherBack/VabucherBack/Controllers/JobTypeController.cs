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
    }
}