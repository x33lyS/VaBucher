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
using OpenQA.Selenium.Support.UI;

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
            try
            {
                using (var driver = new ChromeDriver("."))
                {
                    //Navigate to DotNet website
                    driver.Navigate().GoToUrl("https://www.monster.fr/emploi/");
                    //Click the Get Started button
                    var submitButton = driver.FindElement(By.Id("onetrust-accept-btn-handler"));
                    submitButton.Click();
                    var input = driver.FindElement(By.Id("search-job"));
                    input.SendKeys("Informatique etudiant");
                    submitButton = driver.FindElement(By.ClassName("btn-purple-fill"));
                    submitButton.Click();
                    string principalHandle = driver.CurrentWindowHandle;
                    // Get Started section is a multi-step wizard
                    // The following sections will find the visible next step button until there's no next step button left
                    int i = 1;
                    while (i < driver.FindElements(By.ClassName("job-cardstyle__JobCardComponent-sc-1mbmxes-0")).Count())
                    {
                        var nextLink = driver.FindElements(By.ClassName("job-cardstyle__JobCardComponent-sc-1mbmxes-0")).ElementAt(i);

                        var originalHandles = driver.WindowHandles;
                        nextLink.Click();
                        var newHandle = driver.WindowHandles.Except(originalHandles).Single();
                        driver.SwitchTo().Window(newHandle);




                        JobOffer offer = new JobOffer();
                        //Title
                        try
                        {
                            var titleElement = driver.FindElement(By.ClassName("JobViewTitle"));
                            var Texttitle = titleElement.Text;
                            offer.Title = Texttitle;
                        }
                        catch
                        {
                            offer.Title = "";
                        }
                        //CompanyInfo
                        try
                        {
                            var companyInfoElement = driver.FindElement(By.ClassName("headerstyle__JobViewHeaderCompany-sc-1ijq9nh-6"));
                            var TextcompanyInfo = companyInfoElement.Text;
                            offer.CompanyInfo = TextcompanyInfo;
                        }
                        catch
                        {
                            offer.CompanyInfo = "";
                        }

                        //Salary
                        try
                        {
                            var salaryElement = driver.FindElement(By.XPath("//div[@data-test-id='svx_salaryComponent_body']"));
                            var Textsalary = salaryElement.Text;
                            offer.Salaire = Textsalary;
                        }
                        catch
                        {
                            offer.Salaire = "";
                        }
                        //JobTypes
                        try
                        {
                            var jobTypesElement = driver.FindElement(By.XPath("//div[@data-test-id='svx-jobview-employmenttype']"));
                            var TextjobTypes = jobTypesElement.Text;
                            offer.Types = TextjobTypes;
                        }
                        catch
                        {
                            offer.Types = "";
                        }
                        //Localisation
                        try
                        {
                            var localisationElement = driver.FindElement(By.XPath("//div[@data-test-id='svx-jobview-location']"));
                            var Textlocalisation = localisationElement.Text;
                            offer.Localisation = Textlocalisation;
                        }
                        catch
                        {
                            offer.Localisation = "";
                        }
                        //IsNew
                        try
                        {
                            var isNewElement = driver.FindElement(By.XPath("//div[@data-test-id='svx-jobview-posted']"));
                            var TextisNew = isNewElement.Text;
                            offer.IsNew = TextisNew;
                        }
                        catch
                        {
                            offer.IsNew = "";
                        }
                        //Description
                        try
                        {
                            var descriptionElement = driver.FindElement(By.ClassName("descriptionstyles__DescriptionBody-sc-13ve12b-4"));
                            var Textdescription = descriptionElement.Text;
                            offer.Description = Textdescription;
                        }
                        catch
                        {
                            offer.Description = "";
                        }
                        if (principalHandle != newHandle)
                        {
                            driver.Close();
                        }
                        if (!_context.JobOffers.Any(j => j.Title == offer.Title) && offer.Title != "")
                        {
                            _context.JobOffers.Add(offer);
                            await _context.SaveChangesAsync();
                        }
                        i++;
                        driver.SwitchTo().Window(principalHandle);

                    }

                    driver.Quit();
                }
            }
            catch
            {

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
