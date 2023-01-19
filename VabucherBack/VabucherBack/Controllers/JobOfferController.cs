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
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;

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
            using (var driver = new ChromeDriver("."))
            {
                //Navigate to DotNet website
                driver.Navigate().GoToUrl("https://www.monster.fr/emploi/");
                //Click the Get Started button
                var submitButton = driver.FindElement(By.Id("onetrust-accept-btn-handler"));
                submitButton.Click();
                var input = driver.FindElement(By.Id("search-job"));
                input.SendKeys("Informatique");
                submitButton = driver.FindElement(By.ClassName("btn-purple-fill"));
                submitButton.Click();
                driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromMilliseconds(6000);
                var title = driver.Title;

                // Get Started section is a multi-step wizard
                // The following sections will find the visible next step button until there's no next step button left
                IWebElement nextLink = null;
                do
                {
                    nextLink = driver.FindElements(By.ClassName("job-cardstyle__JobCardComponent-sc-1mbmxes-0")).FirstOrDefault();
                    nextLink?.Click();
                    JobOffer offer = new JobOffer();
                    try
                    {
                        var salaryElement = driver.FindElement(By.ClassName("detailsstyles__DetailsTableRow-sc-1deoovj-2"));
                        var Textsalary = salaryElement.Text;
                        offer.Salaire = Textsalary;
                    }
                    catch
                    {
                        var salaryElement = "";
                    }
                } while (nextLink != null);
            }



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
