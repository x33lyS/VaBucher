using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VaBucherBack.Data;
using VaBucherBack;
using Microsoft.EntityFrameworkCore;
using HtmlAgilityPack;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Net;
using System.Text;
using System.Security.Cryptography.X509Certificates;

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

            
            HtmlWeb web = new HtmlWeb();
            HtmlDocument htmlDoc = web.Load("https://news.ycombinator.com/");
            var programmerLinks = htmlDoc.DocumentNode.Descendants("tr")
                    .Where(node => node.GetAttributeValue("class", "").Contains("athing")).Take(10).ToList();

            foreach (var link in programmerLinks)
            {
                JobOffer offer = new JobOffer();
                var rank = link.SelectSingleNode(".//span[@class='rank']").InnerText;
                var storyName = link.SelectSingleNode(".//span[@class='titleline']").InnerText;
                var score = link.SelectSingleNode("..//span[@class='score']").InnerText;
                offer.Title = rank;
                offer.Description = storyName;
                offer.Localisation = score;
                Console.WriteLine("");
                Console.WriteLine("");
                Console.WriteLine("");

                Console.WriteLine(offer);
                Console.WriteLine("");
                Console.WriteLine("");
                Console.WriteLine("");
                Console.WriteLine("");

                Console.WriteLine(offer.Title);
                Console.WriteLine(offer.Description);
                Console.WriteLine(offer.Localisation);

                _context.JobOffers.Add(offer);
                await _context.SaveChangesAsync();
            }
            
            


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
