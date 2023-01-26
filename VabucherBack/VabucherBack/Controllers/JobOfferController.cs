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
using OpenQA.Selenium.Support;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

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
            var working = false;
            //ChromeOptions options = new ChromeOptions();
            //options.AddArgument("--headless=true");
            while (!working)
            {
                using (var driver = new ChromeDriver("."))
                {
                    try
                    {
                        //Navigate to DotNet website
                        driver.Navigate().GoToUrl("https://www.monster.fr/emploi/");
                        //Click the Get Started button
                        var submitButton = driver.FindElement(By.Id("onetrust-accept-btn-handler"));
                        submitButton.Click();
                        var input = driver.FindElement(By.Id("search-job"));
                        input.SendKeys(jobOffer.Domain + " etudiant");
                        submitButton = driver.FindElement(By.ClassName("btn-purple-fill"));
                        submitButton.Click();
                        string principalHandle = driver.CurrentWindowHandle;
                        // Get Started section is a multi-step wizard
                        // The following sections will find the visible next step button until there's no next step button left
                        int i = 0;
                        IWebElement nextLink = null;
                        var exist = "";
                        while (nextLink == null)
                        {
                            try
                            {
                                await Task.Delay(5000);

                                nextLink = driver.FindElement(By.ClassName("job-cardstyle__JobCardComponent-sc-1mbmxes-0"));
                                exist = nextLink.Text;

                            }
                            catch
                            {
                                try
                                {
                                    var notfound = driver.FindElement(By.XPath("//h3[@data-testid='messageTitle']"));
                                    driver.Quit();
                                    return BadRequest("No Job found.");

                                }
                                catch { }
                            }
                        }
                        if (exist != "")
                        {
                            while (i <= driver.FindElements(By.ClassName("job-cardstyle__JobCardComponent-sc-1mbmxes-0")).Count())
                            {


                                nextLink = driver.FindElements(By.ClassName("job-cardstyle__JobCardComponent-sc-1mbmxes-0")).ElementAt(i);

                                var originalHandles = driver.WindowHandles;
                                nextLink.Click();
                                var newHandle = driver.WindowHandles.Except(originalHandles).Single();
                                driver.SwitchTo().Window(newHandle);




                                JobOffer offer = new JobOffer();
                                //Title
                                try
                                {
                                    var titleElement = driver.FindElement(By.ClassName("JobViewTitle"));
                                    offer.Title = titleElement.Text;
                                    offer.Domain = jobOffer.Domain;
                                }
                                catch
                                {
                                    offer.Title = "";
                                }
                                //CompanyInfo
                                try
                                {
                                    var companyInfoElement = driver.FindElement(By.ClassName("headerstyle__JobViewHeaderCompany-sc-1ijq9nh-6"));
                                    offer.CompanyInfo = companyInfoElement.Text;
                                }
                                catch
                                {
                                    offer.CompanyInfo = "";
                                }

                                //Salary
                                try
                                {
                                    var salaryElement = driver.FindElement(By.XPath("//div[@data-testid='svx_salaryComponent_body']"));
                                    offer.Salaire = salaryElement.Text;
                                }
                                catch
                                {
                                    offer.Salaire = "";
                                }
                                //JobTypes
                                try
                                {
                                    var jobTypesElement = driver.FindElement(By.XPath("//div[@data-test-id='svx-jobview-employmenttype']"));
                                    offer.Types = jobTypesElement.Text;
                                }
                                catch
                                {
                                    offer.Types = "";
                                }
                                //Localisation
                                try
                                {
                                    var localisationElement = driver.FindElement(By.XPath("//div[@data-test-id='svx-jobview-location']"));
                                    offer.Localisation = localisationElement.Text;
                                }
                                catch
                                {
                                    offer.Localisation = "";
                                }
                                //IsNew
                                try
                                {
                                    var isNewElement = driver.FindElement(By.XPath("//div[@data-test-id='svx-jobview-posted']"));
                                    offer.IsNew = isNewElement.Text;
                                }
                                catch
                                {
                                    offer.IsNew = "";
                                }
                                //Description
                                try
                                {
                                    var descriptionElement = driver.FindElement(By.ClassName("descriptionstyles__DescriptionBody-sc-13ve12b-4"));
                                    offer.Description = descriptionElement.Text;
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
                                working = true;
                                driver.SwitchTo().Window(principalHandle);

                            }
                            driver.Quit();
                        }
                    }
                    catch
                    {
                        driver.Quit();
                    }

                }

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
