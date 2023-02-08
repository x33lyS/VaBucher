using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VaBucherBack;
using VaBucherBack.Data;

namespace VabucherBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobHistoryController : Controller
    {
        private readonly DataContext _context;
        public JobHistoryController(DataContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<List<JobHistory>>> GetJobHistories()
        {
            return Ok(await _context.JobHistories.ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult<List<JobHistory>>> CreateJobHistory(JobHistory jobHistory)
        {
                _context.JobHistories.Add(jobHistory);
                await _context.SaveChangesAsync();
                return Ok(await _context.JobHistories.ToListAsync());
            }
           
    }
}
     


      